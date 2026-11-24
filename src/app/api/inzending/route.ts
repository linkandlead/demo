import { lijktSpam } from "@/lib/lead/aanvraag";
import { valideerInzending } from "@/lib/lead/inzending";
import { bewaarInzending, isRecentDubbel, magInzenden } from "@/lib/supabase/server";
import { meldInzending } from "@/lib/lead/melding";
import { stuurReviewNaarCms } from "@/lib/cms/review";
import { stuurLeadNaarCms } from "@/lib/cms/lead";

// NOVA-formulieren (contact, nieuwsbrief, formulierbouwer, review, NPS) → tabel `aanvragen` in de NOVA-demodatabase (Supabase).
// Er wordt NIETS gemaild; inzendingen zijn alleen in het Supabase-dashboard te zien.


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
  if (!(await magInzenden(request)))
    return Response.json(
      { ok: false, melding: "Je hebt net al een paar keer iets verstuurd. Probeer het over tien minuten opnieuw." },
      { status: 429 },
    );

  const v = valideerInzending(body);
  if (!v.ok)
    return Response.json(
      { ok: false, melding: Object.values(v.fouten).join(" "), fouten: v.fouten },
      { status: 400 },
    );
  const soort = v.inzending.soort;
  // Een dubbelklik of herhaald verzoek: dezelfde inzending van de afgelopen seconden telt één keer. De bezoeker krijgt
  // gewoon de bevestiging; er wordt niets dubbel opgeslagen, gemeld of naar het CMS gestuurd.
  const dubbel = !v.inzending.testcode && (await isRecentDubbel(v.inzending));
  const r = dubbel ? "opgeslagen" : await bewaarInzending(v.inzending);
  if (r === "opgeslagen" && !dubbel) {
    await meldInzending(v.inzending);
    // Contact, nieuwsbrief en formulieren ook als lead in het CMS (best effort, niet bij testinzendingen).
    await stuurLeadNaarCms(v.inzending);
    // Reviews ook ter goedkeuring naar het CMS (niet bij testinzendingen).
    if (soort === "review" && !v.inzending.testcode && v.inzending.naam && v.inzending.vraag)
      await stuurReviewNaarCms({ naam: v.inzending.naam, tekst: v.inzending.vraag, rating: v.inzending.score ?? 5 });
  }
  if (r === "opgeslagen")
    return Response.json({
      ok: true,
      melding:
        soort === "nieuwsbrief"
          ? "Je aanmelding is ontvangen en opgeslagen in de NOVA-demodatabase. Er wordt geen bevestigingsmail verstuurd."
          : soort === "contact"
            ? "Bedankt! Je bericht is ontvangen en opgeslagen in de NOVA-demodatabase. Er wordt geen e-mail verstuurd."
            : "Bedankt! Je inzending is opgeslagen in de NOVA-demodatabase.",
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
