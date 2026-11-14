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
import { getCases, getPeople, getPosts, pagina } from "@/lib/cms/data";

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
    <Page>
      <section data-cms="Header (hero) · Diepst" className="hero-home">
        <div className="hero-visual">
          <Photo
            src="hero_arch"
            alt="Sculpturale blauwe architectuur met warm oranje licht"
            priority
          />
        </div>
        <div className="container hero-copy">
          <div className="eyebrow" style={{ color: "var(--lime)" }}>
            {t(hero, "eyebrow", "WELCOME TO CREATIVE FUTURES")}
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
                Ideas deserve
                <br />
                to become
                <br />
                reality<span style={{ color: "var(--lime)" }}>.</span>
              </>
            )}
          </h1>
          <p>
            {t(
              hero,
              "subheading",
              "Een plek voor nieuwe ideeën, inspirerende mensen en bijzondere ervaringen.",
            )}
          </p>
          <div className="hero-actions">
            <Btn to={t(hero, "cta_primair_link", "work")}>
              {t(hero, "cta_primair_label", "Explore NOVA")}
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
            <span className="scroll">SCROLL TO EXPLORE &nbsp; ↓</span>
          </div>
        </div>
      </section>

      <div data-cms="Bewegende tekstband" className="marquee">
        <div className="container">
          <span>
            CREATE &nbsp; / &nbsp; CONNECT &nbsp; / &nbsp; EXPLORE &nbsp; /
            &nbsp; BUILD &nbsp; / &nbsp;
          </span>
        </div>
      </div>

      <section data-cms="Tekst met beeld · Licht" className="section">
        <div className="container intro-grid">
          <div>
            <SectionLabel num="01">
              {t(intro, "eyebrow", "OUR WORLD")}
            </SectionLabel>
            <h2>{t(intro, "titel", "Where ideas find their people.")}</h2>
            <p>
              Wij geloven in de kracht van ontmoetingen. In ruimtes die
              uitdagen, verhalen die blijven hangen en ideeën die de wereld
              verder brengen.
            </p>
            <Btn to={t(intro, "knop", "about")} cl="btn-dark">
              {t(intro, "knoptekst", "Ontdek ons verhaal")}
            </Btn>
          </div>
          <div className="image-frame intro-image">
            <Photo src="work_color" alt="Kleurrijke lichtinstallatie" />
            <span className="image-tag">CREATIVITY IN MOTION</span>
          </div>
        </div>
      </section>

      <section data-cms="Cases · collectie" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="SELECTED WORK"
            title="Made to move people."
            desc="Van architectuur en ervaringen tot digitale ideeën. Werk dat niet alleen mooi is, maar ook iets losmaakt."
          />
          {uitgelicht.length ? (
            <div className="portfolio-grid">
              {uitgelicht.map((c, i) => (
                <PicCard key={c.slug} item={c} large={i === 0} />
              ))}
            </div>
          ) : (
            <EmptyState>Er zijn nog geen cases gepubliceerd.</EmptyState>
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
            {t(statement, "eyebrow", "OUR BELIEF")}
          </SectionLabel>
          <h2>
            {typeof statement.titel === "string" && statement.titel ? (
              statement.titel
            ) : (
              <>
                Tomorrow is not something we wait for.{" "}
                <em>It&apos;s something we make.</em>
              </>
            )}
          </h2>
          <Btn to={t(statement, "knop", "community")}>
            {t(statement, "knoptekst", "Meet our community")}
          </Btn>
        </div>
      </section>

      <section data-cms="Statistieken · Zacht" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="04"
            eyebrow="THE IDEA IN NUMBERS"
            title="A world of possibilities."
            desc="Fictieve voorbeeldcijfers voor de demonstratie van het CMS-statistiekenblok."
          />
          <div className="stats-grid">
            <div className="stat">
              <strong>
                120<span style={{ color: "#8fa616" }}>+</span>
              </strong>
              <p>Ideas brought to life</p>
            </div>
            <div className="stat">
              <strong>38</strong>
              <p>Creative collaborators</p>
            </div>
            <div className="stat">
              <strong>12k</strong>
              <p>Inspired minds</p>
            </div>
          </div>
        </div>
      </section>

      <section data-cms="Team · collectie" className="section">
        <div className="container">
          <SectionTitle
            num="05"
            eyebrow="PEOPLE"
            title="Meet the minds."
            desc="Ideeën worden pas bijzonder door de mensen die ze vormgeven."
          />
          {people.length ? (
            <div className="people-grid">
              {people.slice(0, 4).map((p) => (
                <PersonCard key={p.name} p={p} />
              ))}
            </div>
          ) : (
            <EmptyState>Er zijn nog geen teamleden gepubliceerd.</EmptyState>
          )}
          <div style={{ marginTop: 32 }}>
            <Btn to="community" cl="btn-dark">
              Ontmoet onze community
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
            eyebrow="THE JOURNAL"
            title="Fresh perspectives."
            desc="Verhalen om bij stil te staan. En om daarna weer vooruit te kijken."
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
              Bekijk alle verhalen
            </Btn>
          </div>
        </div>
      </section>
    </Page>
  );
}
