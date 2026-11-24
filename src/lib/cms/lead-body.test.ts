import assert from "node:assert/strict";
import { test } from "node:test";
import { leadBody } from "./lead-body.ts";

test("leadBody: contact, nieuwsbrief en formulier gaan naar het CMS; reviews en NPS niet", () => {
  const c = leadBody({ soort: "contact", naam: "Sam", email: "s@x.nl", onderwerp: "Offerte", vraag: "Hallo", bron_pagina: "/contact" }, "site-1");
  assert.equal(c?.soort, "contact");
  assert.equal(c?.site_id, "site-1");
  assert.equal(c?.vraag, "Offerte\nHallo");
  assert.equal(leadBody({ soort: "nieuwsbrief", email: "s@x.nl" }, "s")?.soort, "nieuwsbrief");
  const f = leadBody({ soort: "formulier", gegevens: { Naam: "Sam", Workshop: "Licht" } }, "s");
  assert.equal(f?.vraag, "Naam: Sam\nWorkshop: Licht");
  assert.equal(leadBody({ soort: "review" }, "s"), null);
  assert.equal(leadBody({ soort: "nps" }, "s"), null);
});
