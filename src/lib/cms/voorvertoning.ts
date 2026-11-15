// "Voorbeeld op de site" (protocol van linkandlead-cms, UX-002). Puur (geen server-only), zodat het
// los te testen is. Bronnen in de CMS-repo:
//   src/features/voorvertoning/adres.ts      het CMS opent <adres>?pad=/x&token=<token>
//   src/core/auth/voorvertoning.ts           token = "<verloopt-unix>.<hmac-sha256-hex>", 30 minuten
//   src/routes/api/v1/pagina.ts              GET /api/v1/pagina?pad=/x&voorvertoning=<token> + leestoken
//   packages/site-kit/src/voorvertoning.ts   leesVoorvertoningsUrl (pad/token, ook ?voorvertoning=)
// De site kent het geheim niet: alleen het CMS kan het token controleren. Een geldig token geeft in
// het antwoord `concept: true`; een ongeldig token geeft gewoon de gepubliceerde pagina (`concept: false`).

import { valideerBewerken } from "./bewerken.ts";
import { isObj, str, type CmsBlok } from "./valideer.ts";

/** Naam van de cookie met het voorvertoningstoken (httpOnly, alleen serverkant gelezen). */
export const VOORVERTONING_COOKIE = "nova_voorvertoning";

/** Hooguit zo lang mag de cookie leven, ook als het token zegt dat hij langer geldt. */
const MAX_LEEFTIJD_S = 60 * 60;

/** Alleen een intern pad: begint met één "/", geen "//" of "/\" (andere host), geen stuurtekens. */
export function veiligPad(invoer: unknown): string | null {
  if (typeof invoer !== "string") return null;
  const p = invoer.trim();
  if (
    !p.startsWith("/") ||
    p.startsWith("//") ||
    p.startsWith("/\\") ||
    p.length > 300
  )
    return null;
  if (/[\u0000-\u001f\u007f\\]/.test(p)) return null;
  try {
    const basis = "https://site.invalid";
    const u = new URL(p, basis);
    if (u.origin !== basis) return null;
    return u.pathname + u.search;
  } catch {
    return null;
  }
}

/** Vorm van het CMS-token: "<verloopt-unix>.<64 hex>". Alles daarbuiten gaat niet naar het CMS. */
export function tokenVorm(token: unknown): token is string {
  return typeof token === "string" && /^\d{9,12}\.[0-9a-f]{64}$/.test(token);
}

/** Resterende geldigheid van het token in seconden (0 = verlopen of ongeldig van vorm). */
export function tokenSecondenGeldig(token: unknown, nu = Date.now()): number {
  if (!tokenVorm(token)) return 0;
  const verloopt = Number(token.split(".")[0]);
  const rest = verloopt - Math.floor(nu / 1000);
  return rest > 0 ? Math.min(rest, MAX_LEEFTIJD_S) : 0;
}

/** Leest ?pad=/x&token=… (of ?voorvertoning=…), zoals de site-kit. null = geen bruikbaar verzoek. */
export function leesVoorvertoningsVerzoek(
  zoek: URLSearchParams,
  nu = Date.now(),
): { pad: string; token: string } | null {
  const pad = veiligPad(zoek.get("pad") || "/");
  const token = zoek.get("token") ?? zoek.get("voorvertoning");
  if (!pad || !tokenVorm(token) || tokenSecondenGeldig(token, nu) === 0)
    return null;
  return { pad, token };
}

export type ConceptPagina = {
  concept: boolean;
  pagina: {
    slug: string;
    titel: string;
    beschrijving: string;
    blokken: CmsBlok[];
  };
};

/** Runtime-validatie van PaginaV1 (site-kit contract.ts): onbekende JSON → getypeerd, of null. */
export function valideerPaginaV1(json: unknown): ConceptPagina | null {
  if (!isObj(json) || !isObj(json.pagina) || typeof json.concept !== "boolean")
    return null;
  const p = json.pagina;
  const slug = veiligPad(p.slug);
  if (!slug) return null;
  return {
    concept: json.concept,
    pagina: {
      slug,
      titel: str(p.titel),
      beschrijving: str(p.beschrijving),
      blokken: (Array.isArray(p.blokken) ? p.blokken : [])
        .filter(isObj)
        .map((b) => {
          const blok: CmsBlok = {
            type: str(b.type),
            bg: typeof b.bg === "string" ? b.bg : null,
            content: isObj(b.inhoud) ? b.inhoud : {},
          };
          // B-090: sectie-id en bewerkbare velden, alleen als het CMS ze meestuurt (in een concept).
          if (typeof b.id === "string" && /^[0-9a-f-]{36}$/i.test(b.id)) blok.id = b.id;
          const bewerken = valideerBewerken(b.bewerken);
          if (blok.id && bewerken) blok.bewerken = bewerken;
          return blok;
        })
        .filter((b) => b.type),
    },
  };
}

/** Uitkomst van één verzoek naar de lees-API v1 met een voorvertoningstoken. */
export type ConceptUitkomst =
  | { soort: "concept"; pagina: ConceptPagina["pagina"] }
  | { soort: "geweigerd" }
  | { soort: "niet-gevonden" }
  | { soort: "fout" };

/** Zet status + JSON van /api/v1/pagina om in een uitkomst. Alleen `concept: true` telt als concept. */
export function beoordeelAntwoord(
  status: number,
  json: unknown,
): ConceptUitkomst {
  if (status === 404) return { soort: "niet-gevonden" };
  if (status === 401 || status === 403) return { soort: "geweigerd" };
  if (status !== 200) return { soort: "fout" };
  const p = valideerPaginaV1(json);
  if (!p) return { soort: "fout" };
  return p.concept
    ? { soort: "concept", pagina: p.pagina }
    : { soort: "geweigerd" };
}

/** Concept of gepubliceerd? Alleen in draft mode én met een echt concept uit het CMS het concept. */
export function kiesInhoud<T>(o: {
  draftMode: boolean;
  concept: ConceptUitkomst | null;
  gepubliceerd: T;
}): T | ConceptPagina["pagina"] {
  if (o.draftMode && o.concept?.soort === "concept") return o.concept.pagina;
  return o.gepubliceerd;
}
