import { notFound } from "next/navigation";
import { CmsPagina } from "@/components/nova/CmsPagina";
import { Blokken } from "@/components/nova/Blokken";
import { Page } from "@/components/nova/Page";
import { getCases } from "@/lib/cms/data";
import { laadPagina, paginaMetadata, slugsOnder, type Blok, type PaginaInhoud } from "@/lib/cms/paginas";

// Projectdetail: de CMS-pagina "/work/<slug>" als die bestaat. Een case die alleen in de
// Cases-collectie staat, krijgt automatisch een detailpagina uit de velden van die case.
export async function generateStaticParams() {
  const [paginas, { items }] = await Promise.all([slugsOnder("/work/"), getCases()]);
  return [...new Set([...paginas, ...items.map((c) => c.slug)])].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (await laadPagina(`/work/${slug}`)) return paginaMetadata(`/work/${slug}`);
  const c = (await getCases()).items.find((x) => x.slug === slug);
  return c ? { title: c.name, description: c.desc } : {};
}

export default async function Project({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (await laadPagina(`/work/${slug}`)) return <CmsPagina slug={`/work/${slug}`} />;
  const c = (await getCases()).items.find((x) => x.slug === slug);
  if (!c) notFound();
  const blokken: Blok[] = [
    {
      type: "header",
      bg: "nacht",
      content: { layout: "achtergrond", eyebrow: `GESELECTEERD WERK / ${c.type}`, heading: `${c.name}.`, subheading: c.desc, media_afbeelding: c.cover },
    },
    {
      type: "feiten",
      bg: "wit",
      content: {
        feiten: [
          { label: "SECTOR", waarde: c.type },
          ...(c.year ? [{ label: "JAAR", waarde: c.year }] : []),
          ...(c.diensten?.length ? [{ label: "DIENSTEN", waarde: c.diensten.join(" / ") }] : []),
        ],
      },
    },
    ...(c.statement ? [{ type: "flexibel", bg: "wit", content: { titel: c.statement, kolommen: "1", items: [{ tekst: c.desc }] } }] : []),
  ];
  const pagina: PaginaInhoud = { slug: `/work/${slug}`, titel: c.name, beschrijving: c.desc, blokken, bron: "cms" };
  return (
    <Page>
      <Blokken pagina={pagina} blokken={blokken} />
    </Page>
  );
}
