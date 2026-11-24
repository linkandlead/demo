import "server-only";
import { cmsUrl } from "./client";
import type { Inzending } from "@/lib/supabase/server";
import { leadBody } from "./lead-body";

// Contact, nieuwsbrief en formulieren komen naast de NOVA-demodatabase ook als lead in het CMS van de
// site Demo Klant (POST /api/cms/lead, server-to-server). Alleen met CMS_URL én CMS_INZENDING_SITE_ID
// (site-id van Demo Klant, nooit een andere site). Best effort: nooit blokkerend voor de bezoeker,
// en nooit voor testinzendingen.
export type LeadResultaat = "verstuurd" | "niet-ingesteld" | "overgeslagen" | "mislukt";

export async function stuurLeadNaarCms(i: Inzending): Promise<LeadResultaat> {
  if (i.testcode) return "overgeslagen";
  const url = cmsUrl();
  const siteId = process.env.CMS_INZENDING_SITE_ID?.trim();
  if (!url || !siteId) return "niet-ingesteld";
  const body = leadBody(i, siteId);
  if (!body) return "overgeslagen";
  try {
    const res = await fetch(`${url}/api/cms/lead`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
      redirect: "error",
    });
    return res.ok ? "verstuurd" : "mislukt";
  } catch {
    return "mislukt";
  }
}
