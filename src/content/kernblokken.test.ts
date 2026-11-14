import assert from "node:assert/strict";
import { test } from "node:test";
import { KERNBLOKKEN, variantOpties } from "./kernblokken.ts";

test("precies 43 unieke kernblokken in vijf categorieën", () => {
  assert.equal(KERNBLOKKEN.length, 43);
  assert.equal(new Set(KERNBLOKKEN.map((b) => b.naam)).size, 43);
  assert.equal(new Set(KERNBLOKKEN.map((b) => b.categorie)).size, 5);
});

test('alleen "Collectie (lijst)" mist een bloktype in de CMS-repo', () => {
  assert.deepEqual(
    KERNBLOKKEN.filter((b) => !b.cmsType).map((b) => b.naam),
    ["Collectie (lijst)"],
  );
});

test("varianten komen uit de PDF", () => {
  assert.deepEqual(variantOpties("geen"), ["Standaard"]);
  assert.deepEqual(variantOpties("3 of 4 kolommen"), [
    "3 kolommen",
    "4 kolommen",
  ]);
  assert.deepEqual(
    variantOpties("lay-out: gecentreerd / beeld links / compact; hoogte: x"),
    ["gecentreerd", "beeld links", "compact"],
  );
});
