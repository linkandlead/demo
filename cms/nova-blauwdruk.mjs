// Blauwdruk van de NOVA-demosite voor het Link & Lead One-CMS (model A: deze frontend leest de
// content via GET /api/cms/content).
//
// GEBRUIK — alleen tegen een APARTE, geïsoleerde NOVA-demosite, nooit tegen een bestaande site:
//   1. Maak in het CMS via /admin/platform → "+ Nieuwe website" een nieuwe site "NOVA demo" aan
//      (NIET de bestaande sites "Nova Studio" of "Stadstheater Nova").
//   2. Genereer daar het API-token (cms_...). Dat token is hard op die ene site gescopet.
//   3. Vanuit de linkandlead-cms-repo:
//        CMS_URL=https://<cms-domein> CMS_TOKEN=cms_... node scripts/cms-push.mjs <pad>/cms/nova-blauwdruk.mjs
//   4. Zet dezelfde CMS_URL + CMS_TOKEN als env-vars van deze frontend.
//
// Alleen bestaande bloktypes en velden (geverifieerd tegen src/shared/blokregistry.ts). De sync
// weigert onbekende types. Achtergrond (bg): wit=Licht, mist=Zacht, limoenlicht=Accent,
// diep=Donker, nacht=Diepst. Collecties (cases, artikelen, teamleden) beheer je in /admin; die
// zitten niet in de sync-blauwdruk.

const blauwdruk = {
  // De 12 CMS-kleurvelden in NOVA-huisstijl (03_ELEMENTEN/design_tokens.json → cmsColorFields).
  design_tokens: {
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
  },

  paginas: [
    {
      slug: "/",
      titel: "NOVA — Ideeën verdienen werkelijkheid",
      beschrijving:
        "Een plek voor nieuwe ideeën, inspirerende mensen en bijzondere ervaringen.",
      published: true,
      blokken: [
        {
          type: "header",
          bg: "nacht",
          content: {
            layout: "split-rechts",
            hoogte: "fullscreen",
            eyebrow: "WELKOM IN CREATIEVE TOEKOMSTEN",
            heading: "Ideeën\nverdienen\nwerkelijkheid.",
            subheading:
              "Een plek voor nieuwe ideeën, inspirerende mensen en bijzondere ervaringen.",
            cta_primair_label: "Ontdek NOVA",
            cta_primair_link: "/work",
            cta_secundair_label: "Ontdek het CMS",
            cta_secundair_link: "/one",
            media_type: "afbeelding",
            media_alt: "Sculpturale blauwe architectuur met warm oranje licht",
            overlay: "donker",
            extras: "stats",
            stats: [
              { waarde: "18", label: "Paginatypes" },
              { waarde: "43", label: "CMS-blokken" },
              { waarde: "05", label: "Kleurenschema's" },
            ],
          },
        },
        {
          type: "marquee",
          bg: null,
          content: {
            stijl: "limoen",
            items: ["CREËREN", "VERBINDEN", "ONTDEKKEN", "BOUWEN"].map(
              (tekst) => ({
                tekst,
              }),
            ),
          },
        },
        {
          type: "mediatekst",
          bg: "wit",
          content: {
            eyebrow: "ONZE WERELD",
            titel: "Waar ideeën hun mensen vinden.",
            alineas: [
              {
                tekst:
                  "Wij geloven in de kracht van ontmoetingen. In ruimtes die uitdagen, verhalen die blijven hangen en ideeën die de wereld verder brengen.",
              },
            ],
            beeld_alt: "Kleurrijke lichtinstallatie",
            beeldzijde: "rechts",
            knop: "/about",
            knoptekst: "Ontdek ons verhaal",
          },
        },
        {
          type: "cases_grid",
          bg: "mist",
          content: {
            eyebrow: "GESELECTEERD WERK",
            titel: "Gemaakt om mensen te raken.",
            maximaal: 3,
            link_naar_overzicht: "/work",
          },
        },
        {
          type: "statement",
          bg: "nacht",
          content: {
            eyebrow: "WAAR WE IN GELOVEN",
            titel: "Op morgen wachten we niet. Morgen maken we zelf.",
            knop: "/community",
            knoptekst: "Ontmoet onze community",
          },
        },
        {
          type: "statistieken",
          bg: "mist",
          content: {
            titel: "Een wereld vol mogelijkheden.",
            intro:
              "Fictieve voorbeeldcijfers voor de demonstratie van het CMS-statistiekenblok.",
            items: [
              {
                waarde: "120",
                achtervoegsel: "+",
                label: "Ideeën tot leven gebracht",
              },
              { waarde: "38", label: "Creatieve samenwerkingspartners" },
              {
                waarde: "12",
                achtervoegsel: "k",
                label: "Geïnspireerde geesten",
              },
            ],
          },
        },
        {
          type: "mensen",
          bg: "wit",
          content: {
            titel: "Ontmoet de denkers.",
            intro:
              "Ideeën worden pas bijzonder door de mensen die ze vormgeven.",
            maximaal: 4,
          },
        },
        {
          type: "artikelen_grid",
          bg: "mist",
          content: {
            eyebrow: "VERHALEN",
            titel: "Frisse perspectieven.",
            maximaal: 3,
          },
        },
        {
          type: "cta",
          bg: "nacht",
          content: {
            eyebrow: "WAT IS DE VOLGENDE STAP?",
            titel: "Heb je iets bijzonders in gedachten?",
            knoptekst: "Start een gesprek",
            knop: "/contact",
          },
        },
      ],
    },
    {
      slug: "/work",
      titel: "Werk",
      beschrijving: "Projecten die impact maken.",
      published: true,
      blokken: [
        {
          type: "header",
          bg: "wit",
          content: {
            layout: "compact",
            hoogte: "normaal",
            eyebrow: "ONS WERK / GESELECTEERDE PROJECTEN",
            heading: "Projecten die\nimpact maken.",
            subheading:
              "Van meeslepende belevingen tot digitale platformen. Ontdek hoe ideeën veranderen in betekenisvolle projecten.",
          },
        },
        { type: "cases_grid", bg: "wit", content: { maximaal: 24 } },
      ],
    },
    {
      slug: "/journal",
      titel: "Verhalen",
      beschrijving: "Verhalen, ideeën en inzichten.",
      published: true,
      blokken: [
        {
          type: "header",
          bg: "wit",
          content: {
            layout: "compact",
            hoogte: "normaal",
            eyebrow: "VERHALEN / IDEEËN & INZICHTEN",
            heading: "Verhalen, ideeën\nen inzichten.",
          },
        },
        {
          type: "artikelen_grid",
          bg: "mist",
          content: {
            eyebrow: "MEER OM TE ONTDEKKEN",
            titel: "Ideeën die het delen waard zijn.",
            maximaal: 12,
          },
        },
        {
          type: "formulier",
          bg: "limoenlicht",
          content: {
            soort: "nieuwsbrief",
            eyebrow: "NOVA-NOTITIES",
            titel: "Een beetje meer inspiratie in je inbox.",
            knoptekst: "Aanmelden",
          },
        },
      ],
    },
    {
      slug: "/contact",
      titel: "Contact",
      beschrijving: "Laten we iets laten gebeuren.",
      published: true,
      blokken: [
        {
          type: "header",
          bg: "wit",
          content: {
            layout: "compact",
            hoogte: "normaal",
            eyebrow: "CONTACT / NEEM CONTACT OP",
            heading: "Laten we\niets laten gebeuren.",
          },
        },
        {
          type: "formulier",
          bg: "wit",
          content: {
            soort: "contact",
            eyebrow: "VERTEL ONS OVER JE IDEE",
            titel: "Wat houdt je bezig?",
            knoptekst: "Verstuur je bericht",
          },
        },
      ],
    },
  ],
};

export default blauwdruk;
