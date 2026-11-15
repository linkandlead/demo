import Link from "next/link";
import { footerTekst } from "@/content/teksten";
import { siteInstellingen } from "@/lib/cms/data";
import type { Blok } from "@/lib/cms/paginas";
import { Btn, Lines } from "./ui";

const tx = (c: Record<string, unknown>, k: string) => (typeof c[k] === "string" ? (c[k] as string).trim() : "");

// Afsluitende oproep (laatste cta-blok van de pagina in het CMS) + footer. De footerkolommen komen
// uit de CMS-navigatie (merk → footer_kolommen). Markup gelijk aan callout()/footer() uit het prototype.
/** De afsluitende oproep (laatste cta-blok van een pagina), ook gebruikt in de blokkenverkenner. */
export function OproepSectie({ oproep }: { oproep: Blok }) {
  const c = oproep.content;
  const knop = tx(c, "knop");
  return (
    <section data-cms="Afsluitende oproep (CTA) · Diepst" className="footer-cta">
      <div className="container">
        <span className="eyebrow" style={{ color: "var(--lime)" }}>
          {tx(c, "eyebrow")}
        </span>
        <h2>
          <Lines text={tx(c, "titel")} />
        </h2>
        {tx(c, "tekst") ? <p className="footer-cta-tekst">{tx(c, "tekst")}</p> : null}
        {knop ? <Btn to={knop}>{tx(c, "knoptekst")}</Btn> : null}
      </div>
    </section>
  );
}

export async function Footer({ oproep }: { oproep: Blok | null }) {
  const { naam, navigatie } = await siteInstellingen();
  return (
    <>
      {oproep ? <OproepSectie oproep={oproep} /> : null}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <Link className="brand" href="/">
              {naam}
              <span>.</span>
            </Link>
            <div className="footer-links">
              {navigatie.footer.map((kolom) => (
                <div key={kolom.kop}>
                  <span className="eyebrow">{kolom.kop}</span>
                  {kolom.links.map((l) => (
                    <Link key={l.href + l.titel} href={l.href}>
                      {l.titel}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="footer-one-promo">
            <div>
              <strong>{footerTekst.cmsKop}</strong>
              <span>{footerTekst.cmsTekst}</span>
            </div>
            <Link href="/one" className="btn btn-mini btn-lime">
              Ontdek het CMS ↗
            </Link>
          </div>
          <div className="footer-end">
            <span>{footerTekst.copyright}</span>
            <span>{footerTekst.disclaimer}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
