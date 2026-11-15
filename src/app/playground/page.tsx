import Link from "next/link";
import { CmsPagina } from "@/components/nova/CmsPagina";
import { blokVoorbeelden } from "@/components/nova/BlokVoorbeelden";
import { Playground } from "@/components/nova/Playground";
import { paginaMetadata } from "@/lib/cms/paginas";

// Blokkenbibliotheek: kop en oproep uit het CMS; de interactieve verkenner is een frontendmodule.
export const generateMetadata = () => paginaMetadata("/playground");

export default function Blokkenbibliotheek() {
  return (
    <CmsPagina
      slug="/playground"
      na={{
        header: (
          <section className="section section-soft" style={{ paddingTop: 50 }} data-cms="Blokkenverkenner (frontendmodule)">
            <div className="container">
              <Playground voorbeelden={blokVoorbeelden()} />
              <p style={{ marginTop: 24, fontSize: 13 }}>
                Bekijk ook de{" "}
                <Link href="/playground/sports" style={{ textDecoration: "underline" }}>
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
