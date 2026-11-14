import type { ReactNode } from "react";

// Wat een gekozen variant in de blokkenverkenner zichtbaar verandert. Elke variant uit de
// CMS-specificatie krijgt een eigen weergave: ligging van het beeld, kolommen, kleurstelling,
// formuliersoort, enzovoort. Varianten zonder visueel verschil ("Standaard") tonen de basisvorm.

export type VariantWeergave = {
  /** Extra klassen op .block-preview (ligging van beeld en tekst). */
  klasse: string;
  /** Overschrijft de achtergrondkeuze (bv. Conclusieregel donker/accent). */
  achtergrond?: string;
  /** Overschrijft de kop (A/B-test, personalisatie). */
  kop?: string;
  /** Extra inhoud onder de tekst. */
  extra?: ReactNode;
};

const kaartjes = (n: number) => (
  <div className="pv-kolommen" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i}>
        <b>0{i + 1}</b>
        <span>Kolom {i + 1}</span>
      </div>
    ))}
  </div>
);

function Stappen({ stijl }: { stijl: "pijl" | "cirkel" | "lijn" | "blok" }) {
  const s = ["Ontdek", "Ontwerp", "Bouw", "Deel"];
  if (stijl === "cirkel")
    return (
      <div className="pv-cirkel" aria-hidden="true">
        {s.map((x, i) => (
          <span key={x} style={{ transform: `rotate(${i * 90}deg) translate(62px) rotate(${-i * 90}deg)` }}>
            {x}
          </span>
        ))}
        <b>↻</b>
      </div>
    );
  return (
    <div className={`pv-stappen pv-${stijl}`}>
      {s.map((x, i) => (
        <span key={x}>
          <b>{String(i + 1).padStart(2, "0")}</b> {x}
        </span>
      ))}
    </div>
  );
}

export function variantWeergave(blok: string, variant: string): VariantWeergave {
  const v = variant.toLowerCase();

  // Ligging van beeld en tekst
  if (v === "gecentreerd") return { klasse: "v-midden" };
  if (v === "beeld links") return { klasse: "v-links" };
  if (v === "beeld rechts") return { klasse: "" };
  if (v === "achtergrondbeeld") return { klasse: "v-achtergrond" };
  if (v === "compact") return { klasse: "v-compact" };

  // Kolommen
  const kol = v.match(/^(\d) kolom/);
  if (kol) return { klasse: "v-zonder-beeld", extra: kaartjes(Number(kol[1])) };

  // Kleurvarianten
  if (blok === "Conclusieregel") return { klasse: "", achtergrond: v === "donker" ? "deepest" : "accent" };
  if (blok === "Bewegende tekstband")
    return {
      klasse: "v-zonder-beeld",
      extra: (
        <div className={`pv-band pv-band-${v}`}>CREËREN / VERBINDEN / ONTDEKKEN / BOUWEN /</div>
      ),
    };

  // Reeks stappen
  if (blok === "Reeks stappen") {
    const stijl = /cirkel|kringloop/.test(v)
      ? "cirkel"
      : /pijplijn|fasenstrip|keten/.test(v)
        ? "pijl"
        : /tijdlijn|weken/.test(v)
          ? "lijn"
          : "blok";
    return { klasse: "v-zonder-beeld", extra: <Stappen stijl={stijl} /> };
  }

  // Aan/uit-varianten
  if (v === "logo’s aan")
    return {
      klasse: "v-zonder-beeld",
      extra: (
        <div className="pv-logos" aria-hidden="true">
          {["ATELIER", "NORTH", "LUMEN", "FIELD"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      ),
    };
  if (v === "logo’s uit" || v === "foto uit" || v === "filters uit") return { klasse: "v-zonder-beeld" };
  if (v === "foto aan") return { klasse: "" };
  if (v === "filters aan")
    return {
      klasse: "v-zonder-beeld",
      extra: (
        <div className="chip-row" style={{ marginTop: 18 }}>
          {["Alles", "Ontwerp", "Cultuur", "Technologie"].map((f, i) => (
            <span className={`chip${i === 0 ? " active" : ""}`} key={f}>
              {f}
            </span>
          ))}
        </div>
      ),
    };

  // Collectieweergave
  if (v === "lijst")
    return {
      klasse: "v-zonder-beeld",
      extra: (
        <div className="pv-lijst">
          {["Aurora Pavilion", "Lumen Experience", "Echo Spaces"].map((x) => (
            <span key={x}>
              {x} <b>↗</b>
            </span>
          ))}
        </div>
      ),
    };
  if (v === "raster") return { klasse: "v-zonder-beeld", extra: kaartjes(3) };
  if (v === "uitgelicht") return { klasse: "v-achtergrond" };

  // Formulieren en interactie
  if (blok === "Formulier") {
    const velden =
      v === "nieuwsbrief" ? ["E-mailadres"] : v === "url-scan" ? ["Websiteadres (https://…)"] : ["Naam", "E-mailadres", "Je vraag"];
    return {
      klasse: "v-zonder-beeld",
      extra: (
        <div className="pv-velden">
          {velden.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      ),
    };
  }
  if (v === "nps 0–10")
    return {
      klasse: "v-zonder-beeld",
      extra: (
        <div className="chip-row" style={{ marginTop: 18 }}>
          {Array.from({ length: 11 }, (_, i) => (
            <span className={`chip${i === 9 ? " active" : ""}`} key={i}>
              {i}
            </span>
          ))}
        </div>
      ),
    };
  if (v === "sterren")
    return { klasse: "v-zonder-beeld", extra: <div className="pv-sterren" aria-label="4 van 5 sterren">★★★★☆</div> };
  if (v === "versie a") return { klasse: "", kop: "Maak ruimte voor nieuwe ideeën." };
  if (v === "versie b") return { klasse: "v-links", kop: "Geef jouw volgende idee een vliegende start." };
  if (v === "nieuwe bezoeker") return { klasse: "", kop: "Welkom bij NOVA." };
  if (v === "bekende bezoeker") return { klasse: "", kop: "Fijn dat je er weer bent." };
  if (v === "aantal personen aan")
    return {
      klasse: "v-zonder-beeld",
      extra: (
        <div className="pv-velden">
          <span>Type ervaring ▾</span>
          <span>Aantal personen: 25 ━━━━●━━━</span>
        </div>
      ),
    };
  if (v === "aantal personen uit")
    return {
      klasse: "v-zonder-beeld",
      extra: (
        <div className="pv-velden">
          <span>Type ervaring ▾</span>
        </div>
      ),
    };
  return { klasse: "" };
}
