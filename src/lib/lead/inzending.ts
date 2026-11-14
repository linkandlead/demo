// Validatie van NOVA-inzendingen (contact, nieuwsbrief, formulierbouwer, review, NPS).
// Puur, zodat het los te testen is; de route slaat het resultaat op in Supabase. Er wordt nooit gemaild.
import type { Inzending } from "../supabase/server.ts";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const tekst = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Opruimcode die een E2E-test meestuurt (`_testcode`), zodat de test zijn eigen rijen kan wissen. */
export function testcode(body: unknown): string | undefined {
  const code = body && typeof body === "object" ? (body as Record<string, unknown>)._testcode : undefined;
  return typeof code === "string" && UUID.test(code) ? code.toLowerCase() : undefined;
}

export type Resultaat = { ok: true; inzending: Inzending } | { ok: false; fouten: Record<string, string> };

const SOORTEN = ["contact", "nieuwsbrief", "formulier", "review", "nps"] as const;

export function valideerInzending(body: Record<string, unknown>): Resultaat {
  const soort = SOORTEN.find((s) => s === body.soort) ?? "contact";
  const fouten: Record<string, string> = {};
  const email = tekst(body.email, 254);
  const naam = [tekst(body.naam, 100), tekst(body.achternaam, 100)].filter(Boolean).join(" ");
  const vraag = tekst(body.vraag, 2000);
  const basis = { soort, bron_pagina: tekst(body.bron_pagina, 200) || undefined, testcode: testcode(body) };

  if (soort === "nps" || soort === "review") {
    const score = Number(body.score);
    const [min, max] = soort === "nps" ? [0, 10] : [1, 5];
    if (!Number.isInteger(score) || score < min || score > max)
      fouten.score = soort === "nps" ? "Kies een score van 0 tot 10." : "Kies een aantal sterren van 1 tot 5.";
    if (soort === "review" && !naam) fouten.naam = "Vul je naam in.";
    if (soort === "review" && vraag.length < 10) fouten.vraag = "Schrijf minimaal tien tekens.";
    if (soort === "review" && body.akkoord !== "on") fouten.akkoord = "Geef toestemming om je review te tonen.";
    if (Object.keys(fouten).length) return { ok: false, fouten };
    return { ok: true, inzending: { ...basis, score, naam: naam || undefined, vraag: vraag || undefined } };
  }

  if (soort === "formulier") {
    const gegevens: Record<string, string> = {};
    const ruw = body.gegevens && typeof body.gegevens === "object" ? (body.gegevens as Record<string, unknown>) : {};
    for (const [k, v] of Object.entries(ruw).slice(0, 20)) {
      const sleutel = tekst(k, 80);
      const waarde = tekst(v, 1000);
      if (sleutel && waarde) gegevens[sleutel] = waarde;
    }
    if (email && !EMAIL.test(email)) fouten.email = "Vul een geldig e-mailadres in.";
    if (!Object.keys(gegevens).length) fouten.gegevens = "Vul het formulier in.";
    if (Object.keys(fouten).length) return { ok: false, fouten };
    return { ok: true, inzending: { ...basis, email: email || undefined, gegevens } };
  }

  if (!EMAIL.test(email)) fouten.email = "Vul een geldig e-mailadres in.";
  if (soort === "contact" && !naam) fouten.naam = "Vul dit veld in.";
  if (soort === "contact" && vraag.length < 10) fouten.vraag = "Vertel iets meer, zodat we je goed kunnen helpen.";
  if (body.akkoord !== "on") fouten.akkoord = "Geef toestemming om je aanvraag te verwerken.";
  if (Object.keys(fouten).length) return { ok: false, fouten };
  return {
    ok: true,
    inzending: {
      ...basis,
      email,
      naam: naam || undefined,
      bedrijf: tekst(body.bedrijf, 200) || undefined,
      onderwerp: tekst(body.onderwerp, 200) || undefined,
      vraag: vraag || undefined,
    },
  };
}
