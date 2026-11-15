"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { BLOKVOORBEELDEN } from "@/content/blokvoorbeelden";
import { KERNBLOKKEN, variantOpties } from "@/content/kernblokken";
import type { Voorbeeld } from "@/content/verkenner";
import {
  ACHTERGRONDEN,
  GERENDERD,
  HOOGTES,
  blokSleutel,
} from "@/content/verkenner-keuzes";
import { variantWeergave } from "./PreviewVariant";
import { mediaSrc, mediaSrcSet } from "./ui";

// Block Playground — playground() uit het prototype, met de echte veldnamen, de officiële varianten
// uit de PDF en het bijbehorende CMS-bloktype per blok. Blokken met een NOVA-renderer worden door de
// server met de échte renderer (Blokken.tsx) getoond: `weergave` is dat gerenderde blok. Keuzes gaan
// via de URL (router.replace), zodat de server alleen het gekozen blok rendert. Blokken zonder
// renderer houden een duidelijk gelabelde ontwerpindicatie.

const ALLE = "Alle categorieën";
const GROEPEN = [
  ALLE,
  ...Array.from(new Set(KERNBLOKKEN.map((b) => b.categorie))),
];
const ECHT_AANTAL = KERNBLOKKEN.filter(
  (b) => b.cmsType && GERENDERD.has(b.cmsType),
).length;
const ZONDER_RENDERER = KERNBLOKKEN.filter(
  (b) => b.cmsType && !GERENDERD.has(b.cmsType),
).length;
/** Klassen van de ontwerpindicatie (prototype) per achtergrond. */
const INDICATIE_KLASSE: Record<string, string> = {
  wit: "light",
  mist: "soft",
  limoenlicht: "accent",
  diep: "dark",
  nacht: "deepest",
};

type Keuze = {
  sleutel: string;
  bg?: string;
  variant?: string;
  hoogte?: string;
};

function adres({ sleutel, bg, variant, hoogte }: Keuze) {
  const q = new URLSearchParams({ blok: sleutel });
  if (bg) q.set("bg", bg);
  if (variant) q.set("variant", variant);
  if (hoogte) q.set("hoogte", hoogte);
  return `/playground?${q.toString()}`;
}

function previewHeadline(b: string) {
  if (/Formulier|Enquête|NPS|Review/.test(b))
    return "Laten we in contact blijven.";
  if (/Artikel|Cases|Portfolio|Collectie/.test(b))
    return "Verhalen die het delen waard zijn.";
  if (/Team|Partner|Sprekers|Testimonial/.test(b))
    return "Mogelijk gemaakt door mensen.";
  if (/Statist|Feiten|Bewijs/.test(b)) return "Ideeën met impact.";
  if (/Tickets|Prijs|Configurat/.test(b))
    return "Jouw beleving, op jouw manier.";
  if (/Agenda|Aftel|Wedstrijd/.test(b)) return "De momenten die ons raken.";
  return "Maak wat er komt.";
}

/** Ontwerpindicatie voor blokken zonder renderer in deze frontend (geen echte weergave). */
function Indicatie({
  naam,
  bg,
  variant,
}: {
  naam: string;
  bg: string;
  variant: string;
}) {
  const voorbeeld = BLOKVOORBEELDEN[naam];
  const weergave = variantWeergave(naam, variant);
  const bgKlasse = weergave.achtergrond ?? INDICATIE_KLASSE[bg] ?? "light";
  return (
    <div
      className={`block-preview ${bgKlasse} ${weergave.klasse}`.trim()}
      data-variant={variant}
    >
      <span className="eyebrow" style={{ position: "relative", zIndex: 1 }}>
        ONTWERPINDICATIE · GEEN ECHTE WEERGAVE
      </span>
      <h3 style={{ position: "relative", zIndex: 1 }}>
        {weergave.kop ?? voorbeeld?.kop ?? previewHeadline(naam)}
      </h3>
      <p style={{ position: "relative", zIndex: 1 }}>
        {voorbeeld?.intro ??
          `Een visuele indicatie van het blok “${naam}”, binnen de NOVA-huisstijl.`}
      </p>
      {weergave.extra ? (
        <div style={{ position: "relative", zIndex: 1 }}>{weergave.extra}</div>
      ) : null}
      <div style={{ position: "relative", zIndex: 1, marginTop: 25 }}>
        <span className="btn btn-lime">
          {voorbeeld?.knop ?? "Ontdek meer"} ↗
        </span>
      </div>
      <div className="preview-art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaSrc("work_color")}
          srcSet={mediaSrcSet("work_color")}
          sizes="(max-width: 760px) 30vw, 340px"
          alt="Abstracte ontwerpvisual"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

/** Het echte blok op schermbreedte, verkleind tot de breedte van de viewer (CSS zoom), zodat
 *  media queries, vw-maten en kolommen zich gedragen als op de site. */
function Podium({ children, laden }: { children: ReactNode; laden: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [schaal, zetSchaal] = useState<number | null>(null);
  const [melding, zetMelding] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const meet = () => zetSchaal(el.clientWidth / window.innerWidth);
    const ro = new ResizeObserver(meet);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Formulieren in het voorbeeld versturen niets: geen inzendingen of aanvragen vanuit de verkenner.
  function blokkeer(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    zetMelding(true);
  }

  return (
    <>
      <div
        className="blok-podium"
        ref={ref}
        aria-busy={laden}
        data-laden={laden || undefined}
        onSubmitCapture={blokkeer}
      >
        <div
          className="blok-podium-doek"
          style={schaal ? { zoom: schaal } : undefined}
        >
          {children}
        </div>
      </div>
      {melding ? (
        <p className="demo-note" role="status" style={{ marginTop: 10 }}>
          In de blokkenverkenner wordt niets verzonden of opgeslagen. Op de
          echte pagina werkt dit formulier wel.
        </p>
      ) : null}
    </>
  );
}

export function Playground({
  voorbeeld,
  weergave,
}: {
  voorbeeld: Omit<Voorbeeld, "blok">;
  /** Het gekozen blok, door de server gerenderd met de echte renderer (null = ontwerpindicatie). */
  weergave: ReactNode;
}) {
  const router = useRouter();
  const [laden, startOvergang] = useTransition();
  const [keuze, zetKeuze] = useOptimistic<Keuze>({
    sleutel: voorbeeld.sleutel,
    bg: voorbeeld.bg,
    variant: voorbeeld.variant,
    hoogte: voorbeeld.hoogte ?? undefined,
  });
  const [groep, setGroep] = useState(ALLE);

  const blokken =
    groep === ALLE
      ? KERNBLOKKEN
      : KERNBLOKKEN.filter((b) => b.categorie === groep);
  const blok =
    KERNBLOKKEN.find((b) => blokSleutel(b.naam) === keuze.sleutel) ??
    KERNBLOKKEN[0];
  const opties = variantOpties(blok.varianten, blok.naam);
  const isHeader = blok.cmsType === "header";
  // Tijdens het laden van een ander blok toont de viewer nog de vorige weergave.
  const actueel = keuze.sleutel === voorbeeld.sleutel;

  function kies(nieuw: Keuze) {
    startOvergang(() => {
      zetKeuze(nieuw);
      router.replace(adres(nieuw), { scroll: false });
    });
  }
  const kiesBlok = (naam: string) => kies({ sleutel: blokSleutel(naam) });
  const pas = (deel: Partial<Keuze>) =>
    kies({
      sleutel: keuze.sleutel,
      bg: keuze.bg,
      variant: keuze.variant,
      hoogte: keuze.hoogte,
      ...deel,
    });

  return (
    <>
      <div
        className="chip-row"
        style={{ marginBottom: 28 }}
        role="group"
        aria-label="Categorie"
      >
        {GROEPEN.map((g) => (
          <button
            key={g}
            className={`chip ${g === groep ? "active" : ""}`}
            aria-pressed={g === groep}
            onClick={() => {
              setGroep(g);
              const lijst =
                g === ALLE
                  ? KERNBLOKKEN
                  : KERNBLOKKEN.filter((b) => b.categorie === g);
              if (!lijst.some((b) => b.naam === blok.naam))
                kiesBlok(lijst[0].naam);
            }}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="playground-layout">
        <aside className="block-menu">
          <span className="eyebrow">
            BLOKKENBIBLIOTHEEK · {blokken.length} BLOKKEN
          </span>
          <h3>Kies een blok.</h3>
          <div className="block-list" role="listbox" aria-label="CMS-blokken">
            {blokken.map((b) => (
              <button
                key={b.naam}
                role="option"
                aria-selected={b.naam === blok.naam}
                className={b.naam === blok.naam ? "active" : ""}
                onClick={() => kiesBlok(b.naam)}
              >
                <span>{b.naam}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="block-viewer">
          <div className="toolbar">
            <div>
              <span className="eyebrow">
                {voorbeeld.echt
                  ? "ECHTE WEERGAVE · NOVA-RENDERER"
                  : "ONTWERPINDICATIE"}
              </span>
              <h3 style={{ fontSize: 29, marginTop: 6 }}>{blok.naam}</h3>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <select
                aria-label="Kies achtergrond"
                value={keuze.bg ?? ""}
                onChange={(e) => pas({ bg: e.target.value })}
              >
                {ACHTERGRONDEN.map(([n, t]) => (
                  <option key={t} value={t}>
                    {n}
                  </option>
                ))}
              </select>
              <select
                aria-label="Kies variant"
                value={
                  keuze.variant && opties.includes(keuze.variant)
                    ? keuze.variant
                    : opties[0]
                }
                onChange={(e) => pas({ variant: e.target.value })}
              >
                {opties.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              {isHeader ? (
                <select
                  aria-label="Kies hoogte"
                  value={keuze.hoogte ?? "normaal"}
                  onChange={(e) => pas({ hoogte: e.target.value })}
                >
                  {HOOGTES.map(([n, h]) => (
                    <option key={h} value={h}>
                      {n}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          </div>
          {voorbeeld.echt && actueel ? (
            <Podium laden={laden}>{weergave}</Podium>
          ) : !voorbeeld.echt && actueel ? (
            <Indicatie
              naam={voorbeeld.naam}
              bg={keuze.bg ?? voorbeeld.bg}
              variant={keuze.variant ?? voorbeeld.variant}
            />
          ) : (
            <div className="blok-podium blok-podium-leeg" aria-busy="true">
              <span className="eyebrow">{blok.naam} laden…</span>
            </div>
          )}
          <div className="block-details">
            <div>
              <strong>CMS-blok</strong>
              <br />
              <span>{blok.naam}</span>
            </div>
            <div>
              <strong>Ingevulde velden</strong>
              <br />
              <span>
                {voorbeeld.velden.length && actueel
                  ? voorbeeld.velden.map(([k, v]) => `${k}: ${v}`).join(" · ")
                  : "—"}
              </span>
            </div>
            <div>
              <strong>Voorbeeldinhoud</strong>
              <br />
              <span>
                {voorbeeld.bron && actueel ? (
                  <>
                    blauwdruk, pagina{" "}
                    <Link href={voorbeeld.bron}>{voorbeeld.bron}</Link>
                  </>
                ) : (
                  "ontwerpindicatie"
                )}
              </span>
            </div>
          </div>
          {actueel && voorbeeld.notities.length ? (
            <ul className="blok-notities">
              {voorbeeld.notities.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}
          <div className="block-fields">
            <strong>Wat de redacteur invult</strong>{" "}
            {blok.cmsType ? (
              <span style={{ fontSize: 12, color: "#5c6675" }}>
                · bloktype <code>{blok.cmsType}</code> in het CMS
              </span>
            ) : (
              <span style={{ fontSize: 12, color: "#7c2412" }}>
                · nog geen bloktype in de CMS-code (alleen in de specificatie)
              </span>
            )}
            <ul>
              {blok.velden.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
          <div className="demo-note" style={{ marginTop: 14 }}>
            {ECHT_AANTAL} van de {KERNBLOKKEN.length} blokken zie je hier met
            dezelfde renderer als op de site, verkleind en met voorbeeldinhoud
            uit de NOVA-blauwdruk; achtergrond en variant zetten de echte
            velden. {ZONDER_RENDERER} bloktypes bestaan wel in het CMS maar
            hebben in deze frontend nog geen renderer, en één blok heeft nog
            geen bloktype: die tonen een gelabelde ontwerpindicatie. Er wordt
            niets in het CMS bewerkt of opgeslagen.{" "}
            <Link href="/one#aanvraag" style={{ textDecoration: "underline" }}>
              Plan een kennismaking ↗
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
