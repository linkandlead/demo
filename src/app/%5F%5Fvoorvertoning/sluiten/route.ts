import { cookies, draftMode } from "next/headers";
import type { NextRequest } from "next/server";
import { BEWERK_COOKIE } from "@/lib/cms/bewerken";
import { veiligPad, VOORVERTONING_COOKIE } from "@/lib/cms/voorvertoning";

// GET /__voorvertoning/sluiten?pad=/x — "Voorbeeld sluiten" of "Stoppen": draft mode uit, tokens weg, terug naar
// de gepubliceerde versie van dezelfde pagina (alleen een intern pad).

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  if (draft.isEnabled) draft.disable();
  const jar = await cookies();
  if (jar.has(VOORVERTONING_COOKIE)) jar.delete(VOORVERTONING_COOKIE);
  // Ook "Stoppen" in de bewerkbalk komt hier: het bewerktoken gaat mee weg.
  if (jar.has(BEWERK_COOKIE)) jar.delete(BEWERK_COOKIE);
  const pad = veiligPad(request.nextUrl.searchParams.get("pad") || "/") ?? "/";
  return new Response(null, {
    status: 307,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      Location: new URL(pad, request.nextUrl.origin).toString(),
    },
  });
}
