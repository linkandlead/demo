import type { ReactNode } from "react";
import { Footer, type Oproep } from "./Footer";

/** Paginaomhulsel zoals in het prototype: <div class="page"> … callout + footer.
 *  `oproep` geeft een pagina een eigen afsluitende oproep; zonder valt hij terug op de gedeelde. */
export function Page({
  children,
  oproep,
}: {
  children: ReactNode;
  oproep?: Oproep;
}) {
  return (
    <div className="page">
      {children}
      <Footer oproep={oproep} />
    </div>
  );
}
