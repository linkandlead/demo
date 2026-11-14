import type { Metadata } from "next";
import Link from "next/link";
import { DemoKnop } from "@/components/nova/DemoKnop";
import { Page } from "@/components/nova/Page";
import { Btn, PersonCard, Photo, SectionTitle } from "@/components/nova/ui";
import { getPeople } from "@/lib/cms/data";

export const metadata: Metadata = { title: "Belevingen" };

const TICKETS = [
  ["Dagkaart", "€ 49", "Toegang voor één inspirerende festivaldag."],
  [
    "Volledige beleving",
    "€ 119",
    "Alle dagen, alle sessies en alle inspiratie.",
  ],
  [
    "Communitykaart",
    "€ 179",
    "Met extra netwerkervaring en besloten programma.",
  ],
];

export default async function Experiences() {
  const { items: people } = await getPeople();
  return (
    <Page>
      <section data-cms="Header (hero) · Diepst" className="feature-media">
        <Photo
          src="event_lights"
          alt="Publiek bij een creatieve lichtshow"
          priority
        />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            KOMENDE BELEVINGEN
          </span>
          <h1>
            Pulse
            <br />
            Festival.
          </h1>
          <p>
            Een driedaags festival over creativiteit, technologie en de mens van
            morgen.
          </p>
          <div className="hero-actions">
            <Btn to="experiences/nova-sessions">Bekijk het programma</Btn>
            <Link className="btn btn-outline" href="/experiences/nova-sessions">
              Ontdek het evenement ↗
            </Link>
          </div>
        </div>
      </section>
      <section data-cms="Kaartenrij" className="section">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="WAT JE KUNT VERWACHTEN"
            title="Meer dan een evenement."
          />
          <div className="card-3">
            <div className="info-tile">
              <span className="eyebrow">01</span>
              <strong>Inspirerende sprekers.</strong>
              <p>Nieuwe perspectieven van makers en denkers.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">02</span>
              <strong>Meeslepende kunst.</strong>
              <p>Ervaar de toekomst met al je zintuigen.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">03</span>
              <strong>Echte verbindingen.</strong>
              <p>Ontmoet mensen die iets in beweging brengen.</p>
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
            title="Een beleving om te onthouden."
            desc="Drie inspirerende dagen. Hier tonen we de visuele uitwerking van een programma en tijdlijn."
          />
          <div className="schedule">
            <div>
              {[
                ["10:00", "Opening Pulse Festival"],
                ["11:15", "Ontwerpen voor morgen"],
                ["13:30", "Belevingen voorbij het scherm"],
                ["16:00", "Ontmoet de makers"],
              ].map(([tijd, titel]) => (
                <div className="schedule-row" key={tijd}>
                  <strong>{tijd}</strong>
                  <span>{titel}</span>
                  <span aria-hidden="true">↗</span>
                </div>
              ))}
            </div>
            <div className="image-frame" style={{ height: 360 }}>
              <Photo
                src="event_gradient"
                alt="Lichtkunst en festivalatmosfeer"
              />
            </div>
          </div>
        </div>
      </section>
      <section data-cms="Sprekers · collectie" className="section">
        <div className="container">
          <SectionTitle
            num="03"
            eyebrow="OP HET PODIUM"
            title="Nieuwe stemmen. Grote ideeën."
          />
          <div className="people-grid">
            {people.slice(0, 4).map((p) => (
              <PersonCard key={p.name} p={p} prefix="Spreker · " />
            ))}
          </div>
        </div>
      </section>
      <section
        data-cms="Prijskaarten / tickets"
        className="section section-dark"
      >
        <div className="container">
          <SectionTitle num="04" eyebrow="DOE MEE" title="Vind je ticket." />
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
            Fictieve ticketprijzen uitsluitend voor het ontwerp.
          </p>
        </div>
      </section>
    </Page>
  );
}
