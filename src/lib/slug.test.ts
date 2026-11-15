import assert from "node:assert/strict";
import { test } from "node:test";
import { persoonSlug } from "./slug.ts";

test("persoonSlug maakt nette, voorspelbare slugs", () => {
  assert.equal(persoonSlug("Maya Chen"), "maya-chen");
  assert.equal(persoonSlug("Amélie d'Or"), "amelie-d-or");
  assert.equal(persoonSlug("  Noah  Vermeer "), "noah-vermeer");
});
