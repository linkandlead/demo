import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/nova/Page";
import { Playground } from "@/components/nova/Playground";

export const metadata: Metadata = { title: "Block Playground" };

export default function PlaygroundPage() {
  return (
    <Page>
      <section className="inner-hero" style={{ paddingBottom: 65 }}>
        <div className="container">
          <span className="eyebrow">LINK & LEAD ONE / BLOCK EXPLORER</span>
          <h1>
            One system.
            <br />
            43 possibilities.
          </h1>
          <div className="hero-description">
            <span className="meta">43 GENERIC CONTENT BLOCKS</span>
            <p>
              De visuele bibliotheek van alle generieke CMS-blokken. Dit is een
              ontwerpvoorstel, nog geen live weergave van de echte componenten.
              Bekijk ook de{" "}
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
