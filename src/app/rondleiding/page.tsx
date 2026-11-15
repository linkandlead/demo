import type { Metadata } from "next";
import { Rondleiding } from "@/components/nova/Rondleiding";

// Automatische rondleiding door de hele site en het systeem erachter (scènes in src/content/rondleiding.ts).
export const metadata: Metadata = {
  title: "Rondleiding",
  description: "Druk op afspelen en zie in een paar minuten hoe NOVA en Link & Lead One samenwerken.",
  alternates: { canonical: "/rondleiding" },
};

export default function RondleidingPagina() {
  return (
    <div className="page">
      <Rondleiding />
    </div>
  );
}
