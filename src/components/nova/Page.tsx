import type { ReactNode } from "react";
import type { Blok } from "@/lib/cms/paginas";
import { Footer } from "./Footer";

/** Paginaomhulsel zoals in het prototype: <div class="page"> … afsluitende oproep + footer.
 *  `oproep` is het laatste cta-blok van de CMS-pagina. */
export function Page({ children, oproep }: { children: ReactNode; oproep?: Blok | null }) {
  return (
    <div className="page">
      {children}
      <Footer oproep={oproep ?? null} />
    </div>
  );
}
