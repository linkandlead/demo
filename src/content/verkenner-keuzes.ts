// Keuzes van de blokkenverkenner die ook de client nodig heeft (zonder de blauwdruk mee te laden).

/** Bloktypes waarvoor Blokken.tsx een NOVA-renderer heeft (de `case`s in de switch; een test
 *  houdt deze lijst gelijk aan de code). Andere bloktypes worden op de site overgeslagen. */
export const GERENDERD = new Set([
  "header",
  "marquee",
  "mediatekst",
  "statement",
  "statistieken",
  "feiten",
  "flexibel",
  "kaarten",
  "portfolio",
  "reeks",
  "faq",
  "overgang",
  "cta",
  "cases_grid",
  "artikelen_grid",
  "mensen",
  "sprekers",
  "partners_grid",
  "partner_uitgelicht",
  "citaten_carrousel",
  "prijskaarten",
  "tabel",
  "formulier",
  "kaart",
  "configurator",
  "formulier_bouwer",
  "review_verzamelen",
  "leden_toegang",
  "enquete",
  "ab_blok",
  "personalisatie",
]);

/** Achtergrondkeuze → CMS-veld bg. */
export const ACHTERGRONDEN: Array<[string, string]> = [
  ["Licht", "wit"],
  ["Zacht", "mist"],
  ["Accent", "limoenlicht"],
  ["Donker", "diep"],
  ["Diepst", "nacht"],
];

/** Tweede keuze bij de header: CMS-veld hoogte. */
export const HOOGTES: Array<[string, string]> = [
  ["Compact", "compact"],
  ["Normaal", "normaal"],
  ["Schermvullend", "fullscreen"],
];

/** Lichte, naadloos lussende achtergrondvideo (9 s, 1280×720, H.264 zonder geluid, ±0,8 MB), met
 *  ffmpeg gemaakt uit eigen NOVA-beelden: hero_arch → event_lights → work_arch → hero_arch, elk met
 *  een trage zoom (zoompan) en 1 s crossfade (xfade), daarna getrimd van 1 s tot 10 s zodat het
 *  laatste beeld weer het eerste is. Geen externe bron of licentievraag. */
export const HEADER_VIDEO = "/media/nova-header.mp4";

export const blokSleutel = (naam: string) =>
  naam
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
