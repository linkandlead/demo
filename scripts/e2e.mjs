// End-to-end-controle van NOVA (Playwright, globaal geïnstalleerd) + axe-core toegankelijkheid.
//   SITE=http://localhost:3000 [SITE_CMS=http://localhost:3001 LEADS_LOG=... MOCK_CMS=http://localhost:4000] node scripts/e2e.mjs
//   Alleen de voorvertoning (geen formulieren, geen Supabase): ALLEEN=voorvertoning SITE_CMS=… MOCK_CMS=…
import { createRequire } from "node:module";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const AXE = require.resolve("axe-core/axe.min.js");

const SITE = process.env.SITE ?? "http://localhost:3000";
const SITE_CMS = process.env.SITE_CMS;
const ROUTES = [
  "/",
  "/work",
  "/work/aurora-pavilion",
  "/journal",
  "/journal/de-kracht-van-immersive-experiences",
  "/experiences",
  "/experiences/nova-sessions",
  "/spaces",
  "/spaces/studio-one",
  "/community",
  "/about",
  "/contact",
  "/lab",
  "/members",
  "/playground",
  "/playground/sports",
  "/demo",
  "/one",
];

let ok = 0,
  fout = 0;
const check = (naam, voorwaarde, extra = "") => {
  if (voorwaarde) {
    ok++;
    console.log(`  ✓ ${naam}`);
  } else {
    fout++;
    console.log(`  ✗ ${naam} ${extra}`);
  }
};

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await ctx.newPage();

// Testinzendingen krijgen een opruimcode; aan het eind wist de test precies die rijen weer
// (Supabase-functie ruim_testinzendingen_op). Echte inzendingen blijven onaangeroerd.
const TESTCODE = randomUUID();
await ctx.route(/\/api\/(inzending|aanvraag)$/, async (route) => {
  const req = route.request();
  let data = {};
  try {
    data = JSON.parse(req.postData() ?? "{}");
  } catch {}
  await route.continue({ postData: JSON.stringify({ ...data, _testcode: TESTCODE }) });
});

if (SITE_CMS && process.env.ALLEEN === "voorvertoning") {
  await voorvertoning();
  await browser.close();
  console.log(`\n${ok} geslaagd, ${fout} mislukt`);
  process.exit(fout ? 1 : 0);
}

console.log("Routes, verplichte promotie-elementen en links");
const links = new Set();
for (const r of ROUTES) {
  const res = await page.goto(SITE + r, { waitUntil: "load" });
  const info = await page.evaluate(() => ({
    navCms: !!document.querySelector('.primary-nav a[href="/one"]'),
    footerCms: [...document.querySelectorAll(".footer-one-promo a")].some(
      (a) =>
        a.textContent.includes("Ontdek het CMS") &&
        a.getAttribute("href") === "/one",
    ),
    fab: document
      .querySelector(".demo-fab")
      ?.textContent.includes("Bekijk het CMS-ontwerp"),
    links: [...document.querySelectorAll('a[href^="/"]')].map((a) =>
      a.getAttribute("href"),
    ),
  }));
  info.links.forEach((l) => links.add(l.split("#")[0]));
  check(
    `${r} → 200, Het CMS in nav, Ontdek het CMS in footer, zwevende knop`,
    res.status() === 200 && info.navCms && info.footerCms && info.fab,
  );
}
let dood = [];
for (const l of links) {
  const s = (await page.request.get(SITE + l)).status();
  if (s !== 200) dood.push(`${l} (${s})`);
}
check(
  `geen dode interne links (${links.size} gecontroleerd)`,
  dood.length === 0,
  dood.join(", "),
);
check(
  "onbekende case geeft 404",
  (await page.request.get(SITE + "/work/bestaat-niet")).status() === 404,
);

console.log("Verkoopflow homepage → CMS → tour → blokken → aanvraag");
await page.goto(SITE + "/", { waitUntil: "load" });
await page
  .getByRole("link", { name: /Ontdek het CMS/ })
  .first()
  .click();
await page.waitForURL("**/one");
check("homepage-hero → /one", page.url().endsWith("/one"));
await page.getByRole("link", { name: /Start de rondleiding/ }).first().click();
await page.waitForURL("**/demo");
await page.getByRole("button", { name: /Start op de homepage/ }).click();
await page.waitForURL(SITE + "/");
check(
  "tour start op de homepage (stap 1)",
  (await page.locator(".tour-bar").textContent()).includes("STAP 1 / 7"),
);
await page.getByRole("button", { name: /Volgende/ }).click();
await page.waitForTimeout(200);
check(
  "stap 2 zet de CMS-bloklabels aan",
  await page.evaluate(() => document.body.classList.contains("demo-active")),
);
const label = await page.evaluate(
  () =>
    getComputedStyle(document.querySelector("[data-cms]"), "::before").content,
);
check("bloklabel toont de bloknaam", label.includes("Header (hero)"), label);
await page.getByRole("button", { name: /Volgende/ }).click();
await page.waitForURL("**/work");
check("stap 3 → /work", page.url().endsWith("/work"));
for (let i = 0; i < 3; i++)
  await page
    .getByRole("button", { name: /Volgende/ })
    .click()
    .then(() => page.waitForTimeout(400));
check(
  "stap 6 opent de mobiele weergave",
  (await page.locator(".mobile-preview iframe").count()) === 1,
);
await page.keyboard.press("Escape");
await page.getByRole("button", { name: /Volgende/ }).click();
await page.waitForURL("**/one#aanvraag");
check(
  "laatste stap → aanvraagformulier op /one",
  page.url().endsWith("/one#aanvraag") &&
    (await page.locator("#aanvraag form").count()) === 1,
);
await page.getByRole("button", { name: "Rondleiding sluiten" }).click();

console.log("Demo Mode-paneel");
await page.getByRole("button", { name: "Open demonstratiemodus" }).click();
check("paneel opent", await page.locator("#demoPanel.open").isVisible());
check(
  "databron zichtbaar gelabeld (CMS, Supabase of Demodata)",
  /CMS · live|Supabase · live|Demodata/.test(
    await page.locator(".demo-bron").textContent(),
  ),
);
await page.getByRole("button", { name: "Roze" }).click();
check(
  "accentkleur wisselt",
  (await page.evaluate(() =>
    document.documentElement.style.getPropertyValue("--lime"),
  )) === "#F4A5C7",
);
await page.keyboard.press("Escape");
check(
  "Escape sluit het paneel",
  !(await page.locator("#demoPanel.open").count()),
);

console.log("Interactie");
await page.goto(SITE + "/work", { waitUntil: "load" });
await page.getByRole("button", { name: "ontwerp", exact: true }).click();
check(
  'werkfilter "ontwerp" toont 1 project',
  (await page.locator("#projects > div").count()) === 1,
);
await page.goto(SITE + "/lab", { waitUntil: "load" });
await page.locator("#lab-people").fill("50");
check(
  "configurator: 50 personen → € 1.150",
  (await page.locator("#lab-price").textContent()).includes("1.150"),
);
await page.getByRole("button", { name: /Wissel tekstvariant/ }).click();
check(
  "A/B-test wisselt tekst",
  (await page.locator("#ab-text").textContent()) ===
    "Geef jouw volgende idee een vliegende start.",
);
await page.goto(SITE + "/contact", { waitUntil: "load" });
await page.getByRole("button", { name: /Verstuur mijn bericht/ }).click();
check(
  "contact: lege inzending → foutstaat",
  (await page.locator(".form-status.fout").count()) === 1 &&
    (await page.locator('[aria-invalid="true"]').count()) >= 3,
);
await page.fill("#first-name", "Sam");
await page.fill("#email", "sam@voorbeeld.nl");
await page.fill("#message", "E2E-test — mag verwijderd worden");
await page.selectOption("#interest", "Een project");
await page.check("#contact-akkoord");
await page.waitForTimeout(2100); // spamfilter: inzendingen binnen 2 s gelden als bot
await page.getByRole("button", { name: /Verstuur mijn bericht/ }).click();
await page.waitForFunction(() =>
  /bevestigingsweergave|opgeslagen/.test(
    document.querySelector(".form-status.ok")?.textContent ?? "",
  ),
);
const contactTekst = await page.locator(".form-status.ok").textContent();
check(
  "contact: opgeslagen in Supabase of eerlijke demostatus, nooit 'verzonden'",
  /opgeslagen|bevestigingsweergave/.test(contactTekst) && !/verzonden(?! omdat)/.test(contactTekst),
  contactTekst,
);
// NOVA Lab: formulierbouwer (foutmeldingen + opslaan), review en NPS
await page.goto(SITE + "/lab", { waitUntil: "load" });
await page.getByRole("button", { name: /Verstuur het formulier/ }).click();
check(
  "formulierbouwer: leeg versturen toont foutmeldingen per verplicht veld",
  (await page.locator('[aria-invalid="true"]').count()) >= 3,
  String(await page.locator('[aria-invalid="true"]').count()),
);
await page.getByLabel("Naam *", { exact: true }).first().fill("E2E-test");
await page.getByLabel("Soort bijeenkomst *").selectOption("Workshop");
await page.getByLabel("Wat wil je bereiken? *").fill("E2E-test — mag verwijderd worden");
await page.getByLabel("Telefoonnummer").fill("12");
await page.getByRole("button", { name: /Verstuur het formulier/ }).click();
check(
  "formulierbouwer: ongeldig telefoonnummer wordt geweigerd",
  await page.getByText("Vul een geldig telefoonnummer in.").isVisible(),
);
await page.getByLabel("Telefoonnummer").fill("+31 20 123 4567");
await page.getByRole("button", { name: /Verstuur het formulier/ }).click();
const fbOk = await page
  .locator(".form-status.ok", { hasText: /antwoorden zijn opgeslagen|Demonstratie/ })
  .waitFor({ timeout: 10000 })
  .then(() => true, () => false);
check("formulierbouwer: geldige inzending wordt opgeslagen", fbOk);
await page.getByRole("button", { name: /Plaats mijn review/ }).click();
check("review: zonder sterren een foutmelding", await page.getByText("Kies een aantal sterren van 1 tot 5.").first().isVisible());
await page.getByRole("radio", { name: "4 sterren" }).click();
await page.fill("#r-naam", "E2E-test");
await page.fill("#r-tekst", "E2E-test — mag verwijderd worden");
await page.check("#r-akkoord");
await page.getByRole("button", { name: /Plaats mijn review/ }).click();
const revOk = await page
  .locator(".form-status.ok", { hasText: /review! Hij is opgeslagen|Demonstratie/ })
  .waitFor({ timeout: 10000 })
  .then(() => true, () => false);
check("review: sterren, naam en tekst worden opgeslagen", revOk);
await page.getByRole("button", { name: /Geef mijn score door/ }).click();
check("NPS: zonder score een foutmelding", await page.getByText("Kies eerst een score van 0 tot 10.").isVisible());
await page.getByRole("radio", { name: "9", exact: true }).click();
await page.fill("#nps-waarom", "E2E-test");
await page.getByRole("button", { name: /Geef mijn score door/ }).click();
const npsOk = await page
  .locator(".form-status.ok", { hasText: /score is opgeslagen|Demonstratie/ })
  .waitFor({ timeout: 10000 })
  .then(() => true, () => false);
check("NPS: score en toelichting worden opgeslagen", npsOk);

// Blokkenverkenner: de preview is het echte NOVA-blok en volgt de gekozen variant
await page.goto(SITE + "/playground", { waitUntil: "load" });
await page.getByLabel("Kies variant").selectOption("achtergrondbeeld");
check(
  "blokkenverkenner: header 'achtergrondbeeld' toont de echte achtergrondhero",
  (await page.locator(".pv-frame .feature-media").count()) === 1,
);
await page.getByLabel("Kies variant").selectOption("beeld links");
check("blokkenverkenner: header 'beeld links' toont beeld links", (await page.locator(".pv-frame .hero-split").count()) === 1);
await page.locator(".block-list button", { hasText: "Artikelen" }).first().click();
check("blokkenverkenner: Artikelen toont echte artikelkaarten", (await page.locator(".pv-frame .article-card").count()) >= 3);
await page.locator(".block-list button", { hasText: "Kaartenrij" }).first().click();
await page.getByLabel("Kies variant").selectOption("4 kolommen");
check("blokkenverkenner: Kaartenrij '4 kolommen' toont vier kaarten", (await page.locator(".pv-frame .info-tile").count()) === 4);

await page.locator(".block-list button", { hasText: "Formulierbouwer" }).first().click();
check(
  "blokkenverkenner: formulierbouwer opent op ware grootte met voorbeeldopstellingen",
  (await page.locator(".pv-frame.ware-grootte").count()) === 1 &&
    (await page.getByLabel("Kies variant").locator("option", { hasText: "Offerteaanvraag" }).count()) === 1,
);
await page.getByLabel("Kies variant").selectOption("Offerteaanvraag");
await page.locator(".pv-frame").getByRole("button", { name: /Vraag een offerte aan/ }).click();
check(
  "blokkenverkenner: leeg versturen toont foutmeldingen in de preview",
  (await page.locator('.pv-frame [aria-invalid="true"]').count()) >= 4,
);
await page.locator(".block-list button", { hasText: "Review verzamelen" }).first().click();
check("blokkenverkenner: reviewformulier met sterren", (await page.locator(".pv-frame .sterren-rij button").count()) === 5);

// Homepage: videoblok uit het CMS (Header met media_type video)
await page.goto(SITE + "/", { waitUntil: "load" });
const video = await page.evaluate(() => {
  const v = document.querySelector(".met-video video");
  return v ? { bronnen: [...v.querySelectorAll("source")].map((s) => s.getAttribute("src")), muted: v.muted, h1: document.querySelectorAll("h1").length } : null;
});
check(
  "homepage: videoblok met desktop- en mobiele video, zonder geluid, één h1",
  !!video && video.bronnen.some((b) => b.startsWith("/media/nova-film-liggend.mp4")) && video.bronnen.some((b) => b.startsWith("/media/nova-film-staand.mp4")) && video.muted && video.h1 === 1,
  JSON.stringify(video),
);
check("homepage: video is te pauzeren", (await page.getByRole("button", { name: /Pauzeer video|Speel video af/ }).count()) === 1);

await page.goto(SITE + "/experiences", { waitUntil: "load" });
await page
  .getByRole("button", { name: /Bekijk tickets/ })
  .first()
  .click();
check(
  "tickets: geen betaling, zichtbare demostatus",
  await page.getByText("Er vindt geen betaling plaats").first().isVisible(),
);

async function aanvraag(basis) {
  await page.goto(basis + "/one#aanvraag", { waitUntil: "load" });
  await page.fill("#a-naam", "Test Persoon");
  await page.fill("#a-email", "test@voorbeeld.nl");
  await page.fill("#a-bedrijf", "E2E-test");
  await page.selectOption("#a-type", "Eventwebsite");
  await page.fill("#a-vraag", "Demo graag");
  await page.check("#a-akkoord");
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: /Vraag mijn demo aan/ }).click();
  await page.waitForFunction(
    () =>
      document.querySelector("#aanvraag .form-status")?.textContent.trim()
        .length > 0,
  );
  return page.locator("#aanvraag .form-status").last().textContent();
}
const aanvraagTekst = await aanvraag(SITE);
check(
  'aanvraag zonder CMS → opgeslagen in Supabase of eerlijk "níet verzonden"',
  /Zo ziet de bevestiging eruit|opgeslagen in de NOVA-demodatabase/.test(
    aanvraagTekst,
  ),
  aanvraagTekst,
);

console.log("Mobiel menu (390px)");
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(SITE + "/", { waitUntil: "load" });
await m.getByRole("button", { name: "Open het menu" }).click();
check(
  "menu opent met Het CMS en Block Playground",
  (await m.locator("#mobile").isVisible()) &&
    (await m.locator('#mobile a[href="/playground"]').count()) === 1,
);
await m.keyboard.press("Escape");
check("Escape sluit het menu", !(await m.locator("#mobile").isVisible()));
await m.close();

console.log("Toegankelijkheid (axe-core, WCAG 2 A/AA)");
const axeRes = [];
for (const r of ROUTES) {
  await page.goto(SITE + r, { waitUntil: "load" });
  await page.waitForTimeout(600); // .page fade-in (opacity .7 → 1) eerst laten aflopen
  await page.addScriptTag({ path: AXE });
  const v = await page.evaluate(async () =>
    (
      await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa"] })
    ).violations.map((x) => ({
      id: x.id,
      impact: x.impact,
      n: x.nodes.length,
    })),
  );
  axeRes.push({ route: r, v });
}
const ernstig = axeRes.flatMap((x) =>
  x.v
    .filter((v) => ["serious", "critical"].includes(v.impact))
    .map((v) => `${x.route}:${v.id}(${v.n})`),
);
check(
  "geen ernstige/kritieke WCAG-schendingen",
  ernstig.length === 0,
  ernstig.join(" "),
);
fs.writeFileSync(
  process.env.AXE_OUT ?? "/dev/null",
  JSON.stringify(axeRes, null, 2),
);


// "Voorbeeld op de site" (protocol linkandlead-cms UX-002): /__voorvertoning?pad=/x&token=…
async function voorvertoning() {
  const MOCK = process.env.MOCK_CMS ?? "http://localhost:4000";
  console.log("Voorbeeld op de site (/__voorvertoning, nep-CMS)");
  const token = await (await fetch(`${MOCK}/test/voorvertoningstoken`)).text();
  const ongeldig = `${Math.floor(Date.now() / 1000) + 1800}.${"0".repeat(64)}`;
  const vv = (pad, t) => `${SITE_CMS}/__voorvertoning?pad=${encodeURIComponent(pad)}&token=${encodeURIComponent(t)}`;

  // Ondersteuningscontrole van het CMS: GET ?pad=/ met geldig token, redirects volgen, zonder cookies → 2xx.
  const controle = await fetch(vv("/", token));
  check("ondersteuningscontrole van het CMS krijgt 200", controle.status === 200, `status ${controle.status}`);

  const los = await fetch(vv("/", token), { redirect: "manual" });
  const cookie = los.headers.getSetCookie().join("; ");
  check(
    "geldig token: 307 naar het pad, draft mode + tokencookie, no-store en noindex",
    los.status === 307 &&
      new URL(los.headers.get("location")).pathname === "/" &&
      cookie.includes("__prerender_bypass=") &&
      cookie.includes("nova_voorvertoning=") &&
      /httponly/i.test(cookie) &&
      (los.headers.get("cache-control") ?? "").includes("no-store") &&
      (los.headers.get("x-robots-tag") ?? "").includes("noindex"),
  );
  const weg = await fetch(vv("//evil.example/x", token), { redirect: "manual" });
  check(
    "geen open redirect: //andere-host gaat naar / op de site zelf",
    weg.status === 307 && new URL(weg.headers.get("location")).origin === new URL(SITE_CMS).origin && !weg.headers.getSetCookie().join().includes("__prerender_bypass="),
  );
  const slecht = await fetch(vv("/", ongeldig), { redirect: "manual" });
  check(
    "ongeldig token geweigerd: geen draft mode, door naar de gepubliceerde pagina (geen 404)",
    slecht.status === 307 && !slecht.headers.getSetCookie().join().includes("__prerender_bypass=") && (slecht.headers.get("cache-control") ?? "").includes("no-store"),
  );

  const vctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const vp = await vctx.newPage();
  await vp.goto(vv("/", ongeldig), { waitUntil: "load" });
  check(
    "ongeldig token in de browser: gepubliceerde inhoud, geen balk",
    (await vp.locator("h1").first().textContent()).includes("Bewerkt") && (await vp.locator(".voorbeeld-balk").count()) === 0,
  );

  const res = await vp.goto(vv("/", token), { waitUntil: "load" });
  check("geldig token: concept zichtbaar", (await vp.locator("h1").first().textContent()).includes("Concept"));
  check(
    'balk "Voorbeeld van het concept" met "Voorbeeld sluiten"',
    (await vp.locator(".voorbeeld-balk").textContent()).includes("Voorbeeld van het concept") &&
      (await vp.getByRole("link", { name: "Voorbeeld sluiten" }).count()) === 1,
  );
  const koppen = res.headers();
  check(
    "conceptpagina: no-store en noindex",
    (koppen["cache-control"] ?? "").includes("no-store") &&
      (koppen["x-robots-tag"] ?? "").includes("noindex") &&
      (await vp.locator('meta[name="robots"]').getAttribute("content")).includes("noindex"),
  );
  await vp.getByRole("link", { name: "Voorbeeld sluiten" }).click();
  await vp.waitForLoadState("load");
  check(
    "na sluiten: gepubliceerde inhoud, geen balk, geen draft-cookie",
    (await vp.locator("h1").first().textContent()).includes("Bewerkt") &&
      (await vp.locator(".voorbeeld-balk").count()) === 0 &&
      !(await vctx.cookies()).some((c) => c.name === "__prerender_bypass" || c.name === "nova_voorvertoning"),
  );
  await vctx.close();

  const gewoon = await fetch(`${SITE_CMS}/`);
  const html = await gewoon.text();
  check(
    "zonder draft mode: gepubliceerde inhoud, geen balk, geen X-Robots-Tag van de proxy",
    html.includes("Bewerkt") && !html.includes("Concept") && !html.includes("voorbeeld-balk") && !gewoon.headers.get("x-robots-tag"),
  );
}

if (SITE_CMS) {
  console.log("Met CMS-koppeling (nep-CMS met het echte contract)");
  await voorvertoning();
  await page.goto(SITE_CMS + "/", { waitUntil: "load" });
  check(
    "hero-tekst komt uit het CMS",
    (await page.locator("h1").textContent()).includes("Bewerkt"),
  );
  check(
    "cases uit CMS-records",
    (await page.locator(".portfolio-grid").textContent()).includes(
      "Case Uit CMS",
    ),
  );
  await page.getByRole("button", { name: "Open demonstratiemodus" }).click();
  check(
    'paneel meldt "CMS · live" en toont beheerlink',
    (await page.locator(".demo-bron").textContent()).includes("CMS · live") &&
      (
        await page
          .getByRole("link", { name: /Open CMS-beheer/ })
          .getAttribute("href")
      ).endsWith("/admin/paginas"),
  );
  const voor = fs.existsSync(process.env.LEADS_LOG)
    ? fs
        .readFileSync(process.env.LEADS_LOG, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean).length
    : 0;
  check(
    "aanvraag met configuratie → bevestiging",
    (await aanvraag(SITE_CMS)).startsWith(
      "Je aanvraag is ontvangen. We nemen contact",
    ),
  );
  const regels = fs
    .readFileSync(process.env.LEADS_LOG, "utf8")
    .trim()
    .split("\n");
  const lead = JSON.parse(regels[regels.length - 1]);
  check(
    "lead bereikt /api/cms/lead met site_id, herkomst en zonder Origin",
    regels.length === voor + 1 &&
      lead.body.site_id === "00000000-0000-4000-8000-000000000001" &&
      lead.body.herkomst === "nova-demo" &&
      lead.origin === null &&
      lead.body.email === "test@voorbeeld.nl",
  );
}

console.log("Opruimen");
{
  // Zelfde Supabase-project als de site (src/lib/supabase/server.ts); de publieke sleutel volstaat.
  const bron = fs.readFileSync(new URL("../src/lib/supabase/server.ts", import.meta.url), "utf8");
  const url = (process.env.SUPABASE_URL ?? bron.match(/STANDAARD_URL = "([^"]+)"/)?.[1] ?? "").trim();
  const key = (process.env.SUPABASE_PUBLISHABLE_KEY ?? bron.match(/STANDAARD_KEY = "([^"]+)"/)?.[1] ?? "").trim();
  if (!url || !key) console.log("  – geen Supabase ingesteld, niets op te ruimen");
  else {
    const res = await fetch(`${url}/rest/v1/rpc/ruim_testinzendingen_op`, {
      method: "POST",
      headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ code: TESTCODE }),
    });
    const aantal = res.ok ? await res.json() : null;
    check("testinzendingen opgeruimd", res.ok, `status ${res.status}`);
    if (res.ok) console.log(`    ${aantal} testinzending(en) verwijderd`);
  }
}

await browser.close();
console.log(`\n${ok} geslaagd, ${fout} mislukt`);
process.exit(fout ? 1 : 0);
