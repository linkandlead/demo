import assert from "node:assert/strict";
import { test } from "node:test";
import { lijktSpam, valideerAanvraag } from "./aanvraag.ts";

test("verplichte velden geven Nederlandse foutmeldingen", () => {
  const v = valideerAanvraag({ naam: " ", email: "geen-mail" });
  assert.equal(v.ok, false);
  if (!v.ok) assert.deepEqual(Object.keys(v.fouten).sort(), ["email", "naam"]);
});

test("geldige aanvraag wordt getrimd en begrensd", () => {
  const v = valideerAanvraag({
    naam: "  Sam ",
    email: "sam@voorbeeld.nl",
    vraag: "x".repeat(5000),
  });
  assert.ok(v.ok);
  if (v.ok) {
    assert.equal(v.data.naam, "Sam");
    assert.equal(v.data.vraag?.length, 2000);
    assert.equal(v.data.bedrijf, undefined);
  }
});

test("honeypot en te snelle inzending gelden als spam (gelijk aan het CMS)", () => {
  assert.equal(lijktSpam({ _website: "http://spam" }), true);
  assert.equal(lijktSpam({ _ts: 1000 }, 1500), true);
  assert.equal(lijktSpam({ _ts: 1000 }, 4000), false);
  assert.equal(lijktSpam({}), false);
});
