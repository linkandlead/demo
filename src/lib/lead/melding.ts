// Mailvrije melding van een nieuwe inzending (punt 16). NOVA mailt nooit: wie meldingen wil, zet
// INZENDING_WEBHOOK_URL (https) naar bv. een Slack-, Discord- of Zapier-webhook. Met
// INZENDING_WEBHOOK_SECRET wordt de body ondertekend (x-nova-handtekening, HMAC-SHA256 hex).
// Best effort: een mislukte melding breekt de inzending nooit.
import type { Inzending } from "../supabase/server.ts";
import { hmacHex } from "../cms/webhook.ts";

const SOORT: Record<string, string> = {
  contact: "Contactbericht",
  nieuwsbrief: "Nieuwsbriefaanmelding",
  "demo-aanvraag": "Demo-aanvraag Link & Lead One",
  formulier: "Formulier",
  review: "Review",
  nps: "NPS-score",
};

/** De melding zelf (puur, los te testen). */
export function meldingVoor(i: Inzending, nu = new Date()) {
  const inhoud = (i.vraag ?? (i.gegevens ? Object.entries(i.gegevens).map(([k, v]) => `${k}: ${v}`).join(" · ") : "")).slice(0, 300);
  const kop = `${SOORT[i.soort] ?? i.soort} via NOVA${i.bron_pagina ? ` (${i.bron_pagina})` : ""}`;
  const regels = [
    kop,
    i.naam ? `Naam: ${i.naam}` : "",
    i.email ? `E-mail: ${i.email}` : "",
    i.onderwerp ? `Onderwerp: ${i.onderwerp}` : "",
    typeof i.score === "number" ? `Score: ${i.score}` : "",
    inhoud ? `“${inhoud}”` : "",
  ].filter(Boolean);
  const tekst = regels.join("\n");
  // "text" werkt voor Slack, "content" voor Discord; de overige velden zijn voor eigen koppelingen.
  return { gebeurtenis: "inzending", soort: i.soort, ontvangen: nu.toISOString(), text: tekst, content: tekst, kop, inhoud };
}

export async function meldInzending(i: Inzending): Promise<void> {
  const url = process.env.INZENDING_WEBHOOK_URL?.trim() ?? "";
  if (!/^https:\/\//.test(url) || i.testcode) return;
  try {
    const body = JSON.stringify(meldingVoor(i));
    const geheim = process.env.INZENDING_WEBHOOK_SECRET?.trim();
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(geheim ? { "x-nova-handtekening": await hmacHex(geheim, body) } : {}) },
      body,
      signal: AbortSignal.timeout(3000),
      redirect: "error",
    });
  } catch {
    // melding is niet kritiek
  }
}
