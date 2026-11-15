import assert from "node:assert/strict";
import { test } from "node:test";
import { handtekeningKlopt, hmacHex } from "./webhook.ts";

test("accepteert alleen de juiste HMAC-handtekening", async () => {
  const body = JSON.stringify({ gebeurtenis: "inhoud_gepubliceerd", data: { paden: ["/"] } });
  const goed = await hmacHex("geheim-1", body);
  assert.equal(await handtekeningKlopt("geheim-1", body, goed), true);
  assert.equal(await handtekeningKlopt("geheim-1", body, goed.toUpperCase()), true);
  assert.equal(await handtekeningKlopt("ander-geheim", body, goed), false);
  assert.equal(await handtekeningKlopt("geheim-1", body + " ", goed), false);
  assert.equal(await handtekeningKlopt("geheim-1", body, null), false);
  assert.equal(await handtekeningKlopt("", body, goed), false);
});
