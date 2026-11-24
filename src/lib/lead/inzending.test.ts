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

test("alleen een geldige uuid wordt als opruimcode bewaard", () => {
  const goed = valideerInzending({ soort: "nps", score: 5, _testcode: "0F8FAD5B-D9CB-469F-A165-70867728950E" });
  const fout = valideerInzending({ soort: "nps", score: 5, _testcode: "'; drop table aanvragen; --" });
  assert.ok(goed.ok && fout.ok);
  if (goed.ok) assert.equal(goed.inzending.testcode, "0f8fad5b-d9cb-469f-a165-70867728950e");
  if (fout.ok) assert.equal(fout.inzending.testcode, undefined);
});

test("een te lange tekst wordt geweigerd in plaats van stil afgekapt", () => {
  const r = valideerInzending({ soort: "contact", email: "a@b.nl", naam: "Jan", vraag: "x".repeat(2010), akkoord: "on" });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.fouten.vraag, /maximaal 2000 tekens \(10 te veel\)/);
  const g = valideerInzending({ soort: "formulier", gegevens: { Doel: "y".repeat(1001) } });
  assert.equal(g.ok, false);
  if (!g.ok) assert.match(g.fouten["gegevens.Doel"], /maximaal 1000 tekens/);
});
