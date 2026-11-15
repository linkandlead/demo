import "server-only";
import { cmsUrl } from "./client";

// Reviews ter goedkeuring naar het CMS (POST /api/cms/review, token-scoped op Demo Klant; CMS-PR
// linkandlead/linkandlead-cms#314). Daar keurt een beheerder ze goed; goedgekeurde reviews komen
// via de collectie Reviews terug op de site. Zolang de route nog niet live is (404), blijft de review
// alleen in de NOVA-demodatabase staan. Best effort, nooit blokkerend voor de bezoeker.
export async function stuurReviewNaarCms(r: { naam: string; tekst: string; rating: number }): Promise<"verstuurd" | "niet-beschikbaar" | "mislukt"> {
  const url = cmsUrl();
  const token = process.env.CMS_TOKEN?.trim();
  if (!url || !token) return "niet-beschikbaar";
  try {
    const res = await fetch(`${url}/api/cms/review`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(r),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
      redirect: "error",
    });
    if (res.status === 404 || res.status === 405) return "niet-beschikbaar";
    return res.ok ? "verstuurd" : "mislukt";
  } catch {
    return "mislukt";
  }
}
