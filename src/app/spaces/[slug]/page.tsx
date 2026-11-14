import { CmsPagina } from "@/components/nova/CmsPagina";
import { paginaMetadata, slugsOnder } from "@/lib/cms/paginas";

// Detailpagina's onder /spaces/ zijn gewone CMS-pagina's (slug "/spaces/<naam>"). Een nieuwe pagina in het
// CMS verschijnt vanzelf (dynamicParams staat aan).
export async function generateStaticParams() {
  return (await slugsOnder("/spaces/")).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/spaces/[slug]">) {
  return paginaMetadata(`/spaces/${(await params).slug}`);
}

export default async function Detail({ params }: PageProps<"/spaces/[slug]">) {
  return <CmsPagina slug={`/spaces/${(await params).slug}`} />;
}
