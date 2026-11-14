"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Ontwerpdemomodus: blokinspectie, themawissel, responsieve weergave en de vijf-minutentour.
// Paneel-markup gelijk aan index.html van het prototype; nieuw zijn de databron-regel, de
// (alleen bij koppeling getoonde) beheerlink, de mobiele weergave en de rondleiding.

export type CmsInfoProps = {
  bron: "cms" | "supabase" | "demo";
  site: string | null;
  melding: string | null;
  beheerUrl: string | null;
};

type Stap = {
  pad: string;
  titel: string;
  uitleg: string;
  actie?: "labels" | "mobiel";
};

export const TOUR: Stap[] = [
  {
    pad: "/",
    titel: "Open de homepage",
    uitleg:
      "NOVA is een volledig eigen frontend. Alles wat je ziet is ontworpen, niet uit een template.",
  },
  {
    pad: "/",
    titel: "Toon de CMS-bloklabels",
    uitleg:
      "Elke sectie is een CMS-blok met vaste velden. De labels laten zien welk blok en welke achtergrond.",
    actie: "labels",
  },
  {
    pad: "/work",
    titel: "Navigeer door projecten en artikelen",
    uitleg:
      "Cases, artikelen en teamleden komen uit collecties die de redacteur apart beheert.",
  },
  {
    pad: "/lab",
    titel: "Test een configurator en formulier",
    uitleg:
      "Configurator, enquête, A/B-test en personalisatie zijn bestaande CMS-blokken. Hier als veilige demo.",
  },
  {
    pad: "/playground",
    titel: "Bekijk de 43 blokken",
    uitleg:
      "De volledige blokkenbibliotheek, met echte veldnamen, varianten en de vijf achtergronden.",
  },
  {
    pad: "/",
    titel: "Wissel naar mobiele weergave",
    uitleg:
      "Dezelfde website op 390 pixels breed. Geen aparte mobiele site, hetzelfde CMS.",
    actie: "mobiel",
  },
  {
    pad: "/one#aanvraag",
    titel: "Plan een kennismaking",
    uitleg:
      "Benieuwd wat Link & Lead One voor jouw website kan doen? Vraag een demo aan.",
  },
];

type Ctx = {
  labels: boolean;
  setLabels: (v: boolean) => void;
  startTour: () => void;
  openMobiel: () => void;
};
const DemoCtx = createContext<Ctx | null>(null);
export const useDemo = () => {
  const c = useContext(DemoCtx);
  if (!c) throw new Error("useDemo buiten DemoProvider");
  return c;
};

const ACCENTEN: Array<[string, string]> = [
  ["Limoen", "#DBF866"],
  ["Roze", "#F4A5C7"],
  ["Blauw", "#93C8FF"],
  ["Oranje", "#FFB473"],
];

export function DemoProvider({
  info,
  children,
}: {
  info: CmsInfoProps;
  children: ReactNode;
}) {
  const [paneel, setPaneel] = useState(false);
  const [labels, setLabelsState] = useState(false);
  const [tour, setTour] = useState<number | null>(null);
  const [mobiel, setMobiel] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const setLabels = useCallback((v: boolean) => {
    setLabelsState(v);
    document.body.classList.toggle("demo-active", v);
  }, []);

  const setAccent = (kleur: string) =>
    document.documentElement.style.setProperty("--lime", kleur);

  const gaNaarStap = useCallback(
    (i: number) => {
      const stap = TOUR[i];
      setTour(i);
      setPaneel(false);
      if (stap.actie === "labels") setLabels(true);
      if (stap.actie === "mobiel") setMobiel(true);
      const [pad] = stap.pad.split("#");
      if (pathname !== pad || stap.pad.includes("#")) router.push(stap.pad);
    },
    [pathname, router, setLabels],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPaneel(false);
        setMobiel(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({
      labels,
      setLabels,
      startTour: () => gaNaarStap(0),
      openMobiel: () => setMobiel(true),
    }),
    [labels, setLabels, gaNaarStap],
  );

  const gekoppeld = info.bron === "cms";
  const viaSupabase = info.bron === "supabase";

  return (
    <DemoCtx.Provider value={ctx}>
      {children}
      <button
        aria-label="Open demonstratiemodus"
        aria-expanded={paneel}
        aria-controls="demoPanel"
        className="demo-fab"
        onClick={() => setPaneel((o) => !o)}
      >
        ◈ <span>Bekijk het CMS-ontwerp</span> <span>↗</span>
      </button>
      <div
        className={`demo-panel ${paneel ? "open" : ""}`}
        id="demoPanel"
        role="dialog"
        aria-label="Ontwerpdemomodus"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="eyebrow">LINK &amp; LEAD ONE</span>
          <button
            aria-label="Sluiten"
            onClick={() => setPaneel(false)}
            style={{ background: "none", border: 0, fontSize: 22 }}
          >
            ×
          </button>
        </div>
        <h3>Ontwerpdemomodus</h3>
        <p>
          {gekoppeld
            ? `Deze inhoud komt uit het Link & Lead One-CMS (site: ${info.site ?? "onbekend"}).`
            : viaSupabase
              ? "Cases, artikelen, team, ruimtes en evenementen komen uit de NOVA-demodatabase in Supabase. Paginateksten zijn nog ontwerpcopy; het echte CMS is nog niet gekoppeld."
              : "Dit is een klikbaar visueel prototype. Het is nog niet gekoppeld aan het echte CMS."}
        </p>
        <div className="demo-control" style={{ marginTop: 22 }}>
          Toon CMS-bloklabels
          <button
            aria-label="CMS-blokken markeren"
            aria-pressed={labels}
            className={`switch ${labels ? "on" : ""}`}
            id="cmsSwitch"
            onClick={() => setLabels(!labels)}
          />
        </div>
        <div className="demo-control">
          Ontwerpstijlen <span>Accentkleur</span>
        </div>
        <div className="color-dots">
          {ACCENTEN.map(([naam, kleur]) => (
            <button
              key={kleur}
              aria-label={naam}
              onClick={() => setAccent(kleur)}
              style={{ background: kleur }}
            />
          ))}
        </div>
        <div className="demo-control">
          Bekijk alle 43 blokken
          <Link
            className="btn btn-mini btn-dark"
            href="/playground"
            onClick={() => setPaneel(false)}
          >
            Open blokkenbibliotheek ↗
          </Link>
        </div>
        <div className="demo-control">
          Vijf-minutentour
          <button
            className="btn btn-mini btn-dark"
            onClick={() => gaNaarStap(0)}
          >
            Start rondleiding ↗
          </button>
        </div>
        <div className="demo-control">
          Responsieve weergave
          <button
            className="btn btn-mini btn-dark"
            onClick={() => setMobiel(true)}
          >
            Bekijk op mobiel ↗
          </button>
        </div>
        <div className="demo-control">
          Presentatieoverzicht
          <Link
            className="btn btn-mini btn-dark"
            href="/demo"
            onClick={() => setPaneel(false)}
          >
            Bekijk demo ↗
          </Link>
        </div>
        <div className="demo-control">
          Databron
          <span
            className={`demo-bron ${gekoppeld || viaSupabase ? "live" : ""}`}
          >
            {gekoppeld
              ? "CMS · live"
              : viaSupabase
                ? "Supabase · live"
                : "Demodata"}
          </span>
        </div>
        {(gekoppeld || viaSupabase) && info.beheerUrl ? (
          <div className="demo-control">
            Inhoud bewerken
            <a
              className="btn btn-mini btn-dark"
              href={info.beheerUrl}
              target="_blank"
              rel="noopener"
            >
              {gekoppeld ? "Open CMS-beheer ↗" : "Open Supabase ↗"}
            </a>
          </div>
        ) : null}
        <p style={{ marginTop: 10 }}>
          {gekoppeld
            ? "Wijzigingen in het CMS-beheer verschijnen hier na ongeveer een minuut. Inloggen in het beheer is vereist."
            : viaSupabase
              ? "Wijzigingen in de Supabase-tabellen verschijnen hier na ongeveer een minuut (inloggen bij Supabase vereist). Formulieren slaan inzendingen op in de tabel aanvragen; er wordt niets gemaild."
              : `Live content wijzigen kan pas na koppeling met een eigen, afgeschermde NOVA-demosite in het CMS.${info.melding ? ` (${info.melding})` : ""}`}
        </p>
      </div>

      {tour !== null ? (
        <div
          className="tour-bar"
          role="region"
          aria-label="Rondleiding"
          aria-live="polite"
        >
          <div>
            <span className="eyebrow">
              RONDLEIDING · STAP {tour + 1} / {TOUR.length}
            </span>
            <strong>{TOUR[tour].titel}</strong>
            <p>{TOUR[tour].uitleg}</p>
          </div>
          <div className="tour-actions">
            <button
              className="btn btn-mini btn-ghost"
              disabled={tour === 0}
              onClick={() => gaNaarStap(tour - 1)}
            >
              Vorige
            </button>
            {tour < TOUR.length - 1 ? (
              <button
                className="btn btn-mini btn-lime"
                onClick={() => gaNaarStap(tour + 1)}
              >
                Volgende ↗
              </button>
            ) : null}
            <button
              className="btn btn-mini btn-ghost"
              onClick={() => setTour(null)}
              aria-label="Rondleiding sluiten"
            >
              Sluiten
            </button>
          </div>
        </div>
      ) : null}

      {mobiel ? (
        <div
          className="mobile-preview"
          role="dialog"
          aria-modal="true"
          aria-label="Mobiele weergave"
        >
          <div className="mobile-preview-bar">
            <span className="eyebrow">MOBIELE WEERGAVE · 390 × 844</span>
            <button
              className="btn btn-mini btn-lime"
              onClick={() => setMobiel(false)}
            >
              Sluiten ×
            </button>
          </div>
          <iframe
            title="NOVA op mobiel"
            src={pathname}
            className="mobile-preview-frame"
          />
        </div>
      ) : null}
    </DemoCtx.Provider>
  );
}

/** Startknop voor de rondleiding, in dezelfde vorm als btn() uit het prototype. */
export function TourStart({
  children,
  cl = "btn-lime",
}: {
  children: ReactNode;
  cl?: string;
}) {
  const { startTour } = useDemo();
  return (
    <button type="button" className={`btn ${cl}`} onClick={startTour}>
      {children}
      <span className="arrow">↗</span>
    </button>
  );
}
