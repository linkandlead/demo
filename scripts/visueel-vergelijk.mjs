// Visuele vergelijking: originele prototype (referentie/nova-bouwpakket/02_WEBSITE, hash-routes)
// tegen de Next.js-build. Maakt per route en viewport screenshots van beide en controleert
// overflow, aantal H1's en consolefouten.
//
//   PROTO=http://localhost:8080 SITE=http://localhost:3000 OUT=./uit node scripts/visueel-vergelijk.mjs
import { createRequire } from "node:module";
// Playwright staat globaal geïnstalleerd (niet als projectdependency).
const { chromium } = createRequire(import.meta.url)("playwright");
import fs from "node:fs";

const PROTO = process.env.PROTO ?? "http://localhost:8080";
const SITE = process.env.SITE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "./visueel-uit";
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  "",
  "work",
  "work/aurora-pavilion",
  "journal",
  "journal/de-kracht-van-immersive-experiences",
  "experiences",
  "experiences/nova-sessions",
  "spaces",
  "spaces/studio-one",
  "community",
  "about",
  "contact",
  "lab",
  "members",
  "playground",
  "playground/sports",
  "demo",
  "one",
];
const VIEWPORTS = { desktop: [1440, 900], mobiel: [390, 844] };
const EXTRA = [375, 768, 1280];
const naam = (r) => (r || "home").replaceAll("/", "_");

const browser = await chromium.launch();
const rapport = [];
for (const [vp, [w, h]] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(`${PROTO}/#/${r}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${OUT}/${vp}-${naam(r)}-proto.png` });
    await page.screenshot({
      path: `${OUT}/${vp}-${naam(r)}-proto-vol.png`,
      fullPage: true,
    });

    const fouten = [];
    const onErr = (m) => m.type() === "error" && fouten.push(m.text());
    page.on("console", onErr);
    const res = await page.goto(`${SITE}/${r}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${OUT}/${vp}-${naam(r)}-site.png` });
    await page.screenshot({
      path: `${OUT}/${vp}-${naam(r)}-site-vol.png`,
      fullPage: true,
    });
    const info = await page.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      hoogte: document.documentElement.scrollHeight,
    }));
    page.off("console", onErr);
    rapport.push({
      vp,
      route: "/" + r,
      status: res?.status(),
      ...info,
      consolefouten: fouten,
    });
  }
  await ctx.close();
}
// Extra breedtes: alleen overflow
for (const w of EXTRA) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(`${SITE}/${r}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    rapport.push({ vp: `${w}px`, route: "/" + r, overflow });
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${OUT}/rapport.json`, JSON.stringify(rapport, null, 2));
console.log("klaar", rapport.length);
