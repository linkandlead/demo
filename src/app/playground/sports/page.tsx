import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import { SectionTitle } from "@/components/nova/ui";

export const metadata: Metadata = { title: "Sports" };

export default function Sports() {
  return (
    <Page>
      <section className="inner-hero">
        <div className="container">
          <span className="eyebrow">BLOCK PLAYGROUND / SPORTS</span>
          <h1>
            Every team.
            <br />
            Every moment.
          </h1>
          <p>
            Een aparte visuele omgeving voor de bestaande blokken Wedstrijden en
            Volgende wedstrijd.
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
            eyebrow="THE NEXT MATCH"
            title="NOVA United."
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
              <span className="eyebrow">NEXT MATCH / HOME</span>
              <h2 style={{ fontSize: 80, marginTop: 15 }}>NOVA / ATLAS</h2>
              <p style={{ fontSize: 15, color: "#1b2b3c", marginTop: 15 }}>
                Fictieve wedstrijd · 24 april 2027 · 16:00
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
              <div className="schedule-row">
                <strong>24 APR</strong>
                <span>NOVA United — Atlas FC</span>
                <span aria-hidden="true">↗</span>
              </div>
              <div className="schedule-row">
                <strong>1 MEI</strong>
                <span>Harbor City — NOVA United</span>
                <span aria-hidden="true">↗</span>
              </div>
            </div>
            <div className="demo-note">
              Uitsluitend fictieve uitslagen en wedstrijddatums.
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
