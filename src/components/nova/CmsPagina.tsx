import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { laadPagina } from "@/lib/cms/paginas";
import { Blokken, splitsOproep } from "./Blokken";
import { Page } from "./Page";

/** Een volledige pagina uit het CMS: alle blokken in volgorde, het laatste cta-blok als oproep. */
export async function CmsPagina({ slug, na }: { slug: string; na?: Partial<Record<string, ReactNode>> }) {
  const pagina = await laadPagina(slug);
  if (!pagina) notFound();
  const { blokken, oproep } = splitsOproep(pagina.blokken);
  return (
    <Page oproep={oproep}>
      <Blokken pagina={pagina} blokken={blokken} na={na} />
    </Page>
  );
}
