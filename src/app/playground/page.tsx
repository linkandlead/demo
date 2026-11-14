import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/nova/Page";
import { Playground } from "@/components/nova/Playground";

export const metadata: Metadata = {
  title: "Blokkenbibliotheek — 43 CMS-blokken",
  description:
    "Ontdek de 43 algemene CMS-blokken en vijf achtergronden van Link & Lead One in een interactieve voorbeeldbibliotheek.",
};

export default function PlaygroundPage() {
  return (
    <Page
      oproep={{
        eyebrow: "02 / ZIE HET IN CONTEXT",
        kop: "Een blok is pas het begin.",
        tekst:
          "Ontdek hoe losse onderdelen samen één overtuigende website vormen.",
        knop: "Bekijk NOVA in actie",
        href: "",
      }}
    >
      <section className="inner-hero" style={{ paddingBottom: 65 }}>
        <div className="container">
          <span className="eyebrow">LINK & LEAD ONE / BLOKKENVERKENNER</span>
          <h1>
            Eén systeem.
            <br />
            43 mogelijkheden.
          </h1>
          <div className="hero-description">
            <span className="meta">43 ALGEMENE CONTENTBLOKKEN</span>
            <p>
              Bekijk alle 43 algemene CMS-blokken. Kies een categorie,
              achtergrond en beschikbare variant om te zien hoe uiteenlopende
              pagina’s worden opgebouwd. Bekijk ook de{" "}
              <Link
                href="/playground/sports"
                style={{ textDecoration: "underline" }}
              >
                sportblokken
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
      <section className="section section-soft" style={{ paddingTop: 50 }}>
        <div className="container">
          <Playground />
        </div>
      </section>
    </Page>
  );
}
