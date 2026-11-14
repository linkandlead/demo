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
      titel: "NOVA — Ideas deserve to become reality",
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
            eyebrow: "WELCOME TO CREATIVE FUTURES",
            heading: "Ideas deserve\nto become\nreality.",
            subheading:
              "Een plek voor nieuwe ideeën, inspirerende mensen en bijzondere ervaringen.",
            cta_primair_label: "Explore NOVA",
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
            items: ["CREATE", "CONNECT", "EXPLORE", "BUILD"].map((tekst) => ({
              tekst,
            })),
          },
        },
        {
          type: "mediatekst",
          bg: "wit",
          content: {
            eyebrow: "OUR WORLD",
            titel: "Where ideas find their people.",
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
            eyebrow: "SELECTED WORK",
            titel: "Made to move people.",
            maximaal: 3,
            link_naar_overzicht: "/work",
          },
        },
        {
          type: "statement",
          bg: "nacht",
          content: {
            eyebrow: "OUR BELIEF",
            titel:
              "Tomorrow is not something we wait for. It's something we make.",
            knop: "/community",
            knoptekst: "Meet our community",
          },
        },
        {
          type: "statistieken",
          bg: "mist",
          content: {
            titel: "A world of possibilities.",
            intro:
              "Fictieve voorbeeldcijfers voor de demonstratie van het CMS-statistiekenblok.",
            items: [
              {
                waarde: "120",
                achtervoegsel: "+",
                label: "Ideas brought to life",
              },
              { waarde: "38", label: "Creative collaborators" },
              { waarde: "12", achtervoegsel: "k", label: "Inspired minds" },
            ],
          },
        },
        {
          type: "mensen",
          bg: "wit",
          content: {
            titel: "Meet the minds.",
            intro:
              "Ideeën worden pas bijzonder door de mensen die ze vormgeven.",
            maximaal: 4,
          },
        },
        {
          type: "artikelen_grid",
          bg: "mist",
          content: {
            eyebrow: "THE JOURNAL",
            titel: "Fresh perspectives.",
            maximaal: 3,
          },
        },
        {
          type: "cta",
          bg: "nacht",
          content: {
            eyebrow: "WHAT'S NEXT?",
            titel: "Have something extraordinary in mind?",
            knoptekst: "Start een gesprek",
            knop: "/contact",
          },
        },
      ],
    },
    {
      slug: "/work",
      titel: "Work",
      beschrijving: "Projects that make an impact.",
      published: true,
      blokken: [
        {
          type: "header",
          bg: "wit",
          content: {
            layout: "compact",
            hoogte: "normaal",
            eyebrow: "OUR WORK / CURATED PROJECTS",
            heading: "Projects that\nmake an impact.",
            subheading:
              "Van immersieve experiences tot digitale platformen. Ontdek hoe ideeën veranderen in betekenisvolle projecten.",
          },
        },
        { type: "cases_grid", bg: "wit", content: { maximaal: 24 } },
      ],
    },
    {
      slug: "/journal",
      titel: "Journal",
      beschrijving: "Stories, ideas and insights.",
      published: true,
      blokken: [
        {
          type: "header",
          bg: "wit",
          content: {
            layout: "compact",
            hoogte: "normaal",
            eyebrow: "THE JOURNAL / IDEAS & INSIGHTS",
            heading: "Stories, ideas\nand insights.",
          },
        },
        {
          type: "artikelen_grid",
          bg: "mist",
          content: {
            eyebrow: "MORE TO EXPLORE",
            titel: "Ideas worth sharing.",
            maximaal: 12,
          },
        },
        {
          type: "formulier",
          bg: "limoenlicht",
          content: {
            soort: "nieuwsbrief",
            eyebrow: "NOVA NOTES",
            titel: "A little more inspiration in your inbox.",
            knoptekst: "Aanmelden",
          },
        },
      ],
    },
    {
      slug: "/contact",
      titel: "Contact",
      beschrijving: "Let's make something happen.",
      published: true,
      blokken: [
        {
          type: "header",
          bg: "wit",
          content: {
            layout: "compact",
            hoogte: "normaal",
            eyebrow: "CONTACT / GET IN TOUCH",
            heading: "Let's make\nsomething happen.",
          },
        },
        {
          type: "formulier",
          bg: "wit",
          content: {
            soort: "contact",
            eyebrow: "TELL US ABOUT YOUR IDEA",
            titel: "What's on your mind?",
            knoptekst: "Verstuur je bericht",
          },
        },
      ],
    },
  ],
};

export default blauwdruk;
