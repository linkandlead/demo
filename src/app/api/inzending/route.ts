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
  const naam = [tekst(body.naam, 100), tekst(body.achternaam, 100)]
    .filter(Boolean)
    .join(" ");
  const vraag = tekst(body.vraag, 2000);
  const fouten: Record<string, string> = {};
  if (!EMAIL.test(email)) fouten.email = "Vul een geldig e-mailadres in.";
  if (soort === "contact" && !naam) fouten.naam = "Vul dit veld in.";
  if (soort === "contact" && vraag.length < 10)
    fouten.vraag = "Vertel iets meer, zodat we je goed kunnen helpen.";
  if (body.akkoord !== "on")
    fouten.akkoord = "Geef toestemming om je aanvraag te verwerken.";
  if (Object.keys(fouten).length)
    return Response.json(
      { ok: false, melding: Object.values(fouten).join(" "), fouten },
      { status: 400 },
    );

  const r = await bewaarInzending({
    soort,
    email,
    naam: naam || undefined,
    bedrijf: tekst(body.bedrijf, 200) || undefined,
    onderwerp: tekst(body.onderwerp, 200) || undefined,
    vraag: vraag || undefined,
    bron_pagina: tekst(body.bron_pagina, 200) || undefined,
  });
  if (r === "opgeslagen")
    return Response.json({
      ok: true,
      melding:
        soort === "nieuwsbrief"
          ? "Je aanmelding is ontvangen en opgeslagen in de NOVA-demodatabase. Er wordt geen bevestigingsmail verstuurd."
          : "Bedankt! Je bericht is ontvangen en opgeslagen in de NOVA-demodatabase. Er wordt geen e-mail verstuurd.",
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
      melding:
        "Het verzenden is niet gelukt. Controleer je gegevens en probeer het opnieuw.",
    },
    { status: 502 },
  );
}
