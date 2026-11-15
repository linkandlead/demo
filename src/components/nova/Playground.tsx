"use client";

import Link from "next/link";
import { useState } from "react";
import { KERNBLOKKEN, variantOpties } from "@/content/kernblokken";
import type { BlokVoorbeeld } from "./BlokVoorbeelden";

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

// De preview is het echte NOVA-blok (zelfde renderer als de site), verkleind weergegeven.
export function Playground({ voorbeelden }: { voorbeelden: Record<string, BlokVoorbeeld> }) {
  const [groep, setGroep] = useState(ALLE);
  const [blokNaam, setBlokNaam] = useState("Header (hero)");
  const natuurlijk = (naam: string) =>
    ACHTERGRONDEN.find(([, , token]) => token === voorbeelden[naam]?.bg)?.[0] ?? "Licht";
  const [achtergrond, setAchtergrond] = useState(() => natuurlijk("Header (hero)"));
  const [variant, setVariant] = useState<string | null>(null);

  const blokken =
    groep === ALLE
      ? KERNBLOKKEN
      : KERNBLOKKEN.filter((b) => b.categorie === groep);
  const blok = blokken.find((b) => b.naam === blokNaam) ?? blokken[0];
  const voorbeeld = voorbeelden[blok.naam];
  const opties = variantOpties(blok.varianten, blok.naam);
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
          <h3>Kies een blok.</h3>
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
            </div>
          </div>
          <div className="pv-venster" aria-label={`Voorbeeld van het blok ${blok.naam}`}>
            <div
              className="pv-frame"
              data-bg={bgToken}
              data-variant={huidigeVariant}
              // Interactie in de preview is echt (formulieren, configurator), maar links openen niets.
              onClickCapture={(e) => {
                if ((e.target as HTMLElement).closest("a")) e.preventDefault();
              }}
            >
              {voorbeeld?.varianten[huidigeVariant] ?? (
                <div className="demo-note">Voor dit blok is nog geen voorbeeld beschikbaar.</div>
              )}
            </div>
          </div>
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
              <strong>Previewvariant</strong>
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
