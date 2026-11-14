import { CmsPagina } from "@/components/nova/CmsPagina";
import { paginaMetadata } from "@/lib/cms/paginas";

// Pagina "/work" uit het CMS (site Demo Klant); zonder CMS de blauwdruk.
export const generateMetadata = () => paginaMetadata("/work");

export default function Werk() {
  return <CmsPagina slug="/work" />;
}
