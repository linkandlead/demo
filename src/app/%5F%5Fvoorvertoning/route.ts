import { cookies, draftMode } from "next/headers";
import type { NextRequest } from "next/server";
import { BEWERK_COOKIE, bewerktokenSecondenGeldig } from "@/lib/cms/bewerken";
import { tokenGeldig } from "@/lib/cms/concept";
import { cmsUrl } from "@/lib/cms/client";
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
//
// Bewerken (B-090): staat er ook &bewerken=<bewerktoken> in de link (voor wie de pagina mag bewerken), dan komt
// dat in een eigen httpOnly-cookie. Alleen /api/cms-bewerken leest het, serverkant; het CMS controleert het bij
// elke wijziging. Zonder geldig bewerktoken: alleen het voorbeeld, een oud bewerkcookie gaat weg.
//
// Ingesloten (linkandlead-cms B-110, &ingesloten=1): de pagina-editor van het CMS toont deze route in een iframe.
// Een doorverwijzing werkt daar niet: de gewone pagina's sturen X-Frame-Options SAMEORIGIN (next.config.ts), en in
// een ingesloten venster komen de cookies van draft mode vaak niet mee. Daarom geeft deze route dan de pagina zelf
// terug (200), opgehaald bij deze site met de cookies van draft mode erbij, met frame-ancestors 'self' en het CMS.

export const dynamic = "force-dynamic";

const KOPPEN = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

/** De origin van het CMS voor frame-ancestors; alleen https (of localhost in ontwikkeling). */
function cmsOrigin(): string | null {
  const u = cmsUrl();
  if (!u) return null;
  try {
    const url = new URL(u);
    return url.protocol === "https:" ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

/** De koppen van een ingesloten voorbeeld: alleen het CMS mag het insluiten, nooit in een cache. */
function insluitKoppen(): Record<string, string> {
  const cms = cmsOrigin();
  return {
    ...KOPPEN,
    "Content-Security-Policy": `frame-ancestors 'self'${cms ? ` ${cms}` : ""}`,
  };
}

/** Haalt de pagina in draft mode op bij deze site zelf en geeft haar terug om in te sluiten. */
async function ingeslotenPagina(
  request: NextRequest,
  pad: string,
  cookie: string,
): Promise<Response> {
  try {
    const res = await fetch(new URL(pad, request.nextUrl.origin), {
      headers: { cookie, accept: "text/html" },
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
    });
    // Geen eigen voorbeeldbalk: de editor van het CMS toont zelf dat het een concept is.
    const html = (await res.text()).replace(
      "</head>",
      "<style>.voorbeeld-balk{display:none!important}</style></head>",
    );
    return new Response(html, {
      status: res.status === 404 ? 404 : res.ok ? 200 : 502,
      headers: {
        ...insluitKoppen(),
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch {
    return new Response(
      '<!doctype html><html lang="nl"><meta charset="utf-8"><title>Voorbeeld niet beschikbaar</title><p>Het voorbeeld kan nu niet worden geladen. Probeer het zo opnieuw.</p>',
      {
        status: 503,
        headers: {
          ...insluitKoppen(),
          "Content-Type": "text/html; charset=utf-8",
        },
      },
    );
  }
}

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
    if (jar.has(BEWERK_COOKIE)) jar.delete(BEWERK_COOKIE);
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
  const bewerken = zoek.get("bewerken");
  const bewerkSeconden = Math.min(
    bewerktokenSecondenGeldig(bewerken),
    tokenSecondenGeldig(verzoek.token),
  );
  if (bewerken && bewerkSeconden > 0) {
    jar.set(BEWERK_COOKIE, bewerken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: bewerkSeconden,
    });
  } else if (jar.has(BEWERK_COOKIE)) jar.delete(BEWERK_COOKIE);
  if (zoek.get("ingesloten") === "1") {
    // De cookies die hierboven zijn gezet (draft mode en het token) gaan mee naar de pagina zelf.
    const mee = ["__prerender_bypass", VOORVERTONING_COOKIE]
      .map((naam) => {
        const w = jar.get(naam)?.value;
        return w ? `${naam}=${w}` : null;
      })
      .filter(Boolean)
      .join("; ");
    return ingeslotenPagina(request, verzoek.pad, mee);
  }
  return doorsturen(request, verzoek.pad);
}
