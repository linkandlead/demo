import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { splitsOproep } from "@/components/nova/Blokken";
import { JsonLd } from "@/components/nova/JsonLd";
import { Page } from "@/components/nova/Page";
import { Btn, Photo, mediaSrc } from "@/components/nova/ui";
import { SITE_URL } from "@/content/cms-media";
import { getPeople } from "@/lib/cms/data";
import { laadPagina } from "@/lib/cms/paginas";
import { persoonSlug } from "@/lib/slug";

// Profielpagina van een maker, uit de CMS-collectie Teamleden (naam, functie, tekst, foto, foto_alt).
export async function generateStaticParams() {
  return (await getPeople()).items.map((p) => ({ slug: persoonSlug(p.name) }));
}

async function zoek(slug: string) {
  return (await getPeople()).items.find((p) => persoonSlug(p.name) === slug);
}

export async function generateMetadata({ params }: PageProps<"/mensen/[slug]">): Promise<Metadata> {
  const p = await zoek((await params).slug);
  if (!p) return {};
  const beschrijving = p.bio?.split(". ")[0] ?? p.role;
  return {
    title: `${p.name}, ${p.role}`,
    description: beschrijving,
    alternates: { canonical: `/mensen/${persoonSlug(p.name)}` },
    openGraph: { type: "profile", title: p.name, description: beschrijving, images: p.cover ? [{ url: mediaSrc(p.cover), alt: p.alt || p.name }] : [] },
  };
}

export default async function Maker({ params }: PageProps<"/mensen/[slug]">) {
  const p = await zoek((await params).slug);
  if (!p) notFound();
  const { oproep } = splitsOproep((await laadPagina("/community"))?.blokken ?? []);
  const alineas = (p.bio ?? "").split(/(?<=\.)\s+(?=[A-Z])/).reduce<string[]>((acc, zin, i) => {
    // Twee zinnen per alinea leest prettiger dan één lange lap tekst.
    if (i % 2 === 0) acc.push(zin);
    else acc[acc.length - 1] += ` ${zin}`;
    return acc;
  }, []);
  return (
    <Page oproep={oproep}>
      <JsonLd
        data={{
          "@type": "Person",
          name: p.name,
          jobTitle: p.role,
          description: p.bio,
          image: p.cover ? new URL(mediaSrc(p.cover), SITE_URL).href : undefined,
          worksFor: { "@type": "Organization", name: "NOVA" },
          url: `${SITE_URL}/mensen/${persoonSlug(p.name)}`,
        }}
      />
      <section className="inner-hero" data-cms="Teamleden · collectie">
        <div className="container profiel">
          <div className="image-frame profiel-foto">
            <Photo src={p.cover} alt={p.alt || p.name} priority sizes="(max-width: 760px) 100vw, 40vw" />
          </div>
          <div>
            <nav aria-label="Kruimelpad" className="kruimelpad">
              <ol>
                <li>
                  <Link href="/community">Community</Link>
                </li>
                <li>
                  <span aria-current="page">{p.name}</span>
                </li>
              </ol>
            </nav>
            <span className="eyebrow">{p.role}</span>
            <h1 className="hero-kop">{p.name}.</h1>
            <div className="body-copy">
              {alineas.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Btn to="/community" cl="btn-dark">
                Ontmoet de andere makers
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
