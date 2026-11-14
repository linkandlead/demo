// Nep-CMS voor lokale tests van de koppeling. Volgt exact het contract van linkandlead-cms:
//   GET  /api/cms/content  (Bearer-token, respons zoals src/routes/api/cms/content.ts)
//   POST /api/cms/lead     (body zoals src/routes/api/cms/lead.ts; schrijft naar LEADS_LOG)
//   GET  /api/v1/pagina?pad=/x&voorvertoning=<token>  (zoals src/routes/api/v1/pagina.ts: met een
//        geldig token het concept, `concept: true`; anders de gepubliceerde pagina, `concept: false`)
//   GET  /test/voorvertoningstoken  maakt een token zoals src/core/auth/voorvertoning.ts (alleen hier,
//        voor de e2e; het echte CMS maakt tokens alleen in het beheer)
// Raakt geen echte database en verstuurt niets.
//   PORT=4000 TOKEN=cms_test LEADS_LOG=./leads.jsonl node scripts/mock-cms.mjs
import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";

const PORT = Number(process.env.PORT ?? 4000);
const TOKEN = process.env.TOKEN ?? "cms_test";
const LOG = process.env.LEADS_LOG ?? "./mock-leads.jsonl";
// Nepgeheim en nep-site-id: alleen voor dit nep-CMS.
const GEHEIM = "nep-voorvertoningsgeheim-alleen-voor-tests";
const SITE_ID = "00000000-0000-4000-8000-0000000000aa";

const hmac = (data) => crypto.createHmac("sha256", GEHEIM).update(data).digest("hex");
function maakToken(minuten = 30) {
  const verloopt = Math.floor(Date.now() / 1000) + minuten * 60;
  return `${verloopt}.${hmac(`${SITE_ID}.${verloopt}`)}`;
}
function tokenGeldig(token) {
  const [v, sig] = String(token ?? "").split(".");
  const verloopt = Number(v);
  if (!sig || !Number.isFinite(verloopt) || verloopt < Math.floor(Date.now() / 1000)) return false;
  const verwacht = hmac(`${SITE_ID}.${verloopt}`);
  return sig.length === verwacht.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(verwacht));
}

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

// Het concept: dezelfde homepage met een andere hero (content_concept in het CMS).
const conceptBlokken = (blokken) =>
  blokken.map((b, i) =>
    i === 0 ? { ...b, content: { ...b.content, heading: "Concept\nuit het\nCMS.", subheading: "Nog niet gepubliceerd." } } : b,
  );

function paginaV1(pad, concept) {
  const p = content.paginas.find((x) => x.slug === pad);
  if (!p) return null;
  return {
    versie: "v1",
    taal: "nl",
    concept,
    pagina: {
      slug: p.slug,
      titel: p.titel,
      beschrijving: p.beschrijving,
      type: "pagina",
      seo: { titel: p.titel, beschrijving: p.beschrijving, social_beeld: null, canonical: null, noindex: concept },
      blokken: (concept ? conceptBlokken(p.blokken) : p.blokken).map((b, i) => ({
        id: `blok-${i}`,
        type: b.type,
        bg: b.bg,
        gedeeld: null,
        inhoud: b.content,
      })),
      record: null,
      records: {},
    },
  };
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    if (req.method === "GET" && url.pathname === "/test/voorvertoningstoken") {
      res.writeHead(200, { "content-type": "text/plain" });
      return res.end(maakToken(Number(url.searchParams.get("minuten") ?? 30)));
    }
    if (req.method === "GET" && url.pathname === "/api/v1/pagina") {
      if (req.headers.authorization !== `Bearer ${TOKEN}`) {
        res.writeHead(401, { "content-type": "application/json", "cache-control": "no-store" });
        return res.end(JSON.stringify({ ok: false, melding: "Ongeldig of ontbrekend API-token." }));
      }
      const pad = url.searchParams.get("pad") || "/";
      const concept = tokenGeldig(url.searchParams.get("voorvertoning"));
      const body = paginaV1(pad, concept);
      if (!body) {
        res.writeHead(404, { "content-type": "application/json", "cache-control": "no-store" });
        return res.end(JSON.stringify({ ok: false, melding: "Pagina niet gevonden." }));
      }
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": concept ? "no-store" : "public, max-age=60, stale-while-revalidate=600",
      });
      return res.end(JSON.stringify(body));
    }
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
