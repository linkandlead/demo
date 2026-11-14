import type { Metadata } from "next";
import Link from "next/link";
import { DemoFormulier } from "@/components/nova/DemoFormulier";
import { Page } from "@/components/nova/Page";
import {
  EmptyState,
  Photo,
  SectionTitle,
  StoryCard,
} from "@/components/nova/ui";
import { getPosts } from "@/lib/cms/data";

export const metadata: Metadata = {
  title: "Verhalen & inzichten",
  description:
    "Lees zes inspirerende voorbeeldartikelen over meeslepende belevingen, ontwerp, technologie en community in de NOVA-verhalen.",
};

export default async function Journal() {
  const { items } = await getPosts();
  const [featured, ...rest] = items;
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">VERHALEN / IDEEËN & INZICHTEN</span>
          <h1>
            Verhalen, ideeën
            <br />
            en inzichten.
          </h1>
          <div className="hero-description">
            <span className="meta">DENKEN / BEVRAGEN / VERBEELDEN</span>
            <p>
              Verhalen over de toekomst van creativiteit. Over mensen die anders
              durven denken, plekken die iets losmaken en technologie die nieuwe
              vragen oproept.
            </p>
          </div>
        </div>
      </section>
      {featured ? (
        <section
          data-cms="Artikelen · uitgelicht"
          className="section"
          style={{ paddingTop: 0 }}
        >
          <div className="container">
            <Link href={`/journal/${featured.slug}`} className="featured-story">
              <div className="photo">
                <Photo src={featured.cover} alt={featured.title} />
              </div>
              <div className="copy">
                <span className="eyebrow">
                  UITGELICHT VERHAAL / {featured.cat}
                </span>
                <div>
                  <h2>{featured.title}.</h2>
                  <p style={{ marginTop: 20 }}>
                    Wat gebeurt er als een verhaal niet alleen te lezen of te
                    bekijken is, maar te beleven?
                  </p>
                </div>
                <span className="meta">LEES HET ARTIKEL &nbsp; ↗</span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}
      <section
        data-cms="Artikelen · collectie"
        className="section section-soft"
      >
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="NIEUWSTE VERHALEN"
            title="Frisse perspectieven. Nieuwe mogelijkheden."
            desc="Zes verhalen om even anders naar de wereld te kijken."
          />
          <div
            className="chip-row"
            style={{ marginBottom: 25 }}
            aria-label="Rubrieken (visueel voorbeeld)"
          >
            <span className="chip active">Alles</span>
            <span className="chip">Ontwerp</span>
            <span className="chip">Cultuur</span>
            <span className="chip">Belevingen</span>
            <span className="chip">Toekomst</span>
          </div>
          {rest.length ? (
            <div className="article-grid">
              {rest.map((p) => (
                <StoryCard key={p.slug} post={p} />
              ))}
            </div>
          ) : (
            <EmptyState>
              {items.length
                ? "Dit is op dit moment het enige artikel."
                : "Er zijn nog geen artikelen gepubliceerd."}
            </EmptyState>
          )}
        </div>
      </section>
      <section
        data-cms="Formulier · nieuwsbrief"
        className="section section-lime"
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 30,
            alignItems: "end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span className="eyebrow">NOVA NOTES</span>
            <h2
              style={{
                fontSize: "clamp(55px,7vw,108px)",
                lineHeight: 0.96,
                maxWidth: 720,
              }}
            >
              Een beetje meer inspiratie in je inbox.
            </h2>
            <p style={{ marginTop: 20, maxWidth: 520 }}>
              Verhalen, nieuwe ideeën en creatieve inspiratie. Niet vaker dan
              nodig.
            </p>
          </div>
          <DemoFormulier
            opslaan="nieuwsbrief"
            demoTekst="Dit is een voorbeeld van de aanmeldbevestiging. Er is geen inschrijving opgeslagen."
          >
            <div className="form-field">
              <label htmlFor="newsletter">E-mailadres</label>
              <input
                type="email"
                id="newsletter"
                name="email"
                placeholder="jij@voorbeeld.nl"
                required
                autoComplete="email"
                style={{ minWidth: 250 }}
              />
            </div>
            <label className="form-check" htmlFor="nieuwsbrief-akkoord">
              <input
                id="nieuwsbrief-akkoord"
                name="akkoord"
                type="checkbox"
                required
              />
              Ik wil NOVA Notes ontvangen en kan me later afmelden.
            </label>
            <button className="btn btn-dark" style={{ marginTop: 10 }}>
              Aanmelden voor NOVA Notes ↗
            </button>
          </DemoFormulier>
        </div>
      </section>
    </Page>
  );
}
