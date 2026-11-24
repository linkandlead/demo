// Nep-CMS voor lokale tests van de koppeling. Volgt exact het contract van linkandlead-cms:
//   GET  /api/cms/content  (Bearer-token, respons zoals src/routes/api/cms/content.ts)
//   POST /api/cms/lead     (body zoals src/routes/api/cms/lead.ts; schrijft naar LEADS_LOG)
//   GET  /api/v1/pagina?pad=/x&voorvertoning=<token>  (zoals src/routes/api/v1/pagina.ts: met een
//        geldig token het concept, `concept: true`; anders de gepubliceerde pagina, `concept: false`)
//   GET  /test/voorvertoningstoken  maakt een token zoals src/core/auth/voorvertoning.ts (alleen hier,
//        voor de e2e; het echte CMS maakt tokens alleen in het beheer)
//   GET  /test/bewerktoken[?pad=/&minuten=30]  maakt een bewerktoken zoals src/core/auth/bewerktoken.ts (B-090)
//   POST /api/v1/live-bewerken  (zoals src/features/content/livebewerken-extern.ts: alleen server-naar-server,
//        leestoken + bewerktoken, versie per blok, 409 bij een conflict; bewaart in het concept van dit nep-CMS)
//   GET  /test/bewerkingen  de bewaarde wijzigingen (voor de e2e)
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
// Bewerktoken (B-090): "<verloopt>.<uitgegeven>.<gebruiker>.<sessie>.<pagina>.<hmac>".
const GEBRUIKER = "00000000-0000-4000-8000-0000000000c1";
const paginaId = (i) => `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;
const sectieId = (p, i) => `00000000-0000-4000-9000-${String(p * 100 + i + 1).padStart(12, "0")}`;
const bewerkTekst = (verloopt, uitgegeven, pagina) => `bewerken:frontend:${SITE_ID}.${GEBRUIKER}.${uitgegeven}.-.${pagina}.${verloopt}`;
function maakBewerktoken(pagina, minuten = 30) {
  const verloopt = Math.floor(Date.now() / 1000) + minuten * 60;
  const uitgegeven = Date.now();
  return `${verloopt}.${uitgegeven}.${GEBRUIKER}.-.${pagina}.${hmac(bewerkTekst(verloopt, uitgegeven, pagina))}`;
}
function leesBewerktoken(token) {
  const d = String(token ?? "").split(".");
  if (d.length !== 6 || Number(d[0]) < Math.floor(Date.now() / 1000)) return null;
  const verwacht = hmac(bewerkTekst(d[0], d[1], d[4]));
  return d[5].length === verwacht.length && crypto.timingSafeEqual(Buffer.from(d[5]), Buffer.from(verwacht)) ? { pagina: d[4] } : null;
}
// Platte tekstvelden die het echte CMS per bloktype als bewerkbaar meegeeft (registry: text/textarea).
const BEWERKBAAR = {
  header: { eyebrow: false, heading: false, subheading: true, cta_primair_label: false },
  mediatekst: { eyebrow: false, titel: false },
  statement: { eyebrow: false, titel: false },
  cta: { eyebrow: false, titel: false, knoptekst: false },
};
const BEGINVERSIE = "2026-11-01T08:00:00.000Z";
const versies = new Map(); // sectie-id → huidige versie
const conceptWijzigingen = new Map(); // sectie-id → { veld: waarde }
const bewerkingen = [];

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
    redirects: [{ van: "/oud-adres", naar: "/contact", status: 301 }],
    locale: "nl",
  },
  paginas: [
    {
      // Een pagina zonder eigen route in de site: komt via de route voor CMS-pagina's.
      slug: "/nieuwe-cms-pagina",
      titel: "Nieuwe CMS-pagina",
      beschrijving: "Een pagina die alleen in het CMS bestaat.",
      og_beeld: null,
      blokken: [{ type: "tekst", bg: "wit", content: { heading: "Alleen in het CMS", tekst: "Deze pagina heeft geen eigen route." } }],
    },
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
  const pi = content.paginas.findIndex((x) => x.slug === pad);
  const p = content.paginas[pi];
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
      blokken: (concept ? conceptBlokken(p.blokken) : p.blokken).map((b, i) => {
        const id = sectieId(pi, i);
        const inhoud = concept ? { ...b.content, ...(conceptWijzigingen.get(id) ?? {}) } : b.content;
        const velden = Object.entries(BEWERKBAAR[b.type] ?? {})
          .filter(([naam]) => typeof inhoud[naam] === "string" && inhoud[naam].trim())
          .map(([naam, meerdereRegels]) => ({ pad: [naam], label: naam, waarde: inhoud[naam], meerdereRegels }));
        return {
          id,
          type: b.type,
          bg: b.bg,
          gedeeld: null,
          inhoud,
          ...(concept && velden.length ? { bewerken: { versie: versies.get(id) ?? BEGINVERSIE, velden } } : {}),
        };
      }),
      record: null,
      records: {},
    },
  };
}

// Spiegelt POST /api/v1/live-bewerken van het CMS. Geen CORS-headers: alleen server-naar-server.
function liveBewerken(req, res) {
  const nee = (status, reden, melding) => {
    res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ ok: false, reden, melding, ...(status === 409 ? { conflict: true } : {}) }));
  };
  if (req.method !== "POST") return nee(405, "browser", "Alleen server-naar-server.");
  if (req.headers.origin || req.headers["sec-fetch-site"] || req.headers["sec-fetch-dest"]) return nee(403, "browser", "Alleen server-naar-server.");
  if (req.headers.authorization !== `Bearer ${TOKEN}`) return nee(401, "leestoken", "Ongeldig of ontbrekend API-token.");
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    let b;
    try {
      b = JSON.parse(body);
    } catch {
      return nee(400, "ongeldig", "Ongeldige JSON.");
    }
    const sessie = leesBewerktoken(b.bewerktoken);
    if (!sessie) return nee(401, "bewerktoken", "Je bent niet (meer) aangemeld als bewerker van deze pagina.");
    const pi = content.paginas.findIndex((x) => x.slug === b.pagina);
    if (pi < 0 || paginaId(pi) !== sessie.pagina) return nee(403, "andere_pagina", "Dit bewerktoken hoort bij een andere pagina.");
    const bi = content.paginas[pi].blokken.findIndex((_, i) => sectieId(pi, i) === b.sectie);
    const blok = content.paginas[pi].blokken[bi];
    const naam = Array.isArray(b.pad) && b.pad.length === 1 ? b.pad[0] : null;
    if (!blok || typeof b.waarde !== "string") return nee(404, "niet_gevonden", "Dit onderdeel bestaat niet (meer) op deze website.");
    if (!naam || !(naam in (BEWERKBAAR[blok.type] ?? {}))) return nee(403, "niet_bewerkbaar", "Dit onderdeel bewerk je in het beheer.");
    // Zoals controleerLiveWaarde: een tekstregel (text) heeft geen regeleinden, een tekstvak (textarea) wel.
    if (!BEWERKBAAR[blok.type][naam] && /[\r\n]/.test(b.waarde)) return nee(400, "ongeldig", "Deze tekst past op één regel.");
    const huidig = versies.get(b.sectie) ?? BEGINVERSIE;
    if (b.versie !== huidig) return nee(409, "conflict", "Iemand anders heeft dit onderdeel intussen gewijzigd. Herlaad de pagina om de nieuwste versie te zien; je wijziging is niet opgeslagen.");
    const versie = new Date(Date.parse(BEGINVERSIE) + (bewerkingen.length + 1) * 1000).toISOString();
    versies.set(b.sectie, versie);
    conceptWijzigingen.set(b.sectie, { ...(conceptWijzigingen.get(b.sectie) ?? {}), [naam]: b.waarde });
    bewerkingen.push({ pagina: b.pagina, sectie: b.sectie, pad: b.pad, waarde: b.waarde, versie });
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ ok: true, versie, concept: true, publiceren: "editor" }));
  });
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    if (url.pathname === "/api/v1/live-bewerken") return liveBewerken(req, res);
    if (req.method === "GET" && url.pathname === "/test/bewerktoken") {
      const pi = content.paginas.findIndex((x) => x.slug === (url.searchParams.get("pad") || "/"));
      res.writeHead(pi < 0 ? 404 : 200, { "content-type": "text/plain" });
      return res.end(pi < 0 ? "" : maakBewerktoken(paginaId(pi), Number(url.searchParams.get("minuten") ?? 30)));
    }
    if (req.method === "GET" && url.pathname === "/test/bewerkingen") {
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify(bewerkingen));
    }
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
