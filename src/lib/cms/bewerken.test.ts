import assert from "node:assert/strict";
import { test } from "node:test";
import {
  beoordeelOpslaan,
  bewerktokenSecondenGeldig,
  bewerktokenVorm,
  leesOpslaanVerzoek,
  opslagTekst,
  padTekst,
  valideerBewerken,
  zelfdeHerkomst,
} from "./bewerken.ts";
import { valideerPaginaV1 } from "./voorvertoning.ts";

const NU = Date.UTC(2026, 10, 15, 12, 0, 0);
const sec = Math.floor(NU / 1000);
const U = "aaaaaaaa-0000-4000-8000-0000000000d1";
const P = "aaaaaaaa-0001-4000-8000-000000000002";
const token = (verloopt = sec + 1800, sid = "-") => `${verloopt}.${NU - 1000}.${U}.${sid}.${P}.${"b".repeat(64)}`;
const SECTIE = "aaaaaaaa-0002-4000-8000-000000000001";

test("bewerktoken: alleen de vorm van het CMS, en hooguit 30 minuten", () => {
  assert.equal(bewerktokenVorm(token()), true);
  assert.equal(bewerktokenVorm(token(sec + 1800, U)), true, "met sessie-id");
  assert.equal(bewerktokenVorm(`${sec}.${"a".repeat(64)}`), false, "een voorvertoningstoken is geen bewerktoken");
  assert.equal(bewerktokenVorm(token().replace(/b{64}$/, "x".repeat(64))), false);
  assert.equal(bewerktokenVorm(`${token()}.extra`), false);
  assert.equal(bewerktokenVorm(42), false);
  assert.equal(bewerktokenSecondenGeldig(token(sec + 600), NU), 600);
  assert.equal(bewerktokenSecondenGeldig(token(sec + 86400), NU), 30 * 60 + 5, "nooit langer dan het CMS geeft");
  assert.equal(bewerktokenSecondenGeldig(token(sec - 1), NU), 0, "verlopen");
});

test("bewerken uit de lees-API: gevalideerd, rommel valt weg", () => {
  assert.deepEqual(
    valideerBewerken({
      versie: "2026-11-15T10:00:00.000Z",
      velden: [
        { pad: ["titel"], label: "Titel", waarde: "Over ons", meerdereRegels: false },
        { pad: ["items", 0, "tekst"], label: "Tekst", waarde: "Een", meerdereRegels: true },
        { pad: ["x.y"], label: "Kwaad", waarde: "x" },
        { pad: ["titel"], waarde: 3 },
        "geen object",
      ],
    }),
    {
      versie: "2026-11-15T10:00:00.000Z",
      velden: [
        { pad: ["titel"], label: "Titel", waarde: "Over ons", meerdereRegels: false },
        { pad: ["items", 0, "tekst"], label: "Tekst", waarde: "Een", meerdereRegels: true },
      ],
    },
  );
  assert.equal(valideerBewerken({ velden: [] }), null, "zonder versie");
  assert.equal(valideerBewerken(null), null);
  assert.equal(padTekst(["items", 0, "tekst"]), "items.0.tekst");
});

test("valideerPaginaV1 houdt sectie-id en bewerken vast (alleen samen)", () => {
  const p = valideerPaginaV1({
    concept: true,
    pagina: {
      slug: "/over",
      titel: "Over",
      blokken: [
        { id: SECTIE, type: "tekst", inhoud: { titel: "Over ons" }, bewerken: { versie: "v1", velden: [{ pad: ["titel"], waarde: "Over ons" }] } },
        { id: "blok-1", type: "tekst", inhoud: {}, bewerken: { versie: "v1", velden: [] } },
        { type: "tekst", inhoud: {} },
      ],
    },
  });
  assert.equal(p?.pagina.blokken[0].id, SECTIE);
  assert.equal(p?.pagina.blokken[0].bewerken?.velden[0].waarde, "Over ons");
  assert.equal(p?.pagina.blokken[1].id, undefined, "geen uuid: geen id en geen bewerken");
  assert.equal(p?.pagina.blokken[1].bewerken, undefined);
  assert.equal(p?.pagina.blokken[2].bewerken, undefined);
});

test("verzoek van de bewerkbalk: alleen een volledig, intern verzoek", () => {
  const goed = { pagina: "/over", sectie: SECTIE, pad: ["titel"], waarde: "Nieuw", versie: "v1" };
  assert.deepEqual(leesOpslaanVerzoek(goed), goed);
  assert.equal(leesOpslaanVerzoek({ ...goed, pagina: "//evil.example" }), null);
  assert.equal(leesOpslaanVerzoek({ ...goed, sectie: "1" }), null);
  assert.equal(leesOpslaanVerzoek({ ...goed, pad: [] }), null);
  assert.equal(leesOpslaanVerzoek({ ...goed, waarde: 1 }), null);
  assert.equal(leesOpslaanVerzoek({ ...goed, versie: "" }), null);
  assert.equal(leesOpslaanVerzoek(null), null);
});

test("CSRF: alleen een verzoek met de Origin van deze site", () => {
  const host = "demo.voorbeeld.nl";
  assert.equal(zelfdeHerkomst({ origin: `https://${host}`, host, secFetchSite: "same-origin" }), true);
  assert.equal(zelfdeHerkomst({ origin: `https://${host}`, host, secFetchSite: null }), true);
  assert.equal(zelfdeHerkomst({ origin: "https://evil.example", host, secFetchSite: "cross-site" }), false);
  assert.equal(zelfdeHerkomst({ origin: `https://${host}`, host, secFetchSite: "same-site" }), false, "een subdomein telt niet");
  assert.equal(zelfdeHerkomst({ origin: null, host, secFetchSite: null }), false, "zonder Origin geweigerd");
  assert.equal(zelfdeHerkomst({ origin: "null", host, secFetchSite: null }), false);
  assert.equal(zelfdeHerkomst({ origin: `http://${host}`, host, secFetchSite: null }), false, "geen http buiten localhost");
  assert.equal(zelfdeHerkomst({ origin: "http://localhost:3001", host: "localhost:3001", secFetchSite: "same-origin" }), true);
});

test("antwoord van het CMS → uitkomst voor de balk", () => {
  assert.deepEqual(beoordeelOpslaan(200, { ok: true, versie: "v2" }), { soort: "opgeslagen", versie: "v2" });
  assert.equal(beoordeelOpslaan(409, { ok: false, melding: "Iemand anders…" }).soort, "conflict");
  assert.equal(beoordeelOpslaan(401, {}).soort, "verlopen");
  assert.deepEqual(beoordeelOpslaan(403, { ok: false, melding: "Dit onderdeel past alleen de beheerder van de website aan." }), {
    soort: "fout",
    status: 403,
    melding: "Dit onderdeel past alleen de beheerder van de website aan.",
  });
  assert.equal((beoordeelOpslaan(500, null) as { status: number }).status, 502);
  assert.equal((beoordeelOpslaan(0, null) as { status: number }).status, 502);
  assert.equal(beoordeelOpslaan(200, { ok: true }).soort, "fout", "zonder versie geen succes");
});

test("opslagstatus", () => {
  assert.equal(opslagTekst({ bezig: true, open: 2, mislukt: false }), "Opslaan…");
  assert.equal(opslagTekst({ bezig: false, open: 1, mislukt: false }), "1 wijziging niet opgeslagen");
  assert.equal(opslagTekst({ bezig: false, open: 3, mislukt: true }), "3 wijzigingen niet opgeslagen");
  assert.equal(opslagTekst({ bezig: false, open: 0, mislukt: true }), "Niet opgeslagen");
  assert.equal(opslagTekst({ bezig: false, open: 0, mislukt: false }), "Alle wijzigingen opgeslagen als concept");
});
