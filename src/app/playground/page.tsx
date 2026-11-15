import Link from "next/link";
import { Blokken } from "@/components/nova/Blokken";
import { CmsPagina } from "@/components/nova/CmsPagina";
import { Playground } from "@/components/nova/Playground";
import { verkennerVoorbeeld } from "@/content/verkenner";
import { paginaMetadata } from "@/lib/cms/paginas";

// Blokkenbibliotheek: kop en oproep uit het CMS; de interactieve verkenner is een frontendmodule.
// De keuze (blok, achtergrond, variant, hoogte) staat in de URL. De server rendert alleen het gekozen
// blok, met de echte renderer (Blokken) en voorbeeldinhoud uit de blauwdruk; de verkenner (client)
// krijgt die weergave als kant-en-klaar React-element mee en wisselt via router.replace.
export const generateMetadata = () => paginaMetadata("/playground");

const een = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Blokkenbibliotheek({
  searchParams,
}: PageProps<"/playground">) {
  const sp = await searchParams;
  const { blok, ...voorbeeld } = verkennerVoorbeeld({
    blok: een(sp.blok),
    bg: een(sp.bg),
    variant: een(sp.variant),
    hoogte: een(sp.hoogte),
  });
  const weergave =
    blok && voorbeeld.bron ? (
      <Blokken pagina={{ slug: voorbeeld.bron }} blokken={[blok]} voorbeeld />
    ) : null;

  return (
    <CmsPagina
      slug="/playground"
      na={{
        header: (
          <section
            className="section section-soft"
            style={{ paddingTop: 50 }}
            data-cms="Blokkenverkenner (frontendmodule)"
          >
            <div className="container">
              <Playground voorbeeld={voorbeeld} weergave={weergave} />
              <p style={{ marginTop: 24, fontSize: 13 }}>
                Bekijk ook de{" "}
                <Link
                  href="/playground/sports"
                  style={{ textDecoration: "underline" }}
                >
                  sportblokken
                </Link>
                .
              </p>
            </div>
          </section>
        ),
      }}
    />
  );
}
