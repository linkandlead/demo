import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { paginas } from "./blauwdruk.ts";
import { KERNBLOKKEN } from "./kernblokken.ts";
import { verkennerVoorbeeld } from "./verkenner.ts";
import { GERENDERD, HEADER_VIDEO, blokSleutel } from "./verkenner-keuzes.ts";

const bron = (pad: string) => new URL(`../../${pad}`, import.meta.url);

test("GERENDERD is precies wat Blokken.tsx rendert", () => {
  const code = fs.readFileSync(bron("src/components/nova/Blokken.tsx"), "utf8");
  const cases = [...code.matchAll(/case "([a-z_]+)":/g)].map((m) => m[1]);
  const interactie =
    code.match(/const INTERACTIE = new Set\(\[([^\]]*)\]/)?.[1] ?? "";
  const uitCode = new Set([
    ...cases,
    ...[...interactie.matchAll(/"([a-z_]+)"/g)].map((m) => m[1]),
  ]);
  assert.deepEqual([...GERENDERD].sort(), [...uitCode].sort());
});

test("elk blok met een renderer krijgt echte voorbeeldinhoud uit de blauwdruk", () => {
  for (const k of KERNBLOKKEN) {
    const v = verkennerVoorbeeld({ blok: blokSleutel(k.naam) });
    const echt = !!k.cmsType && GERENDERD.has(k.cmsType);
    assert.equal(v.echt, echt, k.naam);
    if (!echt) {
      assert.equal(v.blok, null);
      continue;
    }
    assert.equal(v.blok?.type, k.cmsType, k.naam);
    assert.ok(
      paginas.some((p) => p.slug === v.bron),
      `${k.naam}: bronpagina ${v.bron}`,
    );
  }
});

test("achtergrond en variant zetten de echte velden", () => {
  const regel = verkennerVoorbeeld({
    blok: "conclusieregel",
    variant: "donker",
    bg: "mist",
  });
  assert.equal(regel.blok?.content.stijl, "donker");
  assert.equal(regel.blok?.bg, "mist");
  const kaarten = verkennerVoorbeeld({
    blok: "kaartenrij",
    variant: "4 kolommen",
  });
  assert.equal(kaarten.blok?.content.kolommen, "4");
  const header = verkennerVoorbeeld({
    blok: "header-hero",
    variant: "achtergrondbeeld",
    hoogte: "normaal",
  });
  assert.equal(header.blok?.content.layout, "achtergrond");
  assert.equal(header.blok?.content.hoogte, "normaal");
  // Onbekende waarden uit de URL vallen terug op het voorbeeld zelf.
  const vreemd = verkennerVoorbeeld({
    blok: "header-hero",
    bg: "rood",
    variant: "x",
    hoogte: "y",
  });
  assert.equal(vreemd.bg, "nacht");
  assert.equal(vreemd.variant, "beeld rechts");
  assert.equal(vreemd.hoogte, "fullscreen");
  // Formulier: elke soort neemt het passende blok uit de blauwdruk.
  assert.equal(
    verkennerVoorbeeld({ blok: "formulier", variant: "contact" }).bron,
    "/contact",
  );
});

test("header-voorbeeld heeft een lichte achtergrondvideo; de blauwdruk zelf blijft ongewijzigd", () => {
  const v = verkennerVoorbeeld({});
  assert.equal(v.naam, "Header (hero)");
  assert.equal(v.blok?.content.media_type, "video");
  assert.equal(v.blok?.content.media_video, HEADER_VIDEO);
  assert.ok(v.blok?.content.media_afbeelding, "poster/terugval");
  const grootte = fs.statSync(bron(`public${HEADER_VIDEO}`)).size;
  assert.ok(grootte < 2_000_000, `video is ${grootte} bytes`);
  const home = paginas.find((p) => p.slug === "/")!.blokken[0];
  assert.equal(home.content.media_type, "afbeelding");
});
