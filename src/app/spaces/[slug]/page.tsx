import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionTitle } from "@/components/nova/ui";
import { spaces } from "@/content/nova";

export const dynamicParams = false;
export const generateStaticParams = () => spaces.map((s) => ({ slug: s.slug }));

export async function generateMetadata({
  params,
}: PageProps<"/spaces/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: spaces.find((s) => s.slug === slug)?.name ?? "Ruimte" };
}

export default async function Ruimte({ params }: PageProps<"/spaces/[slug]">) {
  const { slug } = await params;
  const ruimte = spaces.find((s) => s.slug === slug);
  if (!ruimte) notFound();
  // Ontwerp is uitgewerkt voor Studio One; andere ruimtes gebruiken hetzelfde detailtemplate.
  const isStudio = ruimte.slug === "studio-one";
  return (
    <Page>
      <section data-cms="Header · ruimtedetail" className="detail-hero">
        <Photo
          src={isStudio ? "space_atrium" : ruimte.cover}
          alt="Moderne inspirerende ruimte"
          priority
        />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            NOVA SPACES
          </span>
          <h1>{ruimte.name}.</h1>
          <p>
            {isStudio
              ? "Een inspirerende plek voor ideeën, ontmoetingen en nieuwe mogelijkheden."
              : ruimte.desc}
          </p>
        </div>
      </section>
      <div className="container mini-info" data-cms="Feiten">
        <div>
          <span>OPPERVLAKTE</span>
          <strong>240 m² (demo)</strong>
        </div>
        <div>
          <span>CAPACITEIT</span>
          <strong>10–150 personen (demo)</strong>
        </div>
        <div>
          <span>FACILITEITEN</span>
          <strong>AV / Wifi / Catering</strong>
        </div>
      </div>
      <section className="section" data-cms="Tekst met beeld">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="THE SPACE"
            title="Everything you need to create."
          />
          <div className="intro-grid">
            <div className="body-copy">
              <p>
                Rust, licht en flexibiliteit: {ruimte.name} is ontworpen om
                samen iets bijzonders te maken. Ideaal voor presentaties,
                workshops en creatieve bijeenkomsten.
              </p>
              <p>
                Er zijn meerdere opstellingen mogelijk, afhankelijk van je
                programma en het aantal deelnemers.
              </p>
              <Btn to="lab" cl="btn-dark">
                Stel je arrangement samen
              </Btn>
            </div>
            <div className="image-frame" style={{ height: 420 }}>
              <Photo src={isStudio ? "work_arch" : ruimte.cover} />
            </div>
          </div>
        </div>
      </section>
      <section
        data-cms="Configurator / Agenda-inplanner"
        className="section section-soft"
      >
        <div className="container">
          <SectionTitle
            num="02"
            eyebrow="DESIGN YOUR VISIT"
            title="Your event, your way."
          />
          <div className="card-3">
            <div className="info-tile">
              <span className="eyebrow">STEP 01</span>
              <strong>Kies je ervaring</strong>
              <p>Workshop, presentatie of evenement.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">STEP 02</span>
              <strong>Bepaal je gezelschap</strong>
              <p>Flexibele opstellingen voor groepen.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">STEP 03</span>
              <strong>Plan je bezoek</strong>
              <p>Vraag naar een geschikte datum.</p>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <Btn to="lab" cl="btn-dark">
              Open de voorbeeldconfigurator
            </Btn>
          </div>
        </div>
      </section>
    </Page>
  );
}
