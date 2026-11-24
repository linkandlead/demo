import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { splitsOproep } from "@/components/nova/Blokken";
import { JsonLd } from "@/components/nova/JsonLd";
import { Page } from "@/components/nova/Page";
import { Btn } from "@/components/nova/ui";
import { SITE_URL } from "@/content/cms-media";
import { getPartners } from "@/lib/cms/data";
import { laadPagina } from "@/lib/cms/paginas";

// Profielpagina van een partner, uit de CMS-collectie Partners (naam, branche, tagline, over_tekst,
// quote, website, diensten).
export async function generateStaticParams() {
  return (await getPartners()).items.map((p) => ({ slug: p.slug }));
}

async function zoek(slug: string) {
  return (await getPartners()).items.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/partners/[slug]">): Promise<Metadata> {
  const p = await zoek((await params).slug);
  if (!p) return {};
  return {
    title: `${p.naam}, partner`,
    description: p.tekst,
    alternates: { canonical: `/partners/${p.slug}` },
    openGraph: { type: "website", title: p.naam, description: p.tekst },
  };
}

export default async function PartnerPagina({ params }: PageProps<"/partners/[slug]">) {
  const p = await zoek((await params).slug);
  if (!p) notFound();
  const { oproep } = splitsOproep((await laadPagina("/community"))?.blokken ?? []);
  return (
    <Page oproep={oproep}>
      <JsonLd
        data={{
          "@type": "Organization",
          name: p.naam,
          description: p.over ?? p.tekst,
          url: p.website ?? `${SITE_URL}/partners/${p.slug}`,
          ...(p.logo ? { logo: p.logo } : {}),
        }}
      />
      <section className="inner-hero" data-cms="Partners · collectie">
        <div className="container">
          <nav aria-label="Kruimelpad" className="kruimelpad">
            <ol>
              <li>
                <Link href="/community">Community</Link>
              </li>
              <li>
                <span aria-current="page">{p.naam}</span>
              </li>
            </ol>
          </nav>
          <span className="eyebrow">{p.vak || "PARTNER"}</span>
          <h1 className="hero-kop">{p.naam}.</h1>
          <div className="hero-description">
            <span className="meta">FICTIEVE PARTNER VAN NOVA</span>
            <p>{p.tekst}</p>
          </div>
        </div>
      </section>
      <section className="section section-soft" data-cms="Partner · profiel">
        <div className="container detail-split">
          <p className="pullquote">{p.quote ? `“${p.quote}”` : `${p.naam}.`}</p>
          <div className="body-copy">
            {p.quoteNaam ? <p className="meta">— {p.quoteNaam}</p> : null}
            {p.over && p.over !== p.tekst ? <p>{p.over}</p> : null}
            {p.diensten?.length ? (
              <ul className="kenmerken">
                {p.diensten.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : null}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {p.website ? (
                <Btn to={p.website} cl="btn-dark">
                  Bezoek de website
                </Btn>
              ) : null}
              <Btn to="/community" cl={p.website ? "btn-ghost" : "btn-dark"}>
                Alle partners
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
