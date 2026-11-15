// Bewerken op de site (linkandlead-cms B-090, site-kit 1.16 `bewaarLiveVeld`). Puur (geen server-only), zodat
// het los te testen is. Bronnen in de CMS-repo:
//   src/core/auth/bewerktoken.ts                  bewerktoken "<verloopt>.<uitgegeven>.<gebruiker>.<sessie>.<pagina>.<hmac>"
//   src/features/voorvertoning/adres.ts           de voorvertoningslink krijgt &bewerken=<bewerktoken>
//   src/routes/api/v1/live-bewerken.ts            POST, leestoken + bewerktoken, alleen server-naar-server
//   packages/site-kit/src/contract.ts             BlokBewerkenV1, LiveBewerkenVerzoekV1, LiveBewerkenAntwoordV1
// De site kent het geheim niet: alleen het CMS controleert het bewerktoken. Hier staat alleen de vorm.

import { isObj, str } from "./valideer.ts";

/** Cookie met het bewerktoken (httpOnly, alleen serverkant gelezen; nooit in de pagina). */
export const BEWERK_COOKIE = "nova_bewerken";

/** Hooguit zo lang mag de cookie leven (het CMS geeft 30 minuten). */
const MAX_LEEFTIJD_S = 30 * 60 + 5;

const ID = "[0-9a-z-]{1,64}";
const BEWERKTOKEN = new RegExp(`^\\d{9,12}\\.\\d{1,16}\\.${ID}\\.${ID}\\.${ID}\\.[0-9a-f]{64}$`, "i");

/** Vorm van het bewerktoken. Alles daarbuiten wordt niet bewaard en gaat niet naar het CMS. */
export function bewerktokenVorm(token: unknown): token is string {
  return typeof token === "string" && token.length <= 400 && BEWERKTOKEN.test(token);
}

/** Resterende geldigheid in seconden (0 = verlopen of ongeldig van vorm). */
export function bewerktokenSecondenGeldig(token: unknown, nu = Date.now()): number {
  if (!bewerktokenVorm(token)) return 0;
  const rest = Number(token.split(".")[0]) - Math.floor(nu / 1000);
  return rest > 0 ? Math.min(rest, MAX_LEEFTIJD_S) : 0;
}

export type VeldPad = Array<string | number>;
export type BewerkVeld = { pad: VeldPad; label: string; waarde: string; meerdereRegels: boolean };
/** BlokV1.bewerken: de versie van het blok en de platte tekstvelden die de site bewerkbaar mag maken. */
export type BlokBewerken = { versie: string; velden: BewerkVeld[] };

function geldigPad(p: unknown): p is VeldPad {
  return (
    Array.isArray(p) &&
    p.length > 0 &&
    p.length <= 7 &&
    p.every(
      (x) =>
        (typeof x === "string" && /^[a-z0-9_]{1,60}$/i.test(x)) ||
        (typeof x === "number" && Number.isInteger(x) && x >= 0 && x < 2000),
    )
  );
}

/** Runtime-validatie van BlokV1.bewerken (onbekende JSON → getypeerd, of null). */
export function valideerBewerken(w: unknown): BlokBewerken | null {
  if (!isObj(w) || typeof w.versie !== "string" || !w.versie || w.versie.length > 64) return null;
  const velden = (Array.isArray(w.velden) ? w.velden : [])
    .filter(isObj)
    .filter((v) => geldigPad(v.pad) && typeof v.waarde === "string")
    .map((v) => ({ pad: v.pad as VeldPad, label: str(v.label), waarde: v.waarde as string, meerdereRegels: v.meerdereRegels === true }));
  return { versie: w.versie, velden };
}

/** Het pad als tekst, voor `data-cms-veld` ("items.0.titel"). */
export const padTekst = (pad: VeldPad) => pad.join(".");

/** Wat de browser naar /api/cms-bewerken stuurt (zonder token: dat staat in het httpOnly-cookie). */
export type OpslaanVerzoek = { pagina: string; sectie: string; pad: VeldPad; waarde: string; versie: string };

export function leesOpslaanVerzoek(w: unknown): OpslaanVerzoek | null {
  if (!isObj(w)) return null;
  const { pagina, sectie, pad, waarde, versie } = w;
  if (typeof pagina !== "string" || !pagina.startsWith("/") || pagina.startsWith("//") || pagina.length > 300) return null;
  if (typeof sectie !== "string" || !/^[0-9a-f-]{36}$/i.test(sectie)) return null;
  if (!geldigPad(pad) || typeof waarde !== "string" || waarde.length > 20000) return null;
  if (typeof versie !== "string" || !versie || versie.length > 64) return null;
  return { pagina, sectie, pad, waarde, versie };
}

/** CSRF (Origin-check): alleen een verzoek uit deze site zelf. Een browser stuurt bij een POST altijd
 *  Origin mee; ontbreekt die, of hoort hij bij een andere host, dan weigeren we. Sec-Fetch-Site moet,
 *  als de browser hem stuurt, "same-origin" zijn. */
export function zelfdeHerkomst(o: { origin: string | null; host: string | null; secFetchSite: string | null }): boolean {
  if (!o.origin || !o.host) return false;
  let herkomst: URL;
  try {
    herkomst = new URL(o.origin);
  } catch {
    return false;
  }
  if (herkomst.protocol !== "https:" && herkomst.hostname !== "localhost" && herkomst.hostname !== "127.0.0.1") return false;
  if (herkomst.host.toLowerCase() !== o.host.toLowerCase()) return false;
  return o.secFetchSite === null || o.secFetchSite === "same-origin";
}

export type OpslaanUitkomst =
  | { soort: "opgeslagen"; versie: string }
  | { soort: "conflict"; melding: string }
  | { soort: "verlopen"; melding: string }
  | { soort: "fout"; melding: string; status: number };

const VERLOPEN = "Je bewerksessie is verlopen of ingetrokken. Open de pagina opnieuw via “Voorbeeld op de site” in het CMS.";

/** Status + JSON van POST /api/v1/live-bewerken (LiveBewerkenAntwoordV1) → uitkomst voor de balk. */
export function beoordeelOpslaan(status: number, json: unknown): OpslaanUitkomst {
  const melding = isObj(json) && typeof json.melding === "string" && json.melding ? json.melding : "";
  if (status === 200 && isObj(json) && json.ok === true && typeof json.versie === "string") return { soort: "opgeslagen", versie: json.versie };
  if (status === 409) return { soort: "conflict", melding: melding || "Iemand anders heeft dit onderdeel intussen gewijzigd. Herlaad de pagina." };
  if (status === 401) return { soort: "verlopen", melding: VERLOPEN };
  if (status === 0) return { soort: "fout", status: 502, melding: "Het CMS is niet bereikbaar. Je wijziging is niet opgeslagen; probeer het opnieuw." };
  // Een weigering van het CMS (ongeldig, geen recht, vergrendeld, weg) geven we door; de rest is een storing.
  const door = status === 400 || status === 403 || status === 404 || status === 429;
  return { soort: "fout", status: door ? status : 502, melding: melding || `Opslaan is niet gelukt (status ${status}).` };
}

/** De opslagstatus in de balk (live-regio). */
export function opslagTekst(o: { bezig: boolean; open: number; mislukt: boolean }): string {
  if (o.bezig) return "Opslaan…";
  if (o.open > 0) return o.open === 1 ? "1 wijziging niet opgeslagen" : `${o.open} wijzigingen niet opgeslagen`;
  if (o.mislukt) return "Niet opgeslagen";
  return "Alle wijzigingen opgeslagen als concept";
}
