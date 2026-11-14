import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoKnop } from "@/components/nova/DemoKnop";
import { Page } from "@/components/nova/Page";
import { Photo, SectionTitle } from "@/components/nova/ui";
import { getEvents } from "@/lib/cms/data";

export async function generateStaticParams() {
  return (await getEvents()).items.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/experiences/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { items: events } = await getEvents();
  return { title: events.find((e) => e.slug === slug)?.name ?? "Event" };
}

const MELDING = "Visuele demo: er wordt geen ticket verkocht.";

export default async function EventDetail({
  params,
}: PageProps<"/experiences/[slug]">) {
  const { slug } = await params;
  const { items: events } = await getEvents();
  const ev = events.find((e) => e.slug === slug);
  if (!ev) notFound();
  return (
    <Page>
      <section data-cms="Header · eventdetail" className="detail-hero">
        <Photo src="event_lights" alt="Creatief festival" priority />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            NOVA SESSIONS / EVENEMENT
          </span>
          <h1>{ev.name}.</h1>
          <p>
            Drie dagen vol verhalen, makers en ideeën die perspectief bieden.
            Datum en programma zijn fictief.
          </p>
        </div>
      </section>
      <div className="container mini-info" data-cms="Feiten">
        <div>
          <span>DATUM</span>
          <strong>12–14 september 2027</strong>
        </div>
        <div>
          <span>LOCATIE</span>
          <strong>NOVA Creatieve Campus (fictief)</strong>
        </div>
        <div>
          <span>DOELGROEP</span>
          <strong>Makers en innovators</strong>
        </div>
      </div>
      <section className="section" data-cms="Reeks stappen · programma">
        <div className="container">
          <SectionTitle
            num="01"
            eyebrow="HET PROGRAMMA"
            title="Drie dagen. Eindeloos veel ideeën."
          />
          <div className="schedule">
            <div>
              {[
                ["10:00", "Welkom & creatieve toekomsten"],
                ["11:30", "Voorbij het verwachte"],
                ["14:00", "Ontmoet de makers"],
              ].map(([tijd, titel]) => (
                <div className="schedule-row" key={tijd}>
                  <strong>{tijd}</strong>
                  <span>{titel}</span>
                  <span aria-hidden="true">↗</span>
                </div>
              ))}
            </div>
            <div className="image-frame" style={{ height: 360 }}>
              <Photo src="journal_event" />
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
          />
          <div className="tickets">
            {[
              ["Dagticket.", "€ 49", ""],
              ["Volledige pas.", "€ 119", "featured"],
              ["Groepspas.", "€ 399", ""],
            ].map(([naam, prijs, cl]) => (
              <div className={`ticket ${cl}`} key={naam}>
                <h3>{naam}</h3>
                <strong>{prijs}</strong>
                <DemoKnop melding={MELDING}>Ticket bekijken ↗</DemoKnop>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
