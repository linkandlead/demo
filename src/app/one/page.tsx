import type { Metadata } from "next";
import Link from "next/link";
import { AanvraagFormulier } from "@/components/nova/AanvraagFormulier";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionLabel, SectionTitle } from "@/components/nova/ui";

export const metadata: Metadata = {
  title: "Het CMS — Link & Lead One",
  description:
    "Je zag de website. Ontdek wat erachter zit: de blokken, collecties en mogelijkheden van Link & Lead One.",
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
            LINK & LEAD ONE / HET CMS ACHTER DE ERVARING
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
            overzichtelijk contentbeheer. Ontdek de blokken, collecties en
            mogelijkheden van Link & Lead One in een interactieve demonstratie.
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
              <strong>01</strong>
              <small>centrale contentervaring</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-cms="Tekst met beeld">
        <div className="container one-split">
          <div>
            <SectionLabel num="01">LIVE DESIGN SHOWCASE</SectionLabel>
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
              Van een krachtige hero tot dynamische artikelen, van testimonials
              tot een configurator: laat zien hoe een echte website is opgebouwd
              uit beheersbare onderdelen.
            </p>
            <div style={{ marginTop: 26 }}>
              <Btn to="" cl="btn-dark">
                Bekijk NOVA live
              </Btn>
            </div>
          </div>
          <div className="one-shot">
            <Photo
              src="hero_arch"
              alt="NOVA visualisatie: architecturaal lichtobject"
            />
          </div>
        </div>
      </section>

      <section className="section section-soft" data-cms="Kaartenrij">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="WAT JE KUNT LATEN ZIEN"
            title="Ontworpen om te ontdekken."
            desc="Alle onderstaande onderdelen komen voor in de bijgevoegde CMS-specificatie. Hun volledige integratie moet binnen de bestaande codebase worden bevestigd."
          />
          <div className="one-benefits">
            <div className="one-benefit">
              <span className="one-index">01 / REDACTIE</span>
              <h3>Van tekst tot beeld.</h3>
              <p>
                Beheer paginaonderdelen met vaste velden, media en verschillende
                lay-outs. Content staat centraal.
              </p>
            </div>
            <div className="one-benefit">
              <span className="one-index">02 / CONTENT</span>
              <h3>Collecties die meebewegen.</h3>
              <p>
                Toon cases, artikelen, teamleden en reviews waar ze relevant
                zijn, vanuit aparte verzamelingen.
              </p>
            </div>
            <div className="one-benefit">
              <span className="one-index">03 / CONVERSIE</span>
              <h3>Meer dan een brochure.</h3>
              <p>
                Gebruik formulieren, enquêtes, prijskaarten en configurators om
                bezoekers actief te betrekken.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section one-dark" data-cms="Statement">
        <div className="container">
          <SectionLabel num="03">THE REAL POWER</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(55px,8vw,126px)",
              lineHeight: 0.98,
              maxWidth: 1020,
              margin: "24px 0",
            }}
          >
            Eén systeem.
            <br />
            <span style={{ color: "var(--lime)" }}>
              Jouw eigen uitstraling.
            </span>
          </h2>
          <p style={{ maxWidth: 650 }}>
            Een eigen frontend geeft ontwerpvrijheid. Het CMS zorgt dat
            redacteuren inhoud, blokken en collecties kunnen beheren. NOVA is
            het visuele bewijs van die combinatie.
          </p>
          <div className="one-chip-row">
            {[
              "Eigen huisstijl per site",
              "Blokken & varianten",
              "Dynamische collecties",
              "Formulieren & interactie",
              "Responsive weergave",
            ].map((c) => (
              <span className="one-chip" key={c}>
                {c}
              </span>
            ))}
          </div>
          <Btn to="playground">Ontdek de Playground</Btn>
        </div>
      </section>

      <section className="section" data-cms="Reeks stappen">
        <div className="container">
          <SectionTitle
            num="04"
            eyebrow="IN VIJF MINUTEN"
            title="Zie het verschil."
            desc="Niet alleen over functies praten. Laat de bezoeker zelf ervaren wat er in het CMS kan."
          />
          <div className="steps">
            {[
              "Bekijk de indrukwekkende NOVA-homepage",
              "Markeer het onderliggende CMS-blok",
              "Open de bijbehorende editor (na koppeling)",
              "Ontdek collecties, formulieren en varianten",
              "Bekijk dezelfde website op mobiel",
            ].map((s, i) => (
              <div className="step" key={s}>
                <span>0{i + 1}</span> {s} <b aria-hidden="true">↗</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft" data-cms="Flexibel blok">
        <div className="container">
          <SectionTitle
            num="05"
            eyebrow="VOOR WIE"
            title="Voor wie het niet standaard mag zijn."
          />
          <div className="one-benefits">
            <div className="one-benefit">
              <span className="one-index">TEAMS</span>
              <h3>Marketingteams</h3>
              <p>
                Maak aantrekkelijke pagina&apos;s met consistente bouwstenen en
                beheersbare content.
              </p>
            </div>
            <div className="one-benefit">
              <span className="one-index">BUREAUS</span>
              <h3>Creatieve bureaus</h3>
              <p>
                Ontwerp bijzondere frontends, terwijl de klant de inhoud
                overzichtelijk kan beheren.
              </p>
            </div>
            <div className="one-benefit">
              <span className="one-index">ORGANISATIES</span>
              <h3>Meerdere merken</h3>
              <p>
                Gebruik per site een eigen huisstijl. Bevestig multi-sitebeheer
                en rechten binnen de echte CMS-omgeving.
              </p>
            </div>
          </div>
          <div className="one-promo-ribbon">
            <div>
              <strong>
                Probeer niet te verbeelden wat er mogelijk is. Bekijk het.
              </strong>
              <p>
                Start de interactieve demonstratie of open direct de
                blokkenbibliotheek.
              </p>
            </div>
            <Link href="/demo" className="btn btn-dark">
              Open de demo <span className="arrow">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="one-end" data-cms="Afsluitende oproep / product">
        <div className="container">
          <span className="eyebrow">THE WEBSITE IS THE PROOF</span>
          <h2>Great websites deserve a better way to work.</h2>
          <div className="one-cta-row">
            <Link className="btn btn-dark" href="/demo">
              Ontdek Link & Lead One <span className="arrow">↗</span>
            </Link>
            <Link
              className="btn btn-outline"
              style={{ color: "var(--night)" }}
              href="/playground"
            >
              Bekijk alle mogelijkheden <span className="arrow">↗</span>
            </Link>
          </div>
          <p className="one-honest">
            Dit is een visueel prototype. Voor een live saleswebsite moet de
            echte CMS-koppeling en aanvraagroute nog worden ingesteld.
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
            <SectionLabel num="06">VOLGENDE STAP / KENNISMAKING</SectionLabel>
            <h2 style={{ marginTop: 18 }}>Zie wat het voor jouw site doet.</h2>
            <p className="side-note">
              Vertel kort wat je zoekt. We laten je in een demo zien wat je
              redacteuren in Link & Lead One zelf beheren:
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
