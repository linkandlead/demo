import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, SectionTitle, StoryCard } from "@/components/nova/ui";
import { altTeksten, artikelAlsTekst, artikelen } from "@/content/teksten";
import { splitsOproep } from "@/components/nova/Blokken";
import { getPosts } from "@/lib/cms/data";
import { laadPagina } from "@/lib/cms/paginas";

export async function generateStaticParams() {
  return (await getPosts()).items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPosts()).items.find((p) => p.slug === slug);
  return {
    title: post?.title ?? "Artikel",
    description: post?.lead || (post ? artikelen[post.slug]?.intro : undefined),
  };
}

export default async function Artikel({
  params,
}: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const { items, bron } = await getPosts();
  const post = items.find((p) => p.slug === slug);
  if (!post) notFound();
  // Afsluitende oproep: dezelfde als op het verhalenoverzicht in het CMS.
  const overzicht = await laadPagina("/journal");
  const { oproep } = splitsOproep(overzicht?.blokken ?? []);
  const meer = items.filter((p) => p.slug !== post.slug).slice(0, 3);
  // Hoofdtekst uit Supabase/CMS ("## kop" + alinea's); anders de definitieve teksten.
  const tekst = artikelen[post.slug];
  const blokken = post.body?.length
    ? post.body
    : tekst
      ? artikelAlsTekst(tekst).split("\n\n")
      : [];
  return (
    <Page oproep={oproep}>
      <article className="container article-page" data-cms="Header + Tekstblok">
        <span className="eyebrow">{post.cat} / VERHALEN</span>
        <h1>{post.title}.</h1>
        <p className="lead">{post.lead || tekst?.intro || ""}</p>
        <div className="meta" style={{ marginBottom: 30 }}>
          NOVA-REDACTIE{post.time ? <> &nbsp; · &nbsp; {post.time}</> : null}
          {bron !== "cms" ? <> &nbsp; · &nbsp; VOORBEELDARTIKEL</> : null}
        </div>
        <div className="wide-photo">
          <Photo
            src={post.cover}
            alt={altTeksten[post.cover] ?? post.title}
            priority
          />
        </div>
        <div className="article-body">
          {blokken.map((b, i) =>
            b.startsWith("## ") ? (
              <h2 key={i}>{b.slice(3)}</h2>
            ) : (
              <p key={i}>{b}</p>
            ),
          )}
          {!post.body?.length && tekst?.slot ? <blockquote>{tekst.slot}</blockquote> : null}
          {bron !== "cms" ? (
            <p className="meta">
              Voorbeeldartikel voor de fictieve NOVA-website.
            </p>
          ) : null}
          <Btn to="journal" cl="btn-dark">
            Bekijk meer verhalen
          </Btn>
        </div>
      </article>
      {meer.length ? (
        <section className="section section-soft" data-cms="Artikelen">
          <div className="container">
            <SectionTitle
              num="VERDER"
              eyebrow="LEES MEER"
              title="Meer verhalen die het delen waard zijn."
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
