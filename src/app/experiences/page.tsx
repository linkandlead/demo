import type { Metadata } from "next";
import Link from "next/link";
import { DemoKnop } from "@/components/nova/DemoKnop";
import { Page } from "@/components/nova/Page";
import { Btn, PersonCard, Photo, SectionTitle } from "@/components/nova/ui";
import { getPeople } from "@/lib/cms/data";

export const metadata: Metadata = { title: "Experiences" };

const TICKETS = [
  ["Day Pass", "€ 49", "Toegang voor één inspirerende festivaldag."],
  ["Full Experience", "€ 119", "Alle dagen, alle sessies en alle inspiratie."],
  [
    "Community Pass",
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
            UPCOMING EXPERIENCES
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
              Ontdek het event ↗
            </Link>
          </div>
        </div>
      </section>
      <section data-cms="Kaartenrij" className="section">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="WHAT TO EXPECT"
            title="More than an event."
          />
          <div className="card-3">
            <div className="info-tile">
              <span className="eyebrow">01</span>
              <strong>Inspiring speakers.</strong>
              <p>Nieuwe perspectieven van makers en denkers.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">02</span>
              <strong>Immersive art.</strong>
              <p>Ervaar de toekomst met al je zintuigen.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">03</span>
              <strong>Real connections.</strong>
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
            eyebrow="THE PROGRAM"
            title="An experience to remember."
            desc="Drie inspirerende dagen. Hier tonen we de visuele uitwerking van een programma en tijdlijn."
          />
          <div className="schedule">
            <div>
              {[
                ["10:00", "Opening Pulse Festival"],
                ["11:15", "Designing tomorrow"],
                ["13:30", "Experiences beyond screens"],
                ["16:00", "Meet the makers"],
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
            eyebrow="ON STAGE"
            title="Fresh voices. Big ideas."
          />
          <div className="people-grid">
            {people.slice(0, 4).map((p) => (
              <PersonCard key={p.name} p={p} prefix="Speaker · " />
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
            eyebrow="JOIN THE EXPERIENCE"
            title="Find your ticket."
          />
          <div className="tickets">
            {TICKETS.map((tk, i) => (
              <div
                className={`ticket ${i === 1 ? "featured" : ""}`}
                key={tk[0]}
              >
                <div>
                  <span className="eyebrow">
                    {i === 1 ? "MOST POPULAR" : "ACCESS"}
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
