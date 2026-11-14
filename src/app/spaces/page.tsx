import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/nova/Page";
import { Photo, SectionTitle } from "@/components/nova/ui";
import { spaces } from "@/content/nova";

export const metadata: Metadata = { title: "Spaces" };

export default function Spaces() {
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">OUR SPACES / MEET DIFFERENTLY</span>
          <h1>
            Extraordinary
            <br />
            spaces for
            <br />
            big ideas.
          </h1>
          <div className="hero-description">
            <span className="meta">SPACES THAT INSPIRE</span>
            <p>
              Flexibele, inspirerende locaties voor evenementen, producties,
              workshops en meetings.
            </p>
          </div>
        </div>
      </section>
      <section
        data-cms="Collectie (lijst) · ruimtes"
        className="section"
        style={{ paddingTop: 0 }}
      >
        <div className="container">
          {spaces.map((s, i) => (
            <Link
              className="space-card"
              href={`/spaces/${s.slug}`}
              key={s.slug}
            >
              <div className="photo">
                <Photo src={s.cover} alt={s.alt} />
              </div>
              <div className="copy">
                <span className="eyebrow">0{i + 1} / OUR SPACES</span>
                <h3>{s.name}.</h3>
                <p>{s.desc}</p>
                {/* In het prototype een geneste link; een <a> in een <a> is ongeldige HTML, dus hier
                    dezelfde knopvorm als span binnen de kaartlink. */}
                <span className="btn btn-dark">
                  {s.cta}
                  <span className="arrow">↗</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section data-cms="Feiten" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="SPACE FACTS"
            title="Your next idea starts here."
          />
          <div className="stats-grid">
            <div className="stat">
              <strong>03</strong>
              <p>Unieke ruimtes</p>
            </div>
            <div className="stat">
              <strong>10–500</strong>
              <p>Personen per opstelling</p>
            </div>
            <div className="stat">
              <strong>∞</strong>
              <p>Mogelijkheden om te creëren</p>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
