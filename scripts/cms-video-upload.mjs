#!/usr/bin/env node
// Zet de NOVA-video's in de mediabibliotheek van het CMS (site Demo Klant) via de officiële
// media-API (POST {CMS_URL}/api/cms/media, token-gescopet). Werkt zodra het CMS MP4/WebM aanneemt.
// Een video die al in de bibliotheek staat (zelfde inhoud), slaat het CMS als dubbel over.
//
// Gebruik: CMS_URL=https://linkandlead.nl CMS_TOKEN=… node scripts/cms-video-upload.mjs
// Uitvoer: per bestand de CMS-URL, om in src/content/cms-media.ts te zetten.

import { readFile } from "node:fs/promises";
import path from "node:path";

const CMS_URL = (process.env.CMS_URL || "").replace(/\/$/, "");
const TOKEN = process.env.CMS_TOKEN || "";
if (!CMS_URL || !TOKEN) {
  console.error("Zet CMS_URL en CMS_TOKEN.");
  process.exit(1);
}

const VIDEOS = ["nova-film-liggend.mp4", "nova-film-liggend-720.mp4", "nova-film-staand.mp4"];
let fout = false;
for (const naam of VIDEOS) {
  const bytes = await readFile(path.join("public/media", naam));
  const fd = new FormData();
  fd.append("file", new File([bytes], naam, { type: "video/mp4" }));
  const r = await fetch(`${CMS_URL}/api/cms/media`, { method: "POST", headers: { authorization: `Bearer ${TOKEN}` }, body: fd });
  const j = await r.json().catch(() => ({}));
  if (r.ok && j.ok) console.log(`${naam} → ${j.url}`);
  else {
    fout = true;
    console.error(`${naam}: ${r.status} ${j.melding ?? ""}`);
  }
}
process.exit(fout ? 1 : 0);
