import type { Metadata } from "next";
import { Page } from "@/components/nova/Page";
import { Btn, PersonCard, Photo, SectionTitle } from "@/components/nova/ui";
import { altTeksten, bios } from "@/content/teksten";
import { getPeople } from "@/lib/cms/data";

export const metadata: Metadata = {
  title: "Over ons — het verhaal achter NOVA",
  description:
    "Lees het verhaal achter de fictieve NOVA-website en ontdek waarom deze is ontwikkeld als designshowcase van Link & Lead One.",
};

const STAPPEN = [
  [
    "01",
    "Ontdekken",
    "We luisteren, kijken en stellen de vragen achter de vraag.",
  ],
  [
    "02",
    "Verbeelden",
    "We onderzoeken mogelijkheden buiten het vanzelfsprekende.",
  ],
  ["03", "Creëren", "We brengen vorm, techniek en verhaal samen."],
  [
    "04",
    "Verbinden",
    "We delen het resultaat met de mensen voor wie het bedoeld is.",
  ],
];

export default async function About() {
  const { items: people } = await getPeople();
  return (
    <Page>
      <section data-cms="Header (hero)" className="inner-hero">
        <div className="container">
          <span className="eyebrow">OVER ONS / ONS VERHAAL</span>
          <h1>
            Maak ruimte
            <br />
            voor wat komt.
          </h1>
          <div className="hero-description">
            <span className="meta">NIEUWE MOGELIJKHEDEN ONTWERPEN</span>
            <p>
              NOVA is geen echt bedrijf. Het is een zorgvuldig ontworpen
              voorbeeldwereld om de kracht van bijzonder webdesign en
              overzichtelijk contentbeheer te laten zien.
            </p>
          </div>
          <div className="lead-image image-frame">
            <Photo src="hero_arch" alt={altTeksten.hero_arch} priority />
          </div>
        </div>
      </section>
      <section data-cms="Statement" className="section section-dark statement">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            01 / WAAR WE IN GELOVEN
          </span>
          <h2>
            Wij geloven dat <em>ideeën groeien</em> als werelden elkaar raken.
          </h2>
          <p style={{ maxWidth: 640, color: "#c9d2e1", fontSize: 17 }}>
            Creativiteit begint bij nieuwsgierigheid. Vooruitgang begint bij
            samenwerking. NOVA is gebouwd rondom één gedachte: een website moet
            iets oproepen. Verwondering. Herkenning. Een idee.
          </p>
        </div>
      </section>
      <section data-cms="Reeks stappen · tijdlijn" className="section">
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="ZO DENKEN WE"
            title="Van nieuws&shy;gierigheid naar creatie."
            desc="Vier stappen die de fictieve NOVA-werkwijze tastbaar maken."
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
            num="03"
            eyebrow="DE MENSEN"
            title="Gemaakt door nieuwsgierige geesten."
            desc="Bekijk hoe mensen en rollen vanuit één collectie op verschillende pagina’s terugkomen."
          />
          <div className="people-grid">
            {people.map((p) => (
              <div key={p.name}>
                <PersonCard p={p} />
                {bios[p.name] ? (
                  <p className="person-bio">{bios[p.name].lang}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section data-cms="Tekst met beeld" className="section">
        <div className="container intro-grid">
          <div>
            <span className="eyebrow">
              <span className="label-index">04 / </span> HET ECHTE VERHAAL
            </span>
            <h2 style={{ fontSize: "clamp(40px, 4.6vw, 72px)" }}>
              Een fictieve wereld. Een echte demonstratie van ontwerpvrijheid.
            </h2>
            <p>
              NOVA is gemaakt om de mogelijkheden van Link & Lead One zichtbaar
              te maken. Je ziet een merk met een eigen uitstraling. Achter de
              schermen worden pagina’s, secties en collecties volgens de
              CMS-specificatie ingericht. De werking van de live koppeling
              claimen we pas nadat die technisch is geverifieerd.
            </p>
            <Btn to="one" cl="btn-dark">
              Ontdek Link & Lead One
            </Btn>
          </div>
          <div className="image-frame intro-image">
            <Photo src="work_arch" alt={altTeksten.work_arch} />
          </div>
        </div>
      </section>
    </Page>
  );
}
