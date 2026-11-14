import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import { WorkGrid } from "@/components/nova/WorkGrid";
import { SectionTitle } from "@/components/nova/ui";
import { getCases } from "@/lib/cms/data";

export const metadata: Metadata = { title: "Work" };

export default async function Work() {
  const { items } = await getCases();
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">OUR WORK / CURATED PROJECTS</span>
          <h1>
            Projects that
            <br />
            make an impact.
          </h1>
          <div className="hero-description">
            <span className="meta">DESIGN / CULTURE / EXPERIENCE</span>
            <p>
              Van immersieve experiences tot digitale platformen. Ontdek hoe
              ideeën veranderen in betekenisvolle projecten.
            </p>
          </div>
        </div>
      </section>
      <section
        data-cms="Cases · collectie en filters"
        className="section"
        style={{ paddingTop: 0 }}
      >
        <div className="container">
          <WorkGrid cases={items} />
        </div>
      </section>
      <section data-cms="Bewijsstrook" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="OUR APPROACH"
            title="Every project starts with a question."
          />
          <div className="card-3">
            <div className="info-tile">
              <span className="eyebrow">01 / Discover</span>
              <strong>Listen first.</strong>
              <p>Begrijp het probleem en de mensen erachter.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">02 / Create</span>
              <strong>Think bigger.</strong>
              <p>Geef verbeelding en experiment de ruimte.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">03 / Impact</span>
              <strong>Make it matter.</strong>
              <p>Werk aan iets wat mensen raakt.</p>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
