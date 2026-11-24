import type { Inzending } from "@/lib/supabase/server";

export function leadBody(i: Inzending, siteId: string): Record<string, unknown> | null {
  if (i.soort !== "contact" && i.soort !== "nieuwsbrief" && i.soort !== "formulier") return null;
  const gegevens = i.gegevens ? Object.entries(i.gegevens).map(([k, v]) => `${k}: ${v}`).join("\n") : undefined;
  return {
    soort: i.soort === "nieuwsbrief" ? "nieuwsbrief" : "contact",
    site_id: siteId,
    naam: i.naam,
    email: i.email,
    bedrijf: i.bedrijf,
    vraag: [i.onderwerp, i.vraag, gegevens].filter(Boolean).join("\n") || (i.soort === "nieuwsbrief" ? "Aanmelding nieuwsbrief" : undefined),
    bron_pagina: i.bron_pagina,
    herkomst: "nova-demo",
  };
}
