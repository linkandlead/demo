import Link from "next/link";
import { Page } from "@/components/nova/Page";
import {
  Btn,
  EmptyState,
  Lines,
  PersonCard,
  PicCard,
  Photo,
  SectionLabel,
  SectionTitle,
  StoryCard,
  t,
} from "@/components/nova/ui";
import { altTeksten } from "@/content/teksten";
import { getCases, getPeople, getPosts, pagina } from "@/lib/cms/data";

export const metadata = {
  title: { absolute: "NOVA — Ideeën verdienen werkelijkheid" },
  description:
    "Ontdek NOVA: een fictieve creatieve wereld vol projecten, verhalen, evenementen en bijzondere ruimtes. De visuele showcase van Link & Lead One.",
};

// Homepage — 1-op-1 home() uit het prototype. Elke sectie is een CMS-kernblok (data-cms).
export default async function Home() {
  const [blok, { items: cases }, { items: people }, { items: posts }] =
    await Promise.all([pagina("/"), getCases(), getPeople(), getPosts()]);
  const hero = blok("header");
  const intro = blok("mediatekst");
  const statement = blok("statement");
  // Prototype toont case 2, 1 en 4 (Lumen groot, Aurora, Pulse).
  const uitgelicht =
    cases.length >= 4 ? [cases[1], cases[0], cases[3]] : cases.slice(0, 3);

  return (
    <Page
      oproep={{
        eyebrow: "07 / DE VOLGENDE STAP",
        kop: "Je volgende idee begint hier.",
        tekst:
          "En achter deze website? Daar zit Link & Lead One. Bekijk de interactieve rondleiding of ontdek alle CMS-blokken.",
        knop: "Ontdek het CMS",
        href: "one",
      }}
    >
      <section data-cms="Header (hero) · Diepst" className="hero-home">
        <div className="hero-visual">
          <Photo src="hero_arch" alt={altTeksten.hero_arch} priority />
        </div>
        <div className="container hero-copy">
          <div className="eyebrow" style={{ color: "var(--lime)" }}>
            {t(hero, "eyebrow", "WELKOM IN CREATIEVE TOEKOMSTEN")}
          </div>
          <h1>
            {typeof hero.heading === "string" && hero.heading ? (
              // Afsluitende punt in accentkleur, zoals in het ontwerp.
              hero.heading.endsWith(".") ? (
                <>
                  <Lines text={hero.heading.slice(0, -1)} />
                  <span style={{ color: "var(--lime)" }}>.</span>
                </>
              ) : (
                <Lines text={hero.heading} />
              )
            ) : (
              <>
                Ideeën
                <br />
                verdienen
                <br />
                werkelijkheid<span style={{ color: "var(--lime)" }}>.</span>
              </>
            )}
          </h1>
          <p>
            {t(
              hero,
              "subheading",
              "Een plek voor nieuwe ideeën, inspirerende mensen en bijzondere ervaringen. Ontdek wat er mogelijk wordt als verschillende werelden elkaar ontmoeten.",
            )}
          </p>
          <div className="hero-actions">
            <Btn to={t(hero, "cta_primair_link", "work")}>
              {t(hero, "cta_primair_label", "Ontdek NOVA")}
            </Btn>
            <Link href="/one" className="btn btn-outline">
              ◉ &nbsp; Ontdek het CMS
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="container">
            <div className="hero-stats">
              <div>
                <b>18</b>
                <small>Paginatypes</small>
              </div>
              <div>
                <b>43</b>
                <small>CMS-blokken</small>
              </div>
              <div>
                <b>05</b>
                <small>Kleurenschema&apos;s</small>
              </div>
            </div>
            <span className="scroll">SCROL OM TE ONTDEKKEN &nbsp; ↓</span>
          </div>
        </div>
      </section>

      <div data-cms="Bewegende tekstband" className="marquee">
        <div className="container">
          <span>
            CREËREN &nbsp; / &nbsp; VERBINDEN &nbsp; / &nbsp; ONTDEKKEN &nbsp; /
            &nbsp; BOUWEN &nbsp; / &nbsp;
          </span>
        </div>
      </div>

      <section data-cms="Tekst met beeld · Licht" className="section">
        <div className="container intro-grid">
          <div>
            <SectionLabel num="01">
              {t(intro, "eyebrow", "ONZE WERELD")}
            </SectionLabel>
            <h2>{t(intro, "titel", "Waar ideeën hun mensen vinden.")}</h2>
            <p>
              NOVA brengt een nieuwe manier van denken tot leven. We laten zien
              hoe creativiteit, architectuur, technologie en cultuur samen
              verhalen kunnen vertellen. Van een intiem gesprek tot een grootse
              ervaring: het begint met nieuwsgierigheid.
            </p>
            <Btn to={t(intro, "knop", "about")} cl="btn-dark">
              {t(intro, "knoptekst", "Ontdek ons verhaal")}
            </Btn>
          </div>
          <div className="image-frame intro-image">
            <Photo src="work_color" alt={altTeksten.work_color} />
            <span className="image-tag">CREATIVITEIT IN BEWEGING</span>
          </div>
        </div>
      </section>

      <section data-cms="Cases · collectie" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="GESELECTEERD WERK"
            title="Gemaakt om je iets te laten voelen."
            desc="Ontdek zes voorbeeldprojecten waarin beeld, verhaal en ruimte samenkomen. Elk project heeft een eigen identiteit, precies zoals iedere website een eigen uitstraling verdient."
          />
          {uitgelicht.length ? (
            <div className="portfolio-grid">
              {uitgelicht.map((c, i) => (
                <PicCard key={c.slug} item={c} large={i === 0} />
              ))}
            </div>
          ) : (
            <EmptyState>Er zijn nog geen projecten toegevoegd.</EmptyState>
          )}
          <div style={{ marginTop: 33 }}>
            <Btn to="work" cl="btn-dark">
              Bekijk alle projecten
            </Btn>
          </div>
        </div>
      </section>

      <section
        data-cms="Statement · Donker"
        className="section section-dark statement"
      >
        <div className="ring" />
        <div className="container">
          <SectionLabel num="03">
            {t(statement, "eyebrow", "WAAR WE IN GELOVEN")}
          </SectionLabel>
          <h2>
            {typeof statement.titel === "string" && statement.titel ? (
              statement.titel
            ) : (
              <>
                Op morgen wachten we niet. <em>Morgen maken we zelf.</em>
              </>
            )}
          </h2>
          <Btn to={t(statement, "knop", "about")}>
            {t(statement, "knoptekst", "Maak kennis met NOVA")}
          </Btn>
        </div>
      </section>

      <section data-cms="Statistieken · Zacht" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="04"
            eyebrow="IN DEZE DEMO"
            title="Een wereld vol mogelijkheden."
            desc="Geen verzonnen impactcijfers, maar aantallen die je in de demo zelf kunt bekijken."
          />
          <div className="stats-grid stats-4">
            <div className="stat">
              <strong>43</strong>
              <p>Algemene CMS-blokken</p>
            </div>
            <div className="stat">
              <strong>5</strong>
              <p>Achtergrondvarianten</p>
            </div>
            <div className="stat">
              <strong>6</strong>
              <p>Fictieve projectcases</p>
            </div>
            <div className="stat">
              <strong>3</strong>
              <p>Voorbeeldruimtes</p>
            </div>
          </div>
        </div>
      </section>

      <section data-cms="Team · collectie" className="section">
        <div className="container">
          <SectionTitle
            num="05"
            eyebrow="DE MENSEN"
            title="Verschillende denkers. Gedeelde energie."
            desc="Vier fictieve makers, vier perspectieven. Hun profielen laten zien hoe je een teamcollectie in het CMS beheert."
          />
          {people.length ? (
            <div className="people-grid">
              {people.slice(0, 4).map((p) => (
                <PersonCard key={p.name} p={p} />
              ))}
            </div>
          ) : (
            <EmptyState>Er zijn nog geen teamleden beschikbaar.</EmptyState>
          )}
          <div style={{ marginTop: 32 }}>
            <Btn to="community" cl="btn-dark">
              Ontmoet de makers
            </Btn>
          </div>
        </div>
      </section>

      <section
        data-cms="Artikelen · collectie"
        className="section section-soft"
      >
        <div className="container">
          <SectionTitle
            num="06"
            eyebrow="VERHALEN"
            title="Goede ideeën verdienen een goed verhaal."
            desc="Verhalen over ontwerp, beleving, technologie en samenkomen. Ontdek hoe een redactionele collectie van overzicht tot detailpagina werkt."
          />
          {posts.length ? (
            <div className="article-grid">
              {posts.slice(0, 3).map((p) => (
                <StoryCard key={p.slug} post={p} />
              ))}
            </div>
          ) : (
            <EmptyState>Er zijn nog geen artikelen gepubliceerd.</EmptyState>
          )}
          <div style={{ marginTop: 34 }}>
            <Btn to="journal" cl="btn-dark">
              Lees de verhalen
            </Btn>
          </div>
        </div>
      </section>
    </Page>
  );
}
