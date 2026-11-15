// Webhook "inhoud_gepubliceerd" vanuit het CMS (linkandlead-cms src/core/http/sitewebhooks.ts).
// Het CMS ondertekent de body met HMAC-SHA256 (hex) in de header x-ll-signature, met het geheim
// van de webhook. Puur (geen server-only), zodat de controle los te testen is.

const enc = new TextEncoder();

export async function hmacHex(geheim: string, body: string): Promise<string> {
  const sleutel = await crypto.subtle.importKey("raw", enc.encode(geheim), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", sleutel, enc.encode(body)));
  return [...sig].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Vergelijking in constante tijd, zodat de handtekening niet via de responstijd te raden is. */
function gelijk(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let verschil = 0;
  for (let i = 0; i < a.length; i++) verschil |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return verschil === 0;
}

export async function handtekeningKlopt(geheim: string, body: string, handtekening: string | null): Promise<boolean> {
  if (!geheim || !handtekening || !/^[0-9a-f]{64}$/i.test(handtekening)) return false;
  return gelijk(await hmacHex(geheim, body), handtekening.toLowerCase());
}
