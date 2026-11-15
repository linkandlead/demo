import type { ReactNode } from "react";
import { paginas } from "@/content/blauwdruk";
import { KERNBLOKKEN, variantOpties } from "@/content/kernblokken";
import type { Blok, PaginaInhoud } from "@/lib/cms/paginas";
import { Blokken } from "./Blokken";
import { OproepSectie } from "./Footer";

// Voorbeelden voor de blokkenverkenner (/playground): elk van de 43 kernblokken in elke variant,
// gerenderd door dezelfde renderer als de site (Blokken.tsx). De inhoud komt uit de blauwdruk
// (dezelfde teksten als op de NOVA-pagina's) of, voor blokken die NOVA niet gebruikt, uit
// fictieve voorbeeldinhoud hieronder. De variant zet het bijbehorende CMS-veld (bv. layout,
// kolommen, soort); velden met "_" bestaan niet in het CMS en sturen alleen de vormgeving van de preview.

type Inhoud = Record<string, unknown>;
export type BlokVoorbeeld = { bg: string; varianten: Record<string, ReactNode> };

const m = (naam: string) => `/media/${naam}.webp`;
const uitBlauwdruk = (type: string, slug?: string): Blok | undefined =>
  paginas.filter((p) => !slug || p.slug === slug).flatMap((p) => p.blokken).find((b) => b.type === type);

const EIGEN: Record<string, Blok> = {
  tekst: {
    type: "tekst",
    bg: "wit",
    content: {
      eyebrow: "OVER DEZE DEMO",
      titel: "Een gewoon stuk tekst, goed vormgegeven.",
      tekst:
        "Soms heb je geen beeld of kaarten nodig, maar gewoon ruimte voor een verhaal. Het tekstblok is daarvoor gemaakt: een kop, alinea's en tussenkoppen.\n\n## Voor privacy, voorwaarden en achtergrond\n\nGebruik het voor pagina's die vooral uit tekst bestaan. De redacteur schrijft, het ontwerp zorgt voor rust en leesbaarheid.",
      bijgewerkt: "2026-11-14",
    },
  },
  intake: {
    type: "intake",
    bg: "mist",
    content: {
      titel: "Drie vragen voordat we beginnen.",
      tekst: "Zo weten we wat je nodig hebt, nog voordat we elkaar spreken.",
      muted: "Duurt ongeveer twee minuten.",
      stappen: [
        { nummer: "01", vraag: "Wat voor website wil je maken?", veld: "Bijvoorbeeld: een eventwebsite met programma en tickets" },
        { nummer: "02", vraag: "Wie gaat de inhoud beheren?", veld: "Bijvoorbeeld: twee mensen van het marketingteam" },
        { nummer: "03", vraag: "Wanneer wil je live?", veld: "Bijvoorbeeld: voor de zomer" },
      ],
    },
  },
  bewijsstrook: {
    type: "bewijsstrook",
    bg: "wit",
    content: {
      cijfers: [
        { waarde: "43", label: "Algemene CMS-blokken" },
        { waarde: "5", label: "Achtergrondvarianten" },
        { waarde: "12", label: "Huisstijlkleuren" },
        { waarde: "1", label: "Systeem voor al je sites" },
      ],
      toon_logos: "ja",
      maximaal_logos: 6,
    },
  },
  quote: { type: "quote", bg: "mist", content: { toon_foto: "ja" } },
  logostrook: { type: "logostrook", bg: "wit", content: { eyebrow: "VERTROUWD DOOR", titel: "Fictieve partners van NOVA.", grijs: "ja" } },
  rolvoorbeelden: {
    type: "rolvoorbeelden",
    bg: "mist",
    content: {
      titel: "Wat verandert er voor jouw team?",
      intro: "Drie rollen, vóór en na een eigen frontend op Link & Lead One. Fictieve voorbeelden.",
      items: [
        { tab: "Marketing", nu: "Elke campagnepagina gaat via een ontwikkelaar.", met: "De redacteur bouwt de pagina zelf uit bestaande blokken." },
        { tab: "Ontwerp", nu: "Templates beperken wat er kan.", met: "Een eigen frontend, met de blokken in de eigen huisstijl." },
        { tab: "Directie", nu: "Meerdere websites, meerdere systemen.", met: "Alle sites in één CMS, elk met een eigen merk." },
      ],
    },
  },
  reviews: { type: "reviews", bg: "wit", content: { eyebrow: "REVIEWS", titel: "Wat bezoekers zeggen.", intro: "Goedgekeurde reviews uit het CMS.", maximaal: 3 } },
  wedstrijden: { type: "wedstrijden", bg: "wit", content: { eyebrow: "PROGRAMMA", titel: "Het hele seizoen in één oogopslag.", intro: "Alle clubs en tijden zijn fictief." } },
  volgende_wedstrijd: { type: "volgende_wedstrijd", bg: "nacht", content: { titel: "VOLGENDE WEDSTRIJD", alleen_thuis: "nee" } },
  agenda: {
    type: "agenda",
    bg: "mist",
    content: { eyebrow: "PLAN EEN GESPREK", titel: "Kies een moment dat jou past.", intro: "Vrije tijden uit de agenda. Klik op een tijd om te zien wat er gebeurt.", maximaal_slots: 6 },
  },
  aftelklok: {
    type: "aftelklok",
    bg: "nacht",
    content: {
      eyebrow: "PULSE FESTIVAL",
      titel: "Nog even geduld.",
      intro: "De fictieve editie van Pulse Festival begint over:",
      doeldatum: "2027-06-12T12:00",
      verlopen_tekst: "Pulse Festival is begonnen.",
      knop: "/experiences/pulse-festival",
      knoptekst: "Bekijk het programma",
    },
  },
  collectie_lijst: { type: "collectie_lijst", bg: "wit", content: { eyebrow: "COLLECTIE", titel: "Projecten uit de collectie." } },
};

/** Blokken met één variant krijgen voorbeeldopstellingen: andere inhoud van dezelfde CMS-velden. */
const VOORBEELDOPSTELLINGEN: Record<string, Record<string, Inhoud>> = {
  formulier_bouwer: {
    "Lab-voorbeeld (alle veldtypes)": {},
    Contactformulier: {
      eyebrow: "CONTACT",
      titel: "Stel je vraag.",
      intro: "Drie velden, meer is niet nodig. Probeer het formulier leeg te versturen om de foutmeldingen te zien.",
      velden: [
        { label: "Naam", type: "tekst", verplicht: "ja" },
        { label: "Telefoonnummer", type: "telefoon", verplicht: "nee" },
        { label: "Je vraag", type: "tekstvak", verplicht: "ja" },
      ],
      knoptekst: "Verstuur mijn vraag",
    },
    "Aanmelding workshop": {
      eyebrow: "AANMELDEN",
      titel: "Meld je aan voor een workshop.",
      intro: "Kies een van de fictieve NOVA-workshops. Je aanmelding wordt opgeslagen, er volgt geen bevestigingsmail.",
      velden: [
        { label: "Naam", type: "tekst", verplicht: "ja" },
        { label: "Organisatie", type: "bedrijf", verplicht: "nee" },
        { label: "Workshop", type: "keuze", opties: "Licht en ruimte, Verhalen vertellen, Snel prototypen", verplicht: "ja" },
        { label: "Dieetwensen of andere wensen", type: "tekstvak", verplicht: "nee" },
      ],
      knoptekst: "Meld me aan",
      bevestigingstekst: "Je aanmelding is opgeslagen in de NOVA-demodatabase.",
    },
    Offerteaanvraag: {
      eyebrow: "OFFERTE",
      titel: "Vraag een offerte aan.",
      intro: "Vertel wat je wilt organiseren. Alle keuzes zijn verplicht, op de toelichting na.",
      velden: [
        { label: "Naam", type: "tekst", verplicht: "ja" },
        { label: "Bedrijf", type: "bedrijf", verplicht: "ja" },
        { label: "Soort bijeenkomst", type: "keuze", opties: "Workshop, Presentatie, Evenement", verplicht: "ja" },
        { label: "Aantal personen", type: "keuze", opties: "10 tot 25, 25 tot 100, Meer dan 100", verplicht: "ja" },
        { label: "Toelichting", type: "tekstvak", verplicht: "nee" },
      ],
      knoptekst: "Vraag een offerte aan",
    },
  },
  review_verzamelen: {
    "Algemene review": {},
    "Na een evenement": {
      eyebrow: "JOUW ERVARING",
      titel: "Hoe was Pulse Festival?",
      intro: "Je was erbij. Laat in een paar woorden weten wat je is bijgebleven.",
      knoptekst: "Deel mijn ervaring",
    },
    "Voor een ruimte": {
      eyebrow: "REVIEW",
      titel: "Wat vond je van The Atrium?",
      intro: "Je review helpt anderen kiezen. Hij verschijnt pas na controle op de site.",
      knoptekst: "Plaats mijn review",
    },
  },
};

/** Basisvoorbeeld per bloktype: liefst de echte inzet op een NOVA-pagina. */
function basis(type: string): Blok | undefined {
  const voorkeur: Record<string, string> = {
    header: "/",
    mediatekst: "/",
    kaarten: "/work",
    flexibel: "/one",
    overgang: "/one",
    statement: "/",
    faq: "/one",
    reeks: "/about",
    feiten: "/work/aurora-pavilion",
    portfolio: "/work/aurora-pavilion",
    formulier: "/contact",
    cta: "/",
  };
  return EIGEN[type] ?? uitBlauwdruk(type, voorkeur[type]) ?? uitBlauwdruk(type);
}

/** Wat een variant aan de inhoud verandert (CMS-velden; "_"-velden alleen voor de preview). */
function variantPatch(type: string, variant: string, c: Inhoud): Inhoud {
  const v = variant.toLowerCase();
  switch (type) {
    case "header":
      return {
        gecentreerd: { layout: "gecentreerd", hoogte: "normaal" },
        "beeld links": { layout: "split-links", hoogte: "normaal" },
        "beeld rechts": { layout: "split-rechts", hoogte: "fullscreen" },
        achtergrondbeeld: { layout: "achtergrond", hoogte: "normaal", media_afbeelding: m("event_lights") },
        compact: { layout: "compact", hoogte: "normaal", media_afbeelding: "", usps: [{ tekst: "HET INTERACTIEVE LAB" }] },
      }[v] ?? {};
    case "mediatekst":
      return { beeldzijde: v === "beeld links" ? "links" : "rechts" };
    case "kaarten":
      return v.startsWith("4")
        ? {
            kolommen: "4",
            items: [
              ...((c.items as Inhoud[]) ?? []),
              { titel: "Laten zien.", tekst: "Tot slot delen we het resultaat met de mensen voor wie het bedoeld is.", knoptekst: "04 / Delen" },
            ],
          }
        : { kolommen: "3" };
    case "flexibel": {
      const items = (c.items as Inhoud[]) ?? [];
      if (v.startsWith("1"))
        return {
          kolommen: "1",
          titel: "Een ruimte krijgt betekenis door wat mensen erin ervaren.",
          items: items.map((i) => ({ kop: i.kop, tekst: i.tekst })),
        };
      return v.startsWith("2") ? { kolommen: "2", items: items.slice(0, 2) } : { kolommen: "3" };
    }
    case "overgang":
      return { stijl: v === "donker" ? "donker" : "limoenlicht" };
    case "reeks":
      return {
        _vorm: /keten|pijplijn|fasenstrip/.test(v) ? "pijl" : /kringloop|cirkel/.test(v) ? "cirkel" : /stappen|systeem/.test(v) ? "blok" : "",
        ...(v === "weken"
          ? { stappen: ((c.stappen as Inhoud[]) ?? []).map((s, i) => ({ ...s, nummer: `Week ${i + 1}` })) }
          : {}),
      };
    case "marquee":
      return { stijl: v === "accent" ? "limoenlicht" : v };
    case "bewijsstrook":
      return { toon_logos: v.includes("aan") ? "ja" : "nee" };
    case "quote":
      return { toon_foto: v.includes("aan") ? "ja" : "nee" };
    case "partners_grid":
      return { toon_filter: v.includes("aan") ? "ja" : "nee" };
    case "formulier":
      if (v === "nieuwsbrief") return uitBlauwdruk("formulier", "/journal")?.content ?? {};
      if (v === "url-scan")
        return {
          soort: "scan_url",
          eyebrow: "GRATIS SCAN",
          titel: "Hoe staat jouw website ervoor?",
          intro: "Vul je websiteadres in. In deze demo wordt er niets opgehaald.",
          knoptekst: "Scan mijn website",
        };
      return { soort: "contact" };
    case "enquete":
      return { soort: v === "sterren" ? "sterren" : "nps" };
    case "ab_blok":
    case "personalisatie":
      return { _start: v === "versie b" || v === "bekende bezoeker" ? "b" : "a" };
    case "configurator":
      return { vraag_aantal: v.includes("aan") ? "ja" : "nee" };
    case "collectie_lijst":
      return { _vorm: v };
  }
  return {};
}

const VOORBEELDPAGINA: PaginaInhoud = { slug: "/blokvoorbeeld", titel: "", beschrijving: "", blokken: [], bron: "blauwdruk" };

export function blokVoorbeelden(): Record<string, BlokVoorbeeld> {
  const uit: Record<string, BlokVoorbeeld> = {};
  for (const k of KERNBLOKKEN) {
    const type = k.cmsType ?? (k.naam === "Collectie (lijst)" ? "collectie_lijst" : "");
    const b = basis(type);
    if (!b) continue;
    const varianten: Record<string, ReactNode> = {};
    const opstellingen = VOORBEELDOPSTELLINGEN[type];
    for (const variant of opstellingen ? Object.keys(opstellingen) : variantOpties(k.varianten, k.naam)) {
      const patch = opstellingen ? opstellingen[variant] : variantPatch(type, variant, b.content);
      const blok: Blok = { ...b, content: { ...b.content, ...patch } };
      varianten[variant] =
        type === "cta" ? (
          <OproepSectie oproep={blok} />
        ) : (
          <Blokken pagina={{ ...VOORBEELDPAGINA, blokken: [blok] }} blokken={[blok]} />
        );
    }
    uit[k.naam] = { bg: b.bg ?? "wit", varianten };
  }
  return uit;
}
