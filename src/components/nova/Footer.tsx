import Link from "next/link";
import { gedeeldeOproep } from "@/lib/cms/data";
import { footerTekst } from "@/content/teksten";
import { Btn, Lines, t } from "./ui";

export type Oproep = {
  eyebrow: string;
  kop: string;
  tekst?: string;
  knop: string;
  href: string;
};

// Afsluitende oproep (gedeeld blok, CMS-type `cta`) + footer met de vaste "Ontdek het CMS"-CTA.
// Markup gelijk aan callout()/footer() uit het prototype.
export async function Footer({ oproep }: { oproep?: Oproep }) {
  const c = await gedeeldeOproep();
  // Volgorde: CMS (gedeeld blok) > paginaspecifieke oproep > standaard uit de teksten.
  const o: Oproep = oproep ?? {
    eyebrow: footerTekst.eyebrow,
    kop: footerTekst.kop,
    tekst: footerTekst.tekst,
    knop: footerTekst.knop,
    href: "contact",
  };
  const tekst = t(c, "tekst", o.tekst ?? "");
  return (
    <>
      <section data-cms="Afsluitende oproep · gedeeld" className="footer-cta">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            {t(c, "eyebrow", o.eyebrow)}
          </span>
          <h2>
            <Lines text={t(c, "titel", o.kop)} />
          </h2>
          {tekst ? <p className="footer-cta-tekst">{tekst}</p> : null}
          <Btn to={t(c, "knop", o.href)}>{t(c, "knoptekst", o.knop)}</Btn>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <Link className="brand" href="/">
              NOVA<span>.</span>
            </Link>
            <div className="footer-links">
              <div>
                <span className="eyebrow">Ontdek</span>
                <Link href="/work">Werk</Link>
                <Link href="/journal">Verhalen</Link>
                <Link href="/experiences">Belevingen</Link>
                <Link href="/spaces">Ruimtes</Link>
              </div>
              <div>
                <span className="eyebrow">Contact</span>
                <Link href="/community">Community</Link>
                <Link href="/about">Over ons</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/playground">Blokkenbibliotheek</Link>
              </div>
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
