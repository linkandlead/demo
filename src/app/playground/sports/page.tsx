import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import { SectionTitle } from "@/components/nova/ui";

export const metadata: Metadata = {
  title: "Sportblokken — wedstrijden & volgende wedstrijd",
  description:
    "Bekijk de fictieve sportclub NOVA United en ontdek de CMS-blokken Wedstrijden en Volgende wedstrijd.",
};

export default function Sports() {
  return (
    <Page
      oproep={{
        eyebrow: "03 / TERUG NAAR DE BIBLIOTHEEK",
        kop: "Gebouwd voor meer dan één soort website.",
        tekst: "Dit zijn twee van de 43 algemene CMS-blokken.",
        knop: "Bekijk alle blokken",
        href: "playground",
      }}
    >
      <section className="inner-hero">
        <div className="container">
          <span className="eyebrow">BLOKKENBIBLIOTHEEK / SPORT</span>
          <h1>
            Elk team.
            <br />
            Elk moment.
          </h1>
          <p>
            Een afzonderlijke demo voor wedstrijdoverzichten en de volgende
            wedstrijd. Ontworpen voor sportclubs met een eigen identiteit.
          </p>
        </div>
      </section>
      <section
        data-cms="Wedstrijden en Volgende wedstrijd"
        className="section section-dark"
      >
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="VOLGENDE WEDSTRIJD"
            title="De volgende wedstrijd begint hier."
            desc="NOVA United tegen Atlas FC. Geen live wedstrijdfeed; de datum is voorbeeldcontent."
          />
          <div
            className="featured-story"
            style={{
              background: "#dff29e",
              minHeight: 300,
              color: "var(--night)",
            }}
          >
            <div style={{ padding: 60 }}>
              <span className="eyebrow">VOLGENDE WEDSTRIJD / THUIS</span>
              <h2 style={{ fontSize: 80, marginTop: 15 }}>NOVA / ATLAS</h2>
              <p style={{ fontSize: 15, color: "#1b2b3c", marginTop: 15 }}>
                Voorbeeldwedstrijd · 24 april 2027 · 16.00 uur
              </p>
            </div>
            <div
              style={{
                padding: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 150,
                  fontWeight: 950,
                  letterSpacing: "-.1em",
                }}
                aria-hidden="true"
              >
                N<span style={{ color: "#738900" }}>.</span>
              </div>
            </div>
          </div>
          <div className="schedule" style={{ marginTop: 40 }}>
            <div>
              <span className="eyebrow">
                02 / HET PROGRAMMA · HET HELE SEIZOEN IN ÉÉN OOGOPSLAG
              </span>
              {[
                ["24 APR", "NOVA United — Atlas FC · thuis · 16.00 uur"],
                ["1 MEI", "Harbor City — NOVA United · uit · 14.30 uur"],
                ["8 MEI", "NOVA United — Riverside SC · thuis · 15.00 uur"],
              ].map(([datum, wedstrijd]) => (
                <div className="schedule-row" key={datum}>
                  <strong>{datum}</strong>
                  <span>{wedstrijd}</span>
                  <span aria-hidden="true">↗</span>
                </div>
              ))}
            </div>
            <div className="demo-note">
              Alle clubs, tijden en wedstrijden zijn fictief.
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
