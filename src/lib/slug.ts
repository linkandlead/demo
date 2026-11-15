// Slugs voor detailpagina's (puur, los te testen).

/** "Maya Chen" → "maya-chen"; "Amélie d'Or" → "amelie-d-or". */
export function persoonSlug(naam: string): string {
  return naam
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
