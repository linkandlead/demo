import { CmsPagina } from "@/components/nova/CmsPagina";
import { paginaMetadata } from "@/lib/cms/paginas";

// Pagina "/one" uit het CMS (site Demo Klant); zonder CMS de blauwdruk.
export const generateMetadata = () => paginaMetadata("/one", true);

export default function HetCms() {
  return <CmsPagina slug="/one" />;
}
