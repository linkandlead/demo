// Zet de NOVA-blauwdruk (src/content/blauwdruk.ts) in het CMS via de officiële sync-route
// (linkandlead-cms src/routes/api/cms/sync.ts). Idempotent: opnieuw draaien werkt de pagina's bij.
// Het token bepaalt (en beperkt) de site. Nooit een token in de repo zetten.
//
//   CMS_URL=https://linkandlead.nl CMS_TOKEN_FILE=/pad/naar/token node scripts/cms-push.mjs
//   (of CMS_TOKEN=... in de omgeving)
//
// Alleen bepaalde pagina's (en dan geen merk/huisstijl):  CMS_PAGINAS=/one,/lab node scripts/cms-push.mjs
// Let op: de blokken van elke meegestuurde pagina worden vervangen, ook wijzigingen uit het CMS.
import fs from "node:fs";
import { designTokens, merk, paginas } from "../src/content/blauwdruk.ts";

const url = (process.env.CMS_URL || "").replace(/\/$/, "");
const token =
  process.env.CMS_TOKEN ||
  (process.env.CMS_TOKEN_FILE ? fs.readFileSync(process.env.CMS_TOKEN_FILE, "utf8").trim() : "");
if (!url || !token) {
  console.error("Zet CMS_URL en CMS_TOKEN (of CMS_TOKEN_FILE).");
  process.exit(1);
}

const filter = (process.env.CMS_PAGINAS || "").split(",").map((x) => x.trim()).filter(Boolean);
const selectie = filter.length ? paginas.filter((x) => filter.includes(x.slug)) : paginas;
if (filter.length && selectie.length !== filter.length) {
  console.error("Onbekende pagina in CMS_PAGINAS:", filter.filter((f) => !paginas.some((x) => x.slug === f)).join(", "));
  process.exit(1);
}

const CHUNK = 8;
let p = 0;
let b = 0;
for (let i = 0; i < selectie.length; i += CHUNK) {
  const eerste = i === 0 && !filter.length;
  const res = await fetch(`${url}/api/cms/sync`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({
      design_tokens: eerste ? designTokens : undefined,
      merk: eerste ? merk : undefined,
      paginas: selectie.slice(i, i + CHUNK),
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.ok) {
    console.error(`✗ Mislukt vanaf pagina ${i + 1}:`, j.melding || res.status);
    process.exit(1);
  }
  p += j.paginas ?? 0;
  b += j.blokken ?? 0;
}
console.log(`✅ ${p} pagina's en ${b} blokken gesynchroniseerd.`);
