import { NextResponse } from "next/server";

// Alleen voor verzoeken mét de draft-mode-cookie ("Voorbeeld op de site"): die antwoorden mogen nooit
// geïndexeerd worden. Next.js zet in draft mode zelf al Cache-Control: private, no-store. Gewone
// bezoekers hebben die cookie niet; voor hen draait deze proxy niet (zie de matcher).
export function proxy() {
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|media|fonts|brand|favicon.ico).*)",
      has: [{ type: "cookie", key: "__prerender_bypass" }],
    },
  ],
};
