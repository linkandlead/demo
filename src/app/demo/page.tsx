import type { Metadata } from "next";
import Link from "next/link";
import { TourStart } from "@/components/nova/DemoMode";
import { Page } from "@/components/nova/Page";

export const metadata: Metadata = {
  title: "Interactieve rondleiding — Link & Lead One",
  description:
    "Loop door NOVA en ontdek de contentblokken, collecties en stijlmogelijkheden van Link & Lead One.",
};

const STAPPEN: Array<[string, string]> = [
  ["Start met de homepage", "/"],
  ["Maak de blokken zichtbaar", "/"],
  ["Open een collectie", "/work"],
  ["Probeer interactie in NOVA Lab", "/lab"],
  ["Verken de blokkenbibliotheek", "/playground"],
  ["Bekijk mobiel", "/"],
];

export default function Demo() {
  return (
    <Page
      oproep={{
        eyebrow: "03 / LATEN WE PRATEN",
        kop: "Wil je je eigen website vorm zien krijgen?",
        tekst: "Vraag een persoonlijke toelichting aan op Link & Lead One.",
        knop: "Vraag een persoonlijke demo aan",
        href: "one#aanvraag",
      }}
    >
      <section className="inner-hero night">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            LINK & LEAD ONE / RONDLEIDING
          </span>
          <h1>
            Bekijk het ontwerp.
            <br />
            Ontdek het CMS.
          </h1>
          <div className="hero-description">
            <span className="meta">ONTWERP MET RONDLEIDING</span>
            <p>
              Een rondleiding langs de opvallendste onderdelen van NOVA. Ontdek
              niet alleen wat je ziet, maar ook hoe je de inhoud erachter
              beheert.
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
                Zes korte stappen laten de verbinding tussen design en
                contentbeheer zien. Niet-gekoppelde onderdelen heten in deze
                tour expliciet demonstratie of preview.
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
              <h3>Werk: projecten en contentcollecties</h3>
              <span className="meta">OPEN WERK ↗</span>
            </Link>
            <Link className="showcase-tile" href="/lab">
              <span className="eyebrow">EXPERIMENTEREN</span>
              <h3>NOVA Lab: interactieve blokken en formulieren</h3>
              <span className="meta">OPEN LAB ↗</span>
            </Link>
            <Link className="showcase-tile" href="/playground">
              <span className="eyebrow">VERKENNEN</span>
              <h3>Blokkenbibliotheek: alle 43 algemene blokken</h3>
              <span className="meta">OPEN BLOKKENBIBLIOTHEEK ↗</span>
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
