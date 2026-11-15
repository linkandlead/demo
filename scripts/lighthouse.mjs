// Lighthouse-meting per pagina, met ondergrenzen (punt 8 van de verbeterlijst).
//   SITE=http://localhost:3000 [CHROME_PATH=/pad/naar/chromium] node scripts/lighthouse.mjs
// Faalt (exit 1) als een pagina onder een ondergrens zakt. SEO meten we niet: de demo staat bewust
// op noindex, wat de SEO-score omlaag haalt.
import fs from "node:fs";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const SITE = process.env.SITE ?? "http://localhost:3000";
const PAGINAS = ["/", "/work", "/journal/de-kracht-van-immersive-experiences", "/experiences", "/lab", "/one", "/playground"];
// Prestaties mobiel zijn met gesimuleerde 4G-vertraging gemeten; in CI schommelt dat, dus een ruime ondergrens.
const ONDERGRENS = {
  mobiel: { performance: 0.75, accessibility: 0.95, "best-practices": 0.9 },
  desktop: { performance: 0.85, accessibility: 0.95, "best-practices": 0.9 },
};

const chromePath =
  process.env.CHROME_PATH ?? ["/opt/pw-browsers/chromium", "/usr/bin/chromium", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p));
const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox"] });
let fouten = 0;
const rapport = [];
try {
  for (const [vorm, instellingen] of [
    ["mobiel", { formFactor: "mobile", screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 } }],
    ["desktop", { formFactor: "desktop", screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1 }, throttlingMethod: "provided" }],
  ]) {
    for (const pad of PAGINAS) {
      const r = await lighthouse(SITE + pad, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices"],
        ...instellingen,
      });
      const cat = r.lhr.categories;
      const scores = Object.fromEntries(Object.entries(cat).map(([k, v]) => [k, v.score ?? 0]));
      const te_laag = Object.entries(ONDERGRENS[vorm]).filter(([k, min]) => (scores[k] ?? 0) < min);
      if (te_laag.length) fouten++;
      const regel = `${te_laag.length ? "✗" : "✓"} ${vorm.padEnd(7)} ${pad.padEnd(46)} ${Object.entries(scores)
        .map(([k, v]) => `${k.replace("best-practices", "bp")} ${Math.round(v * 100)}`)
        .join("  ")}`;
      console.log(regel);
      rapport.push({ vorm, pad, scores, lcp: r.lhr.audits["largest-contentful-paint"]?.displayValue, cls: r.lhr.audits["cumulative-layout-shift"]?.displayValue });
      if (te_laag.length)
        for (const a of Object.values(r.lhr.audits).filter((a) => a.score !== null && a.score < 0.9 && a.details?.type !== "debugdata").slice(0, 6))
          console.log(`    · ${a.title}${a.displayValue ? ` (${a.displayValue})` : ""}`);
    }
  }
} finally {
  await chrome.kill();
}
if (process.env.LIGHTHOUSE_RAPPORT) fs.writeFileSync(process.env.LIGHTHOUSE_RAPPORT, JSON.stringify(rapport, null, 2));
console.log(fouten ? `\n${fouten} meting(en) onder de ondergrens` : "\nAlle metingen boven de ondergrens");
process.exit(fouten ? 1 : 0);
