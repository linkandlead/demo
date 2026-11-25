// Ongewijzigde kopie uit linkandlead-cms packages/site-kit 1.25.0 (src/tracking.ts): de bezoekmeting met toestemming.
// Niet hier bewerken; verbeteringen horen in de site-kit en komen met een nieuwe kopie hierheen.
// Tracking naar het CMS (FO §12.3): paginabezoeken en gebeurtenissen naar /api/spoor, ALLEEN na
// toestemming voor meten. De anonieme bezoekers-id staat in localStorage, de sessie in sessionStorage (zelfde
// sleutels als meet.js, zodat beide elkaar niet dubbel tellen). Met toestemming voor herkennen gebruikt de
// tracker de bezoekerscookie die de server van de site zette (./bezoekercookie). Verzending met sendBeacon
// (text/plain: geen CORS-preflight) en anders fetch met keepalive. Faalt nooit hard.
//
// G9 (B-142): klikken met een meetnaam (`data-cms-meet`, `data-cms-item`), scroll in stappen van 25 procent,
// stilte (alleen bij een zichtbaar tabblad) en een SPOOR IN HET GEHEUGEN. Dat spoor werkt ook zonder
// toestemming: er wordt dan niets verzonden en niets opgeslagen; het verdwijnt met de pagina. De pop-up op
// gedrag beslist daarop in de browser.
// De fetch-vorm uit de site-kit (client.ts).
type FetchFn = (invoer: string, init?: RequestInit) => Promise<Response>
import { schoonItem, schoonMeetnaam } from './meetnaam.ts'
import type { ToestemmingKeuze, ToestemmingLagen } from './toestemming.ts'

type Opslagje = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem?(k: string): void }

// De DOM-kant van klik-, scroll- en stiltemeting; injecteerbaar voor tests.
export type TrackingOmgeving = {
  aan(type: string, f: (ev: unknown) => void): () => void
  scrollPct(): number
  zichtbaar(): boolean
  wacht(f: () => void, ms: number): () => void
}

export type TrackingOpties = {
  basisUrl: string
  siteId: string
  // Wordt bij ELKE gebeurtenis opnieuw gevraagd: intrekken van toestemming werkt direct.
  toestemming: () => boolean
  // Toestemming voor herkennen (maakToestemming().herkennen). Alleen dan telt `bezoekerId`.
  herkennen?: () => boolean
  // De id uit de bezoekerscookie (bezoekerCookie().bezoekerId, via de server-render).
  bezoekerId?: string | null
  // Het toestemmingsbeheer: een nieuwe keuze gaat (met tijdstip, zonder IP) naar het CMS, en intrekken van
  // meten wist de ids in deze browser.
  beheer?: { lagen(): ToestemmingLagen | null; luister(f: (k: ToestemmingKeuze) => void): () => void }
  // Versie van de bannertekst, voor het toestemmingslogboek.
  toestemmingVersie?: string
  // De doelgroep van de bezoeker (bv. 'zakelijk'), per gebeurtenis gevraagd.
  doelgroep?: () => string | null | undefined
  // Standaard: direct een paginabezoek voor de huidige pagina (als er toestemming is).
  paginabezoekBijStart?: boolean
  // Injecteerbaar voor tests / niet-browseromgevingen.
  fetch?: FetchFn
  sendBeacon?: ((url: string, data: Blob) => boolean) | null
  lokaal?: Opslagje
  sessie?: Opslagje
  locatie?: () => { pathname: string; search: string; referrer?: string }
  omgeving?: TrackingOmgeving
  nu?: () => number
}

// `paginatype` (B-153): bij een paginabezoek met `{ page_type }` in `extra`, voor de regels van de pop-up op gedrag.
export type SpoorStap = { type: string; pad: string; t: number; element?: string; item?: string; paginatype?: string }

type GebeurtenisGegevens = {
  component?: string
  blok_id?: string
  blok_type?: string
  element?: string
  item?: string
  metadata?: Record<string, unknown>
  // De betaalde plaatsing waarop dit gebeurde (G15, CMS B-166); het CMS controleert dat hij bij de site hoort.
  plaatsing_id?: string
}

export type Tracker = {
  paginabezoek(pad?: string, extra?: Record<string, unknown>): boolean
  // event_type, bv. 'lead_cta_clicked', 'scroll_50', 'formulier_verstuurd'. Geeft false zonder toestemming.
  gebeurtenis(type: string, gegevens?: GebeurtenisGegevens): boolean
  // Een klik op een element met een meetnaam, eventueel op een record (item). Komt altijd in het spoor.
  klik(element: string, item?: string | null, metadata?: Record<string, unknown>): boolean
  // Vertoningen van betaalde plaatsingen (G15): elke id één keer per paginabezoek, als 'plaatsing_vertoning'.
  // Geeft het aantal verstuurde vertoningen (0 zonder toestemming). Gebruik `geplaatsteIds` uit ./plaatsingen.
  plaatsingVertoond(ids: string | readonly string[]): number
  // Een klik op een betaalde plaatsing; `uitklik` voor een klik naar een externe pagina. Komt altijd in het spoor.
  plaatsingKlik(plaatsingId: string, opties?: { uitklik?: boolean; element?: string; item?: string | null }): boolean
  // Meet klikken op elementen met data-cms-meet (en data-cms-item), en op betaalde plaatsingen
  // (data-cms-plaatsing, met data-cms-uitklik voor een externe link). Geeft een opruimfunctie.
  volgKlikken(): () => void
  // Scroll in stappen van 25 procent, elke stap één keer per paginabezoek.
  volgScroll(): () => void
  // Stilte: `seconden` zonder muis, toets, scroll of aanraking, alleen bij een zichtbaar tabblad.
  volgStilte(seconden: number, bijStilte?: () => void): () => void
  // Het spoor van deze pagina-sessie in het geheugen (ook zonder toestemming), oudste eerst.
  spoor(): readonly SpoorStap[]
  // Wis de ids van deze browser (bij intrekken van toestemming).
  vergeet(): void
}

const SLEUTELS = { aid: 'll_aid', sid: 'll_sid', pv: 'll_pv', landing: 'll_first_landing', bidLog: 'll_bid_log' } as const
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const MAX_SPOOR = 200
const DOELGROEP = /^[a-z0-9][a-z0-9_-]{0,47}$/
const PAGINATYPE = /^[a-z0-9][a-z0-9_-]{0,47}$/
const ACTIVITEIT = ['mousemove', 'keydown', 'scroll', 'touchstart', 'pointerdown', 'visibilitychange']

function veilig<T>(f: () => T, terug: T): T {
  try {
    return f()
  } catch {
    return terug
  }
}

function geheugen(): Opslagje {
  const m = new Map<string, string>()
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }
}

function uuid(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto
  if (c?.randomUUID) return c.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (t) => {
    const r = (Math.random() * 16) | 0
    return (t === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

type Doelwit = { closest?: (s: string) => { getAttribute(n: string): string | null } | null }

function standaardOmgeving(): TrackingOmgeving | null {
  const g = globalThis as {
    window?: { addEventListener(t: string, f: (e: unknown) => void, o?: unknown): void; removeEventListener(t: string, f: (e: unknown) => void, o?: unknown): void; innerHeight: number }
    document?: { visibilityState?: string; documentElement?: { scrollTop: number; scrollHeight: number } }
  }
  const w = g.window
  const d = g.document
  if (!w || !d) return null
  return {
    aan(type, f) {
      const doel = type === 'click' || type === 'visibilitychange' ? (d as unknown as typeof w) : w
      doel.addEventListener(type, f, { passive: true, capture: type === 'click' })
      return () => doel.removeEventListener(type, f, { capture: type === 'click' })
    },
    scrollPct() {
      const h = d.documentElement
      if (!h?.scrollHeight) return 0
      return ((h.scrollTop + w.innerHeight) / h.scrollHeight) * 100
    },
    zichtbaar: () => d.visibilityState !== 'hidden',
    wacht(f, ms) {
      const id = setTimeout(f, ms)
      return () => clearTimeout(id)
    },
  }
}

export function startTracking(o: TrackingOpties): Tracker {
  const g = globalThis as {
    localStorage?: Opslagje
    sessionStorage?: Opslagje
    location?: { pathname: string; search: string }
    document?: { referrer?: string }
    navigator?: { sendBeacon?: (url: string, data: Blob) => boolean }
  }
  const lokaal = o.lokaal ?? veilig(() => g.localStorage, undefined) ?? geheugen()
  const sessie = o.sessie ?? veilig(() => g.sessionStorage, undefined) ?? geheugen()
  const locatie = o.locatie ?? (() => ({ pathname: g.location?.pathname ?? '/', search: g.location?.search ?? '', referrer: g.document?.referrer }))
  const beacon = o.sendBeacon !== undefined ? o.sendBeacon : g.navigator?.sendBeacon ? g.navigator.sendBeacon.bind(g.navigator) : null
  const doeFetch: FetchFn | undefined = o.fetch ?? (typeof globalThis.fetch === 'function' ? (i, init) => globalThis.fetch(i, init) : undefined)
  const nu = o.nu ?? (() => Date.now())
  const url = `${o.basisUrl.replace(/\/+$/, '')}/api/spoor`
  const lees = (s: Opslagje, k: string) => veilig(() => s.getItem(k), null)
  const schrijf = (s: Opslagje, k: string, v: string) => veilig(() => s.setItem(k, v), undefined)
  const wis = (s: Opslagje, k: string) => veilig(() => (s.removeItem ? s.removeItem(k) : s.setItem(k, '')), undefined)
  const mag = () => veilig(o.toestemming, false)
  const herkend = (): string | null => (o.bezoekerId && UUID.test(o.bezoekerId) && o.herkennen && veilig(o.herkennen, false) ? o.bezoekerId : null)
  const omgeving = () => o.omgeving ?? standaardOmgeving()

  const geheugenSpoor: SpoorStap[] = []
  let scrollBereikt = new Set<number>()
  let vertoond = new Set<string>()
  const leg = (type: string, extra: { pad?: string; element?: string | null; item?: string | null; paginatype?: string | null } = {}) => {
    geheugenSpoor.push({
      type,
      pad: (extra.pad ?? veilig(() => locatie().pathname, '/')).slice(0, 300),
      t: nu(),
      ...(extra.element ? { element: extra.element } : {}),
      ...(extra.item ? { item: extra.item } : {}),
      ...(extra.paginatype ? { paginatype: extra.paginatype } : {}),
    })
    if (geheugenSpoor.length > MAX_SPOOR) geheugenSpoor.splice(0, geheugenSpoor.length - MAX_SPOOR)
  }

  // Ids pas aanmaken bij de eerste gebeurtenis MET toestemming: zonder toestemming niets opslaan.
  function ids(): { aid: string; sid: string; nieuweSessie: boolean } {
    let aid = herkend() ?? lees(lokaal, SLEUTELS.aid)
    if (!aid) {
      aid = uuid()
      schrijf(lokaal, SLEUTELS.aid, aid)
    }
    let sid = lees(sessie, SLEUTELS.sid)
    const nieuweSessie = !sid
    if (!sid) {
      sid = uuid()
      schrijf(sessie, SLEUTELS.sid, sid)
    }
    return { aid, sid, nieuweSessie }
  }

  function vergeet(): void {
    for (const k of [SLEUTELS.aid, SLEUTELS.landing]) if (lees(lokaal, k)) wis(lokaal, k)
    for (const k of [SLEUTELS.sid, SLEUTELS.pv]) if (lees(sessie, k)) wis(sessie, k)
  }

  function stuur(body: Record<string, unknown>): void {
    const tekst = JSON.stringify(body)
    try {
      if (beacon?.(url, new Blob([tekst], { type: 'text/plain' }))) return
    } catch {
      /* val terug op fetch */
    }
    doeFetch?.(url, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: tekst, keepalive: true, mode: 'cors' }).catch(() => {})
  }

  function basis(type: string, pad?: string): Record<string, unknown> {
    const { aid, sid } = ids()
    const dg = o.doelgroep ? veilig(o.doelgroep, null) : null
    return {
      site_id: o.siteId,
      anonymous_id: aid,
      session_id: sid,
      event_type: type,
      page: (pad ?? locatie().pathname).slice(0, 300),
      ...(typeof dg === 'string' && DOELGROEP.test(dg) ? { doelgroep: dg } : {}),
    }
  }

  const tracker: Tracker = {
    paginabezoek(pad, extra = {}) {
      scrollBereikt = new Set()
      vertoond = new Set()
      const pt = typeof extra.page_type === 'string' && PAGINATYPE.test(extra.page_type) ? extra.page_type : null
      leg('pageview', { pad, paginatype: pt, item: schoonItem(extra.item) })
      if (!mag()) return false
      const loc = locatie()
      const { nieuweSessie } = ids()
      const pv = (Number.parseInt(lees(sessie, SLEUTELS.pv) ?? '0', 10) || 0) + 1
      schrijf(sessie, SLEUTELS.pv, String(pv))
      let landing = lees(lokaal, SLEUTELS.landing)
      if (!landing) {
        landing = pad ?? loc.pathname
        schrijf(lokaal, SLEUTELS.landing, landing)
      }
      const q = new URLSearchParams(loc.search)
      const utm = Object.fromEntries(['source', 'medium', 'campaign', 'content', 'term'].map((k) => [`utm_${k}`, q.get(`utm_${k}`)]))
      stuur({
        ...basis('pageview', pad),
        page_type: 'page',
        pageview_count: pv,
        first_referrer: loc.referrer || null,
        first_landing_page: landing,
        ...utm,
        // Last-touch UTM: alleen bij de start van een sessie (§38 in /api/spoor).
        ...(nieuweSessie && utm.utm_source ? { last_utm_source: utm.utm_source, last_utm_medium: utm.utm_medium, last_utm_campaign: utm.utm_campaign } : {}),
        ...extra,
      })
      if (!nieuweSessie && pv === 2) stuur({ ...basis('second_pageview', pad), pageview_count: pv })
      return true
    },
    gebeurtenis(type, gegevens = {}) {
      if (!type) return false
      const element = schoonMeetnaam(gegevens.element)
      const item = schoonItem(gegevens.item)
      leg(type.slice(0, 64), { element, item })
      if (!mag()) return false
      stuur({
        ...basis(type.slice(0, 64)),
        ...(gegevens.component ? { component: gegevens.component } : {}),
        ...(gegevens.blok_id ? { page_block_id: gegevens.blok_id } : {}),
        ...(gegevens.blok_type ? { block_type: gegevens.blok_type } : {}),
        ...(element ? { element } : {}),
        ...(item ? { item } : {}),
        ...(gegevens.metadata ? { metadata: gegevens.metadata } : {}),
        ...(gegevens.plaatsing_id && UUID.test(gegevens.plaatsing_id) ? { plaatsing_id: gegevens.plaatsing_id } : {}),
      })
      return true
    },
    plaatsingVertoond(ids) {
      const nieuw = (typeof ids === 'string' ? [ids] : [...ids]).filter((id) => UUID.test(id) && !vertoond.has(id))
      if (!nieuw.length || !mag()) return 0
      for (const id of nieuw) {
        vertoond.add(id)
        tracker.gebeurtenis('plaatsing_vertoning', { component: 'plaatsing', plaatsing_id: id })
      }
      return nieuw.length
    },
    plaatsingKlik(plaatsingId, opties = {}) {
      return tracker.gebeurtenis(opties.uitklik ? 'uitklik' : 'klik', {
        element: opties.element ?? 'plaatsing',
        item: opties.item ?? undefined,
        plaatsing_id: UUID.test(plaatsingId) ? plaatsingId : undefined,
      })
    },
    klik(element, item, metadata) {
      return tracker.gebeurtenis('klik', { element, item: item ?? undefined, metadata })
    },
    volgKlikken() {
      const om = omgeving()
      if (!om) return () => {}
      return om.aan('click', (ev) => {
        const doel = (ev as { target?: Doelwit } | null)?.target
        const el = doel?.closest ? veilig(() => doel.closest?.('[data-cms-meet]') ?? null, null) : null
        const naam = el?.getAttribute('data-cms-meet')
        const zoek = (s: string) => (doel?.closest ? veilig(() => doel.closest?.(s) ?? null, null) : null)
        const plaatsing = zoek('[data-cms-plaatsing]')?.getAttribute('data-cms-plaatsing')
        if (!naam && !plaatsing) return
        const item = zoek('[data-cms-item]')?.getAttribute('data-cms-item') ?? null
        if (plaatsing) tracker.plaatsingKlik(plaatsing, { uitklik: !!zoek('[data-cms-uitklik]'), element: naam ?? undefined, item })
        else if (naam) tracker.klik(naam, item)
      })
    },
    volgScroll() {
      const om = omgeving()
      if (!om) return () => {}
      return om.aan('scroll', () => {
        const pct = veilig(() => om.scrollPct(), 0)
        for (const stap of [25, 50, 75, 100]) {
          if (pct >= stap && !scrollBereikt.has(stap)) {
            scrollBereikt.add(stap)
            tracker.gebeurtenis(`scroll_${stap}`, { component: 'scroll' })
          }
        }
      })
    },
    volgStilte(seconden, bijStilte) {
      const om = omgeving()
      if (!om) return () => {}
      const ms = Math.min(600, Math.max(5, Math.round(seconden) || 30)) * 1000
      let stop: (() => void) | null = null
      let gemeld = false
      const plan = () => {
        stop?.()
        stop = om.wacht(() => {
          stop = null
          // Een verborgen tabblad is geen stilte: wachten tot de bezoeker terug is (visibilitychange plant opnieuw).
          if (gemeld || !veilig(() => om.zichtbaar(), false)) return
          gemeld = true
          tracker.gebeurtenis('stilte', { metadata: { seconden: ms / 1000 } })
          veilig(() => bijStilte?.(), undefined)
        }, ms)
      }
      const activiteit = () => {
        gemeld = false
        plan()
      }
      const los = ACTIVITEIT.map((t) => om.aan(t, activiteit))
      plan()
      return () => {
        stop?.()
        for (const f of los) f()
      }
    },
    spoor: () => geheugenSpoor.slice(),
    vergeet,
  }

  // Na intrekken in een eerder bezoek: oude ids opruimen.
  if (!mag()) vergeet()

  if (o.beheer) {
    const logKeuze = (aid: string, l: ToestemmingLagen | null) =>
      stuur({
        site_id: o.siteId,
        anonymous_id: aid,
        event_type: 'toestemming',
        page: veilig(() => locatie().pathname, '/').slice(0, 300),
        toestemming: { meten: l?.meten === true, herkennen: l?.herkennen === true },
        ...(o.toestemmingVersie ? { tekst_versie: o.toestemmingVersie.slice(0, 40) } : {}),
      })
    // De id uit de bezoekerscookie (B-160): de keuze wordt in het CMS per id gelogd en het CMS herkent alleen op
    // dat logboek. De cookie bestaat pas na de keuze (de server van de site zet hem), dus de eerste keer dat de
    // tracker hem krijgt, logt hij de keuze ook onder die id. Eén keer per id (merkteken in localStorage).
    const cookieId = o.bezoekerId && UUID.test(o.bezoekerId) ? o.bezoekerId.toLowerCase() : null
    if (cookieId && herkend() && lees(lokaal, SLEUTELS.bidLog) !== cookieId) {
      logKeuze(cookieId, veilig(() => o.beheer?.lagen() ?? null, null))
      schrijf(lokaal, SLEUTELS.bidLog, cookieId)
    }
    o.beheer.luister(() => {
      const l = veilig(() => o.beheer?.lagen() ?? null, null)
      // Het logboek: met de id die er al was (ook bij intrekken), of de nieuwe na toestemming. Zonder id en
      // zonder toestemming is er niets om vast te leggen.
      const aid = herkend() ?? lees(lokaal, SLEUTELS.aid) ?? (l?.meten ? ids().aid : null)
      if (aid) logKeuze(aid, l)
      // Intrekken van herkennen geldt ook voor de id uit de bezoekerscookie: anders blijft het CMS hem herkennen.
      if (cookieId && cookieId !== aid && !l?.herkennen) {
        logKeuze(cookieId, l)
        wis(lokaal, SLEUTELS.bidLog)
      }
      if (!l?.meten) vergeet()
    })
  }

  if (o.paginabezoekBijStart !== false) tracker.paginabezoek()
  return tracker
}
