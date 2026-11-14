import type { Metadata } from "next";
import { Configurator, Nps, Wissel } from "@/components/nova/LabInteractief";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionTitle } from "@/components/nova/ui";

export const metadata: Metadata = {
  title: "NOVA Lab — interactieve websitefuncties",
  description:
    "Probeer fictieve configurators, formulieren, NPS, personalisatie en A/B-varianten in het interactieve NOVA Lab.",
};

export default function Lab() {
  return (
    <Page
      oproep={{
        eyebrow: "06 / ACHTER DE SCHERMEN",
        kop: "Bekijk de blokken achter elke interactie.",
        tekst: "Alle onderdelen komen voort uit de CMS-blokkenbibliotheek.",
        knop: "Bekijk alle interactieve blokken",
        href: "playground",
      }}
    >
      <section data-cms="Header (hero)" className="inner-hero night">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            NOVA LAB / INTERACTIEVE DEMO’S
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
              Probeer zelf hoe bezoekers met een website kunnen communiceren:
              opties kiezen, feedback geven, formulieren invullen en
              persoonlijke content ontdekken.
            </p>
          </div>
        </div>
      </section>
      <section data-cms="Configurator" className="section">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="MAAK HET VAN JOU"
            title="Stel je eigen beleving samen."
            desc="Stel een fictieve ervaring samen en bekijk hoe een indicatie meebeweegt met jouw keuzes. Er volgt geen aanvraag, reservering of betaling."
          />
          <div className="detail-split">
            <div className="image-frame" style={{ height: 470 }}>
              <Photo
                src="space_atrium"
                alt="Ruim licht atrium met grote ramen, planten en warme zithoeken."
              />
            </div>
            <div style={{ display: "grid", alignContent: "start", gap: 20 }}>
              <Configurator />
              <Btn to="contact" cl="btn-dark">
                Bekijk aanvraagformulier
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
            desc="Enquête, A/B-test en personalisatie: drie bestaande CMS-blokken, hier als veilige demonstratie."
          />
          <div className="showcase-table">
            <div className="showcase-tile">
              <div>
                <span className="eyebrow">ENQUÊTE / NPS</span>
                <h3 style={{ marginTop: 12 }}>
                  Hoe waar&shy;schijnlijk is het dat je deze demo
                  aan&shy;beveelt?
                </h3>
              </div>
              <Nps />
            </div>
            <div className="showcase-tile">
              <Wissel
                id="ab-text"
                a="Maak ruimte voor nieuwe ideeën."
                b="Geef jouw volgende idee een vliegende start."
                knop="Wissel tekstvariant ↗"
              />
            </div>
            <div className="showcase-tile">
              <Wissel
                id="person-text"
                a="Welkom bij NOVA."
                b="Fijn dat je er weer bent. Ontdek wat er nieuw is."
                knop="Simuleer terugkerende bezoeker ↗"
              />
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
