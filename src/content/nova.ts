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
};
export type Post = {
  slug: string;
  title: string;
  cat: string;
  time: string;
  cover: string;
};
export type Person = { name: string; role: string; cover: string };
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
    desc: "Een immersief universum van kleur, licht en beweging.",
  },
  {
    name: "Echo Spaces",
    type: "ONTWERP",
    year: "2025",
    cover: "work_arch",
    desc: "Een nieuwe kijk op de ruimte tussen mens en omgeving.",
  },
  {
    name: "Pulse Festival",
    type: "EVENEMENT",
    year: "2026",
    cover: "event_lights",
    desc: "Drie dagen waarin cultuur en technologie samenkomen.",
  },
  {
    name: "Future Assembly",
    type: "TECHNOLOGIE",
    year: "2026",
    cover: "journal_event",
    desc: "Een ideeënfestival voor een verbonden generatie.",
  },
  {
    name: "The Atrium",
    type: "RUIMTE",
    year: "2025",
    cover: "space_atrium",
    desc: "Een lichte, open ruimte waar alles mogelijk wordt.",
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
    time: "8 min lezen",
    cover: "journal_face",
  },
  {
    title: "Ruimtes die creativiteit activeren",
    cat: "ONTWERP",
    time: "6 min lezen",
    cover: "journal_arch",
  },
  {
    title: "Achter de schermen bij Pulse Festival",
    cat: "BELEVINGEN",
    time: "5 min lezen",
    cover: "journal_event",
  },
  {
    title: "Waarom de toekomst menselijk blijft",
    cat: "TOEKOMST",
    time: "9 min lezen",
    cover: "comm_face",
  },
  {
    title: "Ontwerpen voor morgen begint vandaag",
    slug: "designing-for-tomorrow-begins-today",
    cat: "INZICHTEN",
    time: "11 min lezen",
    cover: "work_color",
  },
  {
    title: "Het nieuwe ontmoeten is persoonlijk",
    cat: "COMMUNITY",
    time: "7 min lezen",
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
    alt: "Licht atrium met planten en modern interieur",
    desc: "Open, licht en vol mogelijkheden. Een ruimte die uitnodigt tot nieuwe perspectieven.",
    cta: "Ontdek deze ruimte",
  },
  {
    slug: "studio-one",
    name: "Studio One",
    cover: "work_arch",
    alt: "Architectonisch paviljoen",
    desc: "Een veelzijdige studio voor workshops, creatieve sessies en presentaties.",
    cta: "Bekijk de studio",
  },
  {
    slug: "light-lab",
    name: "Light Lab",
    cover: "work_color",
    alt: "Kleurrijke ruimtelijke installatie",
    desc: "Een onverwachte omgeving voor eigenzinnige meetings en ervaringen.",
    cta: "Bekijk de ruimte",
  },
];

export const events = [{ slug: "nova-sessions", name: "NOVA Sessions" }];
