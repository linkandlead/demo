import { CmsPagina } from "@/components/nova/CmsPagina";
import { paginaMetadata } from "@/lib/cms/paginas";

// Pagina "/" uit het CMS (site Demo Klant); zonder CMS de blauwdruk.
export const generateMetadata = () => paginaMetadata("/", true);

export default function Home() {
  return <CmsPagina slug="/" />;
}
