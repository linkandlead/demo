import type { Metadata } from "next";
import { DemoFormulier } from "@/components/nova/DemoFormulier";
import { Page } from "@/components/nova/Page";

export const metadata: Metadata = {
  title: "Contact — NOVA / Link & Lead One",
  description:
    "Neem contact op over NOVA of vraag een demonstratie aan van Link & Lead One.",
};

const ONDERWERPEN = [
  "Een project",
  "Een evenement",
  "Een ruimte",
  "Een samenwerking",
  "Demonstratie van Link & Lead One",
  "Iets anders",
];

export default async function Contact({ searchParams }: PageProps<"/contact">) {
  const demo = (await searchParams).onderwerp === "demo";
  return (
    <Page
      oproep={{
        eyebrow: "03 / ONTDEK MEER",
        kop: "Zie wat er kan, voordat we praten.",
        tekst: "Ontdek eerst hoe de website is opgebouwd.",
        knop: "Start de rondleiding",
        href: "demo",
      }}
    >
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">CONTACT / NEEM CONTACT OP</span>
          <h1>
            Laten we
            <br />
            iets laten gebeuren.
          </h1>
          <div className="hero-description">
            <span className="meta">ZEG HALLO</span>
            <p>
              Heb je een idee, een vraag of wil je ontdekken wat Link & Lead One
              voor jouw website kan betekenen? Vertel het ons.
            </p>
          </div>
        </div>
      </section>
      <section
        data-cms="Formulier / Kaart en locatie"
        className="section"
        style={{ paddingTop: 25 }}
      >
        <div className="container contact-layout">
          <div>
            <span className="eyebrow">01 / START EEN GESPREK</span>
            <h2>Wat houdt je bezig?</h2>
            <p className="side-note">
              Een goed gesprek begint met een nieuwsgierige vraag. Vertel in een
              paar zinnen wat je zoekt.
            </p>
            <div style={{ marginTop: 70 }}>
              <span className="eyebrow">02 / WAAR WE ZIJN</span>
              <h3 style={{ fontSize: 30, margin: "12px 0" }}>
                Een digitale wereld. Geen fysiek adres.
              </h3>
              <p style={{ maxWidth: 380, color: "#596476" }}>
                NOVA bestaat alleen als demonstratieconcept. Er is geen
                NOVA-kantoor of publiek bezoekadres.
              </p>
            </div>
          </div>
          <div>
            <DemoFormulier
              className="form-grid"
              opslaan="contact"
              demoTekst="Dit is de bevestigingsweergave. Je bericht is niet verzonden omdat dit formulier nog in demonstratiemodus staat."
            >
              <div className="form-field">
                <label htmlFor="first-name">Voornaam *</label>
                <input
                  id="first-name"
                  name="naam"
                  required
                  placeholder="Bijvoorbeeld Sam"
                  autoComplete="given-name"
                />
              </div>
              <div className="form-field">
                <label htmlFor="last-name">Achternaam</label>
                <input
                  id="last-name"
                  name="achternaam"
                  placeholder="Bijvoorbeeld De Vries"
                  autoComplete="family-name"
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Zakelijk e-mailadres *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="naam@organisatie.nl"
                  autoComplete="email"
                />
              </div>
              <div className="form-field">
                <label htmlFor="organisatie">Organisatie</label>
                <input
                  id="organisatie"
                  name="bedrijf"
                  placeholder="Naam van je organisatie"
                  autoComplete="organization"
                />
              </div>
              <div className="form-field full">
                <label htmlFor="interest">Waar gaat je vraag over? *</label>
                <select
                  id="interest"
                  name="onderwerp"
                  required
                  defaultValue={demo ? "Demonstratie van Link & Lead One" : ""}
                >
                  <option value="" disabled>
                    Kies een onderwerp
                  </option>
                  {ONDERWERPEN.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="message">Vertel ons meer *</label>
                <textarea
                  id="message"
                  name="vraag"
                  placeholder="Wat wil je maken of weten?"
                  required
                  minLength={10}
                />
              </div>
              <div className="form-field full">
                <label className="form-check" htmlFor="contact-akkoord">
                  <input
                    id="contact-akkoord"
                    name="akkoord"
                    type="checkbox"
                    required
                  />
                  Ik begrijp dat mijn gegevens alleen worden gebruikt om op mijn
                  vraag te reageren.
                </label>
              </div>
              <div className="form-field full">
                <button
                  className="btn btn-dark"
                  style={{ width: "fit-content" }}
                >
                  Verstuur mijn bericht ↗
                </button>
              </div>
            </DemoFormulier>
            <p className="demo-note" style={{ marginTop: 25 }}>
              Je bericht wordt opgeslagen in de NOVA-demodatabase. Er wordt geen
              e-mail verstuurd. Voor vragen over het echte CMS gebruik je het
              aanvraagformulier op de pagina Het CMS.
            </p>
          </div>
        </div>
      </section>
    </Page>
  );
}
