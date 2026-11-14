"use client";

import { useState } from "react";
import type { Case } from "@/content/nova";
import { EmptyState, PicCard } from "./ui";

const FILTERS = [
  "ALL",
  "BELEVING",
  "ONTWERP",
  "CULTUUR",
  "EVENEMENT",
  "TECHNOLOGIE",
  "RUIMTE",
];

// Cases-collectie met sectorfilter (CMS: Cases · filter op sector) — filterWork() uit het prototype.
export function WorkGrid({ cases }: { cases: Case[] }) {
  const [filter, setFilter] = useState("ALL");
  // Met CMS-data: toon alleen sectoren die echt voorkomen (plus "alle").
  const sectoren = new Set(cases.map((c) => c.type));
  const knoppen = FILTERS.filter((f) => f === "ALL" || sectoren.has(f)).concat(
    [...sectoren].filter((s) => s && !FILTERS.includes(s)),
  );
  const zichtbaar = cases.filter((x) => filter === "ALL" || x.type === filter);
  return (
    <>
      <div
        className="chip-row"
        id="work-filters"
        role="group"
        aria-label="Filter projecten"
      >
        {knoppen.map((f) => (
          <button
            key={f}
            className={`chip ${f === filter ? "active" : ""}`}
            aria-pressed={f === filter}
            onClick={() => setFilter(f)}
          >
            {f === "ALL" ? "Alle projecten" : f.toLowerCase()}
          </button>
        ))}
      </div>
      {zichtbaar.length ? (
        <div className="project-grid" id="projects">
          {zichtbaar.map((x) => (
            <div key={x.slug}>
              <PicCard item={x} />
              <div className="project-title">
                <div>
                  <h3>{x.name}</h3>
                  <p>{[x.type, x.year].filter(Boolean).join(" · ")}</p>
                </div>
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 35 }}>
          <EmptyState>Geen projecten in deze categorie.</EmptyState>
        </div>
      )}
    </>
  );
}
