// Formulierbouwer: voorwaarde per veld (CMS-veld toon_als). Puur, los te testen.

export type Veld = { label: string; type: string; opties: string[]; verplicht: boolean; toonAls?: string };

/** CMS-veld toon_als, bv. "Interesse=Ja": toon dit veld alleen als het veld met dat label die waarde heeft. */
export function zichtbaar(v: Veld, waarden: Record<string, string>): boolean {
  const m = v.toonAls?.match(/^\s*([^=]+?)\s*=\s*(.+?)\s*$/);
  if (!m) return true;
  return (waarden[m[1]] ?? "").toLowerCase() === m[2].toLowerCase();
}
