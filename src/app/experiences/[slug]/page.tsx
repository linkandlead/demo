import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoKnop } from "@/components/nova/DemoKnop";
import { Page } from "@/components/nova/Page";
import { Photo, SectionTitle } from "@/components/nova/ui";
import { altTeksten, evenementen } from "@/content/teksten";
import { getEvents } from "@/lib/cms/data";

export async function generateStaticParams() {
  return (await getEvents()).items.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/experiences/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { items: events } = await getEvents();
  const ev = events.find((e) => e.slug === slug);
  const tekst = evenementen.find((e) => e.slug === slug);
  return { title: ev?.name ?? "Evenement", description: tekst?.intro };
}

export default async function EventDetail({
  params,
}: PageProps<"/experiences/[slug]">) {
  const { slug } = await params;
  const { items: events } = await getEvents();
  const ev = events.find((e) => e.slug === slug);
  if (!ev) notFound();
  // Programma, tickets en teksten uit de definitieve teksten; de naam uit de collectie.
  const d = evenementen.find((e) => e.slug === slug);
  const beeld = d?.beeld ?? "event_lights";

  return (
    <Page
      oproep={{
        eyebrow: "GA VERDER",
        kop: "Meer dan een evenement. Een gedeelde ervaring.",
        tekst:
          "Bekijk hoe evenementen, programma's en prijskaarten in het CMS worden gepresenteerd.",
        knop: "Ontdek de CMS-blokken",
        href: "playground",
      }}
    >
      <section data-cms="Header · eventdetail" className="detail-hero">
        <Photo src={beeld} alt={altTeksten[beeld]} priority />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            {d?.eyebrow ?? "NOVA BELEVINGEN / DEMO-EVENEMENT"}
          </span>
          <h1>{ev.name}.</h1>
          <p>{d ? `${d.payoff} ${d.intro}` : "Fictief voorbeeldevenement."}</p>
        </div>
      </section>
      {d ? (
        <>
          <div className="container mini-info" data-cms="Feiten">
            <div>
              <span>DATUM</span>
              <strong>{d.datum}</strong>
            </div>
            <div>
              <span>LOCATIE</span>
              <strong>{d.locatie}</strong>
            </div>
            <div>
              <span>DOELGROEP</span>
              <strong>{d.doelgroep}</strong>
            </div>
          </div>
          <section className="section" data-cms="Reeks stappen · programma">
            <div className="container">
              <SectionTitle
                num="01"
                eyebrow="HET PROGRAMMA"
                title={
                  d.dagen.length > 1
                    ? "Drie dagen. Eindeloos veel ideeën."
                    : "Eén middag. Betere vragen."
                }
              />
              <div className="schedule">
                <div>
                  {d.dagen.map((dag) => (
                    <div key={dag.titel} style={{ marginBottom: 28 }}>
                      <span className="eyebrow">{dag.titel}</span>
                      {dag.items.map(([tijd, titel]) => (
                        <div className="schedule-row" key={tijd + titel}>
                          <strong>{tijd}</strong>
                          <span>{titel}</span>
                          <span aria-hidden="true">↗</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="image-frame" style={{ height: 360 }}>
                  <Photo src="event_gradient" alt={altTeksten.event_gradient} />
                </div>
              </div>
            </div>
          </section>
          <section
            className="section section-soft"
            data-cms="Prijskaarten / tickets"
          >
            <div className="container">
              <SectionTitle
                num="02"
                eyebrow="JOUW TICKET"
                title="Kies je beleving."
                desc="Demoprijzen: bestellen of betalen is niet mogelijk."
              />
              <div className="tickets">
                {d.tickets.map(([naam, prijs, tekst], i) => (
                  <div
                    className={`ticket ${i === 1 ? "featured" : ""}`}
                    key={naam}
                  >
                    <div>
                      <h3>{naam}</h3>
                      <p style={{ marginTop: 12 }}>{tekst}</p>
                    </div>
                    <div>
                      <strong>{prijs}</strong>
                      <DemoKnop
                        style={{ display: "flex", marginTop: 15 }}
                        melding={d.disclaimer}
                      >
                        Bekijk voorbeeldtickets ↗
                      </DemoKnop>
                    </div>
                  </div>
                ))}
              </div>
              <p className="demo-note" style={{ marginTop: 20 }}>
                {d.disclaimer}
              </p>
            </div>
          </section>
        </>
      ) : null}
    </Page>
  );
}
