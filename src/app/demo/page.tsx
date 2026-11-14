import type { Metadata } from "next";
import Link from "next/link";
import { TourStart } from "@/components/nova/DemoMode";
import { Page } from "@/components/nova/Page";

export const metadata: Metadata = { title: "Design Demo" };

const STAPPEN: Array<[string, string]> = [
  ["Open de prachtige homepage", "/"],
  ["Toon de CMS-bloklabels", "/"],
  ["Navigeer door projecten en artikelen", "/work"],
  ["Test een configurator en formulier", "/lab"],
  ["Bekijk de 43 blokken in de Playground", "/playground"],
  ["Wissel naar mobiele weergave", "/"],
];

export default function Demo() {
  return (
    <Page>
      <section className="inner-hero night">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            LINK & LEAD ONE / THE SHOWCASE
          </span>
          <h1>
            See the design.
            <br />
            Discover the CMS.
          </h1>
          <div className="hero-description">
            <span className="meta">GUIDED DESIGN EXPERIENCE</span>
            <p>
              Een presentatieroute door de fictieve NOVA-website. De visuele
              fase gaat vooraf aan de werkende CMS-koppeling.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="demo-launch">
            <div>
              <span className="eyebrow" style={{ color: "var(--lime)" }}>
                THE FIVE-MINUTE TOUR
              </span>
              <h2>Show, don&apos;t tell.</h2>
              <p>
                Zo demonstreer je straks de kracht van een prachtig ontworpen
                website én de flexibiliteit van het CMS erachter.
              </p>
              <div style={{ marginTop: 25 }}>
                <TourStart>Start op de homepage</TourStart>
              </div>
            </div>
            <div className="steps">
              {STAPPEN.map(([s, pad], i) => (
                <Link className="step" key={s} href={pad}>
                  <span>0{i + 1}</span> {s} <b aria-hidden="true">↗</b>
                </Link>
              ))}
            </div>
          </div>
          <div className="showcase-table" style={{ marginTop: 25 }}>
            <Link className="showcase-tile" href="/work">
              <span className="eyebrow">EXPLORE</span>
              <h3>Projecten en dynamische collecties</h3>
              <span className="meta">OPEN WORK ↗</span>
            </Link>
            <Link className="showcase-tile" href="/lab">
              <span className="eyebrow">EXPERIMENT</span>
              <h3>Formulieren en interactieve onderdelen</h3>
              <span className="meta">OPEN LAB ↗</span>
            </Link>
            <Link className="showcase-tile" href="/playground">
              <span className="eyebrow">DISCOVER</span>
              <h3>Alle 43 generieke CMS-blokken</h3>
              <span className="meta">OPEN PLAYGROUND ↗</span>
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
