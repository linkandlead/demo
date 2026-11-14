import { CmsPagina } from "@/components/nova/CmsPagina";
import { paginaMetadata, slugsOnder } from "@/lib/cms/paginas";

// Detailpagina's onder /experiences/ zijn gewone CMS-pagina's (slug "/experiences/<naam>"). Een nieuwe pagina in het
// CMS verschijnt vanzelf (dynamicParams staat aan).
export async function generateStaticParams() {
  return (await slugsOnder("/experiences/")).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/experiences/[slug]">) {
  return paginaMetadata(`/experiences/${(await params).slug}`);
}

export default async function Detail({ params }: PageProps<"/experiences/[slug]">) {
  return <CmsPagina slug={`/experiences/${(await params).slug}`} />;
}
