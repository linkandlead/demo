import type { Metadata } from "next";
import { BlokVoorbeeld, voorbeeldOverzicht } from "@/components/nova/BlokVoorbeelden";

// Eén kernblok als losse pagina, voor het voorbeeldvenster (iframe) in de blokkenbibliotheek.
// Alleen het blok: de site-header en de demoknop worden in een iframe verborgen (zie layout).
export const metadata: Metadata = { title: "Blokvoorbeeld", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return Object.values(voorbeeldOverzicht()).map((b) => ({ blok: b.slug }));
}

export default async function Voorbeeld({ params, searchParams }: PageProps<"/blokvoorbeeld/[blok]">) {
  const { blok } = await params;
  const zoek = await searchParams;
  const variant = typeof zoek.variant === "string" ? zoek.variant : "";
  const bg = typeof zoek.bg === "string" && /^(wit|mist|limoenlicht|diep|nacht)$/.test(zoek.bg) ? zoek.bg : undefined;
  return (
    <div className="pv-pagina" data-bg={bg}>
      <BlokVoorbeeld slug={blok} variant={variant} />
    </div>
  );
}
