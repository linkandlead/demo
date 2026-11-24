import assert from "node:assert/strict";
import { test } from "node:test";
import {
  voorvertoningKlikken,
  voorvertoningScript,
  voorvertoningVelden,
} from "./voorvertoningklikken.ts";

// Klikken en typen in het ingesloten voorbeeld (linkandlead-cms B-115, B-127, site-kit 1.21).
const CMS = "https://cms.linkandlead.nl";
const SECTIE = "00000000-0000-4000-9000-000000000001";

type Fn = (e: unknown) => void;
// Een nepvenster in een iframe: document met klikluisteraar, parent met postMessage, berichten van de editor.
function venster(search: string, velden: unknown[] = [], inIframe = true) {
  const berichten: Array<{ b: Record<string, unknown>; doel: string }> = [];
  const klikken: Fn[] = [];
  const berichtLuisteraars: Fn[] = [];
  const v: Record<string, unknown> = {
    location: { search },
    document: {
      addEventListener: (_t: string, f: Fn) => klikken.push(f),
      removeEventListener: (_t: string, f: Fn) =>
        klikken.splice(klikken.indexOf(f), 1),
      querySelectorAll: () => velden,
    },
    addEventListener: (_t: string, f: Fn) => berichtLuisteraars.push(f),
    removeEventListener: (_t: string, f: Fn) =>
      berichtLuisteraars.splice(berichtLuisteraars.indexOf(f), 1),
  };
  v.parent = inIframe
    ? {
        postMessage: (b: Record<string, unknown>, doel: string) =>
          berichten.push({ b, doel }),
      }
    : v;
  return { v, berichten, klikken, berichtLuisteraars };
}
type NepEl = {
  getAttribute: (n: string) => string | null;
  closest: (s: string) => NepEl | null;
  contains: () => boolean;
};
const element = (
  attrs: Record<string, string>,
  ouder: NepEl | null = null,
): NepEl => ({
  getAttribute: (n) => attrs[n] ?? null,
  closest(sel) {
    return sel.split(",").some((s) => s.slice(1, -1) in attrs)
      ? this
      : (ouder?.closest(sel) ?? null);
  },
  contains: () => true,
});
const klik = (target: unknown) => {
  const e = {
    target,
    button: 0,
    gevolgd: true,
    preventDefault: () => {},
    stopPropagation: () => {},
  };
  e.preventDefault = () => {
    e.gevolgd = false;
  };
  return e;
};

test("voorvertoningScript: zelfstandige code met de CMS-origin en de tekstvelden; inhoud kan het script niet afsluiten", () => {
  const s = voorvertoningScript(`${CMS}/admin`, [
    {
      id: SECTIE,
      content: {
        titel: "Welkom </script><script>alert(1)</script>",
        knop: "/x",
      },
    },
    { content: { titel: "zonder id" } },
  ]);
  assert.match(s, /^\(function voorvertoningKlikken\(/);
  assert.ok(s.includes(`"cmsUrl":"${CMS}","ingesloten":true`));
  assert.ok(
    s.endsWith(",{venster:window}))"),
    "het venster gaat expliciet mee (de serverbundel kent geen window)",
  );
  assert.ok(!s.includes("</script>"));
  assert.ok(!s.includes("zonder id"));
  // alleen https (of localhost); anders geen script
  assert.equal(voorvertoningScript("http://cms.example", []), "");
  assert.equal(voorvertoningScript("geen url", []), "");
  assert.equal(voorvertoningScript(null, []), "");
  assert.ok(
    voorvertoningScript("http://localhost:4000", []).includes(
      '"cmsUrl":"http://localhost:4000"',
    ),
  );
});

test("voorvertoningScript: het script werkt als losse code (klaar-bericht alleen naar het CMS)", () => {
  const { v, berichten, klikken } = venster("?ingesloten=1");
  new Function("window", voorvertoningScript(CMS, []))(v);
  assert.equal(klikken.length, 1);
  assert.deepEqual(berichten, [
    { doel: CMS, b: { bron: "cms-voorbeeld", soort: "klaar" } },
  ]);
});

test("voorvertoningKlikken: niets buiten een iframe of zonder ingesloten", () => {
  for (const [search, inIframe] of [
    ["?pad=/", true],
    ["?ingesloten=1", false],
  ] as const) {
    const { v, klikken, berichten } = venster(search, [], inIframe);
    voorvertoningKlikken({ cmsUrl: CMS, venster: v as never });
    assert.equal(klikken.length + berichten.length, 0, search);
  }
});

test("voorvertoningKlikken: klik kiest het veld, links buiten een sectie worden niet gevolgd, typen na een selectie", () => {
  const sectie = element({ "data-cms-sectie": SECTIE });
  const luister: Record<string, Fn> = {};
  const veld = {
    ...element({ "data-cms-veld": "titel" }, sectie),
    textContent: "Welkom",
    childElementCount: 0,
    contentEditable: "inherit",
    addEventListener: (t: string, f: Fn) => {
      luister[t] = f;
    },
    removeEventListener: (t: string) => {
      delete luister[t];
    },
    focus() {},
  };
  const { v, berichten, klikken, berichtLuisteraars } = venster(
    "?ingesloten=1",
    [veld],
  );
  voorvertoningKlikken({ cmsUrl: CMS, venster: v as never });
  berichten.shift();
  const e = klik(veld);
  klikken[0](e);
  assert.equal(e.gevolgd, false);
  assert.deepEqual(berichten.shift(), {
    doel: CMS,
    b: {
      bron: "cms-voorbeeld",
      soort: "kies",
      sectieId: SECTIE,
      pad: ["titel"],
      item: null,
      typbaar: true,
    },
  });
  const menu = klik({
    getAttribute: () => null,
    closest: (s: string) => (s === "a[href]" ? {} : null),
  });
  klikken[0](menu);
  assert.equal(
    menu.gevolgd,
    false,
    "een link buiten een sectie opent geen andere pagina",
  );
  assert.equal(berichten.length, 0);
  const selectie = {
    bron: "cms-editor",
    soort: "selectie",
    geselecteerd: SECTIE,
    pad: ["titel"],
    typen: 2,
  };
  berichtLuisteraars[0]({ origin: "https://kwaad.example", data: selectie });
  assert.equal(veld.contentEditable, "inherit", "een andere origin telt niet");
  berichtLuisteraars[0]({ origin: CMS, data: selectie });
  assert.match(veld.contentEditable, /^(plaintext-only|true)$/);
  veld.textContent = "Welkom thuis";
  luister.input({});
  assert.deepEqual(berichten.shift(), {
    doel: CMS,
    b: {
      bron: "cms-voorbeeld",
      soort: "tekst",
      sectieId: SECTIE,
      pad: ["titel"],
      waarde: "Welkom thuis",
      typen: 2,
    },
  });
  luister.keydown({ key: "Escape", preventDefault() {} });
  assert.equal(veld.textContent, "Welkom");
  assert.equal(berichten.shift()?.b.waarde, "Welkom");
  assert.equal(veld.contentEditable, "false");
});

test("voorvertoningVelden: tekstvelden per sectie, geen links of technische velden", () => {
  assert.deepEqual(
    voorvertoningVelden([
      {
        id: SECTIE,
        inhoud: {
          titel: "Kop",
          link: "/x",
          bg: "nacht",
          items: [{ tekst: "Een" }],
        },
      },
    ]),
    {
      [SECTIE]: [
        { pad: ["titel"], waarde: "Kop" },
        { pad: ["items", 0, "tekst"], waarde: "Een" },
      ],
    },
  );
});
