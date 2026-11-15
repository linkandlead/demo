#!/usr/bin/env node
// Zet video's in de mediabibliotheek van het CMS (site Demo Klant) via de officiële route voor grote
// video's (POST {CMS_URL}/api/cms/video-upload: start → PUT naar een ondertekende URL → klaar).
//
// Gebruik: CMS_URL=… CMS_TOKEN=… node scripts/cms-video-upload.mjs film.mp4 [nog-een.webm …]
// Uitvoer: per bestand de CMS-URL, om in src/content/cms-media.ts (CMS_VIDEO) te zetten.

import { readFile } from "node:fs/promises";
import path from "node:path";

const CMS_URL = (process.env.CMS_URL || "").replace(/\/$/, "");
const TOKEN = process.env.CMS_TOKEN || "";
if (!CMS_URL || !TOKEN) {
  console.error("Zet CMS_URL en CMS_TOKEN.");
  process.exit(1);
}

const H = { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" };
const stap = async (body) => {
  const r = await fetch(`${CMS_URL}/api/cms/video-upload`, { method: "POST", headers: H, body: JSON.stringify(body) });
  return { status: r.status, ...(await r.json().catch(() => ({}))) };
};
let fout = false;
for (const bestand of process.argv.slice(2)) {
  const naam = path.basename(bestand);
  const type = naam.endsWith(".webm") ? "video/webm" : "video/mp4";
  const bytes = await readFile(bestand);
  const start = await stap({ stap: "start", naam, type, grootte: bytes.length });
  if (!start.ok) { fout = true; console.error(`${naam}: ${start.status} ${start.melding ?? ""}`); continue; }
  const put = await fetch(start.uploadUrl, { method: "PUT", headers: { "content-type": type }, body: bytes });
  if (!put.ok) { fout = true; console.error(`${naam}: uploaden mislukt (${put.status})`); continue; }
  const klaar = await stap({ stap: "klaar", pad: start.pad, naam });
  if (klaar.ok) console.log(`${naam} → ${klaar.url}`);
  else { fout = true; console.error(`${naam}: ${klaar.status} ${klaar.melding ?? ""}`); }
}
process.exit(fout ? 1 : 0);
