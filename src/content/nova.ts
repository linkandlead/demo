// Demodata van de fictieve NOVA-site, 1-op-1 overgenomen uit het prototype (02_WEBSITE/scripts/nova-app.js).
// Dit is de fallback zolang er geen geïsoleerde NOVA-demosite in het CMS gekoppeld is. Met een
// gekoppeld CMS komen cases, artikelen en teamleden uit de lees-API (zie src/lib/cms).

export type Media =
  | "comm_arch"
  | "comm_event"
  | "comm_face"
  | "comm_man"
  | "comm_person"
  | "event_gradient"
  | "event_lights"
  | "hero_arch"
  | "journal_arch"
  | "journal_event"
  | "journal_face"
  | "journal_person"
  | "space_atrium"
  | "work_arch"
  | "work_beige"
  | "work_color"
  | "work_person";

export type Case = {
  slug: string;
  name: string;
  type: string;
  year: string;
  cover: string;
  desc: string;
  /** Uit het CMS (citaat / schakels); leeg in de demodata. */
  statement?: string;
  diensten?: string[];
};
export type Post = {
  slug: string;
  title: string;
  cat: string;
  time: string;
  cover: string;
};
export type Person = { name: string; role: string; cover: string; bio?: string };
export type Space = {
  slug: string;
  name: string;
  cover: string;
  alt: string;
  desc: string;
  cta: string;
};

/** Zelfde slugregel als het prototype: lowercase + spaties → koppeltekens. */
export const slugify = (s: string) => s.toLowerCase().replaceAll(" ", "-");

export const nav: Array<[string, string]> = [
  ["Werk", "work"],
  ["Verhalen", "journal"],
  ["Belevingen", "experiences"],
  ["Ruimtes", "spaces"],
  ["Community", "community"],
  ["Over ons", "about"],
  ["Het CMS", "one"],
];

export const mobileExtra: Array<[string, string]> = [
  ["Contact", "contact"],
  ["Het Lab", "lab"],
  ["Blokkenbibliotheek", "playground"],
  ["Ontwerpdemo", "demo"],
  ["Het CMS", "one"],
];

const rawCases = [
  {
    name: "Aurora Pavilion",
    type: "BELEVING",
    year: "2026",
    cover: "hero_arch",
    desc: "Een sculpturale ontmoetingsplek waar architectuur en licht samenkomen.",
  },
  {
    name: "Lumen Experience",
    type: "CULTUUR",
    year: "2026",
    cover: "work_color",
    desc: "Een meeslepende wereld van licht, kleur en beweging.",
  },
  {
    name: "Echo Spaces",
    type: "ONTWERP",
    year: "2025",
    cover: "work_arch",
    desc: "Een nieuwe blik op de ruimte tussen mens en omgeving.",
  },
  {
    name: "Pulse Festival",
    type: "EVENEMENT",
    year: "2026",
    cover: "event_lights",
    desc: "Een ontmoetingsplek voor cultuur, technologie en nieuwsgierige mensen.",
  },
  {
    name: "Future Assembly",
    type: "TECHNOLOGIE",
    year: "2026",
    cover: "journal_event",
    desc: "Een ideeënfestival voor een generatie die liever samen begint.",
  },
  {
    name: "The Atrium",
    type: "RUIMTE",
    year: "2025",
    cover: "space_atrium",
    desc: "Een lichte, open omgeving waar ontmoeting ruimte krijgt.",
  },
];
export const cases: Case[] = rawCases.map((c) => ({
  ...c,
  slug: slugify(c.name),
}));

const rawPosts = [
  {
    title: "De kracht van meeslepende belevingen",
    slug: "de-kracht-van-immersive-experiences",
    cat: "CULTUUR",
    time: "3 min lezen",
    cover: "journal_face",
  },
  {
    title: "Ruimtes die creativiteit activeren",
    cat: "ONTWERP",
    time: "2 min lezen",
    cover: "journal_arch",
  },
  {
    title: "Achter de schermen bij Pulse Festival",
    cat: "BELEVINGEN",
    time: "2 min lezen",
    cover: "journal_event",
  },
  {
    title: "Waarom de toekomst menselijk blijft",
    cat: "TOEKOMST",
    time: "2 min lezen",
    cover: "comm_face",
  },
  {
    title: "Ontwerpen voor morgen begint vandaag",
    slug: "designing-for-tomorrow-begins-today",
    cat: "INZICHTEN",
    time: "2 min lezen",
    cover: "work_color",
  },
  {
    title: "Het nieuwe ontmoeten is persoonlijk",
    cat: "COMMUNITY",
    time: "2 min lezen",
    cover: "space_atrium",
  },
];
// Vaste slug waar de titel vertaald is, zodat bestaande URL's (en Supabase-rijen) blijven werken.
export const posts: Post[] = rawPosts.map((p) => ({
  ...p,
  slug: "slug" in p && p.slug ? p.slug : slugify(p.title),
}));

export const people: Person[] = [
  { name: "Maya Chen", role: "Creatief directeur", cover: "comm_face" },
  { name: "Noah Vermeer", role: "Hoofd belevingen", cover: "comm_man" },
  { name: "Amara Brooks", role: "Ontwerpstrateeg", cover: "journal_face" },
  { name: "Luca Moreno", role: "Communitycurator", cover: "comm_person" },
];

export const spaces: Space[] = [
  {
    slug: "the-atrium",
    name: "The Atrium",
    cover: "space_atrium",
    alt: "Ruim licht atrium met grote ramen, planten en warme zithoeken.",
    desc: "Een open, lichte ruimte waar ideeën de ruimte krijgen.",
    cta: "Bekijk The Atrium",
  },
  {
    slug: "studio-one",
    name: "Studio One",
    cover: "work_arch",
    alt: "Strakke moderne architectuur met geometrische vlakken en zonlicht.",
    desc: "Een veelzijdige studio voor workshops, creatieve sessies en presentaties.",
    cta: "Bekijk Studio One",
  },
  {
    slug: "light-lab",
    name: "Light Lab",
    cover: "work_color",
    alt: "Meeslepende installatie met oranje, paarse en blauwe lichtbanen en bezoekers.",
    desc: "Een experimentele plek waar licht en geluid de sfeer bepalen.",
    cta: "Bekijk Light Lab",
  },
];

export const events = [
  { slug: "pulse-festival", name: "Pulse Festival" },
  { slug: "nova-sessions", name: "NOVA Sessions" },
];
