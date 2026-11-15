import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { cmsUrl } from "@/lib/cms/client";
import { laadPagina } from "@/lib/cms/paginas";
import { BewerkBalk, type BewerkSectie } from "./BewerkBalk";
import { Blokken, splitsOproep } from "./Blokken";
import { Page } from "./Page";

/** Een volledige pagina uit het CMS: alle blokken in volgorde, het laatste cta-blok als oproep. */
export async function CmsPagina({ slug, na }: { slug: string; na?: Partial<Record<string, ReactNode>> }) {
  const pagina = await laadPagina(slug);
  if (!pagina) notFound();
  const { blokken, oproep } = splitsOproep(pagina.blokken);
  // Bewerkmodus (B-090): alleen bij een concept met bewerktoken. Geen tokens naar de browser, alleen wat
  // de balk nodig heeft: per blok de sectie-id, de versie en de bewerkbare tekstvelden. De afsluitende
  // oproep (footer) staat buiten de blokken en bewerk je in de editor.
  const secties: BewerkSectie[] = pagina.bewerkbaar
    ? blokken.flatMap((b) => (b.id && b.bewerken ? [{ id: b.id, versie: b.bewerken.versie, velden: b.bewerken.velden }] : []))
    : [];
  const cms = cmsUrl();
  return (
    <Page oproep={oproep}>
      {secties.length ? (
        <BewerkBalk pagina={pagina.slug} secties={secties} editorUrl={cms ? `${cms}/admin/paginas?zoek=${encodeURIComponent(pagina.slug)}` : null} />
      ) : null}
      <Blokken pagina={pagina} blokken={blokken} na={na} />
    </Page>
  );
}
