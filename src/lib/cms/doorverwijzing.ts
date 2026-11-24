import type { CmsRedirect } from "./valideer.ts";

// Doorverwijzingen uit het CMS (Beheer > Redirects). Puur, zodat het los te testen is.
// Een doorverwijzing gaat voor een pagina: staat er voor dit pad een regel, dan wordt er doorgestuurd.

/** Pad zonder query, anker en slash aan het eind ("/Oud/?a=1" → "/oud"), in kleine letters. */
export function normaalPad(pad: string): string {
  return (pad.split(/[?#]/)[0].replace(/\/+$/, "") || "/").toLowerCase();
}

/** De doorverwijzing voor dit pad, of null. Een keten (a → b → c) wordt in één stap opgelost; een lus geeft null. */
export function vindDoorverwijzing(lijst: readonly CmsRedirect[], pad: string): CmsRedirect | null {
  const per = new Map(lijst.map((r) => [normaalPad(r.van), r]));
  let huidig = per.get(normaalPad(pad));
  if (!huidig) return null;
  const gezien = new Set<string>([normaalPad(pad)]);
  while (huidig && !/^https:\/\//.test(huidig.naar)) {
    const sleutel = normaalPad(huidig.naar);
    if (gezien.has(sleutel)) return null;
    gezien.add(sleutel);
    const volgende = per.get(sleutel);
    if (!volgende) break;
    huidig = { ...volgende, van: huidig.van };
  }
  return huidig ?? null;
}
