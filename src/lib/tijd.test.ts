import assert from "node:assert/strict";
import { test } from "node:test";
import { doelInTijdzone } from "./tijd.ts";

test("doeldatum telt in de opgegeven tijdzone, ook met zomertijd", () => {
  // 12 juni 2027 12:00 in Amsterdam (zomertijd, UTC+2) = 10:00 UTC
  assert.equal(new Date(doelInTijdzone("2027-06-12T12:00", "Europe/Amsterdam")).toISOString(), "2027-06-12T10:00:00.000Z");
  // 12 januari 2027 12:00 in Amsterdam (UTC+1) = 11:00 UTC
  assert.equal(new Date(doelInTijdzone("2027-01-12T12:00", "Europe/Amsterdam")).toISOString(), "2027-01-12T11:00:00.000Z");
  // Londen in de zomer (UTC+1)
  assert.equal(new Date(doelInTijdzone("2027-06-12T12:00", "Europe/London")).toISOString(), "2027-06-12T11:00:00.000Z");
  // Onbekende tijdzone: als UTC
  assert.equal(new Date(doelInTijdzone("2027-06-12T12:00", "Niet/Bestaand")).toISOString(), "2027-06-12T12:00:00.000Z");
});
