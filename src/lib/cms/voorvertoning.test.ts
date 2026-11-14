import assert from "node:assert/strict";
import { test } from "node:test";
import {
  beoordeelAntwoord,
  kiesInhoud,
  leesVoorvertoningsVerzoek,
  tokenSecondenGeldig,
  tokenVorm,
  valideerPaginaV1,
  veiligPad,
} from "./voorvertoning.ts";

const NU = Date.UTC(2026, 10, 14, 12, 0, 0);
const sec = Math.floor(NU / 1000);
const HEX = "a".repeat(64);
const geldig = `${sec + 1800}.${HEX}`;

test("redirect-beveiliging: alleen interne paden", () => {
  assert.equal(veiligPad("/"), "/");
  assert.equal(veiligPad("/about"), "/about");
  assert.equal(
    veiligPad("/work/aurora-pavilion?x=1"),
    "/work/aurora-pavilion?x=1",
  );
  assert.equal(veiligPad("//evil.example"), null);
  assert.equal(veiligPad("/\\evil.example"), null);
  assert.equal(veiligPad("/%2F%2Fevil.example"), "/%2F%2Fevil.example"); // blijft een pad op deze host
  assert.equal(veiligPad("https://evil.example/"), null);
  assert.equal(veiligPad("javascript:alert(1)"), null);
  assert.equal(veiligPad("about"), null);
  assert.equal(veiligPad("/a\nb"), null);
  assert.equal(veiligPad("/" + "x".repeat(300)), null);
  assert.equal(veiligPad(undefined), null);
});

test("tokencontrole: vorm en geldigheid zoals het CMS ze maakt", () => {
  assert.equal(tokenVorm(geldig), true);
  assert.equal(tokenVorm(`${sec}.${"A".repeat(64)}`), false);
  assert.equal(tokenVorm(`${sec}.${HEX}x`), false);
  assert.equal(tokenVorm("cms_l_abc"), false);
  assert.equal(tokenVorm(null), false);
  assert.equal(tokenSecondenGeldig(geldig, NU), 1800);
  assert.equal(tokenSecondenGeldig(`${sec - 1}.${HEX}`, NU), 0);
  assert.equal(tokenSecondenGeldig(`${sec + 999999}.${HEX}`, NU), 3600); // cookie hooguit een uur
});

test("verzoek lezen: pad + token, ook ?voorvertoning=, en weigeren bij rommel", () => {
  const z = (q: string) =>
    leesVoorvertoningsVerzoek(new URLSearchParams(q), NU);
  assert.deepEqual(z(`pad=%2Fabout&token=${geldig}`), {
    pad: "/about",
    token: geldig,
  });
  assert.deepEqual(z(`voorvertoning=${geldig}`), { pad: "/", token: geldig });
  assert.equal(z(`pad=%2F%2Fevil.example&token=${geldig}`), null);
  assert.equal(z("pad=%2F&token=ongeldig"), null);
  assert.equal(z(`pad=%2F&token=${sec - 10}.${HEX}`), null);
  assert.equal(z("pad=%2F"), null);
});

const paginaV1 = (concept: boolean) => ({
  versie: "v1",
  taal: "nl",
  concept,
  pagina: {
    slug: "/about",
    titel: "Over ons",
    beschrijving: "B",
    blokken: [
      {
        id: "x",
        type: "header",
        bg: "nacht",
        gedeeld: null,
        inhoud: { heading: "Concept" },
      },
      { type: 3 },
      "rommel",
    ],
  },
});

test("PaginaV1-validatie: inhoud → content, rommel valt weg", () => {
  const p = valideerPaginaV1(paginaV1(true));
  assert.deepEqual(p, {
    concept: true,
    pagina: {
      slug: "/about",
      titel: "Over ons",
      beschrijving: "B",
      blokken: [
        { type: "header", bg: "nacht", content: { heading: "Concept" } },
      ],
    },
  });
  assert.equal(valideerPaginaV1({ ok: false }), null);
  assert.equal(
    valideerPaginaV1({ ...paginaV1(true), pagina: { slug: "//x" } }),
    null,
  );
});

test("antwoord beoordelen: alleen concept:true is een concept", () => {
  assert.equal(beoordeelAntwoord(200, paginaV1(true)).soort, "concept");
  assert.equal(beoordeelAntwoord(200, paginaV1(false)).soort, "geweigerd"); // ongeldig token: gepubliceerd
  assert.equal(beoordeelAntwoord(401, null).soort, "geweigerd");
  assert.equal(beoordeelAntwoord(404, null).soort, "niet-gevonden");
  assert.equal(beoordeelAntwoord(503, null).soort, "fout");
  assert.equal(beoordeelAntwoord(200, "rommel").soort, "fout");
});

test("kiezen tussen concept en gepubliceerd", () => {
  const gepubliceerd = {
    slug: "/about",
    titel: "Live",
    beschrijving: "",
    blokken: [],
    bron: "cms" as const,
  };
  const concept = beoordeelAntwoord(200, paginaV1(true));
  assert.equal(
    kiesInhoud({ draftMode: true, concept, gepubliceerd }).titel,
    "Over ons",
  );
  // Zonder draft mode nooit het concept, ook niet als het er (per ongeluk) is.
  assert.equal(
    kiesInhoud({ draftMode: false, concept, gepubliceerd }),
    gepubliceerd,
  );
  assert.equal(
    kiesInhoud({
      draftMode: true,
      concept: { soort: "geweigerd" },
      gepubliceerd,
    }),
    gepubliceerd,
  );
  assert.equal(
    kiesInhoud({ draftMode: true, concept: { soort: "fout" }, gepubliceerd }),
    gepubliceerd,
  );
  assert.equal(
    kiesInhoud({ draftMode: true, concept: null, gepubliceerd: null }),
    null,
  );
});
