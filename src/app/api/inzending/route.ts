import { lijktSpam } from "@/lib/lead/aanvraag";
import { bewaarInzending } from "@/lib/supabase/server";

// NOVA-formulieren (contact, nieuwsbrief) → tabel `aanvragen` in de NOVA-demodatabase (Supabase).
// Er wordt NIETS gemaild; inzendingen zijn alleen in het Supabase-dashboard te zien.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const tekst = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { ok: false, melding: "Ongeldige inzending." },
      { status: 400 },
    );
  }
  if (lijktSpam(body)) return Response.json({ ok: true, melding: "Bedankt!" });

  const soort = body.soort === "nieuwsbrief" ? "nieuwsbrief" : "contact";
  const email = tekst(body.email, 254);
  const naam = tekst(body.naam, 200);
  const vraag = tekst(body.vraag, 2000);
  const fouten: Record<string, string> = {};
  if (!EMAIL.test(email)) fouten.email = "Vul een geldig e-mailadres in.";
  if (soort === "contact" && !naam) fouten.naam = "Vul je voornaam in.";
  if (soort === "contact" && !vraag) fouten.vraag = "Vertel ons wat meer.";
  if (Object.keys(fouten).length)
    return Response.json(
      { ok: false, melding: "Controleer de gemarkeerde velden.", fouten },
      { status: 400 },
    );

  const r = await bewaarInzending({
    soort,
    email,
    naam: naam || undefined,
    onderwerp: tekst(body.onderwerp, 200) || undefined,
    vraag: vraag || undefined,
    bron_pagina: tekst(body.bron_pagina, 200) || undefined,
  });
  if (r === "opgeslagen")
    return Response.json({
      ok: true,
      melding:
        soort === "nieuwsbrief"
          ? "Bedankt! Je aanmelding is opgeslagen in de NOVA-demodatabase. Er wordt geen e-mail verstuurd."
          : "Bedankt! Je bericht is opgeslagen in de NOVA-demodatabase. Er wordt geen e-mail verstuurd.",
    });
  if (r === "niet-ingesteld")
    return Response.json(
      {
        ok: false,
        demo: true,
        melding:
          "Demonstratie: er is niets verstuurd of opgeslagen (geen database ingesteld).",
      },
      { status: 503 },
    );
  return Response.json(
    {
      ok: false,
      melding: "Opslaan is niet gelukt. Probeer het later opnieuw.",
    },
    { status: 502 },
  );
}
