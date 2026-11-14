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
        <Photo src="event_lights" alt="Creative festival" priority />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            NOVA SESSIONS / EVENT EXPERIENCE
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
          <strong>NOVA Creative Campus (fictief)</strong>
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
            eyebrow="THE PROGRAM"
            title="Three days. Infinite ideas."
          />
          <div className="schedule">
            <div>
              {[
                ["10:00", "Welcome & Creative Futures"],
                ["11:30", "Beyond the expected"],
                ["14:00", "Meet the makers"],
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
            eyebrow="YOUR TICKET"
            title="Choose your experience."
          />
          <div className="tickets">
            {[
              ["Day ticket.", "€ 49", ""],
              ["Full pass.", "€ 119", "featured"],
              ["Group pass.", "€ 399", ""],
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
