"use client";

import { useState, type FormEvent } from "react";
import { verstuurInzending } from "./LabFormulieren";

// Configurator (calcPrice) en de drie "smart interactions" uit lab() van het prototype.
export type ConfigOptie = { label: string; prijs: number };

export function Configurator({
  opties,
  groep,
  aantalLabel,
  vraagAantal,
  bevestiging,
}: {
  opties: ConfigOptie[];
  groep: string;
  aantalLabel: string;
  vraagAantal: boolean;
  bevestiging: string;
}) {
  const [keuze, setKeuze] = useState(0);
  const [mensen, setMensen] = useState(25);
  const pakket = opties[keuze]?.prijs ?? 0;
  const prijs = pakket + (vraagAantal ? mensen * 20 : 0);
  return (
    <>
      <div className="form-field">
        <label htmlFor="lab-pkg">{groep}</label>
        <select
          id="lab-pkg"
          value={keuze}
          onChange={(e) => setKeuze(Number(e.target.value))}
        >
          {opties.map((o, i) => (
            <option key={o.label} value={i}>
              {o.label} — € {o.prijs.toLocaleString("nl-NL")}
            </option>
          ))}
        </select>
      </div>
      {vraagAantal ? (
      <div className="form-field">
        <label htmlFor="lab-people">{aantalLabel}</label>
        <input
          type="range"
          min="5"
          max="100"
          value={mensen}
          id="lab-people"
          onChange={(e) => setMensen(Number(e.target.value))}
        />
        <div style={{ fontSize: 13 }}>
          <strong id="people-val">{mensen}</strong> personen
        </div>
      </div>
      ) : null}
      <div
        style={{ background: "var(--mist)", padding: 30 }}
        aria-live="polite"
      >
        <span className="eyebrow">INDICATIEVE VOORBEELDPRIJS</span>
        <h3 style={{ fontSize: 70 }} id="lab-price">
          € {prijs.toLocaleString("nl-NL")}
        </h3>
        <p style={{ fontSize: 12 }}>{bevestiging}</p>
      </div>
    </>
  );
}

export function Nps({
  vraag,
  toelichting,
  knoptekst,
  bevestiging,
  sterren = false,
}: {
  vraag: string;
  toelichting: string;
  knoptekst: string;
  bevestiging: string;
  /** Enquêtesoort "sterren": 1–5 sterren in plaats van een score van 0 tot 10. */
  sterren?: boolean;
}) {
  const [score, setScore] = useState<number | null>(null);
  const [status, setStatus] = useState<{ soort: "ok" | "fout"; tekst: string } | null>(null);
  const [bezig, setBezig] = useState(false);

  async function verstuur(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (score === null) {
      setStatus({ soort: "fout", tekst: sterren ? "Kies eerst 1 tot 5 sterren." : "Kies eerst een score van 0 tot 10." });
      return;
    }
    const form = e.currentTarget;
    setBezig(true);
    const r = await verstuurInzending(
      { soort: "nps", score, vraag: new FormData(form).get("vraag") },
      bevestiging,
    );
    setBezig(false);
    setStatus(r.status);
    if (r.status.soort === "ok") {
      form.reset();
      setScore(null);
    }
  }

  return (
    <form onSubmit={verstuur} noValidate>
      {sterren ? (
        <div className="sterren-rij" role="radiogroup" aria-label={vraag || "Aantal sterren"}>
          {[1, 2, 3, 4, 5].map((x) => (
            <button
              type="button"
              key={x}
              role="radio"
              aria-checked={score === x}
              aria-label={`${x} ${x === 1 ? "ster" : "sterren"}`}
              className={score !== null && x <= score ? "aan" : ""}
              onClick={() => setScore(x)}
            >
              ★
            </button>
          ))}
        </div>
      ) : (
        <div className="chip-row" role="radiogroup" aria-label={vraag || "Score van 0 tot 10"}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
            <button
              type="button"
              key={x}
              role="radio"
              className={`chip ${score === x ? "active" : ""}`}
              aria-checked={score === x}
              onClick={() => setScore(x)}
            >
              {x}
            </button>
          ))}
        </div>
      )}
      <div className="form-field" style={{ marginTop: 14 }}>
        <label htmlFor="nps-waarom">{toelichting || "Waarom geef je deze score?"}</label>
        <textarea id="nps-waarom" name="vraag" style={{ minHeight: 80 }} maxLength={2000} />
      </div>
      <button className="btn btn-dark" style={{ marginTop: 12 }} disabled={bezig}>
        {bezig ? "Bezig…" : `${knoptekst || "Verstuur"} ↗`}
      </button>
      <p className={`form-status${status ? ` ${status.soort}` : ""}`} role="status" aria-live="polite">
        {status?.tekst}
      </p>
    </form>
  );
}

export function Wissel({
  id,
  eyebrow,
  a,
  b,
  knop,
  startMetB = false,
}: {
  id: string;
  eyebrow: string;
  a: string;
  b: string;
  knop: string;
  startMetB?: boolean;
}) {
  const [eerste, setEerste] = useState(!startMetB);
  return (
    <>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h3 style={{ marginTop: 12 }} id={id} aria-live="polite">
          {eerste ? a : b}
        </h3>
      </div>
      <button className="btn btn-dark" onClick={() => setEerste((v) => !v)}>
        {knop}
      </button>
    </>
  );
}
