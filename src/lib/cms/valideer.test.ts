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
