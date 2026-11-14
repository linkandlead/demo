import Link from "next/link";
import { gedeeldeOproep } from "@/lib/cms/data";
import { Btn, Lines, t } from "./ui";

// Afsluitende oproep (gedeeld blok, CMS-type `cta`) + footer met de vaste "Ontdek het CMS"-CTA.
// Markup gelijk aan callout()/footer() uit het prototype.
export async function Footer() {
  const c = await gedeeldeOproep();
  return (
    <>
      <section data-cms="Afsluitende oproep · gedeeld" className="footer-cta">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            {t(c, "eyebrow", "WHAT'S NEXT?")}
          </span>
          <h2>
            <Lines
              text={t(c, "titel", "Have something extraordinary in mind?")}
            />
          </h2>
          <Btn to={t(c, "knop", "contact")}>
            {t(c, "knoptekst", "Start een gesprek")}
          </Btn>
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
                <span className="eyebrow">Explore</span>
                <Link href="/work">Work</Link>
                <Link href="/journal">Journal</Link>
                <Link href="/experiences">Experiences</Link>
                <Link href="/spaces">Spaces</Link>
              </div>
              <div>
                <span className="eyebrow">Connect</span>
                <Link href="/community">Community</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/playground">Block Playground</Link>
              </div>
            </div>
          </div>
          <div className="footer-one-promo">
            <div>
              <strong>
                Gemaakt om te inspireren. Ontworpen voor Link & Lead One.
              </strong>
              <span>
                Ontdek de technologie en CMS-blokken achter deze fictieve
                website.
              </span>
            </div>
            <Link href="/one" className="btn btn-mini btn-lime">
              Ontdek het CMS ↗
            </Link>
          </div>
          <div className="footer-end">
            <span>
              © NOVA 2026 — Fictief merk voor de CMS-ontwerpdemonstratie.
            </span>
            <span>
              Visual design concept by Link & Lead One · Geen live website
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
