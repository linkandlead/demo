import { cookies, draftMode } from "next/headers";
import type { NextRequest } from "next/server";
import { BEWERK_COOKIE, bewerktokenSecondenGeldig, leesOpslaanVerzoek, zelfdeHerkomst } from "@/lib/cms/bewerken";
import { bewaarVeld } from "@/lib/cms/opslaan";

// POST /api/cms-bewerken — één tekstveld als concept bewaren vanuit de bewerkbalk (linkandlead-cms B-090).
// De browser stuurt alleen { pagina, sectie, pad, waarde, versie }. Deze route:
//  1. weigert alles wat niet van deze site zelf komt (CSRF: Origin-check, plus JSON-content-type);
//  2. werkt alleen in draft mode ("Voorbeeld op de site") en met het bewerktoken uit het httpOnly-cookie;
//  3. stuurt de wijziging server-naar-server naar het CMS met het leestoken uit de server-env.
// Het CMS controleert alles opnieuw (site, pagina, sessie, rechten, vergrendelde velden, versie). Tokens
// worden nooit gelogd en gaan nooit terug naar de browser.

export const dynamic = "force-dynamic";

const KOPPEN = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

const antwoord = (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers: KOPPEN });

export async function POST(request: NextRequest) {
  const herkomst = zelfdeHerkomst({
    origin: request.headers.get("origin"),
    host: request.headers.get("host"),
    secFetchSite: request.headers.get("sec-fetch-site"),
  });
  if (!herkomst) return antwoord(403, { ok: false, melding: "Dit verzoek komt niet van deze website." });
  if (!(request.headers.get("content-type") ?? "").startsWith("application/json"))
    return antwoord(415, { ok: false, melding: "Stuur de wijziging als JSON." });

  const { isEnabled } = await draftMode();
  const bewerktoken = (await cookies()).get(BEWERK_COOKIE)?.value;
  if (!isEnabled || !bewerktoken || bewerktokenSecondenGeldig(bewerktoken) === 0)
    return antwoord(401, {
      ok: false,
      melding: "Je bewerksessie is verlopen. Open de pagina opnieuw via “Voorbeeld op de site” in het CMS.",
    });

  const verzoek = leesOpslaanVerzoek(await request.json().catch(() => null));
  if (!verzoek) return antwoord(400, { ok: false, melding: "Deze wijziging is onvolledig. Herlaad de pagina en probeer het opnieuw." });

  const uit = await bewaarVeld(bewerktoken, verzoek);
  switch (uit.soort) {
    case "opgeslagen":
      return antwoord(200, { ok: true, versie: uit.versie });
    case "conflict":
      return antwoord(409, { ok: false, conflict: true, melding: uit.melding });
    case "verlopen":
      return antwoord(401, { ok: false, melding: uit.melding });
    default:
      return antwoord(uit.status, { ok: false, melding: uit.melding });
  }
}
