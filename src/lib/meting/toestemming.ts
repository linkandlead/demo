// Ongewijzigde kopie uit linkandlead-cms packages/site-kit 1.25.0 (src/toestemming.ts): de bezoekmeting met toestemming.
// Niet hier bewerken; verbeteringen horen in de site-kit en komen met een nieuwe kopie hierheen.
// Toestemming voor bezoekmeting (CMS-verzoek Hijs Hokij 6, FO §12.3), in lagen sinds G10 (B-142):
//   noodzakelijk  altijd; daaronder valt ook het bewaren van de keuze zelf;
//   meten         paginabezoeken, klikken en scroll naar het CMS (anonieme id per browser);
//   herkennen     een bezoeker over bezoeken heen herkennen (een bezoekerscookie van één jaar, die de server
//                 van de site zet, zie ./bezoekercookie). Werkt alleen samen met meten.
// Welke lagen een site vraagt, volgt uit `site.consent` (meten tenzij analytics 'uit'; herkennen alleen als
// `categorieen` 'herkennen' bevat). De keuze staat in localStorage én in een first-party cookie (zodat de
// server van de site hem kan lezen). `toestemming()` blijft "mag meten" en wordt bij elke gebeurtenis opnieuw
// gevraagd, dus intrekken werkt direct. Vraagt een site een laag die de bezoeker nog niet zag, dan komt de
// banner terug. Faalt nooit hard: zonder opslag (privévenster, server) is er geen keuze en dus geen meting.

export type ToestemmingKeuze = 'akkoord' | 'geweigerd' | null
export type ToestemmingLaag = 'meten' | 'herkennen'
export type ToestemmingLagen = { meten: boolean; herkennen: boolean }

type Opslagje = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }
// document.cookie of een vervanger in tests.
export type CookiePot = { lees(): string; schrijf(regel: string): void }

export type ToestemmingConsent = { banner?: boolean; analytics?: 'eigen' | 'uit'; categorieen?: readonly string[] | null }

export type MeetToestemming = {
  // Compatibel: 'akkoord' als meten is toegestaan, 'geweigerd' na een keuze zonder meten, null zonder keuze.
  keuze(): ToestemmingKeuze
  // De keuze per laag (null = nog niet gekozen). Een laag die de site niet vraagt, staat altijd op false.
  lagen(): ToestemmingLagen | null
  // Wanneer de keuze is gemaakt (ms sinds 1970), of null.
  tijdstip(): number | null
  // De lagen die deze site vraagt, in volgorde.
  aangeboden(): ToestemmingLaag[]
  // true alleen na toestemming voor meten én als meten aan staat in de site-instellingen.
  toestemming(): boolean
  // true alleen met toestemming voor meten én herkennen, en als de site herkennen vraagt.
  herkennen(): boolean
  // Moet de banner (opnieuw) zichtbaar zijn?
  moetVragen(): boolean
  // Alles wat de site vraagt toestaan (true) of alleen het noodzakelijke (false).
  geef(akkoord: boolean): void
  geefLagen(l: Partial<ToestemmingLagen>): void
  // Keuze wissen, zodat de banner terugkomt ("cookie-instellingen wijzigen"). Tot een nieuwe keuze geldt geen
  // toestemming: intrekken is zo één klik.
  wis(): void
  luister(f: (k: ToestemmingKeuze) => void): () => void
}

export type ToestemmingOpties = {
  // `site.consent` uit GET /api/v1/site.
  consent?: ToestemmingConsent | null
  sleutel?: string
  opslag?: Opslagje | null
  // Standaard document.cookie in de browser; null = geen cookie schrijven.
  cookie?: CookiePot | null
  // Secure-vlag op de cookie (standaard: als de pagina via https loopt).
  https?: boolean
  nu?: () => number
}

export const TOESTEMMING_SLEUTEL = 'll_toestemming'
export const TOESTEMMING_COOKIE = 'll_toestemming'
// Een jaar: de keuze hoeft niet vaker gevraagd te worden (richtlijn AP: maximaal ongeveer een jaar).
export const TOESTEMMING_MAX_SECONDEN = 365 * 24 * 60 * 60

// Opgeslagen vorm: `v2.m<0|1>.h<0|1|x>.<seconden>`; x = herkennen niet gevraagd. De oude waarden 'akkoord' en
// 'geweigerd' (één schakelaar) gelden als keuze voor meten, met herkennen niet gevraagd.
type Opgeslagen = { meten: boolean; herkennen: boolean | null; tijd: number | null }
const WAARDE = /^v2\.m([01])\.h([01x])\.(\d{1,12})$/

export function leesToestemmingWaarde(w: unknown): Opgeslagen | null {
  if (w === 'akkoord' || w === 'geweigerd') return { meten: w === 'akkoord', herkennen: null, tijd: null }
  if (typeof w !== 'string') return null
  const m = WAARDE.exec(w)
  if (!m) return null
  return { meten: m[1] === '1', herkennen: m[2] === 'x' ? null : m[2] === '1', tijd: Number(m[3]) * 1000 }
}

export function schrijfToestemmingWaarde(o: Opgeslagen): string {
  const h = o.herkennen === null ? 'x' : o.herkennen ? '1' : '0'
  return `v2.m${o.meten ? '1' : '0'}.h${h}.${Math.floor((o.tijd ?? 0) / 1000)}`
}

// De lagen die een site vraagt. Herkennen alleen samen met meten: zonder meten valt er niets te herkennen.
export function aangebodenLagen(consent: ToestemmingConsent | null | undefined): ToestemmingLaag[] {
  if (consent?.analytics === 'uit') return []
  const uit: ToestemmingLaag[] = ['meten']
  if (consent?.categorieen?.includes('herkennen')) uit.push('herkennen')
  return uit
}

// Effectieve lagen: wat de bezoeker toestond, begrensd tot wat de site vraagt.
export function effectieveLagen(o: Opgeslagen | null, aangeboden: readonly ToestemmingLaag[]): ToestemmingLagen | null {
  if (!o) return null
  const meten = aangeboden.includes('meten') && o.meten
  return { meten, herkennen: meten && aangeboden.includes('herkennen') && o.herkennen === true }
}

// Een cookie uit een Cookie-kop of document.cookie.
export function leesCookie(kop: string | null | undefined, naam: string): string | null {
  if (!kop) return null
  for (const deel of kop.split(';')) {
    const i = deel.indexOf('=')
    if (i < 0) continue
    if (deel.slice(0, i).trim() !== naam) continue
    const w = deel.slice(i + 1).trim()
    try {
      return decodeURIComponent(w)
    } catch {
      return w
    }
  }
  return null
}

export function cookieRegel(naam: string, waarde: string, o: { maxSeconden: number; https: boolean; httpOnly?: boolean }): string {
  return `${naam}=${encodeURIComponent(waarde)}; Path=/; Max-Age=${o.maxSeconden}; SameSite=Lax${o.https ? '; Secure' : ''}${o.httpOnly ? '; HttpOnly' : ''}`
}

function standaardOpslag(): Opslagje | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

function standaardCookie(): CookiePot | null {
  const d = (globalThis as { document?: { cookie: string } }).document
  if (!d) return null
  return {
    lees: () => {
      try {
        return d.cookie
      } catch {
        return ''
      }
    },
    schrijf: (r) => {
      try {
        d.cookie = r
      } catch {
        /* geblokkeerd: dan alleen localStorage */
      }
    },
  }
}

function standaardHttps(): boolean {
  return (globalThis as { location?: { protocol?: string } }).location?.protocol === 'https:'
}

export function maakToestemming(o: ToestemmingOpties = {}): MeetToestemming {
  const sleutel = o.sleutel ?? TOESTEMMING_SLEUTEL
  const opslag = o.opslag === undefined ? standaardOpslag() : o.opslag
  const cookie = o.cookie === undefined ? standaardCookie() : o.cookie
  const https = o.https ?? standaardHttps()
  const nu = o.nu ?? (() => Date.now())
  const aangeboden = aangebodenLagen(o.consent)
  const luisteraars = new Set<(k: ToestemmingKeuze) => void>()

  const ruw = (): Opgeslagen | null => {
    let w: string | null = null
    try {
      w = opslag?.getItem(sleutel) ?? null
    } catch {
      w = null
    }
    const uitOpslag = leesToestemmingWaarde(w)
    if (uitOpslag) return uitOpslag
    // De cookie overleeft als de browser localStorage leegmaakt (Safari na zeven dagen).
    return leesToestemmingWaarde(leesCookie(cookie?.lees(), TOESTEMMING_COOKIE))
  }
  const lagen = () => effectieveLagen(ruw(), aangeboden)
  const keuze = (): ToestemmingKeuze => {
    const l = lagen()
    return l === null ? null : l.meten ? 'akkoord' : 'geweigerd'
  }
  const meld = () => {
    const k = keuze()
    for (const f of luisteraars) f(k)
  }
  const bewaar = (l: Partial<ToestemmingLagen>) => {
    const meten = aangeboden.includes('meten') && l.meten === true
    const waarde: Opgeslagen = {
      meten,
      herkennen: aangeboden.includes('herkennen') ? meten && l.herkennen === true : null,
      tijd: nu(),
    }
    const tekst = schrijfToestemmingWaarde(waarde)
    try {
      opslag?.setItem(sleutel, tekst)
    } catch {
      /* opslag vol of geblokkeerd: de cookie houdt de keuze nog vast */
    }
    cookie?.schrijf(cookieRegel(TOESTEMMING_COOKIE, tekst, { maxSeconden: TOESTEMMING_MAX_SECONDEN, https }))
    meld()
  }

  return {
    keuze,
    lagen,
    tijdstip: () => ruw()?.tijd ?? null,
    aangeboden: () => [...aangeboden],
    toestemming: () => lagen()?.meten === true,
    herkennen: () => lagen()?.herkennen === true,
    moetVragen() {
      if (!o.consent || o.consent.banner === false || !aangeboden.length) return false
      const r = ruw()
      if (!r) return true
      // Een laag die de site nu vraagt maar die de bezoeker nooit zag (bv. herkennen later aangezet).
      return aangeboden.includes('herkennen') && r.meten && r.herkennen === null
    },
    geef(akkoord) {
      bewaar({ meten: akkoord, herkennen: akkoord })
    },
    geefLagen(l) {
      bewaar(l)
    },
    wis() {
      try {
        opslag?.removeItem(sleutel)
      } catch {
        /* idem */
      }
      cookie?.schrijf(cookieRegel(TOESTEMMING_COOKIE, '', { maxSeconden: 0, https }))
      meld()
    },
    luister(f) {
      luisteraars.add(f)
      return () => luisteraars.delete(f)
    },
  }
}

// Moet de banner zichtbaar zijn? Alleen als de site hem aan heeft staan en er nog geen keuze is.
// (Compatibel; de banner zelf gebruikt `moetVragen()`, die ook een nieuw gevraagde laag kent.)
export function toonBanner(consent: ToestemmingOpties['consent'], keuze: ToestemmingKeuze): boolean {
  return consent?.banner !== false && !!consent && keuze === null
}

// Consent mode v2 voor een Google-tag op een site met eigen frontend: meten → analytics_storage. Herkennen
// is geen advertentiedoel, dus de ad_*-signalen blijven altijd 'denied'.
export function consentModus(l: ToestemmingLagen | null): Record<string, 'granted' | 'denied'> {
  return {
    analytics_storage: l?.meten ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  }
}

export const TOESTEMMING_TEKSTEN = {
  titel: 'Mogen we meten hoe de site wordt gebruikt?',
  uitleg: 'We tellen bezoeken zonder je te volgen op andere sites. Je kunt je keuze altijd wijzigen.',
  akkoord: 'Akkoord',
  weigeren: 'Liever niet',
  privacy: 'Privacyverklaring',
  // Banner met lagen (als de site ook herkennen vraagt).
  alles: 'Alles toestaan',
  noodzakelijk: 'Alleen noodzakelijk',
  instellingen: 'Zelf kiezen',
  opslaan: 'Keuze opslaan',
  keuzes: 'Wat sta je toe?',
  laagNoodzakelijk: 'Noodzakelijk',
  laagNoodzakelijkUitleg: 'Nodig om de site te laten werken en je keuze te onthouden. Staat altijd aan.',
  laagMeten: 'Meten',
  laagMetenUitleg: 'Anoniem tellen welke pagina’s en knoppen worden gebruikt, zodat we de site kunnen verbeteren.',
  laagHerkennen: 'Herkennen',
  laagHerkennenUitleg: 'Je bij een volgend bezoek herkennen met een cookie van ons eigen domein (maximaal een jaar), zodat we je beter kunnen helpen. Alleen samen met meten.',
  wijzigen: 'Cookie-instellingen',
}
