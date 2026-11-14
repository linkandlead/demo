"use client";

import { useState } from "react";

// Configurator (calcPrice) en de drie "smart interactions" uit lab() van het prototype.
export function Configurator() {
  const [pakket, setPakket] = useState(150);
  const [mensen, setMensen] = useState(25);
  const prijs = pakket + mensen * 20;
  return (
    <>
      <div className="form-field">
        <label htmlFor="lab-pkg">Type ervaring</label>
        <select
          id="lab-pkg"
          value={pakket}
          onChange={(e) => setPakket(Number(e.target.value))}
        >
          <option value="150">Creative Session — € 150</option>
          <option value="300">Immersive Event — € 300</option>
          <option value="450">Full Experience — € 450</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="lab-people">Aantal deelnemers</label>
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
      <div
        style={{ background: "var(--mist)", padding: 30 }}
        aria-live="polite"
      >
        <span className="eyebrow">INDICATIEVE DEMOPRIJS</span>
        <h3 style={{ fontSize: 70 }} id="lab-price">
          € {prijs.toLocaleString("nl-NL")}
        </h3>
        <p style={{ fontSize: 12 }}>
          Demonstratie zonder offerte of betaalverplichting.
        </p>
      </div>
    </>
  );
}

export function Nps() {
  const [score, setScore] = useState<number | null>(null);
  return (
    <div>
      <div className="chip-row" role="group" aria-label="Demoscore">
        {[7, 8, 9, 10].map((x) => (
          <button
            key={x}
            className={`chip ${score === x ? "active" : ""}`}
            aria-pressed={score === x}
            onClick={() => setScore(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <p style={{ marginTop: 12 }}>Selecteer een demoscore.</p>
    </div>
  );
}

export function Wissel({
  id,
  a,
  b,
  knop,
}: {
  id: string;
  a: string;
  b: string;
  knop: string;
}) {
  const [eerste, setEerste] = useState(true);
  return (
    <>
      <div>
        <span className="eyebrow">
          {id === "ab-text" ? "A/B-TEST" : "PERSONALISATIE"}
        </span>
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
