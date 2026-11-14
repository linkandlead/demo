import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/nova/Page";
import { Photo, SectionTitle } from "@/components/nova/ui";
import { getSpaces } from "@/lib/cms/data";

export const metadata: Metadata = {
  title: "Ruimtes — bijzondere ruimtes",
  description:
    "Ontdek The Atrium, Studio One en Light Lab: drie fictieve NOVA-ruimtes voor workshops, bijeenkomsten en evenementen.",
};

export default async function Spaces() {
  const { items: spaces } = await getSpaces();
  return (
    <Page
      oproep={{
        eyebrow: "03 / PLAN IETS",
        kop: "Jouw ruimte. Jouw verhaal.",
        tekst:
          "Bekijk de configurator en de aanvraagstappen zonder een echte boeking te plaatsen.",
        knop: "Probeer de configurator",
        href: "lab",
      }}
    >
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">ONZE RUIMTES / ANDERS ONTMOETEN</span>
          <h1>
            Bijzondere
            <br />
            ruimtes voor
            <br />
            grote ideeën.
          </h1>
          <div className="hero-description">
            <span className="meta">RUIMTES DIE INSPIREREN</span>
            <p>
              Een goed idee verdient de juiste omgeving. Ontdek drie fictieve
              ruimtes voor ontmoetingen, presentaties, workshops en ervaringen.
            </p>
          </div>
        </div>
      </section>
      <section
        data-cms="Collectie (lijst) · ruimtes"
        className="section"
        style={{ paddingTop: 0 }}
      >
        <div className="container">
          {spaces.map((s, i) => (
            <Link
              className="space-card"
              href={`/spaces/${s.slug}`}
              key={s.slug}
            >
              <div className="photo">
                <Photo src={s.cover} alt={s.alt} />
              </div>
              <div className="copy">
                <span className="eyebrow">0{i + 1} / ONZE RUIMTES</span>
                <h3>{s.name}.</h3>
                <p>{s.desc}</p>
                {/* In het prototype een geneste link; een <a> in een <a> is ongeldige HTML, dus hier
                    dezelfde knopvorm als span binnen de kaartlink. */}
                <span className="btn btn-dark">
                  {s.cta}
                  <span className="arrow">↗</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section data-cms="Feiten" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="RUIMTE OM TE CREËREN"
            title="Elk idee verdient een eigen ruimte."
            desc="Drie voorbeeldruimtes, ieder met een andere sfeer. Capaciteiten zijn alleen voorbeeldgegevens voor deze demo."
          />
          <div className="stats-grid">
            <div className="stat">
              <strong>3</strong>
              <p>Fictieve ruimtes</p>
            </div>
            <div className="stat">
              <strong>10–500</strong>
              <p>Voorbeeldcapaciteit, afhankelijk van opstelling</p>
            </div>
            <div className="stat">
              <strong>1</strong>
              <p>Interactieve configurator</p>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
