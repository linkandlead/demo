import "server-only";
import { cookies, draftMode } from "next/headers";
import { BEWERK_COOKIE, bewerktokenSecondenGeldig } from "./bewerken";
import { cmsUrl, type CmsBlok } from "./client";
import {
  beoordeelAntwoord,
  tokenSecondenGeldig,
  VOORVERTONING_COOKIE,
  type ConceptUitkomst,
} from "./voorvertoning";

// Conceptinhoud voor "Voorbeeld op de site". Alleen serverkant: het leestoken (CMS_TOKEN) gaat nooit
// naar de browser, en het voorvertoningstoken staat in een httpOnly-cookie. Het token wordt nooit
// gelogd: het staat in de URL naar het CMS, dus die URL komt ook nergens in een melding terecht.

const TIME_OUT_MS = 4000;

/** Eén verzoek naar GET {CMS_URL}/api/v1/pagina?pad=…&voorvertoning=…, zonder cache, met time-out. */
export async function haalConcept(
  pad: string,
  token: string,
): Promise<ConceptUitkomst> {
  const url = cmsUrl();
  const leestoken = process.env.CMS_TOKEN?.trim();
  if (!url || !leestoken) return { soort: "fout" };
  const query = new URLSearchParams({ pad, voorvertoning: token });
  try {
    const res = await fetch(`${url}/api/v1/pagina?${query}`, {
      headers: {
        authorization: `Bearer ${leestoken}`,
        accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(TIME_OUT_MS),
      redirect: "error",
    });
    const json: unknown =
      res.status === 200 ? await res.json().catch(() => null) : null;
    return beoordeelAntwoord(res.status, json);
  } catch {
    return { soort: "fout" };
  }
}

/** Is het token geldig voor deze site? Het CMS beslist (`concept: true`). Bestaat het pad niet, dan
 *  controleren we met de homepage: het token geldt per site, niet per pagina. `blokken`: de blokken van het
 *  concept op dit pad (leeg als er hier geen CMS-pagina is), voor de tekstvelden van het ingesloten voorbeeld. */
export async function controleerToken(
  pad: string,
  token: string,
): Promise<{ geldig: boolean; blokken: CmsBlok[] }> {
  const r = await haalConcept(pad, token);
  if (r.soort === "concept") return { geldig: true, blokken: r.pagina.blokken };
  if (r.soort === "niet-gevonden" && pad !== "/")
    return { geldig: (await haalConcept("/", token)).soort === "concept", blokken: [] };
  return { geldig: false, blokken: [] };
}

export async function tokenGeldig(
  pad: string,
  token: string,
): Promise<boolean> {
  return (await controleerToken(pad, token)).geldig;
}

/** Cookie die alleen /__voorvertoning meestuurt als het de pagina voor het ingesloten voorbeeld bij deze site
 *  ophaalt (&ingesloten=1, het iframe van de pagina-editor). Hij komt nooit in de browser en telt alleen in draft
 *  mode: dan krijgen de blokken data-cms-sectie voor klikken en typen (linkandlead-cms B-127). */
export const INGESLOTEN_COOKIE = "nova_ingesloten";

export type VoorbeeldStand =
  | { aan: false }
  | { aan: true; token: string | null; bewerken: boolean; ingesloten: boolean };

/** Draft mode en het token uit de cookie. Buiten draft mode wordt de cookie niet eens gelezen, zodat
 *  gewone pagina's statisch blijven en bezoekers niets anders zien dan voorheen. `bewerken` = er is ook
 *  een (nog niet verlopen) bewerktoken (B-090); het token zelf verlaat de server nooit. */
export async function voorbeeldStand(): Promise<VoorbeeldStand> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return { aan: false };
  const jar = await cookies();
  const token = jar.get(VOORVERTONING_COOKIE)?.value ?? null;
  const geldig = tokenSecondenGeldig(token) > 0;
  return {
    aan: true,
    token: geldig ? token : null,
    bewerken: geldig && bewerktokenSecondenGeldig(jar.get(BEWERK_COOKIE)?.value) > 0,
    ingesloten: geldig && jar.get(INGESLOTEN_COOKIE)?.value === "1",
  };
}
