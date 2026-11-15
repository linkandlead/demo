import "server-only";

// Koppeling met het centrale Link & Lead One-CMS (model A: eigen frontend + CMS-lees-API).
// Contract geverifieerd in linkandlead-cms: src/routes/api/cms/content.ts + HEADLESS-FRONTEND.md.
//
//   GET {CMS_URL}/api/cms/content   Authorization: Bearer {CMS_TOKEN}
//
// Het token is hard gescopet op één site; gebruik dus een token van een APARTE, geïsoleerde
// NOVA-demosite (nooit van een bestaande klantsite). Zonder CMS_URL/CMS_TOKEN valt de site
// terug op de demodata uit src/content/nova.ts en zegt dat ook zichtbaar (Demo Mode-paneel).

import { str, valideerRespons, type CmsSite } from "./valideer";

export type { CmsBlok, CmsPagina, CmsSite } from "./valideer";

export type CmsStatus =
  | { bron: "demo"; reden: "niet-geconfigureerd" }
  | { bron: "demo"; reden: "fout"; melding: string }
  | { bron: "cms"; site: CmsSite };

export function cmsUrl(): string | null {
  const u = process.env.CMS_URL?.trim();
  return u ? u.replace(/\/$/, "") : null;
}

export async function laadCms(): Promise<CmsStatus> {
  const url = cmsUrl();
  const token = process.env.CMS_TOKEN?.trim();
  if (!url || !token) return { bron: "demo", reden: "niet-geconfigureerd" };
  try {
    const res = await fetch(`${url}/api/cms/content`, {
      headers: { authorization: `Bearer ${token}` },
      // De CMS-API cachet zelf 60s; we sluiten daarop aan.
      // Tag "cms": de webhook /api/cms-webhook ververst direct na publiceren in het CMS.
      next: { revalidate: 60, tags: ["cms"] },
    });
    if (!res.ok)
      return {
        bron: "demo",
        reden: "fout",
        melding: `CMS antwoordde met status ${res.status}`,
      };
    const site = valideerRespons(await res.json());
    if (!site)
      return {
        bron: "demo",
        reden: "fout",
        melding: "Onverwacht antwoord van de CMS-API",
      };
    return { bron: "cms", site };
  } catch {
    return { bron: "demo", reden: "fout", melding: "CMS niet bereikbaar" };
  }
}

/** Media-URL uit het CMS: "/media/…" is een beeld uit deze frontend, een volledige https-URL is
 *  een upload, en elk ander pad ("/img/…") staat op het CMS-domein. */
export function cmsMedia(pad: unknown): string {
  const p = str(pad).trim();
  if (!p) return "";
  if (/^https:\/\//.test(p) || p.startsWith("/media/")) return p;
  const url = cmsUrl();
  return url && p.startsWith("/") ? url + p : "";
}
