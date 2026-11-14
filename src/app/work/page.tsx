import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import { WorkGrid } from "@/components/nova/WorkGrid";
import { SectionTitle } from "@/components/nova/ui";
import { getCases } from "@/lib/cms/data";

export const metadata: Metadata = {
  title: "Werk — projecten",
  description:
    "Bekijk de creatieve voorbeeldprojecten van NOVA: architectuur, belevingen, evenementen en ontwerp. Inclusief filters en projectdetailpagina’s.",
};

export default async function Work() {
  const { items } = await getCases();
  return (
    <Page
      oproep={{
        eyebrow: "WAT IS DE VOLGENDE STAP?",
        kop: "Heb je iets bijzonders in gedachten?",
        tekst: "Ontdek eerst hoe deze website is opgebouwd.",
        knop: "Bekijk het CMS",
        href: "one",
      }}
    >
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
              Van lichtinstallaties tot nieuwe ontmoetingsplekken. Ontdek zes
              fictieve projecten met een eigen verhaal en een eigen vorm.
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
            title="Een goed resultaat begint met een betere vraag."
            desc="Niet het eindbeeld, maar het idee erachter maakt het verschil."
          />
          <div className="card-3">
            <div className="info-tile">
              <span className="eyebrow">01 / Ontdekken</span>
              <strong>Eerst begrijpen.</strong>
              <p>Eerst begrijpen wat mensen echt nodig hebben.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">02 / Creëren</span>
              <strong>Ruimte geven.</strong>
              <p>Dan ruimte geven aan verbeelding en experiment.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">03 / Verbinden</span>
              <strong>Relevant maken.</strong>
              <p>
                Tot slot maken we het relevant voor de mensen om wie het draait.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
