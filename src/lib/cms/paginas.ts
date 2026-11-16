import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import { paginas as blauwdruk } from "@/content/blauwdruk";
import { str } from "./valideer";
import { cmsStatus } from "./data";
import { haalConcept, voorbeeldStand } from "./concept";
import { kiesInhoud } from "./voorvertoning";
import type { CmsBlok } from "./client";

// Pagina's komen uit het CMS (site "Demo Klant"): titel, beschrijving en de blokken in volgorde.
// Zonder CMS-koppeling, of voor een pagina die (nog) niet in het CMS staat, valt de site terug op
// de blauwdruk (src/content/blauwdruk.ts) — dezelfde inhoud die met scripts/cms-push.mjs in het
// CMS is gezet. Zo is er één bron van waarheid en ziet de site er zonder CMS hetzelfde uit.
// In draft mode ("Voorbeeld op de site", zie concept.ts) komt eerst het concept uit het CMS.

export type Blok = CmsBlok;
export type PaginaInhoud = {
  slug: string;
  titel: string;
  beschrijving: string;
  ogBeeld?: string;
  blokken: Blok[];
  bron: "cms" | "blauwdruk" | "concept";
  /** Bewerkmodus (B-090): een concept uit het CMS én een bewerktoken. Alleen dan krijgen blokken
   *  bewerkattributen; een bezoeker nooit. */
  bewerkbaar?: boolean;
  /** Ingesloten voorbeeld in de pagina-editor van het CMS (B-127): een concept, opgehaald door /__voorvertoning
   *  met &ingesloten=1. Dan krijgt elk blok data-cms-sectie (klikken en typen); een bezoeker nooit. */
  ingesloten?: boolean;
};

const laadGepubliceerd = async (slug: string): Promise<PaginaInhoud | null> => {
  const st = await cmsStatus();
  if (st.bron === "cms") {
    const p = st.site.paginas.find((x) => x.slug === slug);
    if (p) return { ...p, bron: "cms" };
  }
  const b = blauwdruk.find((x) => x.slug === slug);
  return b ? { slug: b.slug, titel: b.titel, beschrijving: b.beschrijving, blokken: b.blokken, bron: "blauwdruk" } : null;
};

export const laadPagina = cache(async (slug: string): Promise<PaginaInhoud | null> => {
  const stand = await voorbeeldStand();
  const concept = stand.aan && stand.token ? await haalConcept(slug, stand.token) : null;
  const gepubliceerd = concept?.soort === "concept" ? null : await laadGepubliceerd(slug);
  const gekozen = kiesInhoud({ draftMode: stand.aan, concept, gepubliceerd });
  if (!gekozen) return null;
  if ("bron" in gekozen) return gekozen;
  const ingesloten = stand.aan && stand.ingesloten;
  // In de editor (ingesloten) typt de redacteur via het CMS (B-127); de eigen bewerkbalk (B-090) blijft dan uit.
  const bewerkbaar = !ingesloten && stand.aan && stand.bewerken && gekozen.blokken.some((b) => b.id && b.bewerken);
  return { ...gekozen, bron: "concept", ...(bewerkbaar ? { bewerkbaar: true } : {}), ...(ingesloten ? { ingesloten: true } : {}) };
});

/** Alle paginaslugs onder een prefix (bv. "/spaces/"), uit het CMS én de blauwdruk. */
export async function slugsOnder(prefix: string): Promise<string[]> {
  const st = await cmsStatus();
  const uitCms = st.bron === "cms" ? st.site.paginas.map((p) => p.slug) : [];
  const alle = new Set([...uitCms, ...blauwdruk.map((p) => p.slug)]);
  return [...alle]
    .filter((s) => s.startsWith(prefix) && s.length > prefix.length && !s.slice(prefix.length).includes("/"))
    .map((s) => s.slice(prefix.length));
}

/** Deelbeeld: het CMS-veld og_beeld, anders het eerste beeld van de pagina (header, tekst met beeld …). */
export function deelbeeld(p: Pick<PaginaInhoud, "ogBeeld" | "blokken">): string | undefined {
  if (p.ogBeeld) return p.ogBeeld;
  for (const b of p.blokken)
    for (const veld of ["media_afbeelding", "beeld"]) {
      const v = str(b.content[veld]);
      if (/^(https:\/\/|\/media\/)/.test(v)) return v;
    }
  return undefined;
}

/** SEO-titel, -beschrijving en deelgegevens (Open Graph) per pagina, beheerd in het CMS.
 *  Een concept wordt nooit geïndexeerd. */
export async function paginaMetadata(slug: string, absoluut = false): Promise<Metadata> {
  const p = await laadPagina(slug);
  if (!p) return {};
  const titel = str(p.titel);
  const beeld = deelbeeld(p);
  return {
    title: titel ? (absoluut ? { absolute: titel } : titel) : undefined,
    description: p.beschrijving || undefined,
    alternates: { canonical: slug },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      siteName: "NOVA",
      url: slug,
      title: titel || undefined,
      description: p.beschrijving || undefined,
      ...(beeld ? { images: [{ url: beeld, alt: titel }] } : {}),
    },
    twitter: { card: beeld ? "summary_large_image" : "summary", title: titel || undefined, description: p.beschrijving || undefined },
    ...(p.bron === "concept" ? { robots: { index: false, follow: false } } : {}),
  };
}
