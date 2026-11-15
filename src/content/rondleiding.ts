// Automatische rondleiding (/rondleiding): scènes die de echte pagina's van NOVA in een venster
// laten zien en er vanzelf doorheen scrollen, blokken aanwijzen en knoppen indrukken.
// Een scène is óf een pagina (pad) óf een dia met uitleg over wat er achter de schermen gebeurt.
// Elke stap heeft een tijdstip (ms na het begin van de scène). Claim hier alleen wat de site echt doet.

export type Actie =
  | { naar: string | "top"; markeer?: boolean }
  | { labels: boolean }
  | { klik: string; tekst?: string }
  | { punt: number };

export type Scene = {
  titel: string;
  tekst: string;
  punten?: string[];
  duur: number;
  stappen?: Array<[number, Actie]>;
} & ({ pad: string; scherm?: "desktop" | "mobiel" } | { dia: "intro" | "achter" | "kwaliteit" | "einde" });

export const SCENES: Scene[] = [
  {
    dia: "intro",
    titel: "NOVA × Link & Lead One",
    tekst: "Een complete website die volledig in het CMS wordt beheerd. In een paar minuten zie je hoe het werkt.",
    duur: 7000,
  },
  {
    pad: "/",
    titel: "De homepage: alles is een CMS-blok",
    tekst: "Tekst, beelden, knoppen en de volgorde van de secties komen uit het CMS. De redacteur stelt een pagina samen uit blokken.",
    punten: ["Header met eigen ontwerp", "Bloklabels tonen welk CMS-blok het is", "Vijf achtergronden per blok"],
    duur: 13000,
    stappen: [
      [0, { punt: 0 }],
      [3500, { labels: true }],
      [3500, { punt: 1 }],
      [7000, { naar: "#app section:nth-of-type(2)", markeer: true }],
      [9500, { punt: 2 }],
      [9500, { naar: "#app section:nth-of-type(4)", markeer: true }],
    ],
  },
  {
    pad: "/",
    titel: "Video uit de mediabibliotheek",
    tekst: "De video staat in de mediabibliotheek van het CMS. Een telefoon krijgt een staande versie, een tablet een lichtere versie.",
    punten: ["Speelt alleen als hij in beeld is", "Pauzeknop voor bezoekers", "Poster als eerste beeld"],
    duur: 11000,
    stappen: [
      [0, { naar: ".feature-media.met-video", markeer: true }],
      [0, { punt: 0 }],
      [4000, { punt: 1 }],
      [4000, { naar: ".feature-media.met-video .video-knop", markeer: true }],
      [7500, { punt: 2 }],
    ],
  },
  {
    pad: "/",
    titel: "Collecties: mensen, verhalen en cases",
    tekst: "Teamleden, artikelen en projecten beheer je als lijsten in het CMS. Een blok toont ze automatisch.",
    punten: ["Teamleden", "Verhalen", "Oproep onderaan de pagina"],
    duur: 11000,
    stappen: [
      [0, { punt: 0 }],
      [0, { naar: "#app section:nth-of-type(7)", markeer: true }],
      [4000, { punt: 1 }],
      [4000, { naar: "#app section:nth-of-type(8)", markeer: true }],
      [7500, { punt: 2 }],
      [7500, { naar: ".footer-cta", markeer: true }],
    ],
  },
  {
    pad: "/experiences",
    titel: "Een evenement neerzetten",
    tekst: "Pulse Festival: een video-header, een programma en sprekers. Sprekers linken naar hun eigen profielpagina.",
    punten: ["Video-header", "Programma", "Sprekers met profiel"],
    duur: 12000,
    stappen: [
      [0, { punt: 0 }],
      [3500, { punt: 1 }],
      [3500, { naar: "#app section:nth-of-type(3)", markeer: true }],
      [7500, { punt: 2 }],
      [7500, { naar: "#app section:nth-of-type(4)", markeer: true }],
    ],
  },
  {
    pad: "/mensen/maya-chen",
    titel: "Profielpagina's, vanzelf",
    tekst: "Elk teamlid en elke partner krijgt automatisch een eigen pagina, met gegevens voor zoekmachines.",
    duur: 7000,
  },
  {
    pad: "/work",
    titel: "Projecten",
    tekst: "Cases komen uit een collectie in het CMS, met beeld, bijschrift en klant.",
    duur: 8000,
    stappen: [[2500, { naar: "#app section:nth-of-type(2)", markeer: true }]],
  },
  {
    pad: "/journal",
    titel: "Verhalen met filters",
    tekst: "Bezoekers filteren de verhalen op rubriek. Een redacteur voegt een artikel toe en het staat er direct tussen.",
    punten: ["Filter op rubriek", "Uitgelicht verhaal", "Nieuwsbrief-aanmelding"],
    duur: 12000,
    stappen: [
      [0, { punt: 0 }],
      [2000, { naar: "#app section:nth-of-type(2)" }],
      [4000, { klik: '[aria-label="Filter op rubriek"] .chip:nth-child(2)' }],
      [6500, { klik: '[aria-label="Filter op rubriek"] .chip:nth-child(1)' }],
      [8000, { punt: 2 }],
      [8000, { naar: ".section-lime", markeer: true }],
    ],
  },
  {
    pad: "/journal/de-kracht-van-immersive-experiences",
    titel: "Een artikel",
    tekst: "Artikelpagina's krijgen een deelbeeld voor sociale media en gestructureerde gegevens, zodat Google het als artikel herkent.",
    duur: 8000,
    stappen: [[3000, { naar: ".article-body" }]],
  },
  {
    pad: "/one",
    titel: "Link & Lead One",
    tekst: "De productpagina: voordelen, prijzen, veelgestelde vragen en een aanvraagformulier, allemaal als blokken.",
    punten: ["Voordelen", "Veelgestelde vragen", "Aanvraagformulier"],
    duur: 13000,
    stappen: [
      [0, { punt: 0 }],
      [2500, { naar: "#app section:nth-of-type(4)", markeer: true }],
      [6000, { punt: 1 }],
      [6000, { naar: ".faq-lijst", markeer: true }],
      [9500, { punt: 2 }],
      [9500, { naar: "#aanvraag", markeer: true }],
    ],
  },
  {
    pad: "/lab",
    titel: "Interactieve blokken",
    tekst: "Een configurator, een formulier dat je zelf in het CMS samenstelt en een reviewformulier. Inzendingen worden veilig opgeslagen, er wordt niets gemaild.",
    punten: ["Configurator", "Formulierbouwer", "Review geven", "Goedgekeurde reviews"],
    duur: 15000,
    stappen: [
      [0, { punt: 0 }],
      [1500, { naar: "#app section:nth-of-type(2)", markeer: true }],
      [5000, { punt: 1 }],
      [5000, { naar: "#app section:nth-of-type(3)", markeer: true }],
      [8500, { punt: 2 }],
      [8500, { naar: "#app section:nth-of-type(4)", markeer: true }],
      [10500, { klik: '[aria-label="5 sterren"]' }],
      [12000, { punt: 3 }],
      [12000, { naar: "#app section:nth-of-type(5)", markeer: true }],
    ],
  },
  {
    pad: "/playground",
    titel: "De blokkenbibliotheek",
    tekst: "Alle 43 blokken, elk als echt voorbeeld met dezelfde code als de site. Kies een blok, een variant en een schermformaat.",
    punten: ["Kies een blok", "Bekijk het op een telefoon", "Velden die de redacteur invult"],
    duur: 14000,
    stappen: [
      [0, { punt: 0 }],
      [2000, { naar: ".playground-layout" }],
      [4000, { klik: ".block-list button", tekst: "Prijskaarten" }],
      [7500, { punt: 1 }],
      [7500, { klik: ".block-viewer .chip", tekst: "Mobiel" }],
      [10500, { punt: 2 }],
      [10500, { naar: ".block-fields", markeer: true }],
    ],
  },
  {
    pad: "/",
    scherm: "mobiel",
    titel: "Dezelfde site op een telefoon",
    tekst: "Geen aparte mobiele website: hetzelfde CMS en dezelfde blokken, aangepast aan het scherm.",
    duur: 10000,
    stappen: [
      [3500, { naar: "#app section:nth-of-type(2)" }],
      [6500, { naar: ".feature-media" }],
    ],
  },
  {
    dia: "achter",
    titel: "Achter de schermen",
    tekst: "De redacteur werkt in het CMS. De site haalt de inhoud op via de lees-API en ververst binnen een minuut, of direct met een webhook. Formulieren gaan naar een eigen beveiligde database.",
    duur: 13000,
  },
  {
    dia: "kwaliteit",
    titel: "Elke wijziging wordt gecontroleerd",
    tekst: "Bij elke wijziging draaien automatische tests in Chrome en Safari, een snelheidsmeting en een controle op toegankelijkheid. Valt één blok uit, dan blijft de rest van de pagina gewoon staan.",
    duur: 12000,
  },
  {
    dia: "einde",
    titel: "Zelf zien wat Link & Lead One kan?",
    tekst: "Plan een kennismaking, of bekijk de site op je eigen tempo.",
    duur: 8000,
  },
];
