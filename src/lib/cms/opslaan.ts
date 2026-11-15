import "server-only";
import { cmsUrl } from "./client";
import { beoordeelOpslaan, type OpslaanUitkomst, type OpslaanVerzoek } from "./bewerken";

// Eén tekstveld als concept bewaren in het CMS (B-090), zoals site-kit 1.16 `bewaarLiveVeld`. ALLEEN
// SERVERKANT: het leestoken (CMS_TOKEN) staat alleen in de server-env, het bewerktoken komt uit het
// httpOnly-cookie. Server-naar-server, dus zonder Origin; het CMS weigert elk verzoek uit een browser.
// Tokens komen nergens in een melding of log terecht.

const TIME_OUT_MS = 8000;

export async function bewaarVeld(bewerktoken: string, v: OpslaanVerzoek): Promise<OpslaanUitkomst> {
  const url = cmsUrl();
  const leestoken = process.env.CMS_TOKEN?.trim();
  if (!url || !leestoken) return { soort: "fout", status: 503, melding: "Deze site is niet aan het CMS gekoppeld." };
  try {
    const res = await fetch(`${url}/api/v1/live-bewerken`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${leestoken}`,
        "content-type": "application/json",
        accept: "application/json",
        "x-cms-api-versie": "v1",
      },
      body: JSON.stringify({ bewerktoken, ...v }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(TIME_OUT_MS),
    });
    return beoordeelOpslaan(res.status, await res.json().catch(() => null));
  } catch {
    return beoordeelOpslaan(0, null);
  }
}
