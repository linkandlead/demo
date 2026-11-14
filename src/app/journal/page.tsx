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

export const metadata: Metadata = { title: "Journal" };

export default async function Journal() {
  const { items } = await getPosts();
  const [featured, ...rest] = items;
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">THE JOURNAL / IDEAS & INSIGHTS</span>
          <h1>
            Stories, ideas
            <br />
            and insights.
          </h1>
          <div className="hero-description">
            <span className="meta">THINK / QUESTION / IMAGINE</span>
            <p>
              Verdiepende verhalen, interviews en nieuws over creativiteit,
              technologie en de toekomst.
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
                <span className="eyebrow">FEATURED STORY / {featured.cat}</span>
                <div>
                  <h2>{featured.title}.</h2>
                  <p style={{ marginTop: 20 }}>
                    Hoe beleving merken, mensen en plekken dichter bij elkaar
                    brengt.
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
            eyebrow="MORE TO EXPLORE"
            title="Ideas worth sharing."
          />
          <div
            className="chip-row"
            style={{ marginBottom: 25 }}
            aria-label="Rubrieken (visueel voorbeeld)"
          >
            <span className="chip active">Alles</span>
            <span className="chip">Design</span>
            <span className="chip">Culture</span>
            <span className="chip">Experiences</span>
            <span className="chip">Future</span>
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
              A little more inspiration in your inbox.
            </h2>
          </div>
          <DemoFormulier demoTekst="Demonstratie: er is niets verzonden en geen e-mailadres opgeslagen. In een live site koppelt dit aan het CMS-blok Formulier (soort: nieuwsbrief).">
            <div className="form-field">
              <label htmlFor="newsletter">E-mailadres</label>
              <input
                type="email"
                id="newsletter"
                placeholder="jij@voorbeeld.nl"
                required
                autoComplete="email"
                style={{ minWidth: 250 }}
              />
            </div>
            <button className="btn btn-dark" style={{ marginTop: 10 }}>
              Aanmelden ↗
            </button>
          </DemoFormulier>
        </div>
      </section>
    </Page>
  );
}
