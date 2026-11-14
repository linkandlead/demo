import type { Metadata } from "next";
import Link from "next/link";
import { DemoKnop } from "@/components/nova/DemoKnop";
import { Page } from "@/components/nova/Page";
import { Btn, PersonCard, Photo, SectionTitle } from "@/components/nova/ui";
import { altTeksten, sprekers } from "@/content/teksten";
import { getPeople } from "@/lib/cms/data";

export const metadata: Metadata = {
  title: "Belevingen — Pulse Festival",
  description:
    "Ontdek Pulse Festival, het fictieve NOVA-demo-evenement met programma, sprekers en voorbeeldtickets.",
};

const TICKETS = [
  ["Dagkaart", "€ 49", "Toegang tot één programmadag en de centrale expo."],
  [
    "Volledig festival",
    "€ 119",
    "Drie dagen inspiratie, installaties en sessies.",
  ],
  ["Makerspas", "€ 189", "Het volledige programma plus een kleine werksessie."],
];

export default async function Experiences() {
  const { items: people } = await getPeople();
  return (
    <Page
      oproep={{
        eyebrow: "05 / GA VERDER",
        kop: "Meer dan een evenement. Een gedeelde ervaring.",
        tekst:
          "Bekijk hoe evenementen, sprekers en prijskaarten in het CMS worden gepresenteerd.",
        knop: "Ontdek de CMS-blokken",
        href: "playground",
      }}
    >
      <section data-cms="Header (hero) · Diepst" className="feature-media">
        <Photo src="event_lights" alt={altTeksten.event_lights} priority />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            KOMENDE BELEVING / DEMO-EVENEMENT
          </span>
          <h1>
            Pulse
            <br />
            Festival.
          </h1>
          <p>
            Een driedaagse ontmoeting tussen creativiteit, technologie en
            cultuur. Vol verrassende perspectieven, nieuwe verbindingen en
            bijzondere verhalen.
          </p>
          <div className="hero-actions">
            <Btn to="experiences/pulse-festival">Bekijk het programma</Btn>
            <Link className="btn btn-outline" href="/experiences/nova-sessions">
              Bekijk NOVA Sessions ↗
            </Link>
          </div>
        </div>
      </section>
      <section data-cms="Kaartenrij" className="section">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="WAT JE KUNT VERWACHTEN"
            title="Drie dagen. Eindeloos veel perspectieven."
            desc="Niet alleen luisteren, maar ontdekken en meedoen."
          />
          <div className="card-3">
            <div className="info-tile">
              <span className="eyebrow">01</span>
              <strong>Inspirerende stemmen.</strong>
              <p>Nieuwe ideeën van ontwerpers, makers en vernieuwers.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">02</span>
              <strong>Meeslepende werelden.</strong>
              <p>Installaties die je anders laten kijken en voelen.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">03</span>
              <strong>Echte verbindingen.</strong>
              <p>Ontmoet mensen die dezelfde nieuwsgierigheid delen.</p>
            </div>
          </div>
        </div>
      </section>
      <section
        data-cms="Reeks stappen · programma"
        className="section section-soft"
      >
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="HET PROGRAMMA"
            title="Een programma vol mogelijkheden."
            desc="Elke dag een eigen ritme, van eerste idee tot laatste ontmoeting."
          />
          <div className="schedule">
            <div>
              {[
                [
                  "DAG 1",
                  "Ontdekken — nieuwe vragen, nieuwe geluiden, nieuwe perspectieven.",
                ],
                ["DAG 2", "Creëren — workshops, experimenten en samenwerking."],
                [
                  "DAG 3",
                  "Verbinden — inzichten delen en ideeën verder brengen.",
                ],
              ].map(([tijd, titel]) => (
                <div className="schedule-row" key={tijd}>
                  <strong>{tijd}</strong>
                  <span>{titel}</span>
                  <span aria-hidden="true">↗</span>
                </div>
              ))}
            </div>
            <div className="image-frame" style={{ height: 360 }}>
              <Photo src="event_gradient" alt={altTeksten.event_gradient} />
            </div>
          </div>
        </div>
      </section>
      <section data-cms="Sprekers · collectie" className="section">
        <div className="container">
          <SectionTitle
            num="03"
            eyebrow="OP HET PODIUM"
            title="Ontmoet de denkers achter de ideeën."
            desc="Vier fictieve sprekers met elk hun eigen invalshoek."
          />
          <div className="people-grid">
            {people.slice(0, 4).map((p) => (
              <PersonCard
                key={p.name}
                p={{ ...p, role: sprekers[p.name] ?? p.role }}
                prefix="Spreker · "
              />
            ))}
          </div>
        </div>
      </section>
      <section
        data-cms="Prijskaarten / tickets"
        className="section section-dark"
      >
        <div className="container">
          <SectionTitle
            num="04"
            eyebrow="KIES JE BELEVING"
            title="Jouw beleving, op jouw manier."
            desc="Vergelijk voorbeeldtickets. Deze prijzen zijn fictief; bestellen of betalen is niet mogelijk in de demo."
          />
          <div className="tickets">
            {TICKETS.map((tk, i) => (
              <div
                className={`ticket ${i === 1 ? "featured" : ""}`}
                key={tk[0]}
              >
                <div>
                  <span className="eyebrow">
                    {i === 1 ? "MEEST GEKOZEN" : "TOEGANG"}
                  </span>
                  <h3 style={{ marginTop: 13 }}>{tk[0]}</h3>
                  <p style={{ marginTop: 12 }}>{tk[2]}</p>
                </div>
                <div>
                  <strong>{tk[1]}</strong>
                  <DemoKnop
                    style={{ display: "flex", marginTop: 15 }}
                    melding="Dit is een visueel ontwerp. Er vindt geen betaling plaats."
                  >
                    Bekijk tickets ↗
                  </DemoKnop>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, marginTop: 20, color: "#cbd2e0" }}>
            Fictieve prijzen en fictief evenement. Er worden geen tickets
            verkocht.
          </p>
        </div>
      </section>
    </Page>
  );
}
