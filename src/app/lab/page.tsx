import type { Metadata } from "next";
import { Configurator, Nps, Wissel } from "@/components/nova/LabInteractief";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionTitle } from "@/components/nova/ui";

export const metadata: Metadata = { title: "Het Lab" };

export default function Lab() {
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero night">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            NOVA LAB / SPEEL MET IDEEËN
          </span>
          <h1>
            Ontdekken.
            <br />
            Experimenteren.
            <br />
            Beleven.
          </h1>
          <div className="hero-description">
            <span className="meta">HET INTERACTIEVE LAB</span>
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
            eyebrow="DE BELEVINGSBOUWER"
            title="Geef je eigen beleving vorm."
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
            eyebrow="SLIMME INTERACTIES"
            title="Zie wat er nog meer kan."
          />
          <div className="showcase-table">
            <div className="showcase-tile">
              <div>
                <span className="eyebrow">ENQUÊTE / NPS</span>
                <h3 style={{ marginTop: 12 }}>Hoe was je ervaring?</h3>
              </div>
              <Nps />
            </div>
            <div className="showcase-tile">
              <Wissel
                id="ab-text"
                a="Maak wat er komt."
                b="Laat morgen gebeuren."
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
