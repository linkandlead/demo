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
export type CmsSite = {
  naam: string | null;
  domein: string | null;
  paginas: CmsPagina[];
  records: Record<string, Record<string, unknown>[]>;
};

export const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
export const str = (v: unknown) => (typeof v === "string" ? v : "");

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
  return {
    naam: str(site.naam) || null,
    domein: str(site.domein) || null,
    paginas,
    records,
  };
}
