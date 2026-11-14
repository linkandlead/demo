import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import { PersonCard, Photo, SectionTitle } from "@/components/nova/ui";
import { getPeople } from "@/lib/cms/data";

export const metadata: Metadata = { title: "About" };

const STAPPEN = [
  ["01", "Discover", "Luisteren, observeren, doorvragen."],
  ["02", "Imagine", "Nieuwe mogelijkheden durven zien."],
  ["03", "Create", "Ideeën tastbaar maken."],
  ["04", "Connect", "Mensen en plannen samenbrengen."],
];

export default async function About() {
  const { items: people } = await getPeople();
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">ABOUT / OUR STORY</span>
          <h1>
            Make room
            <br />
            for what’s next.
          </h1>
          <div className="hero-description">
            <span className="meta">DESIGNING NEW POSSIBILITIES</span>
            <p>
              NOVA is een fictieve creatieve wereld, speciaal ontworpen om te
              laten zien wat Link & Lead One mogelijk maakt.
            </p>
          </div>
          <div className="lead-image image-frame">
            <Photo
              src="hero_arch"
              alt="Abstract architectonisch paviljoen"
              priority
            />
          </div>
        </div>
      </section>
      <section data-cms="Statement" className="section section-dark statement">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            OUR MISSION
          </span>
          <h2>
            We believe <em>ideas grow</em> when worlds connect.
          </h2>
        </div>
      </section>
      <section data-cms="Reeks stappen · tijdlijn" className="section">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="OUR PROCESS"
            title="From spark to impact."
          />
          <div className="timeline">
            {STAPPEN.map(([n, titel, tekst]) => (
              <div className="timeline-item" key={n}>
                <strong>{n}</strong>
                <h3>{titel}</h3>
                <p>{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section data-cms="Team" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="OUR PEOPLE"
            title="Meet the makers."
          />
          <div className="people-grid">
            {people.map((p) => (
              <PersonCard key={p.name} p={p} />
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
