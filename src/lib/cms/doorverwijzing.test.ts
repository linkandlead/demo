import { test } from "node:test";
import assert from "node:assert/strict";
import { normaalPad, vindDoorverwijzing } from "./doorverwijzing.ts";

const r = (van: string, naar: string, status: 301 | 302 | 307 | 308 = 301) => ({ van, naar, status });

test("normaalPad: zonder query, anker en slash, in kleine letters", () => {
  assert.equal(normaalPad("/Oud/?a=1#x"), "/oud");
  assert.equal(normaalPad("/"), "/");
});

test("een doorverwijzing wordt gevonden, ook met slash of hoofdletters", () => {
  const lijst = [r("/test-redirect-a", "/contact")];
  assert.deepEqual(vindDoorverwijzing(lijst, "/Test-Redirect-A/"), r("/test-redirect-a", "/contact"));
  assert.equal(vindDoorverwijzing(lijst, "/niet-bekend"), null);
});

test("een keten gaat in één stap naar het eind en een lus geeft niets", () => {
  assert.equal(vindDoorverwijzing([r("/a", "/b"), r("/b", "/c")], "/a")?.naar, "/c");
  assert.equal(vindDoorverwijzing([r("/a", "/b"), r("/b", "/a")], "/a"), null);
});

test("een doel buiten de site (https) blijft zoals het is", () => {
  assert.equal(vindDoorverwijzing([r("/a", "https://voorbeeld.nl/x", 302)], "/a")?.naar, "https://voorbeeld.nl/x");
});
