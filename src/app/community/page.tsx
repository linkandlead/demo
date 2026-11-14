import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import {
  Btn,
  EmptyState,
  PersonCard,
  Photo,
  SectionTitle,
} from "@/components/nova/ui";
import { altTeksten, bios, citaten, partners } from "@/content/teksten";
import { getPeople } from "@/lib/cms/data";

export const metadata: Metadata = {
  title: "Community — mensen & makers",
  description:
    "Ontmoet de fictieve makers en communitypartners van NOVA. Een voorbeeld van dynamische team-, partner- en testimonialcollecties.",
};

const MOZAIEK: Array<[string, string, boolean]> = [
  ["comm_face", "Makers", true],
  ["comm_man", "Partners", false],
  ["comm_person", "Team", false],
  ["comm_event", "Momenten die we delen", false],
];

export default async function Community() {
  const { items: people } = await getPeople();
  return (
    <Page
      oproep={{
        eyebrow: "05 / DOE MEE",
        kop: "De toekomst heeft andere stemmen nodig.",
        tekst:
          "Ontdek wat er mogelijk wordt wanneer mensen en ideeën samenkomen.",
        knop: "Neem contact op",
        href: "contact",
      }}
    >
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">ONZE COMMUNITY / SAMEN GEMAAKT</span>
          <h1>
            Mensen maken
            <br />
            de toekomst.
          </h1>
          <div className="hero-description">
            <span className="meta">MENSEN / CREATIVITEIT / VERBINDING</span>
            <p>
              Sterke ideeën ontstaan tussen mensen. Ontmoet de fictieve makers,
              partners en nieuwsgierige geesten van NOVA.
            </p>
          </div>
        </div>
      </section>
      <section
        data-cms="Team en Partners/sponsoren"
        className="section"
        style={{ paddingTop: 0 }}
      >
        <div className="container">
          <div className="community-mosaic">
            {MOZAIEK.map(([src, titel, pijl]) => (
              <div className="image-frame" key={titel}>
                <Photo src={src} alt={altTeksten[src]} />
                <div className="image-overlay" />
                <div className="image-caption">
                  <h3>{titel}</h3>
                  {pijl ? (
                    <span className="circle-arrow" aria-hidden="true">
                      ↗
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section data-cms="Team · collectie" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="ONZE MAKERS"
            title="De mensen achter de mogelijkheden."
            desc="Vier makers. Verschillende disciplines. Eén gedeelde nieuwsgierigheid."
          />
          {people.length ? (
            <div className="people-grid">
              {people.slice(0, 4).map((p) => (
                <div key={p.name}>
                  <PersonCard p={p} />
                  {bios[p.name] ? (
                    <p className="person-bio">{bios[p.name].kort}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>Er zijn nog geen teamleden beschikbaar.</EmptyState>
          )}
        </div>
      </section>
      <section data-cms="Partners/sponsoren" className="section">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="ONZE PARTNERS"
            title="Samen sterker."
            desc="Voorbeeldpartners uit ontwerp, cultuur, technologie en maatschappelijke vernieuwing. Alle namen zijn fictief."
          />
          <div className="card-3 card-4">
            {partners.map(([naam, vak, tekst]) => (
              <div className="info-tile" key={naam}>
                <span className="eyebrow">{vak}</span>
                <strong>{naam}</strong>
                <p>{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section data-cms="Partner uitgelicht" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="03"
            eyebrow="UITGELICHTE PARTNER"
            title="Een ander perspectief verandert alles."
          />
          <div className="detail-split">
            <p className="pullquote">
              Mooie dingen ontstaan als werelden elkaar ontmoeten.
            </p>
            <div className="body-copy">
              <p>
                Maak kennis met Atelier North, een fictieve partner die
                verbeelding verbindt met ruimtelijk ontwerp.
              </p>
              <p>
                Samen onderzoeken we hoe plekken niet alleen functioneel, maar
                ook betekenisvol kunnen zijn.
              </p>
              <Btn to="about" cl="btn-dark">
                Lees over onze aanpak
              </Btn>
            </div>
          </div>
        </div>
      </section>
      <section data-cms="Citaten-carrousel" className="section">
        <div className="container">
          <SectionTitle
            num="04"
            eyebrow="STEMMEN UIT DE COMMUNITY"
            title="Kleine momenten. Grote gesprekken."
            desc="Wat fictieve communityleden zeggen over de NOVA-ervaring. De citaten zijn verzonnen en worden alleen getoond als CMS-demovulling."
          />
          <div className="card-3">
            {citaten.map(([citaat, naam]) => (
              <div className="info-tile" key={naam}>
                <span className="eyebrow">STEM UIT DE COMMUNITY</span>
                <strong style={{ fontSize: 23 }}>“{citaat}”</strong>
                <p>— {naam} · fictief teamlid, voorbeeldcitaat</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
