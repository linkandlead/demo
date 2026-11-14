import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Page } from "@/components/nova/Page";
import { Btn, Photo } from "@/components/nova/ui";
import { altTeksten, caseDetails } from "@/content/teksten";
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
  const d = caseDetails[item.slug];
  const beelden = d?.beelden ?? ["work_color", "hero_arch", "space_atrium"];
  const alinea: Array<[string, string]> = d
    ? [
        ["De vraag", d.vraag],
        ["Het concept", d.concept],
        ["De aanpak", d.aanpak],
        ["Het resultaat", d.resultaat],
      ]
    : [];
  return (
    <Page
      oproep={{
        eyebrow: "WAT IS DE VOLGENDE STAP?",
        kop: "Heb je iets bijzonders in gedachten?",
        tekst: "Ontdek hoe deze projectpagina in het CMS is opgebouwd.",
        knop: "Bekijk het CMS",
        href: "one",
      }}
    >
      <section data-cms="Header · projectdetail" className="detail-hero">
        <Photo
          src={item.cover}
          alt={altTeksten[item.cover] ?? item.name}
          priority
        />
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            GESELECTEERD WERK / {item.type}
          </span>
          <h1>{item.name}.</h1>
          <p>{d?.projectintro ?? item.desc}</p>
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
          <strong>
            {d ? d.diensten.join(" / ") : "Concept / Ontwerp / Beleving"}
          </strong>
        </div>
      </div>
      <section data-cms="Tekst met beeld" className="section">
        <div className="container detail-split">
          <p className="pullquote">
            {d?.statement ?? "Ontworpen om indruk te maken."}
          </p>
          <div className="body-copy">
            {alinea.length ? (
              alinea.map(([kop, tekst]) => (
                <div key={kop}>
                  <span className="eyebrow body-kop">{kop}</span>
                  <p>{tekst}</p>
                </div>
              ))
            ) : (
              <p>{item.desc}</p>
            )}
            <Btn to="work" cl="btn-dark">
              Bekijk meer projecten
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
            <Photo src={beelden[0]} alt={altTeksten[beelden[0]]} />
          </div>
          <div className="card-3" style={{ marginTop: 14 }}>
            <div className="image-frame" style={{ height: 300 }}>
              <Photo src={beelden[1]} alt={altTeksten[beelden[1]]} />
            </div>
            <div className="image-frame" style={{ height: 300 }}>
              <Photo src={beelden[2]} alt={altTeksten[beelden[2]]} />
            </div>
            <div className="image-frame" style={{ height: 300 }}>
              <Photo src={item.cover} alt={altTeksten[item.cover]} />
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
