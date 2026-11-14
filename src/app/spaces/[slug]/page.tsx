import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionTitle } from "@/components/nova/ui";
import { altTeksten, ruimteDemolabel, ruimteDetails } from "@/content/teksten";
import { getSpaces } from "@/lib/cms/data";

// Nieuwe ruimtes uit Supabase renderen op aanvraag (dynamicParams staat standaard aan).
export async function generateStaticParams() {
  return (await getSpaces()).items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/spaces/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { items: spaces } = await getSpaces();
  return {
    title: spaces.find((s) => s.slug === slug)?.name ?? "Ruimte",
    description: ruimteDetails[slug]?.intro,
  };
}

export default async function Ruimte({ params }: PageProps<"/spaces/[slug]">) {
  const { slug } = await params;
  const { items: spaces } = await getSpaces();
  const ruimte = spaces.find((s) => s.slug === slug);
  if (!ruimte) notFound();
  // Ontwerp is uitgewerkt voor Studio One; andere ruimtes gebruiken hetzelfde detailtemplate.
  const isStudio = ruimte.slug === "studio-one";
  const d = ruimteDetails[ruimte.slug];
  const heroBeeld = isStudio ? "space_atrium" : ruimte.cover;
  const zijBeeld = isStudio ? "work_arch" : ruimte.cover;
  return (
    <Page
      oproep={{
        eyebrow: "PLAN IETS",
        kop: "Jouw ruimte. Jouw verhaal.",
        tekst:
          "Bekijk de configurator en de aanvraagstappen zonder een echte boeking te plaatsen.",
        knop: "Probeer de configurator",
        href: "lab",
      }}
    >
      <section data-cms="Header · ruimtedetail" className="detail-hero">
        <Photo
          src={heroBeeld}
          alt={altTeksten[heroBeeld] ?? ruimte.alt}
          priority
        />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            NOVA-RUIMTES
          </span>
          <h1>{ruimte.name}.</h1>
          <p>{d ? `${d.payoff} ${d.intro}` : ruimte.desc}</p>
        </div>
      </section>
      <div className="container mini-info" data-cms="Feiten">
        <div>
          <span>CAPACITEIT</span>
          <strong>{d?.capaciteit ?? "Op aanvraag (demo)"}</strong>
        </div>
        <div>
          <span>KENMERKEN</span>
          <strong>
            {d ? d.kenmerken.slice(0, 2).join(" / ") : "Flexibel in te richten"}
          </strong>
        </div>
        <div>
          <span>STATUS</span>
          <strong>Fictieve ruimte</strong>
        </div>
      </div>
      <section className="section" data-cms="Tekst met beeld">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="DE RUIMTE"
            title="Alles wat je nodig hebt om te creëren."
            desc={ruimteDemolabel}
          />
          <div className="intro-grid">
            <div className="body-copy">
              {(d?.alineas ?? [ruimte.desc]).map((a) => (
                <p key={a}>{a}</p>
              ))}
              {d ? (
                <ul className="kenmerken">
                  {d.kenmerken.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              ) : null}
              <Btn to="lab" cl="btn-dark">
                {d?.knop ?? "Stel je sessie samen"}
              </Btn>
            </div>
            <div className="image-frame" style={{ height: 420 }}>
              <Photo src={zijBeeld} alt={altTeksten[zijBeeld]} />
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
            eyebrow="STEL JE BEZOEK SAMEN"
            title="Jouw evenement, op jouw manier."
          />
          <div className="card-3">
            <div className="info-tile">
              <span className="eyebrow">STAP 01</span>
              <strong>Kies je ervaring</strong>
              <p>Brainstorm, presentatie, workshop of evenement.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">STAP 02</span>
              <strong>Bepaal je gezelschap</strong>
              <p>Kies een opstelling die past bij het aantal deelnemers.</p>
            </div>
            <div className="info-tile">
              <span className="eyebrow">STAP 03</span>
              <strong>Bekijk de indicatie</strong>
              <p>
                Geen echte kalender of reservering: alleen een rekenvoorbeeld.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <Btn to="lab" cl="btn-dark">
              Probeer de configurator
            </Btn>
          </div>
        </div>
      </section>
    </Page>
  );
}
