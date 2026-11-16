import { cookies, draftMode } from "next/headers";
import type { NextRequest } from "next/server";
import { BEWERK_COOKIE, bewerktokenSecondenGeldig } from "@/lib/cms/bewerken";
import { controleerToken, INGESLOTEN_COOKIE, tokenGeldig } from "@/lib/cms/concept";
import type { CmsBlok } from "@/lib/cms/client";
import { voorvertoningScript } from "@/lib/cms/voorvertoningklikken";
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
//
// Klikken en typen in het echte ontwerp (linkandlead-cms B-115, B-127, site-kit 1.21): alleen in dat ingesloten
// voorbeeld krijgen de blokken van het concept data-cms-sectie (Blokken.tsx, via de cookie nova_ingesloten die
// alleen deze route bij het ophalen meestuurt) en staat voorvertoningKlikken als inline script onderaan de pagina.
// Een klik kiest dan het blok in de editor, platte tekst is na de selectie direct te typen, en links openen in het
// editorvenster geen andere pagina. Berichten gaan alleen naar de origin van het beheer van het CMS.

export const dynamic = "force-dynamic";

const KOPPEN = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

/** Een origin voor frame-ancestors; alleen https (of localhost in ontwikkeling). */
function origin(u: string | null | undefined): string | null {
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

/** De koppen van een ingesloten voorbeeld: alleen het CMS mag het insluiten, nooit in een cache. Het beheer van
 *  het CMS kan op een ander adres draaien dan de API (CMS_BEHEER_URL, bv. https://cms.linkandlead.nl). */
function insluitKoppen(): Record<string, string> {
  const toegestaan = [...new Set([origin(cmsUrl()), origin(process.env.CMS_BEHEER_URL)].filter(Boolean))];
  return {
    ...KOPPEN,
    "Content-Security-Policy": `frame-ancestors 'self'${toegestaan.map((o) => ` ${o}`).join("")}`,
  };
}

/** De origin waar de editor van het CMS draait: het beheer (CMS_BEHEER_URL) of anders het CMS zelf. Alleen daarheen
 *  gaan de berichten van het klikscript. */
function editorOrigin(): string | null {
  return origin(process.env.CMS_BEHEER_URL) ?? origin(cmsUrl());
}

/** Haalt de pagina in draft mode op bij deze site zelf en geeft haar terug om in te sluiten, met het klikscript
 *  (de tekstvelden uit de blokken van het concept). */
async function ingeslotenPagina(
  request: NextRequest,
  pad: string,
  cookie: string,
  blokken: CmsBlok[] = [],
): Promise<Response> {
  try {
    const res = await fetch(new URL(pad, request.nextUrl.origin), {
      headers: { cookie, accept: "text/html" },
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
    });
    // Geen eigen voorbeeldbalk: de editor van het CMS toont zelf dat het een concept is. Het klikscript onderaan de
    // body, zodat de secties er al staan als het de velden markeert.
    const script = voorvertoningScript(editorOrigin(), blokken);
    let html = (await res.text()).replace("</head>", `<style>.voorbeeld-balk{display:none!important}</style></head>`);
    if (script) {
      const tag = `<script>${script}</script>`;
      const eind = html.lastIndexOf("</body>");
      html = eind >= 0 ? html.slice(0, eind) + tag + html.slice(eind) : html + tag;
    }
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
  const ingesloten = zoek.get("ingesloten") === "1";
  // In de editor (ingesloten): een klik in het voorbeeld komt hier terug zonder token in het adres; dan het token
  // uit de cookie (die in een iframe alleen meekomt met SameSite=None en Partitioned, zie hieronder).
  const uitCookie = jar.get(VOORVERTONING_COOKIE)?.value;
  const verzoek =
    leesVoorvertoningsVerzoek(zoek) ??
    (ingesloten && uitCookie
      ? leesVoorvertoningsVerzoek(new URLSearchParams({ pad: zoek.get("pad") || "/", token: uitCookie }))
      : null);

  // Ingesloten: meteen de blokken van het concept erbij (voor de tekstvelden van het klikscript).
  const controle = verzoek && ingesloten ? await controleerToken(verzoek.pad, verzoek.token) : null;
  if (ingesloten && (!verzoek || !controle?.geldig)) {
    // Zonder (geldig) token: de gepubliceerde pagina, ook ingesloten (200 met frame-ancestors). Zo slaagt ook de
    // controle van het CMS, die zonder token vraagt of deze route zich laat insluiten (linkandlead-cms B-110).
    return ingeslotenPagina(request, veiligPad(zoek.get("pad") || "/") ?? "/", "");
  }

  if (!verzoek || !(controle?.geldig ?? (await tokenGeldig(verzoek.pad, verzoek.token)))) {
    // Geweigerd: geen draft mode, geen token; door naar de gepubliceerde pagina.
    if (draft.isEnabled) draft.disable();
    if (jar.has(VOORVERTONING_COOKIE)) jar.delete(VOORVERTONING_COOKIE);
    if (jar.has(BEWERK_COOKIE)) jar.delete(BEWERK_COOKIE);
    return doorsturen(request, veiligPad(zoek.get("pad") || "/") ?? "/");
  }

  draft.enable();
  // Ingesloten (iframe op het CMS) stuurt de browser alleen een cookie mee met SameSite=None; Secure; Partitioned.
  const cookieSoort = ingesloten
    ? ({ sameSite: "none", secure: true, partitioned: true } as const)
    : ({ sameSite: "lax", secure: process.env.NODE_ENV !== "development" } as const);
  jar.set(VOORVERTONING_COOKIE, verzoek.token, {
    httpOnly: true,
    ...cookieSoort,
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
      ...cookieSoort,
      path: "/",
      maxAge: bewerkSeconden,
    });
  } else if (jar.has(BEWERK_COOKIE)) jar.delete(BEWERK_COOKIE);
  if (ingesloten) {
    // De cookies die hierboven zijn gezet (draft mode en het token) gaan mee naar de pagina zelf, plus
    // nova_ingesloten (alleen in dit verzoek, nooit naar de browser): dan krijgen de blokken data-cms-sectie.
    const mee = ["__prerender_bypass", VOORVERTONING_COOKIE]
      .map((naam) => {
        const w = jar.get(naam)?.value;
        return w ? `${naam}=${w}` : null;
      })
      .filter(Boolean)
      .concat(`${INGESLOTEN_COOKIE}=1`)
      .join("; ");
    return ingeslotenPagina(request, verzoek.pad, mee, controle?.blokken ?? []);
  }
  return doorsturen(request, verzoek.pad);
}
