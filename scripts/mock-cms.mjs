// Nep-CMS voor lokale tests van de koppeling. Volgt exact het contract van linkandlead-cms:
//   GET  /api/cms/content  (Bearer-token, respons zoals src/routes/api/cms/content.ts)
//   POST /api/cms/lead     (body zoals src/routes/api/cms/lead.ts; schrijft naar LEADS_LOG)
// Raakt geen echte database en verstuurt niets.
//   PORT=4000 TOKEN=cms_test LEADS_LOG=./leads.jsonl node scripts/mock-cms.mjs
import http from "node:http";
import fs from "node:fs";

const PORT = Number(process.env.PORT ?? 4000);
const TOKEN = process.env.TOKEN ?? "cms_test";
const LOG = process.env.LEADS_LOG ?? "./mock-leads.jsonl";

const content = {
  ok: true,
  site: {
    naam: "NOVA demo (test)",
    domein: "nova-demo.test",
    design_tokens: {},
    config: { merk: {} },
    merk: {},
    navigatie: {},
    redirects: [],
    locale: "nl",
  },
  paginas: [
    {
      slug: "/",
      titel: "Home",
      beschrijving: "",
      og_beeld: null,
      blokken: [
        {
          type: "header",
          bg: "nacht",
          content: {
            eyebrow: "UIT HET CMS",
            heading: "Bewerkt\nin het\nCMS.",
            subheading: "Deze tekst komt uit de lees-API.",
            cta_primair_label: "Bekijk werk",
            cta_primair_link: "/work",
          },
        },
        {
          type: "mediatekst",
          bg: "wit",
          content: {
            eyebrow: "CMS-EYEBROW",
            titel: "Titel uit Tekst met beeld.",
          },
        },
        {
          type: "statement",
          bg: "nacht",
          content: {
            eyebrow: "CMS-STATEMENT",
            titel: "Statement uit het CMS.",
          },
        },
        { type: "cases_grid", bg: "mist", content: {} },
        { type: "mensen", bg: "wit", content: {} },
        { type: "artikelen_grid", bg: "mist", content: {} },
        {
          type: "cta",
          bg: "nacht",
          content: {
            eyebrow: "GEDEELDE CTA",
            titel: "Oproep uit het CMS.",
            knoptekst: "Neem contact op",
            knop: "/contact",
          },
        },
      ],
    },
  ],
  records: {
    cases: [
      {
        id: 1,
        klantnaam: "Case Uit CMS",
        sector: "design",
        uitdaging: "Een case met een uitdaging uit het CMS.",
        foto: "/media/hero_arch.webp",
      },
      {
        id: 2,
        klantnaam: "Tweede Case",
        sector: "event",
        uitdaging: "Nog een case.",
        foto: null,
      },
    ],
    artikelen: [
      {
        id: 1,
        slug: "artikel-uit-cms",
        titel: "Artikel uit het CMS",
        rubriek: "insights",
        samenvatting: "Samenvatting uit het CMS.",
        hoofdtekst: "Eerste alinea.\n\nTweede alinea uit het CMS.",
        foto: null,
        gepubliceerd_op: "2026-11-01",
        auteur: null,
      },
    ],
    teamleden: [
      {
        id: 1,
        naam: "Teamlid Uit CMS",
        functie: "Redacteur",
        tekst: null,
        foto: null,
        linkedin: null,
      },
    ],
  },
  popups: [],
};

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    if (req.method === "GET" && url.pathname === "/api/cms/content") {
      if (req.headers.authorization !== `Bearer ${TOKEN}`) {
        res.writeHead(401, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({
            ok: false,
            melding: "Ongeldig of ontbrekend API-token.",
          }),
        );
      }
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify(content));
    }
    if (req.method === "POST" && url.pathname === "/api/cms/lead") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        fs.appendFileSync(
          LOG,
          JSON.stringify({
            origin: req.headers.origin ?? null,
            body: JSON.parse(body),
          }) + "\n",
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true, melding: "Bedankt!" }));
      });
      return;
    }
    res.writeHead(404).end();
  })
  .listen(PORT, () => console.log(`nep-CMS op :${PORT}`));
