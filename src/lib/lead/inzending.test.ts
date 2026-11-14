import assert from "node:assert/strict";
import { test } from "node:test";
import { valideerInzending } from "./inzending.ts";

test("contact vraagt e-mail, naam, vraag en akkoord", () => {
  const r = valideerInzending({ soort: "contact", email: "x" });
  assert.equal(r.ok, false);
  if (!r.ok) assert.deepEqual(Object.keys(r.fouten).sort(), ["akkoord", "email", "naam", "vraag"]);
});

test("NPS accepteert 0–10 zonder e-mailadres", () => {
  assert.equal(valideerInzending({ soort: "nps", score: 11 }).ok, false);
  const r = valideerInzending({ soort: "nps", score: 0, vraag: "Prima" });
  assert.ok(r.ok);
  if (r.ok) assert.equal(r.inzending.score, 0);
});

test("review vraagt sterren, naam, tekst en akkoord", () => {
  const fout = valideerInzending({ soort: "review", score: 6 });
  assert.equal(fout.ok, false);
  const r = valideerInzending({ soort: "review", score: 5, naam: "Sam", vraag: "Mooie demo, duidelijk!", akkoord: "on" });
  assert.ok(r.ok);
});

test("formulierbouwer bewaart antwoorden per label en weigert een leeg formulier", () => {
  assert.equal(valideerInzending({ soort: "formulier", gegevens: {} }).ok, false);
  const r = valideerInzending({ soort: "formulier", gegevens: { Naam: "Sam", Leeg: " " } });
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual(r.inzending.gegevens, { Naam: "Sam" });
});
