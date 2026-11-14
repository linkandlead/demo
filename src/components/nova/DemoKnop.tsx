"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

// Knop voor acties die in de demo niet echt mogen gebeuren (betalen, tickets kopen). In plaats
// van alert() uit het prototype een zichtbare, toegankelijke demonstratiestatus onder de knop.
export function DemoKnop({
  children,
  melding,
  style,
}: {
  children: ReactNode;
  melding: string;
  style?: CSSProperties;
}) {
  const [toon, setToon] = useState(false);
  return (
    <>
      <button
        type="button"
        className="btn btn-dark"
        style={style}
        onClick={() => setToon(true)}
      >
        {children}
      </button>
      <p
        className="form-status ok"
        role="status"
        aria-live="polite"
        hidden={!toon}
      >
        {melding}
      </p>
    </>
  );
}
