import type { Metadata } from "next";
import Link from "next/link";
import { TourStart } from "@/components/nova/DemoMode";
import { Page } from "@/components/nova/Page";

export const metadata: Metadata = { title: "Ontwerpdemo" };

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
            LINK & LEAD ONE / DE SHOWCASE
          </span>
          <h1>
            Bekijk het ontwerp.
            <br />
            Ontdek het CMS.
          </h1>
          <div className="hero-description">
            <span className="meta">ONTWERP MET RONDLEIDING</span>
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
                DE VIJF-MINUTENTOUR
              </span>
              <h2>Laten zien, niet vertellen.</h2>
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
              <span className="eyebrow">ONTDEKKEN</span>
              <h3>Projecten en dynamische collecties</h3>
              <span className="meta">OPEN WERK ↗</span>
            </Link>
            <Link className="showcase-tile" href="/lab">
              <span className="eyebrow">EXPERIMENTEREN</span>
              <h3>Formulieren en interactieve onderdelen</h3>
              <span className="meta">OPEN LAB ↗</span>
            </Link>
            <Link className="showcase-tile" href="/playground">
              <span className="eyebrow">VERKENNEN</span>
              <h3>Alle 43 generieke CMS-blokken</h3>
              <span className="meta">OPEN BLOKKENBIBLIOTHEEK ↗</span>
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
