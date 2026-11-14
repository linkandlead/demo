// Runtime-validatie van de CMS-lees-API (contract: linkandlead-cms src/routes/api/cms/content.ts).
// Puur (geen server-only), zodat het los te testen is.

export type CmsBlok = {
  type: string;
  bg: string | null;
  content: Record<string, unknown>;
};
export type CmsPagina = {
  slug: string;
  titel: string;
  beschrijving: string;
  blokken: CmsBlok[];
};
export type CmsLink = { titel: string; href: string };
export type CmsNavigatie = {
  hoofd: CmsLink[];
  footer: Array<{ kop: string; links: CmsLink[] }>;
  actie: CmsLink | null;
};
export type CmsSite = {
  naam: string | null;
  domein: string | null;
  navigatie: CmsNavigatie;
  merk: Record<string, unknown>;
  designTokens: Record<string, string>;
  paginas: CmsPagina[];
  records: Record<string, Record<string, unknown>[]>;
};

export const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
export const str = (v: unknown) => (typeof v === "string" ? v : "");

function link(v: unknown): CmsLink | null {
  if (!isObj(v)) return null;
  const titel = str(v.titel).trim();
  const href = str(v.href).trim();
  // Alleen interne paden, ankers en https-links; javascript:/data: e.d. vallen weg.
  return titel && /^(\/|#|https:\/\/)/.test(href) ? { titel, href } : null;
}
const links = (v: unknown) => (Array.isArray(v) ? v.map(link).filter((l): l is CmsLink => !!l) : []);

/** Runtime-validatie van de API-respons: onbekende JSON → getypeerd object, rommel valt weg. */
export function valideerRespons(json: unknown): CmsSite | null {
  if (!isObj(json) || json.ok !== true) return null;
  const site = isObj(json.site) ? json.site : {};
  const paginas: CmsPagina[] = (Array.isArray(json.paginas) ? json.paginas : [])
    .filter(isObj)
    .map((p) => ({
      slug: str(p.slug),
      titel: str(p.titel),
      beschrijving: str(p.beschrijving),
      blokken: (Array.isArray(p.blokken) ? p.blokken : [])
        .filter(isObj)
        .map((b) => ({
          type: str(b.type),
          bg: typeof b.bg === "string" ? b.bg : null,
          content: isObj(b.content) ? b.content : {},
        })),
    }));
  const records: CmsSite["records"] = {};
  if (isObj(json.records))
    for (const [k, v] of Object.entries(json.records))
      if (Array.isArray(v)) records[k] = v.filter(isObj);
  const nav = isObj(site.navigatie) ? site.navigatie : {};
  const tokens: Record<string, string> = {};
  if (isObj(site.design_tokens))
    for (const [k, v] of Object.entries(site.design_tokens))
      if (typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v.trim())) tokens[k] = v.trim();
  return {
    naam: str(site.naam) || null,
    domein: str(site.domein) || null,
    navigatie: {
      hoofd: links(nav.hoofd),
      footer: (Array.isArray(nav.footer) ? nav.footer : [])
        .filter(isObj)
        .map((k) => ({ kop: str(k.kop), links: links(k.links) }))
        .filter((k) => k.links.length),
      actie: link(nav.actie),
    },
    merk: isObj(site.merk) ? site.merk : {},
    designTokens: tokens,
    paginas,
    records,
  };
}
