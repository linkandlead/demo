import type { Metadata } from "next";
import { DemoFormulier } from "@/components/nova/DemoFormulier";
import { Page } from "@/components/nova/Page";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">CONTACT / GET IN TOUCH</span>
          <h1>
            Let&apos;s make
            <br />
            something happen.
          </h1>
          <div className="hero-description">
            <span className="meta">SAY HELLO</span>
            <p>
              Een vraag, een idee of gewoon nieuwsgierig? Laat van je horen.
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
            <span className="eyebrow">TELL US ABOUT YOUR IDEA</span>
            <h2>What&apos;s on your mind?</h2>
            <p className="side-note">
              We zijn benieuwd naar je plannen. Dit formulier is een visueel
              ontwerp en verzendt nog geen berichten.
            </p>
            <div style={{ marginTop: 70 }}>
              <span className="eyebrow">FICTIONAL HEADQUARTERS</span>
              <p style={{ fontSize: 18, marginTop: 12 }}>
                NOVA Creative Campus
                <br />
                Demolocatie · geen bezoekadres
              </p>
            </div>
          </div>
          <div>
            <DemoFormulier
              className="form-grid"
              opslaan="contact"
              demoTekst="Demonstratie: er is niets verstuurd of opgeslagen. In een live site koppelt dit formulier aan het CMS-blok Formulier (soort: contact)."
            >
              <div className="form-field">
                <label htmlFor="first-name">Voornaam *</label>
                <input
                  id="first-name"
                  name="naam"
                  required
                  placeholder="Je voornaam"
                  autoComplete="given-name"
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">E-mailadres *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jij@voorbeeld.nl"
                  autoComplete="email"
                />
              </div>
              <div className="form-field full">
                <label htmlFor="interest">Waar gaat je idee over?</label>
                <select id="interest" name="onderwerp">
                  <option>Een creatief project</option>
                  <option>Een evenement</option>
                  <option>Een ruimte huren</option>
                  <option>Een samenwerking</option>
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="message">Vertel ons meer *</label>
                <textarea
                  id="message"
                  name="vraag"
                  placeholder="Wat kunnen we samen maken?"
                  required
                />
              </div>
              <div className="form-field full">
                <button
                  className="btn btn-dark"
                  style={{ width: "fit-content" }}
                >
                  Verstuur je bericht ↗
                </button>
              </div>
            </DemoFormulier>
            <p className="demo-note" style={{ marginTop: 25 }}>
              Deze formulierstaten zijn uitsluitend voor visuele beoordeling. In
              de werkende website worden ze gekoppeld aan de bestaande
              CMS-formuliermodule.
            </p>
          </div>
        </div>
      </section>
    </Page>
  );
}
