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
          <option value="150">Creatieve sessie — € 150</option>
          <option value="300">Meeslepend evenement — € 300</option>
          <option value="450">Volledige beleving — € 450</option>
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
        <span className="eyebrow">INDICATIEVE VOORBEELDPRIJS</span>
        <h3 style={{ fontSize: 70 }} id="lab-price">
          € {prijs.toLocaleString("nl-NL")}
        </h3>
        <p style={{ fontSize: 12 }}>
          Dit is een rekenvoorbeeld. Er is nog geen echte reservering of
          offerteaanvraag gedaan.
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
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
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
      <p style={{ marginTop: 12 }} aria-live="polite">
        {score === null
          ? "Kies een score van 0 tot 10. Je feedback blijft in deze demonstratie."
          : "Bedankt! Je score is alleen als demonstratie verwerkt."}
      </p>
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
