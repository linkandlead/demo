import { cookies, draftMode } from "next/headers";
import type { NextRequest } from "next/server";
import { veiligPad, VOORVERTONING_COOKIE } from "@/lib/cms/voorvertoning";

// GET /__voorvertoning/sluiten?pad=/x — "Voorbeeld sluiten": draft mode uit, token weg, terug naar
// de gepubliceerde versie van dezelfde pagina (alleen een intern pad).

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  if (draft.isEnabled) draft.disable();
  const jar = await cookies();
  if (jar.has(VOORVERTONING_COOKIE)) jar.delete(VOORVERTONING_COOKIE);
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
