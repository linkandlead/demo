"use client";

import { usePathname } from "next/navigation";

/** "Voorbeeld sluiten": een gewone link (geen next/link, dus geen prefetch die de draft mode al
 *  zou beëindigen) naar de sluitroute, terug naar dezelfde pagina. */
export function SluitLink() {
  const pad = usePathname() || "/";
  return (
    <a
      className="voorbeeld-sluiten"
      href={`/__voorvertoning/sluiten?pad=${encodeURIComponent(pad)}`}
    >
      Voorbeeld sluiten
    </a>
  );
}
