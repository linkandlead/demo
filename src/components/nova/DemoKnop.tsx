"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

// Knop voor acties die in de demo niet echt mogen gebeuren (betalen, tickets kopen). In plaats
// van alert() uit het prototype een zichtbare, toegankelijke demonstratiestatus onder de knop.
export function DemoKnop({
  children,
  melding,
  style,
  stijl,
}: {
  children: ReactNode;
  melding: string;
  style?: CSSProperties;
  /** "slot": een tijdvak in de agenda-inplanner in plaats van een gewone knop. */
  stijl?: "slot";
}) {
  const [toon, setToon] = useState(false);
  const Omhulsel = stijl === "slot" ? "div" : "span";
  return (
    <Omhulsel className={stijl === "slot" ? "slot" : "demo-knop"}>
      <button
        type="button"
        className={stijl === "slot" ? "slot-knop" : "btn btn-dark"}
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
    </Omhulsel>
  );
}
