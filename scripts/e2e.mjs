// End-to-end-controle van NOVA (Playwright, globaal geïnstalleerd) + axe-core toegankelijkheid.
//   SITE=http://localhost:3000 [SITE_CMS=http://localhost:3001 LEADS_LOG=... MOCK_CMS=http://localhost:4000] node scripts/e2e.mjs
//   Alleen de voorvertoning (geen formulieren, geen Supabase): ALLEEN=voorvertoning SITE_CMS=… MOCK_CMS=…
//   Alleen bewerken en opslaan (B-090, geen Supabase):          ALLEEN=bewerken SITE_CMS=… MOCK_CMS=…
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

if (SITE_CMS && process.env.ALLEEN === "bewerken") {
  await bewerken();
  await browser.close();
  console.log(`\n${ok} geslaagd, ${fout} mislukt`);
  process.exit(fout ? 1 : 0);
}

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

// Blokkenverkenner: een andere variant verandert de preview zichtbaar
await page.goto(SITE + "/playground", { waitUntil: "load" });
const klasVoor = await page.locator(".block-preview").getAttribute("class");
await page.getByLabel("Kies variant").selectOption("achtergrondbeeld");
const klasNa = await page.locator(".block-preview").getAttribute("class");
check("blokkenverkenner: variant 'achtergrondbeeld' verandert de preview", klasVoor !== klasNa && /v-achtergrond/.test(klasNa), klasNa);

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

// Bewerken op de site (linkandlead-cms B-090): bewerktoken in de voorvertoningslink → httpOnly-cookie →
// bewerkbalk bovenaan → tekst wijzigen → Opslaan via /api/cms-bewerken (eigen server) → concept in het nep-CMS.
async function bewerken() {
  const MOCK = process.env.MOCK_CMS ?? "http://localhost:4000";
  console.log("Bewerken en opslaan (bewerkbalk, /api/cms-bewerken, nep-CMS)");
  const token = await (await fetch(`${MOCK}/test/voorvertoningstoken`)).text();
  const bt = await (await fetch(`${MOCK}/test/bewerktoken?pad=/`)).text();
  const link = `${SITE_CMS}/__voorvertoning?pad=%2F&token=${encodeURIComponent(token)}&bewerken=${encodeURIComponent(bt)}`;

  const los = await fetch(link, { redirect: "manual" });
  const koek = los.headers.getSetCookie().find((c) => c.startsWith("nova_bewerken=")) ?? "";
  check("bewerktoken in een httpOnly-, SameSite=Lax-cookie; niet in de doorverwijzing", /httponly/i.test(koek) && /samesite=lax/i.test(koek) && !(los.headers.get("location") ?? "").includes("bewerken"));
  const zonder = await fetch(`${SITE_CMS}/__voorvertoning?pad=%2F&token=${encodeURIComponent(token)}&bewerken=vervalst`, { redirect: "manual" });
  check("een bewerktoken met een verkeerde vorm wordt niet bewaard", !zonder.headers.getSetCookie().some((c) => c.startsWith("nova_bewerken=") && !/max-age=0|expires=thu, 01 jan 1970/i.test(c)));

  const bctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const bp = await bctx.newPage();
  await bp.goto(link, { waitUntil: "load" });
  await bp.waitForSelector(".bewerk-balk");
  const balk = bp.locator(".bewerk-balk");
  check('bewerkbalk bovenaan: "Je bewerkt deze pagina live"', (await balk.textContent()).includes("Je bewerkt deze pagina live") && (await balk.boundingBox()).y === 0);
  check(
    "knoppen Opslaan, Openen in de editor en Stoppen; status in een live-regio",
    (await bp.getByRole("button", { name: "Opslaan" }).count()) === 1 &&
      (await bp.getByRole("link", { name: "Openen in de editor" }).count()) === 1 &&
      (await bp.getByRole("link", { name: "Stoppen" }).count()) === 1 &&
      (await bp.locator('.bewerk-status[aria-live="polite"]').count()) === 1,
  );
  check("de balk 'Voorbeeld van het concept' valt weg", !(await bp.locator(".voorbeeld-balk").isVisible().catch(() => false)));
  await bp.waitForFunction(() => document.querySelectorAll("[data-cms-veld]").length > 0);
  const titel = bp.locator('[data-cms-veld="titel"]', { hasText: "Titel uit Tekst met beeld." });
  check("platte tekstvelden zijn bewerkbaar (contenteditable, data-cms-veld)", (await titel.count()) === 1 && ["plaintext-only", "true"].includes(await titel.getAttribute("contenteditable")));
  check("geen token in de HTML", !(await bp.content()).includes(bt));

  // Bezoeker: geen balk, geen bewerkattributen.
  const bezoeker = await (await fetch(`${SITE_CMS}/`)).text();
  check("bezoeker: geen bewerkbalk, geen data-cms-veld of -sectie", !bezoeker.includes("bewerk-balk") && !bezoeker.includes("data-cms-veld") && !bezoeker.includes("data-cms-sectie"));

  await titel.click();
  await bp.keyboard.press("ControlOrMeta+A");
  await bp.keyboard.type("Nieuwe titel vanaf de site.");
  await bp.waitForFunction(() => document.querySelector(".bewerk-status")?.textContent?.includes("niet opgeslagen"));
  check("status: wijziging niet opgeslagen", (await bp.locator(".bewerk-status").textContent()).includes("1 wijziging niet opgeslagen"));
  await bp.getByRole("button", { name: "Opslaan" }).click();
  await bp.waitForFunction(() => document.querySelector(".bewerk-status")?.textContent?.includes("Alle wijzigingen opgeslagen"));
  const opgeslagen = await (await fetch(`${MOCK}/test/bewerkingen`)).json();
  const laatste = opgeslagen.at(-1);
  check("opgeslagen als concept in het CMS (via de server van de site)", laatste?.waarde === "Nieuwe titel vanaf de site." && laatste?.pagina === "/" && laatste?.pad?.join(".") === "titel");
  await bp.reload({ waitUntil: "load" });
  await bp.waitForSelector(".bewerk-balk");
  check("na herladen staat het concept er", (await bp.locator("main").textContent()).includes("Nieuwe titel vanaf de site."));

  // CSRF en browserweigering.
  const verzoek = { pagina: "/", sectie: laatste?.sectie, pad: ["titel"], waarde: "Kwaad", versie: laatste?.versie };
  const cookie = (await bctx.cookies()).map((c) => `${c.name}=${c.value}`).join("; ");
  const kwaad = await fetch(`${SITE_CMS}/api/cms-bewerken`, { method: "POST", headers: { "content-type": "application/json", origin: "https://evil.example", cookie }, body: JSON.stringify(verzoek) });
  check("/api/cms-bewerken weigert een andere Origin (CSRF)", kwaad.status === 403);
  const geenOrigin = await fetch(`${SITE_CMS}/api/cms-bewerken`, { method: "POST", headers: { "content-type": "application/json", cookie }, body: JSON.stringify(verzoek) });
  check("/api/cms-bewerken weigert een verzoek zonder Origin", geenOrigin.status === 403);
  const zonderCookie = await fetch(`${SITE_CMS}/api/cms-bewerken`, { method: "POST", headers: { "content-type": "application/json", origin: new URL(SITE_CMS).origin }, body: JSON.stringify(verzoek) });
  check("/api/cms-bewerken zonder bewerkcookie: 401", zonderCookie.status === 401);
  const rechtstreeks = await fetch(`${MOCK}/api/v1/live-bewerken`, { method: "POST", headers: { "content-type": "application/json", origin: new URL(SITE_CMS).origin }, body: JSON.stringify({ ...verzoek, bewerktoken: bt }) });
  check("het CMS weigert een browserverzoek (Origin) zonder CORS-headers", rechtstreeks.status === 403 && !rechtstreeks.headers.get("access-control-allow-origin"));
  check("na de weigeringen is er niets extra opgeslagen", (await (await fetch(`${MOCK}/test/bewerkingen`)).json()).length === opgeslagen.length);

  // Conflict: iemand anders bewaart intussen dezelfde sectie (server-naar-server, met de nieuwste versie).
  const ander = await fetch(`${MOCK}/api/v1/live-bewerken`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.MOCK_TOKEN ?? "cms_test"}` },
    body: JSON.stringify({ ...verzoek, waarde: "Titel van iemand anders.", bewerktoken: bt }),
  });
  check("(voorbereiding) een andere bewerker bewaart dezelfde sectie", ander.status === 200);
  const veld = bp.locator('[data-cms-veld="titel"]', { hasText: "Nieuwe titel vanaf de site." });
  await veld.click();
  await bp.keyboard.press("End");
  await bp.keyboard.type(" Nog meer.");
  await bp.getByRole("button", { name: "Opslaan" }).click();
  await bp.waitForSelector(".bewerk-melding.conflict");
  check("conflict (409): duidelijke melding met de keuze Herladen", (await bp.locator(".bewerk-melding").textContent()).includes("Iemand anders") && (await bp.getByRole("button", { name: "Herladen" }).count()) === 1);
  await bp.getByRole("button", { name: "Herladen" }).click();
  await bp.waitForLoadState("load");
  await bp.waitForSelector(".bewerk-balk");
  check("na Herladen de nieuwste versie", (await bp.locator("main").textContent()).includes("Titel van iemand anders."));

  // Axe op de balk.
  await bp.addScriptTag({ path: AXE });
  const v = await bp.evaluate(async () => (await window.axe.run(".bewerk-balk", { runOnly: ["wcag2a", "wcag2aa"] })).violations.map((x) => x.id));
  check("bewerkbalk zonder axe-fouten (WCAG 2 A/AA)", v.length === 0, v.join(", "));

  // Mobiel: de balk past en dekt de kop niet af.
  await bp.setViewportSize({ width: 390, height: 844 });
  const mb = await balk.boundingBox();
  const kop = await bp.locator(".site-header").boundingBox();
  check("mobiel: balk bovenaan, kop eronder", mb.y === 0 && kop.y >= mb.height - 1, `balk ${mb.height}, kop ${kop.y}`);
  await bp.setViewportSize({ width: 1440, height: 900 });

  await bp.getByRole("link", { name: "Stoppen" }).click();
  await bp.waitForLoadState("load");
  check(
    "Stoppen: geen balk, geen draft-, voorvertonings- of bewerkcookie",
    (await bp.locator(".bewerk-balk").count()) === 0 &&
      !(await bctx.cookies()).some((c) => ["__prerender_bypass", "nova_voorvertoning", "nova_bewerken"].includes(c.name)),
  );
  await bctx.close();
}

if (SITE_CMS) {
  console.log("Met CMS-koppeling (nep-CMS met het echte contract)");
  await voorvertoning();
  await bewerken();
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
