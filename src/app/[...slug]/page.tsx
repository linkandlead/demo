import { notFound, permanentRedirect, redirect } from "next/navigation";
import { CmsPagina } from "@/components/nova/CmsPagina";
import { cmsStatus } from "@/lib/cms/data";
import { vindDoorverwijzing } from "@/lib/cms/doorverwijzing";
import { laadPagina, paginaMetadata } from "@/lib/cms/paginas";

// Elke pagina uit het CMS die geen eigen route heeft in deze site (bv. een nieuwe pagina die in One Studio is
// gemaakt en gepubliceerd). De vaste routes (/about, /work, …) gaan hiervoor. Eerst de doorverwijzingen uit het
// CMS (Beheer > Redirects): die gaan voor een pagina. Bestaat de pagina niet, dan de 404 van de site.
const padVan = (slug: string[]) => `/${slug.join("/")}`;

export async function generateMetadata({ params }: PageProps<"/[...slug]">) {
  const pad = padVan((await params).slug);
  return (await laadPagina(pad)) ? paginaMetadata(pad) : {};
}

export default async function CmsPaginaRoute({ params }: PageProps<"/[...slug]">) {
  const pad = padVan((await params).slug);
  const st = await cmsStatus();
  const door = st.bron === "cms" ? vindDoorverwijzing(st.site.redirects, pad) : null;
  if (door) {
    if (door.status === 301 || door.status === 308) permanentRedirect(door.naar);
    redirect(door.naar);
  }
  if (!(await laadPagina(pad))) notFound();
  return <CmsPagina slug={pad} />;
}
