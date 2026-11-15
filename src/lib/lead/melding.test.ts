import assert from "node:assert/strict";
import { test } from "node:test";
import { meldingVoor } from "./melding.ts";

test("melding vat een inzending samen voor Slack/Discord, zonder te mailen", () => {
  const m = meldingVoor(
    { soort: "contact", naam: "Sam", email: "sam@voorbeeld.nl", onderwerp: "Een project", vraag: "x".repeat(400), bron_pagina: "/contact" },
    new Date("2026-11-15T10:00:00Z"),
  );
  assert.equal(m.kop, "Contactbericht via NOVA (/contact)");
  assert.ok(m.text.includes("Naam: Sam") && m.text.includes("E-mail: sam@voorbeeld.nl"));
  assert.equal(m.inhoud.length, 300);
  assert.equal(m.text, m.content);
  const f = meldingVoor({ soort: "formulier", gegevens: { Naam: "Sam", Workshop: "Licht" } });
  assert.equal(f.inhoud, "Naam: Sam · Workshop: Licht");
});
