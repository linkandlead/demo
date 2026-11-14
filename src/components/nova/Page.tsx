import type { ReactNode } from "react";
import { Footer } from "./Footer";

/** Paginaomhulsel zoals in het prototype: <div class="page"> … callout + footer. */
export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="page">
      {children}
      <Footer />
    </div>
  );
}
