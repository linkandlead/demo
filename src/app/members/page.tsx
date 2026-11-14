import type { Metadata } from "next";
import { DemoFormulier } from "@/components/nova/DemoFormulier";
import { Page } from "@/components/nova/Page";

export const metadata: Metadata = { title: "Members" };

export default function Members() {
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero night">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            MEMBERS / YOUR SPACE
          </span>
          <h1>
            A place for
            <br />
            our people.
          </h1>
          <p style={{ maxWidth: 490, color: "#c0c7d8" }}>
            Een besloten omgeving waar leden exclusieve ideeën, sessies en
            projecten ontdekken.
          </p>
        </div>
      </section>
      <section data-cms="Ledentoegang" className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          <span className="eyebrow">MEMBER ACCESS</span>
          <h2 style={{ fontSize: 68, margin: "18px 0" }}>Welcome back.</h2>
          <DemoFormulier
            className="form-grid"
            demoTekst="Dit is een voorbeeldscherm. Er is geen echte login en er wordt niets opgeslagen."
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
                placeholder="••••••••"
                required
                autoComplete="off"
              />
            </div>
            <button className="btn btn-dark" style={{ width: "fit-content" }}>
              Inloggen ↗
            </button>
          </DemoFormulier>
          <p className="demo-note" style={{ marginTop: 22 }}>
            Visueel loginconcept, geen echte autorisatie of opslag.
          </p>
        </div>
      </section>
    </Page>
  );
}
