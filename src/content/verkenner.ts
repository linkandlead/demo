// Blokkenverkenner (/playground): welk voorbeeldblok de echte renderer (components/nova/Blokken.tsx)
// krijgt, en hoe de achtergrond- en variantkeuze naar de echte CMS-velden vertaalt.
// Voorbeeldinhoud = het eerste blok van dat type uit de blauwdruk (dezelfde inhoud als op de site).
// Zuivere code zonder React, zodat de vertaling met node --test te controleren is.

import { paginas, type BlauwdrukBlok } from "./blauwdruk.ts";
import { KERNBLOKKEN, variantOpties, type KernBlok } from "./kernblokken.ts";
import {
  ACHTERGRONDEN,
  GERENDERD,
  HEADER_VIDEO,
  HOOGTES,
  blokSleutel,
} from "./verkenner-keuzes.ts";

type Patch = Record<string, unknown>;

/** Variant uit de specificatie → de inhoudsvelden die het CMS ervoor opslaat. */
const VARIANT_VELDEN: Record<string, Record<string, Patch>> = {
  "Header (hero)": {
    gecentreerd: { layout: "gecentreerd" },
    "beeld links": { layout: "split-links" },
    "beeld rechts": { layout: "split-rechts" },
    achtergrondbeeld: { layout: "achtergrond" },
    compact: { layout: "compact" },
  },
  "Tekst met beeld": {
    "beeld links": { beeldzijde: "links" },
    "beeld rechts": { beeldzijde: "rechts" },
  },
  Kaartenrij: {
    "3 kolommen": { kolommen: "3" },
    "4 kolommen": { kolommen: "4" },
  },
  "Flexibel blok": {
    "1 kolom": { kolommen: "1" },
    "2 kolommen": { kolommen: "2" },
    "3 kolommen": { kolommen: "3" },
  },
  Conclusieregel: {
    donker: { stijl: "donker" },
    accent: { stijl: "limoenlicht" },
  },
  "Bewegende tekstband": {
    limoen: { stijl: "limoen" },
    diep: { stijl: "diep" },
    nacht: { stijl: "nacht" },
    accent: { stijl: "limoenlicht" },
  },
  "Partners/sponsoren": {
    "Filters aan": { toon_filter: "ja" },
    "Filters uit": { toon_filter: "nee" },
  },
  Formulier: {
    contact: { soort: "contact" },
    nieuwsbrief: { soort: "nieuwsbrief" },
    "URL-scan": { soort: "scan_url" },
  },
  "Enquête / NPS": {
    "NPS 0–10": { soort: "nps" },
    sterren: { soort: "sterren" },
  },
  Configurator: {
    "Aantal personen aan": { vraag_aantal: "ja" },
    "Aantal personen uit": { vraag_aantal: "nee" },
  },
};

/** Varianten die wel een CMS-veld zetten, maar die de NOVA-renderer (nog) niet anders toont. */
const VARIANT_ZONDER_EFFECT: Record<string, string> = {
  "Reeks stappen":
    "De NOVA-renderer kiest de vorm (tijdlijn, programma of rondleiding) uit de inhoud; de variantkeuze verandert de weergave hier niet.",
  "Bewegende tekstband":
    "Het veld stijl wordt in deze frontend nog niet gebruikt: de band is altijd limoen.",
  "Partners/sponsoren":
    "Het veld toon_filter wordt in deze frontend nog niet gebruikt (er is geen filter).",
  "Enquête / NPS":
    "Het veld soort wordt in deze frontend nog niet gebruikt: de vraag is altijd een NPS-schaal 0–10.",
  "A/B-test":
    "Versie A of B is geen inhoudsveld: bezoekers krijgen een van beide. Wissel in het blok zelf met de knop.",
  Personalisatie:
    "Nieuw of bekend is geen inhoudsveld maar hangt af van de bezoeker. Wissel in het blok zelf met de knop.",
};

/** Bloktypes met een vaste achtergrond in de NOVA-renderer (bg verandert de weergave niet). */
const VASTE_ACHTERGROND: Record<string, string> = {
  marquee: "De tekstband heeft altijd een limoen achtergrond.",
  feiten:
    "De feitenregel heeft geen eigen achtergrond; hij neemt die van de pagina over.",
  overgang:
    "De conclusieregel kiest zijn kleur via de variant (veld stijl), niet via de achtergrond.",
  cta: "De oproep is altijd donker. Als laatste blok van een pagina toont NOVA hem als afsluitende oproep boven de footer.",
};

export type Keuze = {
  blok?: string;
  bg?: string;
  variant?: string;
  hoogte?: string;
};

export type Voorbeeld = {
  naam: string;
  sleutel: string;
  cmsType: string | null;
  /** true = getoond met de echte renderer; false = ontwerpindicatie. */
  echt: boolean;
  blok: BlauwdrukBlok | null;
  /** Pagina uit de blauwdruk waar de voorbeeldinhoud vandaan komt. */
  bron: string | null;
  bg: string;
  variant: string;
  varianten: string[];
  hoogte: string | null;
  /** Velden die achtergrond, variant en hoogte zetten, zoals het CMS ze opslaat. */
  velden: Array<[string, string]>;
  notities: string[];
};

/** Eerste blok van dit type in de blauwdruk. /one valt af: daar rendert NOVA de CMS-promotievorm. */
function bronBlok(
  type: string,
  past: (b: BlauwdrukBlok) => boolean = () => true,
) {
  const volgorde = [
    ...paginas.filter((p) => p.slug !== "/one"),
    ...paginas.filter((p) => p.slug === "/one"),
  ];
  for (const p of volgorde) {
    const b = p.blokken.find((x) => x.type === type && past(x));
    if (b) return { blok: b, slug: p.slug };
  }
  return null;
}

const gelijk = (content: Record<string, unknown>, patch: Patch) =>
  Object.entries(patch).every(([k, v]) => content[k] === v);

export function verkennerVoorbeeld(keuze: Keuze): Voorbeeld {
  const kern: KernBlok =
    KERNBLOKKEN.find((b) => blokSleutel(b.naam) === keuze.blok) ??
    KERNBLOKKEN[0];
  const varianten = variantOpties(kern.varianten, kern.naam);
  const patches = VARIANT_VELDEN[kern.naam] ?? {};
  const echt = !!kern.cmsType && GERENDERD.has(kern.cmsType);
  const notities: string[] = [];
  const bgGeldig = (v?: string) =>
    ACHTERGRONDEN.some(([, t]) => t === v) ? v : undefined;

  if (!echt || !kern.cmsType) {
    return {
      naam: kern.naam,
      sleutel: blokSleutel(kern.naam),
      cmsType: kern.cmsType,
      echt: false,
      blok: null,
      bron: null,
      bg: bgGeldig(keuze.bg) ?? "wit",
      variant: varianten.includes(keuze.variant ?? "")
        ? (keuze.variant as string)
        : varianten[0],
      varianten,
      hoogte: null,
      velden: [],
      notities: [
        kern.cmsType
          ? `Het bloktype ${kern.cmsType} bestaat in het CMS, maar deze NOVA-frontend heeft er nog geen renderer voor: op de site wordt het overgeslagen. Hieronder staat een ontwerpindicatie, geen echte weergave.`
          : "Dit blok staat in de specificatie, maar heeft nog geen bloktype in het CMS. Hieronder staat een ontwerpindicatie, geen echte weergave.",
      ],
    };
  }

  const type = kern.cmsType;
  // Bij het formulier hoort elke soort zijn eigen inhoud: neem het passende blok uit de blauwdruk.
  const soort =
    kern.naam === "Formulier" ? patches[keuze.variant ?? ""]?.soort : undefined;
  const bron =
    (soort ? bronBlok(type, (b) => b.content.soort === soort) : null) ??
    bronBlok(type);
  if (!bron)
    throw new Error(`Geen voorbeeld in de blauwdruk voor bloktype ${type}`);

  let content: Record<string, unknown> = { ...bron.blok.content };
  // Header-voorbeeld: de homepage-hero, met een achtergrondvideo (afbeelding = poster en terugval).
  if (type === "header" && bron.slug === "/") {
    content = {
      ...content,
      media_type: "video",
      media_video: HEADER_VIDEO,
      focal_x: 50,
      focal_y: 45,
    };
  }

  const eigenVariant = Object.entries(patches).find(([, p]) =>
    gelijk(content, p),
  )?.[0];
  const variant = varianten.includes(keuze.variant ?? "")
    ? (keuze.variant as string)
    : (eigenVariant ?? varianten[0]);
  const patch = patches[variant] ?? {};
  content = { ...content, ...patch };

  let hoogte: string | null = null;
  if (type === "header") {
    hoogte = HOOGTES.some(([, h]) => h === keuze.hoogte)
      ? (keuze.hoogte as string)
      : String(content.hoogte ?? "normaal");
    content.hoogte = hoogte;
  }

  const bg = bgGeldig(keuze.bg) ?? bron.blok.bg ?? "wit";
  const blok: BlauwdrukBlok = { type, bg, content };

  const velden: Array<[string, string]> = [["bg", bg]];
  for (const k of Object.keys(patch)) velden.push([k, String(content[k])]);
  if (hoogte) velden.push(["hoogte", hoogte]);
  if (type === "header" && content.media_type === "video")
    velden.push(["media_type", "video"]);

  // Eerlijk over wat de keuzes in deze frontend wel en niet veranderen.
  if (VARIANT_ZONDER_EFFECT[kern.naam] && varianten.length > 1)
    notities.push(VARIANT_ZONDER_EFFECT[kern.naam]);
  if (kern.naam === "Formulier" && soort === "scan_url")
    notities.push(
      "Een URL-scan-formulier heeft in deze frontend geen eigen vorm; NOVA toont het als contactformulier.",
    );
  if (
    kern.naam === "Flexibel blok" &&
    (patch.kolommen === "2" || patch.kolommen === "3")
  )
    notities.push(
      "Twee en drie kolommen gebruiken in NOVA hetzelfde raster van drie tegels; één kolom wordt een citaat.",
    );
  if (type === "header") {
    if (hoogte === "fullscreen")
      notities.push(
        "Schermvullend wordt in NOVA altijd de homepage-hero (beeld rechts); de lay-out speelt dan geen rol.",
      );
    else if (content.layout !== "achtergrond")
      notities.push(
        "Gecentreerd, beeld links/rechts en compact worden in NOVA dezelfde binnenkop met het beeld eronder.",
      );
    if (hoogte === "fullscreen" || content.layout === "achtergrond")
      notities.push(
        "Achtergrond: alleen Donker/Diepst veranderen de binnenkop; deze heldenvorm is altijd donker.",
      );
    else if (bg !== "diep" && bg !== "nacht")
      notities.push(
        "Achtergrond: alleen Donker en Diepst geven de binnenkop een donkere uitvoering.",
      );
  } else if (VASTE_ACHTERGROND[type]) {
    notities.push(VASTE_ACHTERGROND[type]);
  } else if (type === "statement") {
    notities.push(
      "Een statement is altijd donker; met Donker (diep) kiest NOVA de uitvoering met opsomming.",
    );
  } else if (type === "formulier" && content.soort === "nieuwsbrief") {
    notities.push(
      "Het nieuwsbriefformulier heeft altijd een limoen achtergrond.",
    );
  } else if (bg === "diep" || bg === "nacht") {
    notities.push(
      "Donker en Diepst worden in deze frontend dezelfde donkere sectie.",
    );
  } else if (bg === "limoenlicht") {
    notities.push("Accent wordt in deze frontend de limoenkleurige sectie.");
  }
  if (
    [
      "formulier",
      "formulier_bouwer",
      "review_verzamelen",
      "enquete",
      "leden_toegang",
    ].includes(type)
  )
    notities.push(
      "In de verkenner verstuurt dit formulier niets; op de site werkt het zoals beschreven.",
    );

  return {
    naam: kern.naam,
    sleutel: blokSleutel(kern.naam),
    cmsType: type,
    echt: true,
    blok,
    bron: bron.slug,
    bg,
    variant,
    varianten,
    hoogte,
    velden,
    notities,
  };
}
