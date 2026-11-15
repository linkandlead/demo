"use client";

import { useState } from "react";
import type { Post } from "@/content/nova";
import { EmptyState, StoryCard } from "./ui";

// Rubriekfilter op Verhalen (CMS-veld rubriek van de artikelen), zoals het sectorfilter op Werk.
export function VerhalenFilter({ posts }: { posts: Array<Post & { lead?: string }> }) {
  const [rubriek, setRubriek] = useState<string | null>(null);
  const rubrieken = [...new Set(posts.map((p) => p.cat).filter(Boolean))];
  const zichtbaar = rubriek ? posts.filter((p) => p.cat === rubriek) : posts;
  return (
    <>
      {rubrieken.length > 1 ? (
        <div className="chip-row" style={{ marginBottom: 25 }} role="group" aria-label="Filter op rubriek">
          {[null, ...rubrieken].map((r) => (
            <button
              key={r ?? "alles"}
              type="button"
              className={`chip ${rubriek === r ? "active" : ""}`}
              aria-pressed={rubriek === r}
              onClick={() => setRubriek(r)}
            >
              {r ? r.charAt(0) + r.slice(1).toLowerCase() : "Alles"}
            </button>
          ))}
        </div>
      ) : null}
      {zichtbaar.length ? (
        <div className="article-grid" aria-live="polite">
          {zichtbaar.map((p) => (
            <StoryCard key={p.slug} post={p} />
          ))}
        </div>
      ) : (
        <EmptyState>Er zijn geen verhalen in deze rubriek.</EmptyState>
      )}
    </>
  );
}
