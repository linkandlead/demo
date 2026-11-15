// Gegenereerd uit 04_CMS_MAPPING/43_kernblokken.json (namen, velden en varianten uit de PDF) en
// geverifieerd tegen linkandlead-cms src/shared/blokregistry.ts (cmsType = sleutel in BLOCK_REGISTRY).
// cmsType null = staat in de PDF maar heeft (nog) geen bloktype in de CMS-repo.

export type KernBlok = {
  naam: string;
  categorie: string;
  cmsType: string | null;
  velden: string[];
  varianten: string;
};

export const KERNBLOKKEN: KernBlok[] = [
  {
    naam: "Header (hero)",
    categorie: "Structuur en tekst",
    cmsType: "header",
    velden: [
      "eyebrow",
      "kop",
      "subkop",
      "knop 1",
      "knop 2",
      "afbeelding of video",
      "overlay",
    ],
    varianten:
      "lay-out: gecentreerd / beeld links / beeld rechts / achtergrondbeeld / compact; hoogte: compact / normaal / schermvullend; onder kop: niets / logostrook / cijfers / formulier",
  },
  {
    naam: "Tekstblok",
    categorie: "Structuur en tekst",
    cmsType: "tekst",
    velden: [
      "eyebrow",
      "titel",
      "tekst met kopjes en lijsten",
      "datum bijgewerkt",
    ],
    varianten: "geen",
  },
  {
    naam: "Tekst met beeld",
    categorie: "Structuur en tekst",
    cmsType: "mediatekst",
    velden: [
      "eyebrow",
      "titel",
      "alinea’s",
      "opsommingspunten",
      "beeld met alt-tekst",
      "knop",
    ],
    varianten: "beeld links / beeld rechts",
  },
  {
    naam: "Kaartenrij",
    categorie: "Structuur en tekst",
    cmsType: "kaarten",
    velden: ["eyebrow", "titel", "intro", "kaarten (titel en tekst)"],
    varianten: "3 of 4 kolommen",
  },
  {
    naam: "Flexibel blok",
    categorie: "Structuur en tekst",
    cmsType: "flexibel",
    velden: ["eyebrow", "titel", "intro", "items"],
    varianten: "1 / 2 / 3 kolommen",
  },
  {
    naam: "Conclusieregel",
    categorie: "Structuur en tekst",
    cmsType: "overgang",
    velden: ["tekst"],
    varianten: "donker / accent",
  },
  {
    naam: "Statement",
    categorie: "Structuur en tekst",
    cmsType: "statement",
    velden: ["eyebrow", "groot cijfer en bijschrift", "claim", "tekst", "knop"],
    varianten: "standaard gedeeld",
  },
  {
    naam: "Veelgestelde vragen",
    categorie: "Structuur en tekst",
    cmsType: "faq",
    velden: ["titel", "vragen en antwoorden"],
    varianten: "uitklapbaar; zonder JavaScript leesbaar",
  },
  {
    naam: "Reeks stappen",
    categorie: "Structuur en tekst",
    cmsType: "reeks",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "stappen",
      "uitkomsten",
      "slotregel",
      "knop",
    ],
    varianten:
      "genummerde keten / pijplijn / stappen of weken / systeem / AI-kringloop / groeiloop (cirkel) / fasenstrip / tijdlijn",
  },
  {
    naam: "Intake-stappen",
    categorie: "Structuur en tekst",
    cmsType: "intake",
    velden: ["titel", "tekst", "subtekst", "stappen"],
    varianten: "geen",
  },
  {
    naam: "Feiten",
    categorie: "Structuur en tekst",
    cmsType: "feiten",
    velden: ["titel", "intro", "feiten", "afbeelding"],
    varianten: "geen",
  },
  {
    naam: "Tabel",
    categorie: "Structuur en tekst",
    cmsType: "tabel",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "maximaal 6 kolomkoppen",
      "rijen",
      "gemarkeerde rij",
      "voettekst",
    ],
    varianten: "geen",
  },
  {
    naam: "Bewegende tekstband",
    categorie: "Structuur en tekst",
    cmsType: "marquee",
    velden: ["woorden"],
    varianten: "limoen / diep / nacht / accent",
  },
  {
    naam: "Bewijsstrook",
    categorie: "Bewijs en mensen",
    cmsType: "bewijsstrook",
    velden: [
      "cijfers (waarde en label)",
      "logo’s uit Klanten-collectie",
      "maximum",
    ],
    varianten: "logo’s aan / uit; standaard gedeeld",
  },
  {
    naam: "Testimonial",
    categorie: "Bewijs en mensen",
    cmsType: "quote",
    velden: [
      "gekozen testimonial uit collectie: citaat",
      "naam",
      "functie",
      "organisatie",
      "foto",
    ],
    varianten: "foto aan / uit; standaard gedeeld",
  },
  {
    naam: "Citaten-carrousel",
    categorie: "Bewijs en mensen",
    cmsType: "citaten_carrousel",
    velden: ["titel", "citaten"],
    varianten: "geen",
  },
  {
    naam: "Logostrook",
    categorie: "Bewijs en mensen",
    cmsType: "logostrook",
    velden: ["eyebrow", "titel", "logo’s"],
    varianten: "grijs naar kleur op hover",
  },
  {
    naam: "Team",
    categorie: "Bewijs en mensen",
    cmsType: "mensen",
    velden: ["titel", "intro", "maximum", "aangesloten Team-collectie"],
    varianten: "geen",
  },
  {
    naam: "Sprekers",
    categorie: "Bewijs en mensen",
    cmsType: "sprekers",
    velden: ["titel", "subtitel", "sprekers", "slotregel"],
    varianten: "geen",
  },
  {
    naam: "Statistieken",
    categorie: "Bewijs en mensen",
    cmsType: "statistieken",
    velden: ["titel", "intro", "cijfers"],
    varianten: "optellende getallen",
  },
  {
    naam: "Portfolio",
    categorie: "Bewijs en mensen",
    cmsType: "portfolio",
    velden: ["eyebrow", "titel", "intro", "projecten"],
    varianten: "geen",
  },
  {
    naam: "Rolvoorbeelden",
    categorie: "Bewijs en mensen",
    cmsType: "rolvoorbeelden",
    velden: ["titel", "intro", "rolvoorbeelden (nu vs. met AI)"],
    varianten: "tabs",
  },
  {
    naam: "Cases",
    categorie: "Live data uit collecties",
    cmsType: "cases_grid",
    velden: [
      "eyebrow",
      "titel",
      "maximum",
      "filter op sector",
      "link overzicht",
      "Cases-collectie",
    ],
    varianten: "filter op sector",
  },
  {
    naam: "Artikelen",
    categorie: "Live data uit collecties",
    cmsType: "artikelen_grid",
    velden: [
      "eyebrow",
      "titel",
      "maximum",
      "filter op rubriek",
      "Artikelen-collectie",
    ],
    varianten: "filter op rubriek",
  },
  {
    naam: "Collectie (lijst)",
    categorie: "Live data uit collecties",
    cmsType: null,
    velden: ["titel", "intro", "gekozen collectie", "tagfilter", "maximum"],
    varianten: "lijst / raster / uitgelicht",
  },
  {
    naam: "Partners/sponsoren",
    categorie: "Live data uit collecties",
    cmsType: "partners_grid",
    velden: ["eyebrow", "titel", "intro", "partners", "filters"],
    varianten: "filters aan / uit",
  },
  {
    naam: "Partner uitgelicht",
    categorie: "Live data uit collecties",
    cmsType: "partner_uitgelicht",
    velden: ["eyebrow", "titel", "intro", "één partner"],
    varianten: "geen",
  },
  {
    naam: "Reviews",
    categorie: "Live data uit collecties",
    cmsType: "reviews",
    velden: ["eyebrow", "titel", "intro", "maximum"],
    varianten: "geen",
  },
  {
    naam: "Wedstrijden",
    categorie: "Live data uit collecties",
    cmsType: "wedstrijden",
    velden: ["eyebrow", "titel", "intro", "komende wedstrijden en uitslagen"],
    varianten: "geen",
  },
  {
    naam: "Volgende wedstrijd",
    categorie: "Live data uit collecties",
    cmsType: "volgende_wedstrijd",
    velden: ["kop", "eerstvolgende wedstrijd", "indicator"],
    varianten: "alleen thuiswedstrijden",
  },
  {
    naam: "Agenda-inplanner",
    categorie: "Live data uit collecties",
    cmsType: "agenda",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "persoon",
      "maximum",
      "vrije tijdsloten",
    ],
    varianten: "geen",
  },
  {
    naam: "Afsluitende oproep (CTA)",
    categorie: "Conversie en formulieren",
    cmsType: "cta",
    velden: ["eyebrow", "titel", "tekst", "knop", "afbeelding", "meta-regels"],
    varianten: "standaard gedeeld",
  },
  {
    naam: "Formulier",
    categorie: "Conversie en formulieren",
    cmsType: "formulier",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "knoptekst",
      "voetnoot",
      "bevestiging",
    ],
    varianten: "contact / nieuwsbrief / URL-scan",
  },
  {
    naam: "Formulierbouwer",
    categorie: "Conversie en formulieren",
    cmsType: "formulier_bouwer",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "velden naast e-mail",
      "knoptekst",
      "bevestiging",
      "voetnoot",
    ],
    varianten: "eigen velden",
  },
  {
    naam: "Review verzamelen",
    categorie: "Conversie en formulieren",
    cmsType: "review_verzamelen",
    velden: ["eyebrow", "titel", "intro", "knoptekst", "bevestiging"],
    varianten: "geen",
  },
  {
    naam: "Ledentoegang",
    categorie: "Conversie en formulieren",
    cmsType: "leden_toegang",
    velden: ["titel", "intro"],
    varianten: "geen",
  },
  {
    naam: "Enquête / NPS",
    categorie: "Conversie en formulieren",
    cmsType: "enquete",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "scorevraag",
      "toelichting",
      "knop",
      "bevestiging",
    ],
    varianten: "NPS 0–10 / sterren",
  },
  {
    naam: "A/B-test",
    categorie: "Conversie en formulieren",
    cmsType: "ab_blok",
    velden: ["titel per variant", "tekst per variant", "knop per variant"],
    varianten: "2 varianten",
  },
  {
    naam: "Personalisatie",
    categorie: "Conversie en formulieren",
    cmsType: "personalisatie",
    velden: [
      "standaard en bekend-versie van eyebrow",
      "titel",
      "tekst",
      "knop",
    ],
    varianten: "drempel voor bekend",
  },
  {
    naam: "Configurator",
    categorie: "Conversie en formulieren",
    cmsType: "configurator",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "opties",
      "aantal personen",
      "knop",
      "bevestiging",
    ],
    varianten: "aantal personen aan / uit",
  },
  {
    naam: "Prijskaarten / tickets",
    categorie: "Conversie en formulieren",
    cmsType: "prijskaarten",
    velden: ["titel", "intro", "kaarten"],
    varianten: "geen",
  },
  {
    naam: "Kaart en locatie",
    categorie: "Overig",
    cmsType: "kaart",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "adres",
      "telefoon",
      "e-mail",
      "knop",
    ],
    varianten: "geen",
  },
  {
    naam: "Aftelklok",
    categorie: "Overig",
    cmsType: "aftelklok",
    velden: [
      "eyebrow",
      "titel",
      "intro",
      "datum en tijd",
      "tekst na afloop",
      "knop",
    ],
    varianten: "geen",
  },
];

// Waar de PDF-tekst een beschrijving is i.p.v. een lijst keuzes, staan de keuzes hier expliciet.
const VARIANT_KEUZES: Record<string, string[]> = {
  "Flexibel blok": ["1 kolom", "2 kolommen", "3 kolommen"],
  "Reeks stappen": [
    "genummerde keten",
    "pijplijn",
    "stappen of weken",
    "systeem",
    "AI-kringloop",
    "groeiloop (cirkel)",
    "fasenstrip",
    "tijdlijn",
  ],
  Statement: ["Standaard (gedeeld)"],
  "Afsluitende oproep (CTA)": ["Standaard (gedeeld)"],
  "Veelgestelde vragen": ["Standaard"],
  Bewijsstrook: ["Logo’s aan", "Logo’s uit"],
  Testimonial: ["Foto aan", "Foto uit"],
  Logostrook: ["Standaard"],
  Statistieken: ["Standaard"],
  Rolvoorbeelden: ["Standaard"],
  Cases: ["Standaard"],
  Artikelen: ["Standaard"],
  "Partners/sponsoren": ["Filters aan", "Filters uit"],
  "Volgende wedstrijd": ["Standaard"],
  Formulierbouwer: ["Standaard"],
  "A/B-test": ["Versie A", "Versie B"],
  Personalisatie: ["Nieuwe bezoeker", "Bekende bezoeker"],
  Configurator: ["Aantal personen aan", "Aantal personen uit"],
};

/** Officiële varianten uit de PDF als keuzelijst; "geen" → alleen Standaard. */
export function variantOpties(varianten: string, naam = ""): string[] {
  if (VARIANT_KEUZES[naam]) return VARIANT_KEUZES[naam];
  const eerste = varianten.split(";")[0].replace(/^[^:]*:\s*/, "");
  if (/^geen$/i.test(eerste.trim())) return ["Standaard"];
  const opties = eerste
    .split(/\s*\/\s*|\s+of\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  // "3 of 4 kolommen" → "3 kolommen" / "4 kolommen": deel het zelfstandig naamwoord van de laatste optie.
  const laatste = opties[opties.length - 1]?.match(/^(\S+)\s+(.+)$/);
  if (laatste && opties.slice(0, -1).every((o) => !o.includes(" "))) {
    opties.splice(
      0,
      opties.length - 1,
      ...opties.slice(0, -1).map((o) => `${o} ${laatste[2]}`),
    );
  }
  return opties.length > 1 ? opties : ["Standaard", ...opties];
}
