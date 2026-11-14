import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import { WorkGrid } from "@/components/nova/WorkGrid";
import { SectionTitle } from "@/components/nova/ui";
import { getCases } from "@/lib/cms/data";

export const metadata: Metadata = { title: "Werk" };

export default async function Work() {
  const { items } = await getCases();
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">ONS WERK / GESELECTEERDE PROJECTEN</span>
          <h1>
            Projecten die
            <br />
            impact maken.
          </h1>
          <div className="hero-description">
            <span className="meta">ONTWERP / CULTUUR / BELEVING</span>
            <p>
              Van meeslepende belevingen tot digitale platformen. Ontdek hoe
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
            eyebrow="ONZE AANPAK"
            title="Elk project begint met een vraag."
          />
          <div className="card-3">
            <div className="info-tile">
              <span className="eyebrow">01 / Ontdekken</span>
              <strong>Eerst luisteren.</strong>
              <p>Begrijp het probleem en de mensen erachter.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">02 / Creëren</span>
              <strong>Groter denken.</strong>
              <p>Geef verbeelding en experiment de ruimte.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">03 / Impact</span>
              <strong>Laat het ertoe doen.</strong>
              <p>Werk aan iets wat mensen raakt.</p>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
