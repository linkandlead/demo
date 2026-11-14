import { CmsPagina } from "@/components/nova/CmsPagina";
import { paginaMetadata } from "@/lib/cms/paginas";

// Pagina "/journal" uit het CMS (site Demo Klant); zonder CMS de blauwdruk.
export const generateMetadata = () => paginaMetadata("/journal");

export default function Verhalen() {
  return <CmsPagina slug="/journal" />;
}
