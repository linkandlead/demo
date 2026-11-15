import assert from "node:assert/strict";
import { test } from "node:test";
import { zichtbaar } from "./veldvoorwaarde.ts";

const veld = (toonAls?: string) => ({ label: "Toelichting", type: "tekstvak", opties: [], verplicht: true, toonAls });

test("toon_als toont een veld alleen bij de juiste waarde", () => {
  assert.equal(zichtbaar(veld(), {}), true);
  assert.equal(zichtbaar(veld("Interesse=Ja"), {}), false);
  assert.equal(zichtbaar(veld("Interesse=Ja"), { Interesse: "Nee" }), false);
  assert.equal(zichtbaar(veld("Interesse=Ja"), { Interesse: "ja" }), true);
  assert.equal(zichtbaar(veld(" Soort bijeenkomst = Workshop "), { "Soort bijeenkomst": "Workshop" }), true);
  assert.equal(zichtbaar(veld("zonder-isgelijkteken"), {}), true);
});
