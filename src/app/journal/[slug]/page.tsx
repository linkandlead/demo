import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Page } from "@/components/nova/Page";
import { Photo, SectionTitle, StoryCard } from "@/components/nova/ui";
import { getPosts } from "@/lib/cms/data";

export async function generateStaticParams() {
  return (await getPosts()).items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPosts()).items.find((p) => p.slug === slug);
  return { title: post?.title ?? "Artikel" };
}

export default async function Artikel({
  params,
}: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const { items, bron } = await getPosts();
  const post = items.find((p) => p.slug === slug);
  if (!post) notFound();
  const meer = items.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <Page>
      <article className="container article-page" data-cms="Header + Tekstblok">
        <span className="eyebrow">{post.cat} / THE JOURNAL</span>
        <h1>{post.title}.</h1>
        <p className="lead">
          {post.lead ||
            "Waarom nieuwe ideeën, mensen en plekken een steeds belangrijkere rol spelen in de manier waarop we samenkomen en creëren."}
        </p>
        <div className="meta" style={{ marginBottom: 30 }}>
          NOVA EDITORIAL{post.time ? <> &nbsp; · &nbsp; {post.time}</> : null}
          {bron === "demo" ? <> &nbsp; · &nbsp; VOORBEELDARTIKEL</> : null}
        </div>
        <div className="wide-photo">
          <Photo src={post.cover} alt={post.title} priority />
        </div>
        <div className="article-body">
          {post.body?.length ? (
            post.body.map((alinea, i) => <p key={i}>{alinea}</p>)
          ) : (
            <>
              <p>
                De mooiste ideeën ontstaan vaak op de grens tussen disciplines.
                Waar architectuur, technologie en cultuur elkaar raken, groeit
                ruimte voor onverwachte ervaringen.
              </p>
              <p>
                Bij NOVA geloven we dat vernieuwen begint met nieuwsgierigheid.
                Niet met de nieuwste techniek of het grootste podium, maar met
                de vraag wat we voor mensen mogelijk willen maken.
              </p>
              <h2>Experience first.</h2>
              <p>
                Een sterke ervaring vertelt een verhaal zonder alles uit te
                leggen. Ze maakt bezoekers niet alleen toeschouwer, maar
                onderdeel van wat er gebeurt. Dat vraagt om ruimte, ritme en een
                scherp gevoel voor detail.
              </p>
              <blockquote>Great design makes people feel something.</blockquote>
              <p>
                Van een intieme studio tot een grootschalig festival: de
                uitgangspunten blijven hetzelfde. Zoek naar wat verbindt, laat
                ruimte voor verwondering en maak iets dat betekenis heeft.
              </p>
              <p>
                Dit artikel bevat fictieve voorbeeldcontent, speciaal geschreven
                voor het visuele CMS-ontwerp.
              </p>
            </>
          )}
        </div>
      </article>
      {meer.length ? (
        <section className="section section-soft" data-cms="Artikelen">
          <div className="container">
            <SectionTitle
              num="NEXT"
              eyebrow="READ MORE"
              title="Stories worth sharing."
            />
            <div className="article-grid">
              {meer.map((p) => (
                <StoryCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </Page>
  );
}
