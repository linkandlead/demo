import { cookies, draftMode } from "next/headers";
import type { NextRequest } from "next/server";
import { tokenGeldig } from "@/lib/cms/concept";
import {
  leesVoorvertoningsVerzoek,
  tokenSecondenGeldig,
  veiligPad,
  VOORVERTONING_COOKIE,
} from "@/lib/cms/voorvertoning";

// GET /__voorvertoning?pad=/x&token=<token> — "Voorbeeld op de site" uit het CMS (UX-002).
// De map heet %5F%5Fvoorvertoning omdat een map met "_" in Next.js privé is (geen route).
//
// Protocol (linkandlead-cms docs/bouwwijze.md §6.3): het CMS controleert per website of deze route
// op ?pad=/ met een geldig token 200 geeft (redirects volgt het zelf). Zonder geldig token: de gewone
// pagina, nooit een 404. Het token controleert het CMS zelf via de lees-API (concept: true); de site
// kent geen geheim. Het token wordt niet gelogd.

export const dynamic = "force-dynamic";

const KOPPEN = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

function doorsturen(request: NextRequest, pad: string): Response {
  // pad is gecontroleerd met veiligPad: altijd een intern pad op deze host.
  return new Response(null, {
    status: 307,
    headers: {
      ...KOPPEN,
      Location: new URL(pad, request.nextUrl.origin).toString(),
    },
  });
}

export async function GET(request: NextRequest) {
  const zoek = request.nextUrl.searchParams;
  const draft = await draftMode();
  const jar = await cookies();
  const verzoek = leesVoorvertoningsVerzoek(zoek);

  if (!verzoek || !(await tokenGeldig(verzoek.pad, verzoek.token))) {
    // Geweigerd: geen draft mode, geen token; door naar de gepubliceerde pagina.
    if (draft.isEnabled) draft.disable();
    if (jar.has(VOORVERTONING_COOKIE)) jar.delete(VOORVERTONING_COOKIE);
    return doorsturen(request, veiligPad(zoek.get("pad") || "/") ?? "/");
  }

  draft.enable();
  jar.set(VOORVERTONING_COOKIE, verzoek.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: tokenSecondenGeldig(verzoek.token),
  });
  return doorsturen(request, verzoek.pad);
}
