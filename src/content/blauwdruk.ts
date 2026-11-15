// Blauwdruk van de NOVA-site voor het Link & Lead One-CMS (site "Demo Klant").
// Eén bron voor alle paginateksten: dit wordt via de officiële sync-route (POST /api/cms/sync) in het
// CMS gezet (scripts/cms-push.mjs), en is tegelijk de terugval als het CMS onbereikbaar is.
// Alleen bestaande bloktypes en veldnamen uit linkandlead-cms src/shared/blokregistry.ts.
// Achtergrond (bg): wit = Licht, mist = Zacht, limoenlicht = Accent, diep = Donker, nacht = Diepst.
// Afbeeldingen: "/media/<naam>.webp" = beeld uit deze frontend; een upload uit het CMS is een volledige URL.

import {
  bios,
  caseDetails,
  citaten,
  evenementen,
  faq,
  footerTekst,
  ruimteDemolabel,
  ruimteDetails,
} from "./teksten.ts";
import { CMS_MEDIA, SITE_URL } from "./cms-media.ts";

export type BlauwdrukBlok = { type: string; bg: string | null; content: Record<string, unknown> };
export type BlauwdrukPagina = {
  slug: string;
  titel: string;
  beschrijving: string;
  published: boolean;
  blokken: BlauwdrukBlok[];
};

// Beelden staan in de mediabibliotheek van het CMS (src/content/cms-media.ts).
const m = (naam: string) => CMS_MEDIA[naam] ?? `/media/${naam}.webp`;
const blok = (type: string, bg: string | null, content: Record<string, unknown>): BlauwdrukBlok => ({ type, bg, content });
const cta = (eyebrow: string, titel: string, tekst: string, knoptekst: string, knop: string) =>
  blok("cta", "nacht", { eyebrow, titel, tekst, knoptekst, knop });

// ---------- Huisstijl en merk ----------
export const designTokens = {
  wit: "#F8F7F3",
  mist: "#E7EDF1",
  limoenlicht: "#EFF7C7",
  diep: "#14204A",
  nacht: "#0B1127",
  limoen: "#DBF866",
  limoendonker: "#596E00",
  tekst: "#3D4858",
  steen: "#5C6675",
  mistdof: "#C9D2E1",
  fout: "#D1492F",
  foutlicht: "#FCE8E1",
};

export const merk = {
  naam: "NOVA",
  slogan: "Ideeën verdienen werkelijkheid.",
  tagline: "Een fictieve creatieve wereld en de visuele showcase van Link & Lead One.",
  hoofd_nav: [
    { titel: "Werk", href: "/work" },
    { titel: "Verhalen", href: "/journal" },
    { titel: "Belevingen", href: "/experiences" },
    { titel: "Ruimtes", href: "/spaces" },
    { titel: "Community", href: "/community" },
    { titel: "Over ons", href: "/about" },
    { titel: "Het CMS", href: "/one" },
  ],
  footer_kolommen: [
    {
      kop: "Ontdek",
      links: [
        { titel: "Werk", href: "/work" },
        { titel: "Verhalen", href: "/journal" },
        { titel: "Belevingen", href: "/experiences" },
        { titel: "Ruimtes", href: "/spaces" },
      ],
    },
    {
      kop: "Contact",
      links: [
        { titel: "Community", href: "/community" },
        { titel: "Over ons", href: "/about" },
        { titel: "Contact", href: "/contact" },
        { titel: "Blokkenbibliotheek", href: "/playground" },
      ],
    },
  ],
  juridische_links: [],
  primaire_actie: { titel: "Neem contact op", href: "/contact" },
  footer: {
    cms_kop: footerTekst.cmsKop,
    cms_tekst: footerTekst.cmsTekst,
    cms_knop: footerTekst.cmsKnop,
    copyright: footerTekst.copyright,
    disclaimer: footerTekst.disclaimer,
  },
};

// ---------- Pagina's ----------
const home: BlauwdrukPagina = {
  slug: "/",
  titel: "NOVA — Ideeën verdienen werkelijkheid",
  beschrijving:
    "Ontdek NOVA: een fictieve creatieve wereld vol projecten, verhalen, evenementen en bijzondere ruimtes. De visuele showcase van Link & Lead One.",
  published: true,
  blokken: [
    blok("header", "nacht", {
      layout: "split-rechts",
      hoogte: "fullscreen",
      eyebrow: "WELKOM IN CREATIEVE TOEKOMSTEN",
      heading: "Ideeën\nverdienen\nwerkelijkheid.",
      subheading:
        "Een plek voor nieuwe ideeën, inspirerende mensen en bijzondere ervaringen. Ontdek wat er mogelijk wordt als verschillende werelden elkaar ontmoeten.",
      cta_primair_label: "Ontdek NOVA",
      cta_primair_link: "/work",
      cta_secundair_label: "Ontdek het CMS",
      cta_secundair_link: "/one",
      media_type: "afbeelding",
      media_afbeelding: m("hero_arch"),
      media_alt: "Monumentale blauw verlichte boogarchitectuur met warm oranje licht en een wandelende figuur.",
      overlay: "donker",
      extras: "stats",
      stats: [
        { waarde: "18", label: "Paginatypes" },
        { waarde: "43", label: "CMS-blokken" },
        { waarde: "05", label: "Kleurenschema's" },
      ],
    }),
    blok("marquee", null, {
      stijl: "limoen",
      items: [{ tekst: "CREËREN" }, { tekst: "VERBINDEN" }, { tekst: "ONTDEKKEN" }, { tekst: "BOUWEN" }],
    }),
    blok("mediatekst", "wit", {
      eyebrow: "ONZE WERELD",
      titel: "Waar ideeën hun mensen vinden.",
      alineas: [
        {
          tekst:
            "NOVA brengt een nieuwe manier van denken tot leven. We laten zien hoe creativiteit, architectuur, technologie en cultuur samen verhalen kunnen vertellen. Van een intiem gesprek tot een grootse ervaring: het begint met nieuwsgierigheid.",
        },
      ],
      punten: [{ tekst: "CREATIVITEIT IN BEWEGING" }],
      beeld: m("work_color"),
      beeld_alt: "Meeslepende installatie met oranje, paarse en blauwe lichtbanen en bezoekers.",
      beeldzijde: "rechts",
      knop: "/about",
      knoptekst: "Ontdek ons verhaal",
    }),
    // Videoblok: een Header met media_type "video". De staande mobiele versie en de posters horen bij
    // de film op deze website (zie src/content/media.ts). Het CMS heeft de volledige URL, zodat ook de
    // CMS-editor hem toont; video's kunnen niet in de mediabibliotheek.
    blok("header", "nacht", {
      layout: "achtergrond",
      hoogte: "normaal",
      eyebrow: "NOVA IN BEWEGING",
      heading: "Zie wat er\nmogelijk wordt.",
      subheading: "Tweeëndertig seconden NOVA: architectuur, licht, ontmoetingen en ideeën die in beweging komen.",
      cta_primair_label: "Bekijk ons werk",
      cta_primair_link: "/work",
      media_type: "video",
      media_video: `${SITE_URL}/media/nova-film-liggend.mp4`,
      media_afbeelding: m("nova-film-poster"),
      media_alt: "Korte film over NOVA: blauwe boogarchitectuur, lichtinstallaties, een concertzaal en bewegende lijnen.",
      overlay: "donker",
    }),
    blok("cases_grid", "mist", {
      eyebrow: "GESELECTEERD WERK",
      // Regels na de titel = toelichting naast de kop.
      titel:
        "Gemaakt om je iets te laten voelen.\nOntdek zes voorbeeldprojecten waarin beeld, verhaal en ruimte samenkomen. Elk project heeft een eigen identiteit, precies zoals iedere website een eigen uitstraling verdient.",
      maximaal: 3,
      link_naar_overzicht: "/work",
    }),
    blok("statement", "nacht", {
      eyebrow: "WAAR WE IN GELOVEN",
      titel: "Op morgen wachten we niet. *Morgen maken we zelf.*",
      tekst: "Vooruitgang ontstaat niet vanzelf. Je maakt haar samen.",
      knop: "/about",
      knoptekst: "Maak kennis met NOVA",
    }),
    blok("statistieken", "mist", {
      // Eerste regel in hoofdletters = eyebrow.
      titel: "IN DEZE DEMO\nEen wereld vol mogelijkheden.",
      intro: "Geen verzonnen impactcijfers, maar aantallen die je in de demo zelf kunt bekijken.",
      items: [
        { waarde: "43", label: "Algemene CMS-blokken" },
        { waarde: "5", label: "Achtergrondvarianten" },
        { waarde: "6", label: "Fictieve projectcases" },
        { waarde: "3", label: "Voorbeeldruimtes" },
      ],
    }),
    blok("mensen", "wit", {
      titel: "DE MENSEN\nVerschillende denkers. Gedeelde energie.",
      intro: "Vier fictieve makers, vier perspectieven. Hun profielen laten zien hoe je een teamcollectie in het CMS beheert.",
      maximaal: 4,
    }),
    blok("artikelen_grid", "mist", {
      eyebrow: "VERHALEN",
      titel:
        "Goede ideeën verdienen een goed verhaal.\nVerhalen over ontwerp, beleving, technologie en samenkomen. Ontdek hoe een redactionele collectie van overzicht tot detailpagina werkt.",
      maximaal: 3,
    }),
    cta(
      "07 / DE VOLGENDE STAP",
      "Je volgende idee begint hier.",
      "En achter deze website? Daar zit Link & Lead One. Bekijk de interactieve rondleiding of ontdek alle CMS-blokken.",
      "Ontdek het CMS",
      "/one",
    ),
  ],
};

const binnenHero = (eyebrow: string, heading: string, meta: string, subheading: string, extra: Record<string, unknown> = {}) =>
  blok("header", "wit", { layout: "compact", hoogte: "normaal", eyebrow, heading, subheading, usps: [{ tekst: meta }], ...extra });

const werk: BlauwdrukPagina = {
  slug: "/work",
  titel: "Werk — projecten",
  beschrijving:
    "Bekijk de creatieve voorbeeldprojecten van NOVA: architectuur, belevingen, evenementen en ontwerp. Inclusief filters en projectdetailpagina’s.",
  published: true,
  blokken: [
    binnenHero(
      "ONS WERK / GESELECTEERDE PROJECTEN",
      "Projecten die\nimpact maken.",
      "ONTWERP / CULTUUR / BELEVING",
      "Van lichtinstallaties tot nieuwe ontmoetingsplekken. Ontdek zes fictieve projecten met een eigen verhaal en een eigen vorm.",
    ),
    blok("cases_grid", "wit", { eyebrow: "GESELECTEERD WERK", titel: "Ontdek het bijzondere.", maximaal: 24 }),
    blok("kaarten", "mist", {
      eyebrow: "ONZE AANPAK",
      titel: "Een goed resultaat begint met een betere vraag.",
      intro: "Niet het eindbeeld, maar het idee erachter maakt het verschil.",
      kolommen: "3",
      items: [
        { titel: "Eerst begrijpen.", tekst: "Eerst begrijpen wat mensen echt nodig hebben.", knoptekst: "01 / Ontdekken" },
        { titel: "Ruimte geven.", tekst: "Dan ruimte geven aan verbeelding en experiment.", knoptekst: "02 / Creëren" },
        {
          titel: "Relevant maken.",
          tekst: "Tot slot maken we het relevant voor de mensen om wie het draait.",
          knoptekst: "03 / Verbinden",
        },
      ],
    }),
    cta("WAT IS DE VOLGENDE STAP?", "Heb je iets bijzonders in gedachten?", "Ontdek eerst hoe deze website is opgebouwd.", "Bekijk het CMS", "/one"),
  ],
};

const caseNamen: Record<string, [string, string, string]> = {
  "aurora-pavilion": ["Aurora Pavilion", "BELEVING", "2026"],
  "lumen-experience": ["Lumen Experience", "CULTUUR", "2026"],
  "echo-spaces": ["Echo Spaces", "ONTWERP", "2025"],
  "pulse-festival": ["Pulse Festival", "EVENEMENT", "2026"],
  "future-assembly": ["Future Assembly", "TECHNOLOGIE", "2026"],
  "the-atrium": ["The Atrium", "RUIMTE", "2025"],
};

const caseDetailPaginas: BlauwdrukPagina[] = Object.entries(caseDetails).map(([slug, d]) => {
  const [naam, sector, jaar] = caseNamen[slug];
  return {
    slug: `/work/${slug}`,
    titel: naam,
    beschrijving: d.projectintro,
    published: true,
    blokken: [
      blok("header", "nacht", {
        layout: "achtergrond",
        hoogte: "normaal",
        eyebrow: `GESELECTEERD WERK / ${sector}`,
        heading: `${naam}.`,
        subheading: d.projectintro,
        media_type: "afbeelding",
        media_afbeelding: m(d.beelden[0]),
        overlay: "donker",
      }),
      blok("feiten", "wit", {
        titel: "Projectfeiten",
        feiten: [
          { label: "SECTOR", waarde: sector },
          { label: "JAAR", waarde: jaar },
          { label: "OPDRACHTGEVER", waarde: "NOVA-demoproject" },
          { label: "DIENSTEN", waarde: d.diensten.join(" / ") },
        ],
      }),
      blok("flexibel", "wit", {
        titel: d.statement,
        kolommen: "1",
        items: [
          { kop: "De vraag", tekst: d.vraag },
          { kop: "Het concept", tekst: d.concept },
          { kop: "De aanpak", tekst: d.aanpak },
          { kop: "Het resultaat", tekst: d.resultaat },
        ],
      }),
      blok("portfolio", "mist", {
        titel: "Beelden",
        items: d.beelden.map((b) => ({ titel: naam, beeld: m(b), alt: "" })),
      }),
      cta("WAT IS DE VOLGENDE STAP?", "Heb je iets bijzonders in gedachten?", "Ontdek hoe deze projectpagina in het CMS is opgebouwd.", "Bekijk het CMS", "/one"),
    ],
  };
});

const verhalen: BlauwdrukPagina = {
  slug: "/journal",
  titel: "Verhalen & inzichten",
  beschrijving:
    "Lees zes inspirerende voorbeeldartikelen over meeslepende belevingen, ontwerp, technologie en community in de NOVA-verhalen.",
  published: true,
  blokken: [
    binnenHero(
      "VERHALEN / IDEEËN & INZICHTEN",
      "Verhalen, ideeën\nen inzichten.",
      "DENKEN / BEVRAGEN / VERBEELDEN",
      "Verhalen over de toekomst van creativiteit. Over mensen die anders durven denken, plekken die iets losmaken en technologie die nieuwe vragen oproept.",
    ),
    blok("artikelen_grid", "mist", {
      eyebrow: "NIEUWSTE VERHALEN",
      titel: "Frisse perspectieven. Nieuwe mogelijkheden.\nZes verhalen om even anders naar de wereld te kijken.",
      maximaal: 12,
    }),
    blok("formulier", "limoenlicht", {
      soort: "nieuwsbrief",
      eyebrow: "NOVA NOTES",
      titel: "Een beetje meer inspiratie in je inbox.",
      intro: "Verhalen, nieuwe ideeën en creatieve inspiratie. Niet vaker dan nodig.",
      knoptekst: "Aanmelden voor NOVA Notes",
      voetnoot: "Ik wil NOVA Notes ontvangen en kan me later afmelden.",
      bevestigingstekst: "Je aanmelding is ontvangen en opgeslagen. Er wordt geen bevestigingsmail verstuurd.",
    }),
    cta("WAT IS DE VOLGENDE STAP?", footerTekst.kop, footerTekst.tekst, footerTekst.knop, "/contact"),
  ],
};

const belevingen: BlauwdrukPagina = {
  slug: "/experiences",
  titel: "Belevingen — Pulse Festival",
  beschrijving: "Ontdek Pulse Festival, het fictieve NOVA-demo-evenement met programma, sprekers en voorbeeldtickets.",
  published: true,
  blokken: [
    blok("header", "nacht", {
      layout: "achtergrond",
      hoogte: "normaal",
      eyebrow: "KOMENDE BELEVING / DEMO-EVENEMENT",
      heading: "Pulse\nFestival.",
      subheading:
        "Een driedaagse ontmoeting tussen creativiteit, technologie en cultuur. Vol verrassende perspectieven, nieuwe verbindingen en bijzondere verhalen.",
      cta_primair_label: "Bekijk het programma",
      cta_primair_link: "/experiences/pulse-festival",
      cta_secundair_label: "Bekijk NOVA Sessions",
      cta_secundair_link: "/experiences/nova-sessions",
      // Videohero: dezelfde NOVA-film als op de homepage (met staande versie voor telefoons).
      media_type: "video",
      media_video: `${SITE_URL}/media/nova-film-liggend.mp4`,
      media_afbeelding: m("nova-film-poster"),
      media_alt: "Korte film over NOVA: lichtinstallaties, een concertzaal, boogarchitectuur en bewegende lijnen.",
      overlay: "donker",
    }),
    blok("kaarten", "wit", {
      eyebrow: "WAT JE KUNT VERWACHTEN",
      titel: "Drie dagen. Eindeloos veel perspectieven.",
      intro: "Niet alleen luisteren, maar ontdekken en meedoen.",
      kolommen: "3",
      items: [
        { titel: "Inspirerende stemmen.", tekst: "Nieuwe ideeën van ontwerpers, makers en vernieuwers.", knoptekst: "01" },
        { titel: "Meeslepende werelden.", tekst: "Installaties die je anders laten kijken en voelen.", knoptekst: "02" },
        { titel: "Echte verbindingen.", tekst: "Ontmoet mensen die dezelfde nieuwsgierigheid delen.", knoptekst: "03" },
      ],
    }),
    blok("reeks", "mist", {
      eyebrow: "HET PROGRAMMA",
      titel: "Een programma vol mogelijkheden.",
      intro: "Elke dag een eigen ritme, van eerste idee tot laatste ontmoeting.",
      stappen: [
        { label: "DAG 1", tekst: "Ontdekken — nieuwe vragen, nieuwe geluiden, nieuwe perspectieven." },
        { label: "DAG 2", tekst: "Creëren — workshops, experimenten en samenwerking." },
        { label: "DAG 3", tekst: "Verbinden — inzichten delen en ideeën verder brengen." },
      ],
    }),
    blok("sprekers", "wit", {
      titel: "OP HET PODIUM\nOntmoet de denkers achter de ideeën.",
      sub: "Vier fictieve sprekers met elk hun eigen invalshoek.",
      items: [
        { naam: "Maya Chen", tekst: "Ontwerpen voor morgen", foto: m("comm_face") },
        { naam: "Noah Vermeer", tekst: "Belevingen voorbij het scherm", foto: m("comm_man") },
        { naam: "Amara Brooks", tekst: "De menselijke kant van technologie", foto: m("journal_face") },
        { naam: "Luca Moreno", tekst: "Betere vragen, sterkere gemeenschappen", foto: m("comm_person") },
      ],
    }),
    blok("prijskaarten", "nacht", {
      titel: "KIES JE BELEVING\nJouw beleving, op jouw manier.",
      // Eerste regel naast de kop; volgende regels als opmerking onder de kaarten.
      intro:
        "Vergelijk voorbeeldtickets. Deze prijzen zijn fictief; bestellen of betalen is niet mogelijk in de demo.\nFictieve prijzen en fictief evenement. Er worden geen tickets verkocht.",
      items: [
        { naam: "Dagkaart", prijs: "€ 49", voordeel: "Toegang tot één programmadag en de centrale expo.", knoptekst: "Bekijk tickets" },
        {
          naam: "Volledig festival",
          prijs: "€ 119",
          voordeel: "Drie dagen inspiratie, installaties en sessies.",
          badge: "MEEST GEKOZEN",
          knoptekst: "Bekijk tickets",
          accent: "ja",
        },
        { naam: "Makerspas", prijs: "€ 189", voordeel: "Het volledige programma plus een kleine werksessie.", knoptekst: "Bekijk tickets" },
      ],
    }),
    cta(
      "05 / GA VERDER",
      "Meer dan een evenement. Een gedeelde ervaring.",
      "Bekijk hoe evenementen, sprekers en prijskaarten in het CMS worden gepresenteerd.",
      "Ontdek de CMS-blokken",
      "/playground",
    ),
  ],
};

const eventPaginas: BlauwdrukPagina[] = evenementen.map((e) => ({
  slug: `/experiences/${e.slug}`,
  titel: e.naam,
  beschrijving: e.intro,
  published: true,
  blokken: [
    blok("header", "nacht", {
      layout: "achtergrond",
      hoogte: "normaal",
      eyebrow: e.eyebrow,
      heading: `${e.naam}.`,
      subheading: `${e.payoff} ${e.intro}`,
      media_type: "afbeelding",
      media_afbeelding: m(e.beeld),
      overlay: "donker",
    }),
    blok("feiten", "wit", {
      titel: "Praktisch",
      feiten: [
        { label: "DATUM", waarde: e.datum },
        { label: "LOCATIE", waarde: e.locatie },
        { label: "DOELGROEP", waarde: e.doelgroep },
      ],
    }),
    blok("reeks", "wit", {
      eyebrow: "HET PROGRAMMA",
      titel: e.dagen.length > 1 ? "Drie dagen. Eindeloos veel ideeën." : "Eén middag. Betere vragen.",
      // label = tijd, titel = dag (groepeert de rijen), tekst = programmaonderdeel
      stappen: e.dagen.flatMap((dag) => dag.items.map(([tijd, tekst]) => ({ label: tijd, titel: dag.titel, tekst }))),
    }),
    blok("prijskaarten", "mist", {
      titel: "JOUW TICKET\nKies je beleving.",
      intro: `Demoprijzen: bestellen of betalen is niet mogelijk.\n${e.disclaimer}`,
      items: e.tickets.map(([naam, prijs, voordeel], i) => ({
        naam,
        prijs,
        voordeel,
        knoptekst: "Bekijk voorbeeldtickets",
        accent: i === 1 ? "ja" : "nee",
      })),
    }),
    cta(
      "GA VERDER",
      "Meer dan een evenement. Een gedeelde ervaring.",
      "Bekijk hoe evenementen, programma's en prijskaarten in het CMS worden gepresenteerd.",
      "Ontdek de CMS-blokken",
      "/playground",
    ),
  ],
}));

const ruimteMeta: Record<string, [string, string]> = {
  "the-atrium": ["The Atrium", "space_atrium"],
  "studio-one": ["Studio One", "work_arch"],
  "light-lab": ["Light Lab", "work_color"],
};
const ruimteKaart: Record<string, string> = {
  "the-atrium": "Een open, lichte ruimte waar ideeën de ruimte krijgen.",
  "studio-one": "Een veelzijdige studio voor workshops, creatieve sessies en presentaties.",
  "light-lab": "Een experimentele plek waar licht en geluid de sfeer bepalen.",
};

const ruimtes: BlauwdrukPagina = {
  slug: "/spaces",
  titel: "Ruimtes — bijzondere ruimtes",
  beschrijving:
    "Ontdek The Atrium, Studio One en Light Lab: drie fictieve NOVA-ruimtes voor workshops, bijeenkomsten en evenementen.",
  published: true,
  blokken: [
    binnenHero(
      "ONZE RUIMTES / ANDERS ONTMOETEN",
      "Bijzondere\nruimtes voor\ngrote ideeën.",
      "RUIMTES DIE INSPIREREN",
      "Een goed idee verdient de juiste omgeving. Ontdek drie fictieve ruimtes voor ontmoetingen, presentaties, workshops en ervaringen.",
    ),
    blok("kaarten", "wit", {
      eyebrow: "ONZE RUIMTES",
      titel: "Ruimtes die de manier van ontmoeten veranderen.",
      kolommen: "3",
      items: Object.entries(ruimteMeta).map(([slug, [naam, beeld]]) => ({
        titel: naam,
        tekst: ruimteKaart[slug],
        beeld: m(beeld),
        link: `/spaces/${slug}`,
        knoptekst: `Bekijk ${naam}`,
      })),
    }),
    blok("statistieken", "mist", {
      titel: "RUIMTE OM TE CREËREN\nElk idee verdient een eigen ruimte.",
      intro: "Drie voorbeeldruimtes, ieder met een andere sfeer. Capaciteiten zijn alleen voorbeeldgegevens voor deze demo.",
      items: [
        { waarde: "3", label: "Fictieve ruimtes" },
        { waarde: "10–500", label: "Voorbeeldcapaciteit, afhankelijk van opstelling" },
        { waarde: "1", label: "Interactieve configurator" },
      ],
    }),
    cta(
      "03 / PLAN IETS",
      "Jouw ruimte. Jouw verhaal.",
      "Bekijk de configurator en de aanvraagstappen zonder een echte boeking te plaatsen.",
      "Probeer de configurator",
      "/lab",
    ),
  ],
};

const ruimtePaginas: BlauwdrukPagina[] = Object.entries(ruimteDetails).map(([slug, d]) => {
  const [naam, beeld] = ruimteMeta[slug];
  return {
    slug: `/spaces/${slug}`,
    titel: naam,
    beschrijving: d.intro,
    published: true,
    blokken: [
      blok("header", "nacht", {
        layout: "achtergrond",
        hoogte: "normaal",
        eyebrow: "NOVA-RUIMTES",
        heading: `${naam}.`,
        subheading: `${d.payoff} ${d.intro}`,
        media_type: "afbeelding",
        media_afbeelding: m(slug === "studio-one" ? "space_atrium" : beeld),
        overlay: "donker",
      }),
      blok("feiten", "wit", {
        titel: "Kenmerken",
        feiten: [
          { label: "CAPACITEIT", waarde: d.capaciteit },
          { label: "KENMERKEN", waarde: d.kenmerken.slice(0, 2).join(" / ") },
          { label: "STATUS", waarde: "Fictieve ruimte" },
        ],
      }),
      blok("mediatekst", "wit", {
        eyebrow: "DE RUIMTE",
        titel: "Alles wat je nodig hebt om te creëren.",
        alineas: d.alineas.map((tekst) => ({ tekst })),
        punten: d.kenmerken.map((tekst) => ({ tekst })),
        beeld: m(beeld),
        beeldzijde: "rechts",
        knop: "/lab",
        knoptekst: d.knop,
      }),
      blok("kaarten", "mist", {
        eyebrow: "STEL JE BEZOEK SAMEN",
        titel: "Jouw evenement, op jouw manier.",
        intro: ruimteDemolabel,
        kolommen: "3",
        items: [
          { titel: "Kies je ervaring", tekst: "Brainstorm, presentatie, workshop of evenement.", knoptekst: "STAP 01" },
          { titel: "Bepaal je gezelschap", tekst: "Kies een opstelling die past bij het aantal deelnemers.", knoptekst: "STAP 02" },
          { titel: "Bekijk de indicatie", tekst: "Geen echte kalender of reservering: alleen een rekenvoorbeeld.", knoptekst: "STAP 03" },
        ],
      }),
      cta(
        "PLAN IETS",
        "Jouw ruimte. Jouw verhaal.",
        "Bekijk de configurator en de aanvraagstappen zonder een echte boeking te plaatsen.",
        "Probeer de configurator",
        "/lab",
      ),
    ],
  };
});

const community: BlauwdrukPagina = {
  slug: "/community",
  titel: "Community — mensen & makers",
  beschrijving:
    "Ontmoet de fictieve makers en communitypartners van NOVA. Een voorbeeld van dynamische team-, partner- en testimonialcollecties.",
  published: true,
  blokken: [
    binnenHero(
      "ONZE COMMUNITY / SAMEN GEMAAKT",
      "Mensen maken\nde toekomst.",
      "MENSEN / CREATIVITEIT / VERBINDING",
      "Sterke ideeën ontstaan tussen mensen. Ontmoet de fictieve makers, partners en nieuwsgierige geesten van NOVA.",
    ),
    blok("kaarten", "wit", {
      titel: "Community-mozaïek",
      kolommen: "4",
      items: [
        { titel: "Makers", beeld: m("comm_face"), link: "/about" },
        { titel: "Partners", beeld: m("comm_man") },
        { titel: "Team", beeld: m("comm_person") },
        { titel: "Momenten die we delen", beeld: m("comm_event") },
      ],
    }),
    blok("mensen", "mist", {
      titel: "ONZE MAKERS\nDe mensen achter de mogelijkheden.",
      intro: "Vier makers. Verschillende disciplines. Eén gedeelde nieuwsgierigheid.",
      maximaal: 4,
    }),
    blok("partners_grid", "wit", {
      eyebrow: "ONZE PARTNERS",
      titel: "Samen sterker.",
      intro: "Voorbeeldpartners uit ontwerp, cultuur, technologie en maatschappelijke vernieuwing. Alle namen zijn fictief.",
    }),
    blok("partner_uitgelicht", "mist", {
      eyebrow: "UITGELICHTE PARTNER",
      titel: "Een ander perspectief verandert alles.",
      intro:
        "Maak kennis met Atelier North, een fictieve partner die verbeelding verbindt met ruimtelijk ontwerp. Samen onderzoeken we hoe plekken niet alleen functioneel, maar ook betekenisvol kunnen zijn.",
    }),
    blok("citaten_carrousel", "wit", {
      titel:
        "STEMMEN UIT DE COMMUNITY\nKleine momenten. Grote gesprekken.\nWat fictieve communityleden zeggen over de NOVA-ervaring. De citaten zijn verzonnen en worden alleen getoond als CMS-demovulling.",
      items: citaten.map(([citaat, naam]) => ({ citaat, naam, functie: "fictief teamlid, voorbeeldcitaat" })),
    }),
    cta(
      "05 / DOE MEE",
      "De toekomst heeft andere stemmen nodig.",
      "Ontdek wat er mogelijk wordt wanneer mensen en ideeën samenkomen.",
      "Neem contact op",
      "/contact",
    ),
  ],
};

const overOns: BlauwdrukPagina = {
  slug: "/about",
  titel: "Over ons — het verhaal achter NOVA",
  beschrijving:
    "Lees het verhaal achter de fictieve NOVA-website en ontdek waarom deze is ontwikkeld als designshowcase van Link & Lead One.",
  published: true,
  blokken: [
    binnenHero(
      "OVER ONS / ONS VERHAAL",
      "Maak ruimte\nvoor wat komt.",
      "NIEUWE MOGELIJKHEDEN ONTWERPEN",
      "NOVA is geen echt bedrijf. Het is een zorgvuldig ontworpen voorbeeldwereld om de kracht van bijzonder webdesign en overzichtelijk contentbeheer te laten zien.",
      { media_type: "afbeelding", media_afbeelding: m("hero_arch") },
    ),
    blok("statement", "nacht", {
      eyebrow: "01 / WAAR WE IN GELOVEN",
      titel: "Wij geloven dat *ideeën groeien* als werelden elkaar raken.",
      tekst:
        "Creativiteit begint bij nieuwsgierigheid. Vooruitgang begint bij samenwerking. NOVA is gebouwd rondom één gedachte: een website moet iets oproepen. Verwondering. Herkenning. Een idee.",
    }),
    blok("reeks", "wit", {
      eyebrow: "ZO DENKEN WE",
      titel: "Van nieuwsgierigheid naar creatie.",
      intro: "Vier stappen die de fictieve NOVA-werkwijze tastbaar maken.",
      stappen: [
        { nummer: "01", titel: "Ontdekken", tekst: "We luisteren, kijken en stellen de vragen achter de vraag." },
        { nummer: "02", titel: "Verbeelden", tekst: "We onderzoeken mogelijkheden buiten het vanzelfsprekende." },
        { nummer: "03", titel: "Creëren", tekst: "We brengen vorm, techniek en verhaal samen." },
        { nummer: "04", titel: "Verbinden", tekst: "We delen het resultaat met de mensen voor wie het bedoeld is." },
      ],
    }),
    blok("mensen", "mist", {
      titel: "Gemaakt door nieuwsgierige geesten.",
      intro: "Bekijk hoe mensen en rollen vanuit één collectie op verschillende pagina’s terugkomen.",
      maximaal: 8,
    }),
    blok("mediatekst", "wit", {
      eyebrow: "HET ECHTE VERHAAL",
      titel: "Een fictieve wereld. Een echte demonstratie van ontwerpvrijheid.",
      alineas: [
        {
          tekst:
            "NOVA is gemaakt om de mogelijkheden van Link & Lead One zichtbaar te maken. Je ziet een merk met een eigen uitstraling. Achter de schermen worden pagina’s, secties en collecties volgens de CMS-specificatie ingericht en via het CMS beheerd.",
        },
      ],
      beeld: m("work_arch"),
      beeldzijde: "rechts",
      knop: "/one",
      knoptekst: "Ontdek Link & Lead One",
    }),
    cta("WAT IS DE VOLGENDE STAP?", footerTekst.kop, footerTekst.tekst, footerTekst.knop, "/contact"),
  ],
};

const contact: BlauwdrukPagina = {
  slug: "/contact",
  titel: "Contact — NOVA / Link & Lead One",
  beschrijving: "Neem contact op over NOVA of vraag een demonstratie aan van Link & Lead One.",
  published: true,
  blokken: [
    binnenHero(
      "CONTACT / NEEM CONTACT OP",
      "Laten we\niets laten gebeuren.",
      "ZEG HALLO",
      "Heb je een idee, een vraag of wil je ontdekken wat Link & Lead One voor jouw website kan betekenen? Vertel het ons.",
    ),
    blok("formulier", "wit", {
      soort: "contact",
      eyebrow: "01 / START EEN GESPREK",
      titel: "Wat houdt je bezig?",
      intro: "Een goed gesprek begint met een nieuwsgierige vraag. Vertel in een paar zinnen wat je zoekt.",
      knoptekst: "Verstuur mijn bericht",
      voetnoot: "Ik begrijp dat mijn gegevens alleen worden gebruikt om op mijn vraag te reageren.",
      bevestigingstekst: "Bedankt! Je bericht is ontvangen en opgeslagen. Er wordt geen e-mail verstuurd.",
    }),
    blok("kaart", "wit", {
      eyebrow: "02 / WAAR WE ZIJN",
      titel: "Een digitale wereld. Geen fysiek adres.",
      intro: "NOVA bestaat alleen als demonstratieconcept. Er is geen NOVA-kantoor of publiek bezoekadres.",
    }),
    cta("03 / ONTDEK MEER", "Zie wat er kan, voordat we praten.", "Ontdek eerst hoe de website is opgebouwd.", "Start de rondleiding", "/demo"),
  ],
};

const lab: BlauwdrukPagina = {
  slug: "/lab",
  titel: "NOVA Lab — interactieve websitefuncties",
  beschrijving:
    "Probeer fictieve configurators, formulieren, NPS, personalisatie en A/B-varianten in het interactieve NOVA Lab.",
  published: true,
  blokken: [
    blok("header", "nacht", {
      layout: "compact",
      hoogte: "normaal",
      eyebrow: "NOVA LAB / INTERACTIEVE DEMO’S",
      heading: "Ontdekken.\nExperimenteren.\nBeleven.",
      subheading:
        "Probeer zelf hoe bezoekers met een website kunnen communiceren: opties kiezen, feedback geven, formulieren invullen en persoonlijke content ontdekken.",
      usps: [{ tekst: "HET INTERACTIEVE LAB" }],
    }),
    blok("configurator", "wit", {
      eyebrow: "MAAK HET VAN JOU",
      titel: "Stel je eigen beleving samen.",
      intro:
        "Stel een fictieve ervaring samen en bekijk hoe een indicatie meebeweegt met jouw keuzes. Er volgt geen aanvraag, reservering of betaling.",
      vraag_aantal: "ja",
      aantal_label: "Aantal deelnemers",
      opties: [
        { label: "Creatieve sessie", groep: "Type ervaring", prijs: "150" },
        { label: "Meeslepend evenement", groep: "Type ervaring", prijs: "300" },
        { label: "Volledige beleving", groep: "Type ervaring", prijs: "450" },
      ],
      knoptekst: "Bekijk aanvraagformulier",
      bevestiging: "Dit is een rekenvoorbeeld. Er is nog geen echte reservering of offerteaanvraag gedaan.",
    }),
    blok("formulier_bouwer", "mist", {
      eyebrow: "FORMULIERBOUWER",
      titel: "Een formulier, precies zoals jij het nodig hebt.",
      intro:
        "Elk veld hieronder is in het CMS samengesteld: tekst, tekstvak, telefoon, bedrijf en keuzelijst, verplicht of optioneel. Verstuur het leeg om de foutmeldingen te zien.",
      velden: [
        { label: "Naam", type: "tekst", verplicht: "ja" },
        { label: "Organisatie", type: "bedrijf", verplicht: "nee" },
        { label: "Telefoonnummer", type: "telefoon", verplicht: "nee" },
        { label: "Soort bijeenkomst", type: "keuze", opties: "Workshop, Presentatie, Evenement, Iets anders", verplicht: "ja" },
        { label: "Wat wil je bereiken?", type: "tekstvak", verplicht: "ja" },
      ],
      knoptekst: "Verstuur het formulier",
      voetnoot: "Je antwoorden worden opgeslagen in de NOVA-demodatabase. Er wordt geen e-mail verstuurd.",
      bevestigingstekst: "Bedankt! Je antwoorden zijn opgeslagen in de NOVA-demodatabase.",
    }),
    blok("review_verzamelen", "wit", {
      eyebrow: "REVIEWS VERZAMELEN",
      titel: "Wat vond je van NOVA?",
      intro: "Geef een aantal sterren, je naam en een korte review. Reviews worden opgeslagen en pas na controle getoond.",
      knoptekst: "Plaats mijn review",
      bevestigingstekst: "Bedankt voor je review! Hij is opgeslagen en wordt na controle zichtbaar.",
    }),
    blok("enquete", "mist", {
      soort: "nps",
      eyebrow: "ENQUÊTE / NPS",
      titel: "Hoe waarschijnlijk is het dat je deze demo aanbeveelt?",
      vraag: "Jouw score (0–10)",
      toelichtinglabel: "Waarom geef je deze score?",
      knoptekst: "Geef mijn score door",
      bevestigingstekst: "Bedankt! Je score is opgeslagen in de NOVA-demodatabase.",
    }),
    blok("ab_blok", "mist", {
      experiment: "lab-kop",
      eyebrow: "A/B-TEST",
      titel_a: "Maak ruimte voor nieuwe ideeën.",
      titel_b: "Geef jouw volgende idee een vliegende start.",
      knoptekst_a: "Wissel tekstvariant",
    }),
    blok("personalisatie", "mist", {
      eyebrow: "PERSONALISATIE",
      titel: "Welkom bij NOVA.",
      warm_titel: "Fijn dat je er weer bent. Ontdek wat er nieuw is.",
      knoptekst: "Simuleer terugkerende bezoeker",
    }),
    cta(
      "06 / ACHTER DE SCHERMEN",
      "Bekijk de blokken achter elke interactie.",
      "Alle onderdelen komen voort uit de CMS-blokkenbibliotheek.",
      "Bekijk alle interactieve blokken",
      "/playground",
    ),
  ],
};

const leden: BlauwdrukPagina = {
  slug: "/members",
  titel: "Leden — demo ledentoegang",
  beschrijving: "Bekijk het concept voor ledentoegang binnen de fictieve NOVA-website. Geen echte inlogomgeving.",
  published: true,
  blokken: [
    blok("header", "nacht", {
      layout: "compact",
      hoogte: "normaal",
      eyebrow: "LEDEN / JOUW PLEK",
      heading: "Een plek voor\nonze mensen.",
      subheading: "Een voorbeeld van een afgeschermde plek voor leden met eigen content, sessies en verhalen.",
    }),
    blok("leden_toegang", "wit", {
      titel: "Welkom terug.",
      intro: "Log in om te zien hoe een ledenomgeving vorm kan krijgen. Dit is een visuele demo: er worden geen wachtwoorden gecontroleerd of opgeslagen.",
    }),
    cta(
      "02 / LEDENERVARING",
      "Elke community verdient een eigen plek.",
      "Bekijk meer blokken voor leden, aanmeldingen en formulieren.",
      "Open de blokkenbibliotheek",
      "/playground",
    ),
  ],
};

const bibliotheek: BlauwdrukPagina = {
  slug: "/playground",
  titel: "Blokkenbibliotheek — 43 CMS-blokken",
  beschrijving: "Ontdek de 43 algemene CMS-blokken en vijf achtergronden van Link & Lead One in een interactieve voorbeeldbibliotheek.",
  published: true,
  blokken: [
    binnenHero(
      "LINK & LEAD ONE / BLOKKENVERKENNER",
      "Eén systeem.\n43 mogelijkheden.",
      "43 ALGEMENE CONTENTBLOKKEN",
      "Bekijk alle 43 algemene CMS-blokken. Kies een categorie, achtergrond en beschikbare variant om te zien hoe uiteenlopende pagina’s worden opgebouwd.",
    ),
    cta(
      "02 / ZIE HET IN CONTEXT",
      "Een blok is pas het begin.",
      "Ontdek hoe losse onderdelen samen één overtuigende website vormen.",
      "Bekijk NOVA in actie",
      "/",
    ),
  ],
};

const sport: BlauwdrukPagina = {
  slug: "/playground/sports",
  titel: "Sportblokken — wedstrijden & volgende wedstrijd",
  beschrijving: "Bekijk de fictieve sportclub NOVA United en ontdek de CMS-blokken Wedstrijden en Volgende wedstrijd.",
  published: true,
  blokken: [
    binnenHero(
      "BLOKKENBIBLIOTHEEK / SPORT",
      "Elk team.\nElk moment.",
      "WEDSTRIJDEN",
      "Een afzonderlijke demo voor wedstrijdoverzichten en de volgende wedstrijd. Ontworpen voor sportclubs met een eigen identiteit.",
    ),
    blok("tabel", "nacht", {
      eyebrow: "VOLGENDE WEDSTRIJD",
      titel: "De volgende wedstrijd begint hier.",
      intro: "NOVA United tegen Atlas FC. Geen live wedstrijdfeed; de datum is voorbeeldcontent.",
      // Kolom 2 is ook de kop boven het programma; kolom 3–5 vullen de uitgelichte rij (markeer).
      kolommen: [
        { label: "Datum" },
        { label: "Het programma · het hele seizoen in één oogopslag" },
        { label: "Kop" },
        { label: "Toelichting" },
        { label: "Thuis of uit" },
      ],
      markeer: "Atlas FC",
      rijen: [
        {
          c1: "24 APR",
          c2: "NOVA United — Atlas FC · thuis · 16.00 uur",
          c3: "NOVA / ATLAS",
          c4: "Voorbeeldwedstrijd · 24 april 2027 · 16.00 uur",
          c5: "THUIS",
        },
        { c1: "1 MEI", c2: "Harbor City — NOVA United · uit · 14.30 uur" },
        { c1: "8 MEI", c2: "NOVA United — Riverside SC · thuis · 15.00 uur" },
      ],
      voettekst: "Alle clubs, tijden en wedstrijden zijn fictief.",
    }),
    cta(
      "03 / TERUG NAAR DE BIBLIOTHEEK",
      "Gebouwd voor meer dan één soort website.",
      "Dit zijn twee van de 43 algemene CMS-blokken.",
      "Bekijk alle blokken",
      "/playground",
    ),
  ],
};

const demo: BlauwdrukPagina = {
  slug: "/demo",
  titel: "Interactieve rondleiding — Link & Lead One",
  beschrijving: "Loop door NOVA en ontdek de contentblokken, collecties en stijlmogelijkheden van Link & Lead One.",
  published: true,
  blokken: [
    blok("header", "nacht", {
      layout: "compact",
      hoogte: "normaal",
      eyebrow: "LINK & LEAD ONE / RONDLEIDING",
      heading: "Bekijk het ontwerp.\nOntdek het CMS.",
      subheading:
        "Een rondleiding langs de opvallendste onderdelen van NOVA. Ontdek niet alleen wat je ziet, maar ook hoe je de inhoud erachter beheert.",
      usps: [{ tekst: "ONTWERP MET RONDLEIDING" }],
    }),
    blok("reeks", "wit", {
      eyebrow: "DE VIJF-MINUTENTOUR",
      titel: "Laten zien, niet vertellen.",
      intro:
        "Zes korte stappen laten de verbinding tussen design en contentbeheer zien. Niet-gekoppelde onderdelen heten in deze tour expliciet demonstratie of preview.",
      stappen: [
        { titel: "Start met de homepage", link: "/" },
        { titel: "Maak de blokken zichtbaar", link: "/" },
        { titel: "Open een collectie", link: "/work" },
        { titel: "Probeer interactie in NOVA Lab", link: "/lab" },
        { titel: "Verken de blokkenbibliotheek", link: "/playground" },
        { titel: "Bekijk mobiel", link: "/" },
      ],
      knoptekst_reeks: "Start op de homepage",
    }),
    blok("kaarten", "wit", {
      eyebrow: "ONTDEK MEER",
      titel: "Kies je volgende stop.",
      kolommen: "3",
      items: [
        { tekst: "ONTDEKKEN", titel: "Werk: projecten en contentcollecties", link: "/work", knoptekst: "OPEN WERK" },
        { tekst: "EXPERIMENTEREN", titel: "NOVA Lab: interactieve blokken en formulieren", link: "/lab", knoptekst: "OPEN LAB" },
        {
          tekst: "VERKENNEN",
          titel: "Blokkenbibliotheek: alle 43 algemene blokken",
          link: "/playground",
          knoptekst: "OPEN BLOKKENBIBLIOTHEEK",
        },
      ],
    }),
    cta(
      "03 / LATEN WE PRATEN",
      "Wil je je eigen website vorm zien krijgen?",
      "Vraag een persoonlijke toelichting aan op Link & Lead One.",
      "Vraag een persoonlijke demo aan",
      "/one#aanvraag",
    ),
  ],
};

const hetCms: BlauwdrukPagina = {
  slug: "/one",
  titel: "Link & Lead One — ontdek het CMS achter NOVA",
  beschrijving:
    "Ontdek Link & Lead One: 43 algemene CMS-blokken, vijf achtergrondvarianten, sitegebonden huisstijl en contentcollecties. Bekijk de demo.",
  published: true,
  blokken: [
    blok("header", "nacht", {
      layout: "compact",
      hoogte: "normaal",
      eyebrow: "LINK & LEAD ONE / HET CMS ACHTER NOVA",
      heading: "Je zag de website.\n*Ontdek wat erachter zit.*",
      subheading:
        "NOVA laat zien hoeveel ontwerpvrijheid je kunt combineren met overzichtelijk contentbeheer. Link & Lead One brengt pagina’s, contentblokken en collecties samen, met ruimte voor een volledig eigen uitstraling.",
      cta_primair_label: "Start de rondleiding",
      cta_primair_link: "/demo",
      cta_secundair_label: "Bekijk de 43 blokken",
      cta_secundair_link: "/playground",
      extras: "stats",
      stats: [
        { waarde: "43", label: "algemene contentblokken" },
        { waarde: "05", label: "achtergrondvarianten" },
        { waarde: "12", label: "instelbare huisstijlkleuren" },
      ],
    }),
    blok("mediatekst", "wit", {
      eyebrow: "WAAROM HET WERKT",
      titel: "Mooi van buiten. Slim ingericht.",
      alineas: [
        {
          tekst:
            "Een krachtige website hoeft geen ingewikkeld beheer te hebben. Van de eerste indruk tot de laatste oproep: ieder onderdeel heeft een functie. In Link & Lead One krijgt een redacteur grip op de inhoud, terwijl de voorkant ruimte houdt voor een eigen design.",
        },
      ],
      beeld: m("hero_arch"),
      beeldzijde: "rechts",
      knop: "/demo",
      knoptekst: "Bekijk hoe NOVA is opgebouwd",
    }),
    blok("kaarten", "mist", {
      eyebrow: "DRIE REDENEN",
      titel: "Het design is van jou. De inhoud houd je zelf bij.",
      intro: "Drie sterke bouwstenen voor een website die blijft groeien.",
      kolommen: "3",
      items: [
        {
          knoptekst: "01 / ONTWERPVRIJHEID",
          titel: "Jouw merk, jouw design.",
          tekst: "Een eigen frontend laat het design aansluiten op je merk. Geen verplichte standaarduitstraling.",
        },
        {
          knoptekst: "02 / OVERZICHTELIJKE CONTENT",
          titel: "Alles op een vaste plek.",
          tekst: "Beheer paginaonderdelen, afbeeldingen en collecties op vaste plekken in het CMS.",
        },
        {
          knoptekst: "03 / MEER INTERACTIE",
          titel: "Meer dan een brochure.",
          tekst: "Gebruik de aanwezige blokken voor formulieren, configurators, testimonials en meer.",
        },
      ],
    }),
    blok("statement", "diep", {
      eyebrow: "ÉÉN SYSTEEM",
      titel: "Eén CMS.\n*Heel veel mogelijk­heden.*",
      tekst:
        "43 algemene blokken. Vijf achtergrondvarianten. Twaalf instelbare huisstijlkleuren. Dat zijn geen willekeurige aantallen: ze komen uit de huidige CMS-ontwerpspecificatie. De werkelijke beschikbaarheid in een installatie controleren we tijdens de technische demo.\n- Eigen huisstijl per site\n- Blokken & varianten\n- Dynamische collecties\n- Formulieren & interactie\n- Responsieve weergave",
      knop: "/playground",
      knoptekst: "Ontdek de blokken",
    }),
    blok("mediatekst", "wit", {
      eyebrow: "JOUW MERK",
      titel: "Eén systeem. Jouw eigen uitstraling.",
      alineas: [
        {
          tekst:
            "Een herkenbaar merk bouw je niet met een verzameling identieke templates. NOVA heeft haar eigen beeldtaal, ritme en sfeer. Via de site-instellingen leg je kleuren en typografie per website vast. Met een eigen frontend bepaal je bovendien de vormgeving van de blokken.",
        },
      ],
      beeld: m("work_color"),
      beeldzijde: "links",
      knop: "/",
      knoptekst: "Bekijk het design van NOVA",
    }),
    blok("reeks", "mist", {
      eyebrow: "ZO WERKT HET",
      titel: "Van mooi ontwerp naar beheerbare website.",
      intro: "Een helder proces verbindt ontwerp, bouw en redactie.",
      stappen: [
        { nummer: "01", titel: "Ontwerp", tekst: "Maak een visuele website die precies bij het merk past." },
        { nummer: "02", titel: "Structuur", tekst: "Koppel secties aan bestaande CMS-blokken en collecties." },
        { nummer: "03", titel: "Beheer", tekst: "Vul teksten, media en contentitems in via de daarvoor bedoelde velden." },
        { nummer: "04", titel: "Publiceer", tekst: "Controleer desktop en mobiel en publiceer via de geconfigureerde omgeving." },
      ],
    }),
    blok("flexibel", "wit", {
      eyebrow: "VOOR WIE",
      titel: "Gemaakt voor mensen die iets willen maken.",
      intro: "Of je nu een nieuwe website bouwt of dagelijks content publiceert: een duidelijke inhoudsstructuur helpt.",
      kolommen: "3",
      items: [
        {
          kop: "Voor marketingteams",
          tekst: "Werk aan nieuwe pagina’s, campagnes en updates zonder telkens de hele website opnieuw te ontwerpen.",
        },
        {
          kop: "Voor creatieve bureaus",
          tekst: "Houd de vrijheid van een eigen frontend en geef opdrachtgevers een begrijpelijke manier om content te beheren.",
        },
        {
          kop: "Voor organisaties",
          tekst: "Breng cases, mensen, artikelen en andere content overzichtelijk samen. Gebruik per site de passende huisstijl.",
        },
      ],
    }),
    blok("overgang", "limoenlicht", {
      tekst: "Probeer niet te verbeelden wat er mogelijk is. Bekijk het.\nStart de interactieve rondleiding of open direct de blokkenbibliotheek.",
      stijl: "limoenlicht",
    }),
    blok("faq", "mist", { titel: "Veelgestelde vragen over Link & Lead One.", vragen: faq.map(([vraag, antwoord]) => ({ vraag, antwoord })) }),
    blok("cta", "limoenlicht", {
      eyebrow: "08 / ERVAAR HET ZELF",
      titel: "Laat de website overtuigen. Ontdek zelf hoe het CMS werkt.",
      tekst: "Begin met de interactieve rondleiding, bekijk de blokkenbibliotheek of vraag een persoonlijke demonstratie aan.",
      knoptekst: "Vraag een persoonlijke demo aan",
      knop: "#aanvraag",
      meta: [{ tekst: "Dit is een demonstratie. Voor een live saleswebsite moeten de echte CMS-koppeling en aanvraagroute nog worden ingesteld." }],
    }),
    blok("formulier", "mist", {
      soort: "contact",
      eyebrow: "DEMO AANVRAGEN",
      titel: "Ontdek wat Link & Lead One voor jouw website kan betekenen.",
      intro:
        "Vertel ons wat voor website je wilt maken. Dan kijken we samen welke onderdelen relevant zijn. Dit beheren je redacteuren zelf:\n- Pagina's samenstellen uit blokken, in vijf achtergronden\n- Cases, artikelen, teamleden en reviews als aparte collecties\n- Huisstijl per site: twaalf kleurvelden en twee lettertypes\n- Merk, navigatie en redirects zonder nieuwe deploy\n- Formulieren waarvan aanvragen in het CMS binnenkomen",
      knoptekst: "Vraag mijn demo aan",
      voetnoot: "Ik geef toestemming om contact met mij op te nemen over mijn aanvraag.",
      bevestigingstekst: "Je aanvraag is ontvangen. We nemen contact met je op om een demonstratie af te stemmen.",
    }),
    cta("WAT IS DE VOLGENDE STAP?", footerTekst.kop, footerTekst.tekst, footerTekst.knop, "/contact"),
  ],
};

export const paginas: BlauwdrukPagina[] = [
  home,
  werk,
  ...caseDetailPaginas,
  verhalen,
  belevingen,
  ...eventPaginas,
  ruimtes,
  ...ruimtePaginas,
  community,
  overOns,
  contact,
  lab,
  leden,
  bibliotheek,
  sport,
  demo,
  hetCms,
];

// ---------- Collecties (in het CMS: Cases, Artikelen, Team, Partners) ----------
export const collecties = {
  cases: Object.entries(caseNamen).map(([slug, [naam, sector, jaar]], i) => ({
    slug,
    klantnaam: naam,
    sector,
    resultaat_periode: jaar,
    uitdaging: caseDetails[slug].projectintro,
    citaat: caseDetails[slug].statement,
    schakels: caseDetails[slug].diensten,
    foto: m(caseDetails[slug].beelden[0]),
    sort_order: i + 1,
  })),
  teamleden: Object.entries(bios).map(([naam, b], i) => ({
    naam,
    functie: ["Creatief directeur", "Hoofd belevingen", "Ontwerpstrateeg", "Communitycurator"][i],
    tekst: `${b.kort} ${b.lang}`,
    foto: m(["comm_face", "comm_man", "journal_face", "comm_person"][i]),
    sort_order: i + 1,
  })),
};
