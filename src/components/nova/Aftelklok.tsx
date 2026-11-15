"use client";

import { useEffect, useState } from "react";
import { doelInTijdzone } from "@/lib/tijd";

// Aftelklok (CMS-blok aftelklok): telt af naar `doeldatum`; daarna de verlopen-tekst.
export function Aftelklok({ doel, verlopen, tijdzone = "Europe/Amsterdam" }: { doel: string; verlopen: string; tijdzone?: string }) {
  const doelMs = doelInTijdzone(doel, tijdzone);
  const [nu, setNu] = useState<number | null>(null);
  useEffect(() => {
    // Pas na het laden de klok starten (server en browser renderen eerst hetzelfde).
    const eerst = setTimeout(() => setNu(Date.now()), 0);
    const t = setInterval(() => setNu(Date.now()), 1000);
    return () => {
      clearTimeout(eerst);
      clearInterval(t);
    };
  }, []);
  if (Number.isNaN(doelMs)) return null;
  const rest = nu === null ? null : Math.max(0, doelMs - nu);
  if (rest === 0) return <p className="aftel-verlopen">{verlopen}</p>;
  const delen: Array<[number, string]> =
    rest === null
      ? [[0, "dagen"], [0, "uur"], [0, "minuten"], [0, "seconden"]]
      : [
          [Math.floor(rest / 86400000), "dagen"],
          [Math.floor(rest / 3600000) % 24, "uur"],
          [Math.floor(rest / 60000) % 60, "minuten"],
          [Math.floor(rest / 1000) % 60, "seconden"],
        ];
  return (
    <div className="aftelklok" role="timer" aria-live="off">
      {delen.map(([n, l]) => (
        <div key={l}>
          <strong>{nu === null ? "—" : String(n).padStart(2, "0")}</strong>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}
