import type { Metadata } from "next";
import Link from "next/link";
import { AanvraagFormulier } from "@/components/nova/AanvraagFormulier";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionLabel, SectionTitle } from "@/components/nova/ui";
import { altTeksten, faq } from "@/content/teksten";

export const metadata: Metadata = {
  title: { absolute: "Link & Lead One — ontdek het CMS achter NOVA" },
  description:
    "Ontdek Link & Lead One: 43 algemene CMS-blokken, vijf achtergrondvarianten, sitegebonden huisstijl en contentcollecties. Bekijk de demo.",
};

// Wat redacteurs beheren — alleen onderdelen die in de linkandlead-cms-repo zijn aangetroffen
// (blokregistry, collecties in de lees-API, merk/navigatie/redirects, leads uit formulieren).
const BEHEER = [
  "Pagina's samenstellen uit blokken, in vijf achtergronden",
  "Cases, artikelen, teamleden en reviews als aparte collecties",
  "Huisstijl per site: twaalf kleurvelden en twee lettertypes",
  "Merk, navigatie en redirects zonder nieuwe deploy",
  "Formulieren waarvan aanvragen in het CMS binnenkomen",
];

const STAPPEN: Array<[string, string]> = [
  ["Ontwerp", "Maak een visuele website die precies bij het merk past."],
  ["Structuur", "Koppel secties aan bestaande CMS-blokken en collecties."],
  [
    "Beheer",
    "Vul teksten, media en contentitems in via de daarvoor bedoelde velden.",
  ],
  [
    "Publiceer",
    "Controleer desktop en mobiel en publiceer via de geconfigureerde omgeving.",
  ],
];

export default function One() {
  const extern = process.env.DEMO_AANVRAAG_URL?.trim();
  return (
    <Page>
      <section
        className="one-hero"
        data-cms="Productpromotie / eigen frontendmodule (geen CMS-kernblok)"
      >
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            LINK & LEAD ONE / HET CMS ACHTER NOVA
          </span>
          <h1>
            Je zag de website.
            <br />
            <span style={{ color: "var(--lime)" }}>
              Ontdek wat erachter zit.
            </span>
          </h1>
          <p className="one-intro">
            NOVA laat zien hoeveel ontwerpvrijheid je kunt combineren met
            overzichtelijk contentbeheer. Link & Lead One brengt pagina’s,
            contentblokken en collecties samen, met ruimte voor een volledig
            eigen uitstraling.
          </p>
          <div className="one-cta-row">
            <Link className="btn btn-lime" href="/demo">
              Start de rondleiding <span className="arrow">↗</span>
            </Link>
            <Link className="btn btn-outline" href="/playground">
              Bekijk de 43 blokken <span className="arrow">↗</span>
            </Link>
          </div>
          <div className="one-proof">
            <div>
              <strong>43</strong>
              <small>algemene contentblokken</small>
            </div>
            <div>
              <strong>05</strong>
              <small>achtergrondvarianten</small>
            </div>
            <div>
              <strong>12</strong>
              <small>instelbare huisstijlkleuren</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-cms="Tekst met beeld">
        <div className="container one-split">
          <div>
            <SectionLabel num="01">WAAROM HET WERKT</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(50px,6.5vw,90px)",
                lineHeight: 0.96,
                margin: "20px 0 25px",
              }}
            >
              Mooi van buiten. Slim ingericht.
            </h2>
            <p>
              Een krachtige website hoeft geen ingewikkeld beheer te hebben. Van
              de eerste indruk tot de laatste oproep: ieder onderdeel heeft een
              functie. In Link & Lead One krijgt een redacteur grip op de
              inhoud, terwijl de voorkant ruimte houdt voor een eigen design.
            </p>
            <div style={{ marginTop: 26 }}>
              <Btn to="demo" cl="btn-dark">
                Bekijk hoe NOVA is opgebouwd
              </Btn>
            </div>
          </div>
          <div className="one-shot">
            <Photo src="hero_arch" alt={altTeksten.hero_arch} />
          </div>
        </div>
      </section>

      <section className="section section-soft" data-cms="Kaartenrij">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="DRIE REDENEN"
            title="Het design is van jou. De inhoud houd je zelf bij."
            desc="Drie sterke bouwstenen voor een website die blijft groeien."
          />
          <div className="one-benefits">
            <div className="one-benefit">
              <span className="one-index">01 / ONTWERPVRIJHEID</span>
              <h3>Jouw merk, jouw design.</h3>
              <p>
                Een eigen frontend laat het design aansluiten op je merk. Geen
                verplichte standaarduitstraling.
              </p>
            </div>
            <div className="one-benefit">
              <span className="one-index">02 / OVERZICHTELIJKE CONTENT</span>
              <h3>Alles op een vaste plek.</h3>
              <p>
                Beheer paginaonderdelen, afbeeldingen en collecties op vaste
                plekken in het CMS.
              </p>
            </div>
            <div className="one-benefit">
              <span className="one-index">03 / MEER INTERACTIE</span>
              <h3>Meer dan een brochure.</h3>
              <p>
                Gebruik de aanwezige blokken voor formulieren, configurators,
                testimonials en meer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section one-dark" data-cms="Statement">
        <div className="container">
          <SectionLabel num="03">ÉÉN SYSTEEM</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(55px,8vw,126px)",
              lineHeight: 0.98,
              maxWidth: 1020,
              margin: "24px 0",
            }}
          >
            Eén CMS.
            <br />
            <span style={{ color: "var(--lime)" }}>
              Heel veel mogelijk&shy;heden.
            </span>
          </h2>
          <p style={{ maxWidth: 650 }}>
            43 algemene blokken. Vijf achtergrondvarianten. Twaalf instelbare
            huisstijlkleuren. Dat zijn geen willekeurige aantallen: ze komen uit
            de huidige CMS-ontwerpspecificatie. De werkelijke beschikbaarheid in
            een installatie controleren we tijdens de technische demo.
          </p>
          <div className="one-chip-row">
            {[
              "Eigen huisstijl per site",
              "Blokken & varianten",
              "Dynamische collecties",
              "Formulieren & interactie",
              "Responsieve weergave",
            ].map((c) => (
              <span className="one-chip" key={c}>
                {c}
              </span>
            ))}
          </div>
          <Btn to="playground">Ontdek de blokken</Btn>
        </div>
      </section>

      <section className="section" data-cms="Tekst met beeld · beeld links">
        <div className="container one-split">
          <div className="one-shot">
            <Photo src="work_color" alt={altTeksten.work_color} />
          </div>
          <div>
            <SectionLabel num="04">JOUW MERK</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(50px,6.5vw,90px)",
                lineHeight: 0.96,
                margin: "20px 0 25px",
              }}
            >
              Eén systeem. Jouw eigen uitstraling.
            </h2>
            <p>
              Een herkenbaar merk bouw je niet met een verzameling identieke
              templates. NOVA heeft haar eigen beeldtaal, ritme en sfeer. Via de
              site-instellingen leg je kleuren en typografie per website vast.
              Met een eigen frontend bepaal je bovendien de vormgeving van de
              blokken.
            </p>
            <div style={{ marginTop: 26 }}>
              <Btn to="" cl="btn-dark">
                Bekijk het design van NOVA
              </Btn>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft" data-cms="Reeks stappen">
        <div className="container">
          <SectionTitle
            num="05"
            eyebrow="ZO WERKT HET"
            title="Van mooi ontwerp naar beheerbare website."
            desc="Een helder proces verbindt ontwerp, bouw en redactie."
          />
          <div className="timeline">
            {STAPPEN.map(([titel, tekst], i) => (
              <div className="timeline-item" key={titel}>
                <strong>0{i + 1}</strong>
                <h3>{titel}</h3>
                <p>{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-cms="Flexibel blok">
        <div className="container">
          <SectionTitle
            num="06"
            eyebrow="VOOR WIE"
            title="Gemaakt voor mensen die iets willen maken."
            desc="Of je nu een nieuwe website bouwt of dagelijks content publiceert: een duidelijke inhoudsstructuur helpt."
          />
          <div className="one-benefits">
            <div className="one-benefit">
              <span className="one-index">TEAMS</span>
              <h3>Voor marketingteams</h3>
              <p>
                Werk aan nieuwe pagina’s, campagnes en updates zonder telkens de
                hele website opnieuw te ontwerpen.
              </p>
            </div>
            <div className="one-benefit">
              <span className="one-index">BUREAUS</span>
              <h3>Voor creatieve bureaus</h3>
              <p>
                Houd de vrijheid van een eigen frontend en geef opdrachtgevers
                een begrijpelijke manier om content te beheren.
              </p>
            </div>
            <div className="one-benefit">
              <span className="one-index">ORGANISATIES</span>
              <h3>Voor organisaties</h3>
              <p>
                Breng cases, mensen, artikelen en andere content overzichtelijk
                samen. Gebruik per site de passende huisstijl.
              </p>
            </div>
          </div>
          <div className="one-promo-ribbon">
            <div>
              <strong>
                Probeer niet te verbeelden wat er mogelijk is. Bekijk het.
              </strong>
              <p>
                Start de interactieve rondleiding of open direct de
                blokkenbibliotheek.
              </p>
            </div>
            <Link href="/demo" className="btn btn-dark">
              Open de demo <span className="arrow">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft" data-cms="Veelgestelde vragen">
        <div className="container">
          <SectionTitle
            num="07"
            eyebrow="GOED OM TE WETEN"
            title="Veelgestelde vragen over Link & Lead One."
            desc="Van blokken en collecties tot integratie met je eigen ontwerp."
          />
          <div className="faq-lijst">
            {faq.map(([vraag, antwoord]) => (
              <details key={vraag}>
                <summary>{vraag}</summary>
                <p>{antwoord}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="one-end" data-cms="Afsluitende oproep / product">
        <div className="container">
          <span className="eyebrow">08 / ERVAAR HET ZELF</span>
          <h2>Laat de website overtuigen. Ontdek zelf hoe het CMS werkt.</h2>
          <p style={{ maxWidth: 620, marginTop: 20 }}>
            Begin met de interactieve rondleiding, bekijk de blokkenbibliotheek
            of vraag een persoonlijke demonstratie aan.
          </p>
          <div className="one-cta-row">
            <Link className="btn btn-dark" href="#aanvraag">
              Vraag een persoonlijke demo aan <span className="arrow">↗</span>
            </Link>
            <Link
              className="btn btn-outline"
              style={{ color: "var(--night)" }}
              href="/demo"
            >
              Start de rondleiding <span className="arrow">↗</span>
            </Link>
          </div>
          <p className="one-honest">
            Dit is een demonstratie. Voor een live saleswebsite moeten de echte
            CMS-koppeling en aanvraagroute nog worden ingesteld.
          </p>
        </div>
      </section>

      <section
        className="section section-soft one-aanvraag"
        id="aanvraag"
        data-cms="Formulier · aanvraag (Link & Lead One)"
      >
        <div className="container contact-layout">
          <div>
            <SectionLabel num="09">DEMO AANVRAGEN</SectionLabel>
            <h2 style={{ marginTop: 18 }}>
              Ontdek wat Link & Lead One voor jouw website kan betekenen.
            </h2>
            <p className="side-note">
              Vertel ons wat voor website je wilt maken. Dan kijken we samen
              welke onderdelen relevant zijn. Dit beheren je redacteuren zelf:
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginTop: 24,
                display: "grid",
                gap: 8,
              }}
            >
              {BEHEER.map((b) => (
                <li
                  className="info-tile"
                  key={b}
                  style={{ minHeight: 0, padding: "14px 18px", fontSize: 14 }}
                >
                  {b}
                </li>
              ))}
            </ul>
            {extern ? (
              <div style={{ marginTop: 24 }}>
                <a className="btn btn-outline" href={extern} rel="noopener">
                  Plan direct een afspraak <span className="arrow">↗</span>
                </a>
              </div>
            ) : null}
          </div>
          <div>
            <AanvraagFormulier />
          </div>
        </div>
      </section>
    </Page>
  );
}
