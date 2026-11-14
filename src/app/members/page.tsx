import { CmsPagina } from "@/components/nova/CmsPagina";
import { paginaMetadata } from "@/lib/cms/paginas";

// Pagina "/members" uit het CMS (site Demo Klant); zonder CMS de blauwdruk.
export const generateMetadata = () => paginaMetadata("/members");

export default function Leden() {
  return <CmsPagina slug="/members" />;
}
