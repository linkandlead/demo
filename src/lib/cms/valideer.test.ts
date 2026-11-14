import assert from "node:assert/strict";
import { test } from "node:test";
import { valideerRespons } from "./valideer.ts";

test("weigert een respons zonder ok:true", () => {
  assert.equal(
    valideerRespons({
      ok: false,
      melding: "Ongeldig of ontbrekend API-token.",
    }),
    null,
  );
  assert.equal(valideerRespons("rommel"), null);
});

test("leest pagina’s, blokken en records volgens het CMS-contract", () => {
  const site = valideerRespons({
    ok: true,
    site: { naam: "NOVA demo", domein: "nova-demo.example" },
    paginas: [
      {
        slug: "/",
        titel: "Home",
        blokken: [
          { type: "header", bg: "nacht", content: { heading: "Hoi" } },
          "kapot",
        ],
      },
    ],
    records: { cases: [{ klantnaam: "Aurora" }, 42], onzin: "x" },
  });
  assert.ok(site);
  assert.equal(site.naam, "NOVA demo");
  assert.equal(site.paginas[0].blokken.length, 1);
  assert.deepEqual(site.paginas[0].blokken[0], {
    type: "header",
    bg: "nacht",
    content: { heading: "Hoi" },
  });
  assert.deepEqual(site.records.cases, [{ klantnaam: "Aurora" }]);
  assert.equal(site.records.onzin, undefined);
});

test("leest navigatie en huisstijl en laat onveilige links en kleuren weg", () => {
  const site = valideerRespons({
    ok: true,
    site: {
      navigatie: {
        hoofd: [
          { titel: "Werk", href: "/work" },
          { titel: "Kwaad", href: "javascript:alert(1)" },
          { titel: "", href: "/leeg" },
        ],
        footer: [{ kop: "Ontdek", links: [{ titel: "Werk", href: "/work" }] }, { kop: "Leeg", links: [] }],
        actie: { titel: "Neem contact op", href: "/contact" },
      },
      design_tokens: { nacht: "#0B1127", limoen: "red;}body{x", wit: 3 },
    },
    paginas: [],
  });
  assert.ok(site);
  assert.deepEqual(site.navigatie.hoofd, [{ titel: "Werk", href: "/work" }]);
  assert.equal(site.navigatie.footer.length, 1);
  assert.deepEqual(site.navigatie.actie, { titel: "Neem contact op", href: "/contact" });
  assert.deepEqual(site.designTokens, { nacht: "#0B1127" });
});
