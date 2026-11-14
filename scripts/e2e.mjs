// End-to-end-controle van NOVA (Playwright, globaal geïnstalleerd) + axe-core toegankelijkheid.
//   SITE=http://localhost:3000 [SITE_CMS=http://localhost:3001 LEADS_LOG=...] node scripts/e2e.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
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
await page.getByRole("link", { name: /Start de rondleiding/ }).click();
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
  "databron zichtbaar gelabeld (Demodata of Supabase · live)",
  /Demodata|Supabase · live/.test(
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
  (await page.locator("#ab-text").textContent()) === "Laat morgen gebeuren.",
);
await page.goto(SITE + "/contact", { waitUntil: "load" });
await page.getByRole("button", { name: /Verstuur je bericht/ }).click();
check(
  "contact: lege inzending → foutstaat",
  (await page.locator(".form-status.fout").count()) === 1 &&
    (await page.locator('[aria-invalid="true"]').count()) >= 3,
);
await page.fill("#first-name", "Sam");
await page.fill("#email", "sam@voorbeeld.nl");
await page.fill("#message", "E2E-test — mag verwijderd worden");
await page.waitForTimeout(2100); // spamfilter: inzendingen binnen 2 s gelden als bot
await page.getByRole("button", { name: /Verstuur je bericht/ }).click();
await page.waitForFunction(() =>
  /Demonstratie|opgeslagen/.test(
    document.querySelector(".form-status.ok")?.textContent ?? "",
  ),
);
const contactTekst = await page.locator(".form-status.ok").textContent();
check(
  "contact: opgeslagen in Supabase of eerlijke demostatus, nooit 'verzonden'",
  /opgeslagen in de NOVA-demodatabase|Demonstratie: er is niets verstuurd/.test(
    contactTekst,
  ) && !/verzonden/.test(contactTekst),
  contactTekst,
);
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
  await page.fill("#a-vraag", "Demo graag");
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: /Vraag een demo aan/ }).click();
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
  /níet verzonden|opgeslagen in de NOVA-demodatabase/.test(aanvraagTekst),
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

if (SITE_CMS) {
  console.log("Met CMS-koppeling (nep-CMS met het echte contract)");
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
    (await aanvraag(SITE_CMS)).startsWith("Bedankt! Je aanvraag is ontvangen"),
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

await browser.close();
console.log(`\n${ok} geslaagd, ${fout} mislukt`);
process.exit(fout ? 1 : 0);
