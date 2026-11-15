import { revalidateTag } from "next/cache";
import { handtekeningKlopt } from "@/lib/cms/webhook";

// POST /api/cms-webhook — het CMS meldt "inhoud_gepubliceerd". Dan vervalt de gecachete CMS-inhoud
// (tag "cms") meteen, zodat het volgende bezoek de nieuwe versie ziet in plaats van na 60 seconden.
// Alleen met een geldige handtekening (CMS_WEBHOOK_SECRET, gelijk aan het geheim van de webhook in het CMS).

export async function POST(request: Request) {
  const geheim = process.env.CMS_WEBHOOK_SECRET?.trim() ?? "";
  if (!geheim) return Response.json({ ok: false, melding: "Webhook niet ingesteld." }, { status: 503 });
  const body = await request.text();
  if (body.length > 100_000) return Response.json({ ok: false, melding: "Te groot." }, { status: 413 });
  const handtekening = request.headers.get("x-ll-signature") ?? request.headers.get("x-cms-handtekening");
  if (!(await handtekeningKlopt(geheim, body, handtekening)))
    return Response.json({ ok: false, melding: "Ongeldige handtekening." }, { status: 401 });

  let gebeurtenis = "";
  try {
    gebeurtenis = String((JSON.parse(body) as { gebeurtenis?: unknown }).gebeurtenis ?? "");
  } catch {
    return Response.json({ ok: false, melding: "Ongeldige inhoud." }, { status: 400 });
  }
  if (gebeurtenis !== "inhoud_gepubliceerd") return Response.json({ ok: true, genegeerd: gebeurtenis });

  // expire: 0 → geen verouderde inhoud meer serveren; het eerstvolgende bezoek haalt vers op.
  revalidateTag("cms", { expire: 0 });
  return Response.json({ ok: true, ververst: true });
}
