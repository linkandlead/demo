import assert from "node:assert/strict";
import { test } from "node:test";
import { cspVerbinding, DEMO_KLANT_SITE_ID, metingConfig, metingPad } from "./config.ts";

test("de demo meet alleen met een geldig CMS-adres en tenzij METING=uit", () => {
  assert.equal(metingConfig({}), null);
  assert.equal(metingConfig({ CMS_URL: "niet-een-url" }), null);
  assert.equal(metingConfig({ CMS_URL: "http://cms.example.com" }), null, "geen onversleuteld adres, behalve localhost");
  assert.deepEqual(metingConfig({ CMS_URL: "https://cms.linkandlead.nl/" }), { basisUrl: "https://cms.linkandlead.nl", siteId: DEMO_KLANT_SITE_ID });
  assert.equal(metingConfig({ CMS_URL: "http://localhost:4000" })?.basisUrl, "http://localhost:4000");
  assert.equal(metingConfig({ CMS_URL: "https://cms.linkandlead.nl", METING: "uit" }), null);
});

test("een eigen site-id telt alleen als het een uuid is", () => {
  const eigen = "33333333-3333-4333-8333-333333333333";
  assert.equal(metingConfig({ CMS_URL: "https://c.nl", CMS_SITE_ID: eigen })?.siteId, eigen);
  assert.equal(metingConfig({ CMS_URL: "https://c.nl", CMS_SITE_ID: "rommel" })?.siteId, DEMO_KLANT_SITE_ID);
});

test("de CSP staat het CMS toe voor de beacon, en niets zonder meting", () => {
  assert.deepEqual(cspVerbinding({ CMS_URL: "https://cms.linkandlead.nl/pad" }), ["https://cms.linkandlead.nl"]);
  assert.deepEqual(cspVerbinding({}), []);
});

test("het voorbeeld in de editor en de API worden niet gemeten", () => {
  assert.equal(metingPad("/"), true);
  assert.equal(metingPad("/contact"), true);
  assert.equal(metingPad("/__voorvertoning"), false);
  assert.equal(metingPad("/api/inzending"), false);
});
