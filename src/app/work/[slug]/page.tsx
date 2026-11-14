import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Page } from "@/components/nova/Page";
import { Btn, Photo } from "@/components/nova/ui";
import { getCases } from "@/lib/cms/data";

export async function generateStaticParams() {
  return (await getCases()).items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = (await getCases()).items.find((c) => c.slug === slug);
  return { title: item?.name ?? "Project", description: item?.desc };
}

export default async function WorkDetail({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const { items, bron } = await getCases();
  const item = items.find((c) => c.slug === slug);
  if (!item) notFound();
  return (
    <Page>
      <section data-cms="Header · projectdetail" className="detail-hero">
        <Photo src={item.cover} alt={item.name} priority />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            GESELECTEERD WERK / {item.type}
          </span>
          <h1>{item.name}.</h1>
          <p>{item.desc}</p>
        </div>
      </section>
      <div className="container mini-info" data-cms="Feiten">
        <div>
          <span>SECTOR</span>
          <strong>{item.type}</strong>
        </div>
        {item.year ? (
          <div>
            <span>JAAR</span>
            <strong>{item.year}</strong>
          </div>
        ) : null}
        <div>
          <span>OPDRACHTGEVER</span>
          <strong>{bron === "cms" ? item.name : "NOVA-demoproject"}</strong>
        </div>
        <div>
          <span>DIENSTEN</span>
          <strong>Concept / Ontwerp / Beleving</strong>
        </div>
      </div>
      <section data-cms="Tekst met beeld" className="section">
        <div className="container detail-split">
          <p className="pullquote">Ontworpen om indruk te maken.</p>
          <div className="body-copy">
            <p>
              Dit project begon met een simpele vraag: hoe maak je van een plek
              een ervaring die mensen bijblijft? We creëerden een wereld waar
              ruimte, licht en verhaal elkaar ontmoeten.
            </p>
            <p>
              Van de eerste schets tot de laatste ontmoeting stond de bezoeker
              centraal. Het resultaat is een ervaring die verwondert en
              uitnodigt tot ontdekken.
            </p>
            <Btn to="work" cl="btn-dark">
              Terug naar alle projecten
            </Btn>
          </div>
        </div>
      </section>
      <section
        data-cms="Portfolio / extra beelden"
        className="section section-soft"
        style={{ paddingTop: 0 }}
      >
        <div className="container">
          <div className="wide-photo">
            <Photo src="work_color" alt="Sfeervol projectbeeld" />
          </div>
          <div className="card-3" style={{ marginTop: 14 }}>
            <div className="image-frame" style={{ height: 300 }}>
              <Photo src="hero_arch" />
            </div>
            <div className="image-frame" style={{ height: 300 }}>
              <Photo src="space_atrium" />
            </div>
            <div className="image-frame" style={{ height: 300 }}>
              <Photo src="event_lights" />
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
