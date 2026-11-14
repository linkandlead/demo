import type { Metadata } from "next";
import { Configurator, Nps, Wissel } from "@/components/nova/LabInteractief";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionTitle } from "@/components/nova/ui";

export const metadata: Metadata = { title: "The Lab" };

export default function Lab() {
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero night">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            NOVA LAB / PLAY WITH IDEAS
          </span>
          <h1>
            Explore.
            <br />
            Experiment.
            <br />
            Experience.
          </h1>
          <div className="hero-description">
            <span className="meta">THE INTERACTIVE LAB</span>
            <p>
              De ruimte voor configuratoren, enquêtes, personalisatie, testen en
              slimme formulieren.
            </p>
          </div>
        </div>
      </section>
      <section data-cms="Configurator" className="section">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="THE EXPERIENCE BUILDER"
            title="Shape your own experience."
            desc="Kies een opzet en ontdek hoe een prijsconfigurator eruit kan zien. Alle bedragen zijn fictief."
          />
          <div className="detail-split">
            <div className="image-frame" style={{ height: 470 }}>
              <Photo src="space_atrium" alt="Studio voor evenementen" />
            </div>
            <div style={{ display: "grid", alignContent: "start", gap: 20 }}>
              <Configurator />
              <Btn to="contact" cl="btn-dark">
                Vraag meer informatie
              </Btn>
            </div>
          </div>
        </div>
      </section>
      <section
        data-cms="Enquête / NPS · A/B-test · Personalisatie"
        className="section section-soft"
      >
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="SMART INTERACTIONS"
            title="See what else is possible."
          />
          <div className="showcase-table">
            <div className="showcase-tile">
              <div>
                <span className="eyebrow">ENQUÊTE / NPS</span>
                <h3 style={{ marginTop: 12 }}>How was your experience?</h3>
              </div>
              <Nps />
            </div>
            <div className="showcase-tile">
              <Wissel
                id="ab-text"
                a="Create what's next."
                b="Make tomorrow happen."
                knop="Wissel tekstvariant ↗"
              />
            </div>
            <div className="showcase-tile">
              <Wissel
                id="person-text"
                a="Welkom bij NOVA."
                b="Goed je weer te zien!"
                knop="Simuleer vaste bezoeker ↗"
              />
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
