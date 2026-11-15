import "server-only";
import { cookies, draftMode } from "next/headers";
import { BEWERK_COOKIE, bewerktokenSecondenGeldig } from "./bewerken";
import { cmsUrl } from "./client";
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
 *  controleren we met de homepage: het token geldt per site, niet per pagina. */
export async function tokenGeldig(
  pad: string,
  token: string,
): Promise<boolean> {
  const r = await haalConcept(pad, token);
  if (r.soort === "concept") return true;
  if (r.soort === "niet-gevonden" && pad !== "/")
    return (await haalConcept("/", token)).soort === "concept";
  return false;
}

export type VoorbeeldStand =
  | { aan: false }
  | { aan: true; token: string | null; bewerken: boolean };

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
  };
}
