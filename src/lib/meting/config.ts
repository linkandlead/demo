// Bezoekmeting van de demo-site naar het Link & Lead One-CMS (testrapport T9, besluit B5: de demo meet, met
// toestemming). Pure keuzes, zonder browser: of er gemeten wordt, naar welk adres en voor welke site.
//
//   CMS_URL        het CMS (dezelfde variabele als voor de inhoud)
//   CMS_SITE_ID    optioneel: het site-id dat de metingen krijgt; standaard Demo Klant (publiek, geen geheim)
//   METING=uit     zet de meting uit (bv. op een preview waar je geen bezoeken wilt tellen)

/** Site-id van Demo Klant in het CMS. Gewoon een id: het CMS controleert zelf dat de Origin bij de site hoort. */
export const DEMO_KLANT_SITE_ID = "22222222-2222-2222-2222-222222222222";

type Omgeving = Record<string, string | undefined>;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function origin(url: string | undefined): string | null {
  const u = url?.trim();
  if (!u) return null;
  try {
    const p = new URL(u);
    return p.protocol === "https:" || p.hostname === "localhost" ? p.origin : null;
  } catch {
    return null;
  }
}

/** Waarheen en voor welke site gemeten wordt, of null als de demo niet meet. */
export function metingConfig(env: Omgeving): { basisUrl: string; siteId: string } | null {
  if (env.METING?.trim().toLowerCase() === "uit") return null;
  const basisUrl = origin(env.CMS_URL);
  if (!basisUrl) return null;
  const siteId = env.CMS_SITE_ID?.trim();
  return { basisUrl, siteId: siteId && UUID.test(siteId) ? siteId : DEMO_KLANT_SITE_ID };
}

/** Het adres dat de CSP (connect-src) moet toestaan, zodat de beacon het CMS bereikt. Leeg zonder meting. */
export function cspVerbinding(env: Omgeving): string[] {
  const c = metingConfig(env);
  return c ? [c.basisUrl] : [];
}

/** Op welke paden meten we niet: het voorbeeld in de editor en de API. */
export function metingPad(pad: string): boolean {
  return !pad.startsWith("/__voorvertoning") && !pad.startsWith("/api/");
}
