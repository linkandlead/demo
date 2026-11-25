// Ongewijzigde kopie uit linkandlead-cms packages/site-kit 1.25.0 (src/meetnaam.ts): de bezoekmeting met toestemming.
// Niet hier bewerken; verbeteringen horen in de site-kit en komen met een nieuwe kopie hierheen.
// Meetnamen (G9, B-142): een vaste naam per blok en per knop, zodat een klik of weergave in de meting en in
// rapportages altijd dezelfde naam heeft, ook als de tekst of de plek op de pagina verandert. De redactie zet
// `meetnaam` op een blok en `<linkveld>_meetnaam` bij een knop; in de HTML wordt dat `data-cms-meet`, plus
// `data-cms-item` voor een record. Puur, zonder DOM: het CMS (editor, gedeelde renderer, /api/spoor) en de
// site-kit gebruiken dezelfde regels.

export const MEETNAAM_VELD = 'meetnaam'
const MEETNAAM_ACHTERVOEGSEL = '_meetnaam'
// Kleine letters, cijfers, -, _ en . (voor `blok.knop`), begint met een letter of cijfer. Zo is een meetnaam
// veilig in een attribuut, een CSV en een URL, en kan er geen tekst van een bezoeker in sluipen.
const MEETNAAM = /^[a-z0-9][a-z0-9._-]{0,63}$/
// Item: het id of de slug van een record (uuid, slug of een getal).
const ITEM = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/

// De veldnaam van de meetnaam bij een linkveld: `knop` → `knop_meetnaam`.
export function meetnaamVeld(linkveld: string): string {
  return `${linkveld}${MEETNAAM_ACHTERVOEGSEL}`
}

export function isMeetnaamVeld(naam: string): boolean {
  return naam === MEETNAAM_VELD || naam.endsWith(MEETNAAM_ACHTERVOEGSEL)
}

// Een meetnaam in de vaste vorm, of null. Spaties en hoofdletters worden netjes gemaakt ("Hero knop" →
// "hero-knop"); wat daarna nog niet past, telt niet.
export function schoonMeetnaam(w: unknown): string | null {
  if (typeof w !== 'string') return null
  const s = w
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .slice(0, 64)
  return MEETNAAM.test(s) ? s : null
}

export function schoonItem(w: unknown): string | null {
  if (typeof w === 'number' && Number.isFinite(w)) return String(w)
  if (typeof w !== 'string') return null
  const s = w.trim()
  return ITEM.test(s) ? s : null
}

type BlokLike = { type: string; inhoud?: unknown }

function inhoudVan(blok: BlokLike): Record<string, unknown> {
  const i = blok.inhoud
  return i && typeof i === 'object' && !Array.isArray(i) ? (i as Record<string, unknown>) : {}
}

// De meetnaam van een blok, of van een knop (linkveld) in dat blok. Zonder ingestelde naam: het bloktype,
// en voor een knop `<bloktype>.<veld>`, zodat er altijd iets stabiels in de meting staat.
export function meetnaamVan(blok: BlokLike, veld?: string): string {
  const i = inhoudVan(blok)
  const eigen = schoonMeetnaam(veld ? i[meetnaamVeld(veld)] : i[MEETNAAM_VELD])
  if (eigen) return eigen
  const type = schoonMeetnaam(blok.type) ?? 'blok'
  const v = veld ? schoonMeetnaam(veld) : null
  return v ? `${type}.${v}`.slice(0, 64) : type
}

export type MeetAttributen = { 'data-cms-meet': string; 'data-cms-item'?: string }

// Attributen voor een element, om te spreiden in JSX: `<a {...meetAttributen(blok, 'knop')}>` of
// `<li {...meetAttributen(blok, undefined, record.id)}>`. De klikmeting van de site-kit leest ze.
export function meetAttributen(blok: BlokLike, veld?: string, item?: unknown): MeetAttributen {
  const it = schoonItem(item)
  return { 'data-cms-meet': meetnaamVan(blok, veld), ...(it ? { 'data-cms-item': it } : {}) }
}
