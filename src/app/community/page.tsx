import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionTitle } from "@/components/nova/ui";

export const metadata: Metadata = { title: "Community" };

const MOZAIEK: Array<[string, string, string, boolean]> = [
  ["comm_face", "Portret van een creatieve maker", "Makers", true],
  ["comm_man", "Creatieve partner", "Partners", false],
  ["comm_person", "Portret teamlid", "Team", false],
  ["comm_event", "Community event", "Momenten die we delen", false],
];

const STEMMEN: Array<[string, string]> = [
  [
    "“Er ontstaat hier ruimte voor ideeën die nergens anders passen.”",
    "Maya Chen",
  ],
  ["“De energie van samen iets maken is ongeëvenaard.”", "Noah Vermeer"],
  ["“Je komt voor een event en vertrekt met een perspectief.”", "Amara Brooks"],
];

export default function Community() {
  return (
    <Page>
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
              Een groeiende community van creatieven, innovators en organisaties
              die samen werken aan betekenisvolle projecten.
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
            {MOZAIEK.map(([src, alt, titel, pijl]) => (
              <div className="image-frame" key={titel}>
                <Photo src={src} alt={alt} />
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
      <section data-cms="Partner uitgelicht" className="section section-soft">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="SAMEN STERKER"
            title="Ideeën zijn er om te delen."
          />
          <div className="detail-split">
            <p className="pullquote">
              Mooie dingen ontstaan als werelden elkaar ontmoeten.
            </p>
            <div className="body-copy">
              <p>
                Bij NOVA komen denkers, makers, bedrijven en nieuwsgierige
                mensen samen. Niet omdat we hetzelfde zijn, maar juist omdat we
                anders denken.
              </p>
              <Btn to="members" cl="btn-dark">
                Ontdek de ledenomgeving
              </Btn>
            </div>
          </div>
        </div>
      </section>
      <section data-cms="Reviews / Citaten-carrousel" className="section">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="WAT MENSEN ZEGGEN"
            title="Echte verbinding. Blijvende impact."
          />
          <div className="card-3">
            {STEMMEN.map(([citaat, naam]) => (
              <div className="info-tile" key={naam}>
                <span className="eyebrow">STEM UIT DE COMMUNITY</span>
                <strong style={{ fontSize: 23 }}>{citaat}</strong>
                <p>— {naam} · fictieve testimonial</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
