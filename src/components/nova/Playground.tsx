"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { KERNBLOKKEN, variantOpties } from "@/content/kernblokken";

type Overzicht = Record<string, { slug: string; bg: string; varianten: string[] }>;
const BREEDTE = { desktop: 1440, mobiel: 390 } as const;

/** Het echte blok in een iframe (eigen pagina /blokvoorbeeld/…), verkleind tot de breedte van het
 *  venster. Een iframe rekent met een echt schermformaat, dus "Mobiel" toont de telefoonopmaak.
 *  Pas bij het kiezen wordt het voorbeeld geladen. */
function VoorbeeldVenster({
  src,
  weergave,
  wareGrootte,
  titel,
  variant,
}: {
  src: string;
  weergave: keyof typeof BREEDTE;
  wareGrootte: boolean;
  titel: string;
  variant: string;
}) {
  const venster = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [vensterBreedte, setVensterBreedte] = useState(900);
  const [hoogte, setHoogte] = useState(600);
  const [geladen, setGeladen] = useState(false);
  const breedte = BREEDTE[weergave];
  const schaal = wareGrootte ? 1 : Math.min(1, vensterBreedte / breedte);

  useEffect(() => {
    const el = venster.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setVensterBreedte(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Het iframe kan al geladen zijn voordat React de onLoad-handler koppelde (eerste weergave).
  useEffect(() => {
    if (frame.current?.contentDocument?.readyState === "complete") opLaden();
  }, [src]);

  function opLaden() {
    setGeladen(true);
    const doc = frame.current?.contentDocument;
    const win = frame.current?.contentWindow as (Window & typeof globalThis) | null;
    if (!doc || !win) return;
    // Links in het voorbeeld openen niets; formulieren en knoppen werken wel.
    doc.addEventListener("click", (e) => {
      if ((e.target as Element | null)?.closest?.("a")) e.preventDefault();
    }, true);
    if (doc.body.dataset.gekoppeld) return;
    doc.body.dataset.gekoppeld = "1";
    // Hoogte van het blok zelf (niet van het venster eromheen).
    const meet = () => setHoogte(Math.max(320, Math.ceil(doc.querySelector(".pv-pagina")?.getBoundingClientRect().height ?? doc.documentElement.scrollHeight)));
    meet();
    new win.ResizeObserver(meet).observe(doc.body);
  }

  return (
    <div className="pv-venster" ref={venster} aria-label={`Voorbeeld van het blok ${titel}`} data-variant={variant}>
      <div
        className={`pv-schaal${weergave === "mobiel" ? " pv-mobiel" : ""}`}
        style={{ width: breedte * schaal, height: hoogte * schaal }}
      >
        <iframe
          key={src}
          ref={frame}
          src={src}
          title={`Voorbeeld: ${titel} (${variant})`}
          onLoad={opLaden}
          className={geladen ? "geladen" : ""}
          style={{ width: breedte, height: hoogte, transform: `scale(${schaal})` }}
        />
      </div>
    </div>
  );
}

// Block Playground — playground() uit het prototype, nu met de echte veldnamen, de officiële
// varianten uit de PDF en het bijbehorende CMS-bloktype per blok. De preview zelf blijft een
// visuele indicatie (geen echte CMS-renderer); dat staat ook zo in de toelichting.

const ALLE = "Alle categorieën";
const GROEPEN = [
  ALLE,
  ...Array.from(new Set(KERNBLOKKEN.map((b) => b.categorie))),
];
const ACHTERGRONDEN: Array<[string, string, string]> = [
  ["Licht", "light", "wit"],
  ["Zacht", "soft", "mist"],
  ["Accent", "accent", "limoenlicht"],
  ["Donker", "dark", "diep"],
  ["Diepst", "deepest", "nacht"],
];

export function Playground({ voorbeelden }: { voorbeelden: Overzicht }) {
  const [groep, setGroep] = useState(ALLE);
  const [blokNaam, setBlokNaam] = useState("Header (hero)");
  const natuurlijk = (naam: string) =>
    ACHTERGRONDEN.find(([, , token]) => token === voorbeelden[naam]?.bg)?.[0] ?? "Licht";
  const [achtergrond, setAchtergrond] = useState(() => natuurlijk("Header (hero)"));
  // Formulieren en interactie bekijk je op ware grootte (in de verkleinde weergave zijn velden te klein).
  const interactief = (naam: string) => KERNBLOKKEN.find((b) => b.naam === naam)?.categorie === "Conversie en formulieren";
  const [wareGrootte, setWareGrootte] = useState(false);
  const [weergave, setWeergave] = useState<keyof typeof BREEDTE>("desktop");
  const [variant, setVariant] = useState<string | null>(null);

  const blokken =
    groep === ALLE
      ? KERNBLOKKEN
      : KERNBLOKKEN.filter((b) => b.categorie === groep);
  const blok = blokken.find((b) => b.naam === blokNaam) ?? blokken[0];
  const voorbeeld = voorbeelden[blok.naam];
  // Voorbeeldopstellingen (bv. bij de formulierbouwer) gaan voor de varianten uit de specificatie.
  const opties = voorbeelden[blok.naam]
    ? voorbeelden[blok.naam].varianten
    : variantOpties(blok.varianten, blok.naam);
  const huidigeVariant =
    variant && opties.includes(variant) ? variant : opties[0];
  const [, , bgToken] =
    ACHTERGRONDEN.find(([n]) => n === achtergrond) ?? ACHTERGRONDEN[0];

  return (
    <>
      <div
        className="chip-row"
        style={{ marginBottom: 28 }}
        role="group"
        aria-label="Categorie"
      >
        {GROEPEN.map((g) => (
          <button
            key={g}
            className={`chip ${g === groep ? "active" : ""}`}
            aria-pressed={g === groep}
            onClick={() => setGroep(g)}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="playground-layout">
        <aside className="block-menu">
          <span className="eyebrow">
            BLOKKENBIBLIOTHEEK · {blokken.length} BLOKKEN
          </span>
          <h3 role="heading" aria-level={2}>Kies een blok.</h3>
          <div className="block-list" role="listbox" aria-label="CMS-blokken">
            {blokken.map((b) => (
              <button
                key={b.naam}
                role="option"
                aria-selected={b.naam === blok.naam}
                className={b.naam === blok.naam ? "active" : ""}
                onClick={() => {
                  setBlokNaam(b.naam);
                  setVariant(null);
                  setAchtergrond(natuurlijk(b.naam));
                  setWareGrootte(interactief(b.naam));
                }}
              >
                <span>{b.naam}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="block-viewer">
          <div className="toolbar">
            <div>
              <span className="eyebrow">LIVE ONTWERPVOORBEELD</span>
              <h3 style={{ fontSize: 29, marginTop: 6 }}>{blok.naam}</h3>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <select
                aria-label="Kies achtergrond"
                value={achtergrond}
                onChange={(e) => setAchtergrond(e.target.value)}
              >
                {ACHTERGRONDEN.map(([n]) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
              <select
                aria-label="Kies variant"
                value={huidigeVariant}
                onChange={(e) => setVariant(e.target.value)}
              >
                {opties.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <div className="chip-row" role="group" aria-label="Schermformaat">
                {(["desktop", "mobiel"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`chip ${weergave === w ? "active" : ""}`}
                    aria-pressed={weergave === w}
                    onClick={() => setWeergave(w)}
                  >
                    {w === "desktop" ? "Desktop" : "Mobiel"}
                  </button>
                ))}
                <button
                  type="button"
                  className={`chip ${wareGrootte ? "active" : ""}`}
                  aria-pressed={wareGrootte}
                  onClick={() => setWareGrootte((w) => !w)}
                >
                  Ware grootte
                </button>
              </div>
            </div>
          </div>
          {voorbeeld ? (
            <VoorbeeldVenster
              src={`/blokvoorbeeld/${voorbeeld.slug}?variant=${encodeURIComponent(huidigeVariant)}&bg=${bgToken}`}
              weergave={weergave}
              wareGrootte={wareGrootte}
              titel={blok.naam}
              variant={huidigeVariant}
            />
          ) : (
            <div className="demo-note">Voor dit blok is nog geen voorbeeld beschikbaar.</div>
          )}
          <div className="block-details">
            <div>
              <strong>CMS-blok</strong>
              <br />
              <span>{blok.naam}</span>
            </div>
            <div>
              <strong>Ontwerpachtergrond</strong>
              <br />
              <span>
                {achtergrond} (kleurveld {bgToken})
              </span>
            </div>
            <div>
              <strong>{voorbeelden[blok.naam] && !variantOpties(blok.varianten, blok.naam).includes(huidigeVariant) ? "Voorbeeldopstelling" : "Previewvariant"}</strong>
              <br />
              <span>{huidigeVariant}</span>
            </div>
          </div>
          <div className="block-fields">
            <strong>Wat de redacteur invult</strong>{" "}
            {blok.cmsType ? (
              <span style={{ fontSize: 12, color: "#5c6675" }}>
                · bloktype <code>{blok.cmsType}</code> in het CMS
              </span>
            ) : (
              <span style={{ fontSize: 12, color: "#7c2412" }}>
                · nog geen bloktype in de CMS-code (alleen in de specificatie)
              </span>
            )}
            <ul>
              {blok.velden.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
          <div className="demo-note" style={{ marginTop: 14 }}>
            Het voorbeeld is het echte NOVA-blok, gemaakt met dezelfde code als de
            site, met voorbeeldinhoud. Links in het voorbeeld zijn uitgeschakeld.
            De 43 namen, velden en varianten komen uit de CMS-specificatie.{" "}
            <Link href="/one#aanvraag" style={{ textDecoration: "underline" }}>
              Plan een kennismaking ↗
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
