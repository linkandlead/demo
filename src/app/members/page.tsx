import type { Metadata } from "next";
import { DemoFormulier } from "@/components/nova/DemoFormulier";
import { Page } from "@/components/nova/Page";

export const metadata: Metadata = {
  title: "Leden — demo ledentoegang",
  description:
    "Bekijk het concept voor ledentoegang binnen de fictieve NOVA-website. Geen echte inlogomgeving.",
};

export default function Members() {
  return (
    <Page
      oproep={{
        eyebrow: "02 / LEDENERVARING",
        kop: "Elke community verdient een eigen plek.",
        tekst: "Bekijk meer blokken voor leden, aanmeldingen en formulieren.",
        knop: "Open de blokkenbibliotheek",
        href: "playground",
      }}
    >
      <section data-cms="Header (hero)" className="inner-hero night">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            LEDEN / JOUW PLEK
          </span>
          <h1>
            Een plek voor
            <br />
            onze mensen.
          </h1>
          <p style={{ maxWidth: 490, color: "#c0c7d8" }}>
            Een voorbeeld van een afgeschermde plek voor leden met eigen
            content, sessies en verhalen.
          </p>
        </div>
      </section>
      <section data-cms="Ledentoegang" className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          <span className="eyebrow">LEDENTOEGANG</span>
          <h2 style={{ fontSize: 68, margin: "18px 0" }}>Welkom terug.</h2>
          <p style={{ marginBottom: 24 }}>
            Log in om te zien hoe een ledenomgeving vorm kan krijgen.
          </p>
          <DemoFormulier
            className="form-grid"
            demoTekst="Dit is een voorbeeld van een ledenomgeving. Er is geen echte inlogsessie aangemaakt."
          >
            <div className="form-field full">
              <label htmlFor="member-email">E-mailadres</label>
              <input
                id="member-email"
                type="email"
                placeholder="jij@voorbeeld.nl"
                required
                autoComplete="off"
              />
            </div>
            <div className="form-field full">
              <label htmlFor="member-pass">Wachtwoord</label>
              <input
                id="member-pass"
                type="password"
                placeholder="Voer je wachtwoord in"
                required
                autoComplete="off"
              />
            </div>
            <button className="btn btn-dark" style={{ width: "fit-content" }}>
              Inloggen ↗
            </button>
          </DemoFormulier>
          <p className="demo-note" style={{ marginTop: 22 }}>
            Dit is een visuele demo. Er worden geen wachtwoorden gecontroleerd
            of opgeslagen.
          </p>
        </div>
      </section>
    </Page>
  );
}
