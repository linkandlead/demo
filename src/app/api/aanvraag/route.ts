import { lijktSpam, valideerAanvraag } from "@/lib/lead/aanvraag";
import { bewaarInzending } from "@/lib/supabase/server";

// Demo-aanvraag voor Link & Lead One → bestaande CMS-leadflow (linkandlead-cms
// src/routes/api/cms/lead.ts). Server-to-server, dus zonder Origin-header (toegestaan door het
// CMS) en zonder token in de browser. Daarnaast wordt elke aanvraag bewaard in de NOVA-
// demodatabase (Supabase, tabel aanvragen). Zonder beide = er gebeurt niets en de bezoeker
// krijgt een eerlijke demonstratiestatus.
//
//   CMS_URL            basis-URL van het CMS (bv. https://linkandlead.nl)
//   CMS_LEAD_SITE_ID   site-id (uuid) die de aanvragen ontvangt — de Link & Lead-verkoopsite,
//                      níet de NOVA-demosite en niet een klantsite
//   LEAD_PROXY_SECRET  optioneel; laat het CMS het echte bezoekers-IP gebruiken voor de rate-limit

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, melding: "Ongeldige aanvraag." },
      { status: 400 },
    );
  }
  if (lijktSpam(body)) return Response.json({ ok: true, melding: "Bedankt!" });

  const v = valideerAanvraag(body);
  if (!v.ok)
    return Response.json(
      {
        ok: false,
        melding: "Controleer de gemarkeerde velden.",
        fouten: v.fouten,
      },
      { status: 400 },
    );

  // Altijd eerst bewaren in de NOVA-demodatabase (Supabase), als die is ingesteld.
  const opgeslagen = await bewaarInzending({
    soort: "demo-aanvraag",
    naam: v.data.naam,
    email: v.data.email,
    bedrijf: v.data.bedrijf,
    vraag: v.data.vraag,
    bron_pagina: "/one",
  });

  const cms = process.env.CMS_URL?.trim().replace(/\/$/, "");
  const siteId = process.env.CMS_LEAD_SITE_ID?.trim();
  if (!cms || !siteId) {
    if (opgeslagen === "opgeslagen")
      return Response.json({
        ok: true,
        melding:
          "Bedankt! Je aanvraag is opgeslagen in de NOVA-demodatabase. Doorsturen naar het Link & Lead One-team is nog niet ingesteld, dus er volgt geen automatische e-mail.",
      });
    return Response.json(
      {
        ok: false,
        demo: true,
        melding:
          "Demonstratiestatus: je aanvraag is níet verzonden. De aanvraagroute naar Link & Lead One is in deze omgeving nog niet ingesteld.",
      },
      { status: 503 },
    );
  }

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  const geheim = process.env.LEAD_PROXY_SECRET;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (geheim) headers["x-lead-proxy-secret"] = geheim;

  try {
    const res = await fetch(`${cms}/api/cms/lead`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        soort: "contact",
        site_id: siteId,
        naam: v.data.naam,
        email: v.data.email,
        bedrijf: v.data.bedrijf,
        vraag: v.data.vraag
          ? `Demo-aanvraag Link & Lead One: ${v.data.vraag}`
          : "Demo-aanvraag Link & Lead One (via NOVA)",
        bron_pagina: "/one",
        herkomst: "nova-demo",
        ...(geheim && ip ? { bezoeker_ip: ip } : {}),
      }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      melding?: string;
    };
    if (!res.ok || !data.ok) {
      return Response.json(
        {
          ok: false,
          melding:
            data.melding ||
            "Versturen is niet gelukt. Probeer het later opnieuw.",
        },
        { status: 502 },
      );
    }
    return Response.json({
      ok: true,
      melding:
        "Bedankt! Je aanvraag is ontvangen. We nemen contact met je op om een demo in te plannen.",
    });
  } catch {
    return Response.json(
      {
        ok: false,
        melding:
          "Het CMS is op dit moment niet bereikbaar. Probeer het later opnieuw.",
      },
      { status: 502 },
    );
  }
}
