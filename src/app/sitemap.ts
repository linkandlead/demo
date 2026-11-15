import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/cms-media";
import { paginas as blauwdruk } from "@/content/blauwdruk";
import { cmsStatus, getCases, getPartners, getPeople, getPosts } from "@/lib/cms/data";
import { persoonSlug } from "@/lib/slug";

// sitemap.xml uit het CMS: alle pagina's, projecten, artikelen, makers en partners.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const st = await cmsStatus();
  const paginas = new Set([...(st.bron === "cms" ? st.site.paginas.map((p) => p.slug) : []), ...blauwdruk.map((p) => p.slug)]);
  const [{ items: cases }, { items: posts }, { items: mensen }, { items: partners }] = await Promise.all([
    getCases(),
    getPosts(),
    getPeople(),
    getPartners(),
  ]);
  const paden = [
    ...paginas,
    "/rondleiding",
    ...cases.map((c) => `/work/${c.slug}`),
    ...posts.map((p) => `/journal/${p.slug}`),
    ...mensen.map((m) => `/mensen/${persoonSlug(m.name)}`),
    ...partners.map((p) => `/partners/${p.slug}`),
  ];
  return [...new Set(paden)].map((pad) => ({
    url: SITE_URL + pad,
    changeFrequency: pad === "/" || pad === "/journal" ? "weekly" : "monthly",
    priority: pad === "/" ? 1 : pad.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
