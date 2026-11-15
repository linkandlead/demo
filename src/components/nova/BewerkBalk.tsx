"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { opslagTekst, padTekst, type BewerkVeld, type VeldPad } from "@/lib/cms/bewerken";

// Bewerkbalk bovenaan (linkandlead-cms B-090, zoals de bewerkbalk van de gedeelde renderer, B-083). Alleen in
// bewerkmodus: draft mode + een concept uit het CMS + een bewerktoken (dat in een httpOnly-cookie staat en deze
// component nooit ziet). De platte tekstvelden die het CMS als bewerkbaar meegeeft (`bewerken.velden`) worden
// in de pagina gezocht op hun tekst; alleen een element dat die tekst precies toont, wordt contenteditable met
// `data-cms-veld`. Is dat niet eenduidig, dan wordt er niet gegokt (dat veld bewerk je in de editor).
// Opslaan gaat naar /api/cms-bewerken (eigen server, Origin-check); die stuurt het als concept naar het CMS.

export type BewerkSectie = { id: string; versie: string; velden: BewerkVeld[] };

type Gekoppeld = { sectie: string; pad: VeldPad; el: HTMLElement; meerdereRegels: boolean; origineel: string };
type Melding = { soort: "conflict" | "fout"; tekst: string } | null;

// Elementen waarin bewerken niet kan zonder de werking te breken (links, knoppen, formulieren).
const NIET_IN = "a, button, select, input, textarea, label, summary, svg, script, style";

/** De tekst zoals de bezoeker hem ziet (met regeleinden voor <br>), zonder \r. */
const zichtbaar = (el: HTMLElement) => (el.innerText ?? "").replace(/\r/g, "");

function zoekElement(sectie: Element, waarde: string, bezet: Set<Element>): HTMLElement | null {
  if (!waarde.trim() || waarde !== waarde.trim()) return null;
  const treffers = [...sectie.querySelectorAll<HTMLElement>("*")].filter(
    (el) => !bezet.has(el) && !el.closest(NIET_IN) && !el.querySelector(NIET_IN) && zichtbaar(el).trim() === waarde,
  );
  const diepste = treffers.filter((el) => !treffers.some((ander) => ander !== el && el.contains(ander)));
  if (diepste.length === 1) return diepste[0];
  const koppen = diepste.filter((el) => /^H[1-6]$/.test(el.tagName));
  return koppen.length === 1 ? koppen[0] : null;
}

export function BewerkBalk({ pagina, secties, editorUrl }: { pagina: string; secties: BewerkSectie[]; editorUrl: string | null }) {
  const velden = useRef<Gekoppeld[]>([]);
  const versies = useRef(new Map(secties.map((s) => [s.id, s.versie])));
  const [aantal, setAantal] = useState<number | null>(null);
  const [open, setOpen] = useState(0);
  const [bezig, setBezig] = useState(false);
  const [mislukt, setMislukt] = useState(false);
  const [melding, setMelding] = useState<Melding>(null);
  // Bewust weg (Herladen na een conflict, of Stoppen na de vraag): dan niet nog eens vragen.
  const bewustWeg = useRef(false);

  const telOpen = useCallback(() => setOpen(velden.current.filter((v) => zichtbaar(v.el) !== v.origineel).length), []);

  // Na het renderen: velden koppelen. Alleen in deze component, dus alleen in bewerkmodus.
  useEffect(() => {
    const gekoppeld: Gekoppeld[] = [];
    const bezet = new Set<Element>();
    for (const s of secties) {
      const blok = document.querySelector(`[data-cms-sectie="${CSS.escape(s.id)}"]`);
      if (!blok) continue;
      for (const v of s.velden) {
        const el = zoekElement(blok, v.waarde, bezet);
        // Alleen als de tekst precies terugkomt zoals hij in het CMS staat (geen opmaak, geen hoofdletters via CSS).
        if (!el || zichtbaar(el) !== v.waarde) continue;
        bezet.add(el);
        el.setAttribute("contenteditable", "plaintext-only");
        if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
        el.setAttribute("data-cms-veld", padTekst(v.pad));
        el.setAttribute("role", "textbox");
        el.setAttribute("aria-label", `${v.label || "Tekst"} bewerken`);
        if (v.meerdereRegels) el.setAttribute("aria-multiline", "true");
        el.spellcheck = true;
        el.classList.add("cms-veld");
        gekoppeld.push({ sectie: s.id, pad: v.pad, el, meerdereRegels: v.meerdereRegels, origineel: v.waarde });
      }
    }
    velden.current = gekoppeld;
    // De DOM is hier de externe bron: de telling volgt in het volgende frame.
    const frame = requestAnimationFrame(() => setAantal(gekoppeld.length));
    const opInvoer = () => telOpen();
    const opToets = (e: KeyboardEvent) => {
      const doel = gekoppeld.find((v) => v.el === e.currentTarget);
      if (e.key === "Enter" && doel && !doel.meerdereRegels) e.preventDefault();
    };
    for (const v of gekoppeld) {
      v.el.addEventListener("input", opInvoer);
      v.el.addEventListener("keydown", opToets);
    }
    return () => {
      cancelAnimationFrame(frame);
      for (const v of gekoppeld) {
        v.el.removeEventListener("input", opInvoer);
        v.el.removeEventListener("keydown", opToets);
      }
    };
  }, [secties, telOpen]);

  const opslaan = useCallback(async () => {
    const teDoen = velden.current.filter((v) => zichtbaar(v.el) !== v.origineel);
    if (!teDoen.length || bezig) return;
    setBezig(true);
    setMelding(null);
    let fout = false;
    for (const v of teDoen) {
      const waarde = zichtbaar(v.el);
      let res: Response | null = null;
      try {
        res = await fetch("/api/cms-bewerken", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ pagina, sectie: v.sectie, pad: v.pad, waarde, versie: versies.current.get(v.sectie) }),
        });
      } catch {
        res = null;
      }
      const json: { ok?: boolean; versie?: string; melding?: string; conflict?: boolean } = res ? await res.json().catch(() => ({})) : {};
      if (res?.ok && json.ok && typeof json.versie === "string") {
        versies.current.set(v.sectie, json.versie);
        v.origineel = waarde;
        continue;
      }
      fout = true;
      setMelding({
        soort: res?.status === 409 ? "conflict" : "fout",
        tekst: json.melding || "Opslaan is niet gelukt. Controleer je verbinding en probeer het opnieuw.",
      });
      v.el.focus();
      break;
    }
    setMislukt(fout);
    setBezig(false);
    telOpen();
  }, [bezig, pagina, telOpen]);

  // Ctrl/Cmd+S bewaart; wegnavigeren met open wijzigingen vraagt eerst.
  useEffect(() => {
    const toets = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void opslaan();
      }
    };
    const weg = (e: BeforeUnloadEvent) => {
      if (!bewustWeg.current && velden.current.some((v) => zichtbaar(v.el) !== v.origineel)) e.preventDefault();
    };
    window.addEventListener("keydown", toets);
    window.addEventListener("beforeunload", weg);
    return () => {
      window.removeEventListener("keydown", toets);
      window.removeEventListener("beforeunload", weg);
    };
  }, [opslaan]);

  const status = aantal === 0 ? "Geen teksten om hier te bewerken" : opslagTekst({ bezig, open, mislukt });
  const stoppen = `/__voorvertoning/sluiten?pad=${encodeURIComponent(pagina)}`;

  return (
    <div className="bewerk-balk" role="region" aria-label="Bewerkbalk">
      <strong>Je bewerkt deze pagina live</strong>
      <span className="bewerk-badge">Concept</span>
      <span className="bewerk-status" role="status" aria-live="polite">
        {aantal === null ? "Teksten zoeken…" : status}
      </span>
      <span className="bewerk-knoppen">
        <button type="button" className="bewerk-knop primair" onClick={() => void opslaan()} disabled={bezig || open === 0}>
          {bezig ? "Opslaan…" : "Opslaan"}
        </button>
        {editorUrl ? (
          <a className="bewerk-knop" href={editorUrl} target="_blank" rel="noopener noreferrer">
            Openen in de editor
          </a>
        ) : null}
        <a
          className="bewerk-knop"
          href={stoppen}
          onClick={(e) => {
            if (open > 0 && !window.confirm("Je hebt wijzigingen die nog niet zijn opgeslagen. Toch stoppen?")) e.preventDefault();
            else bewustWeg.current = true;
          }}
        >
          Stoppen
        </a>
      </span>
      {melding ? (
        <div className={`bewerk-melding ${melding.soort}`} role="alert">
          <span>{melding.tekst}</span>
          {melding.soort === "conflict" ? (
            <button type="button" className="bewerk-knop primair" onClick={() => {
                bewustWeg.current = true;
                window.location.reload();
              }}
            >
              Herladen
            </button>
          ) : null}
          <button type="button" className="bewerk-knop" onClick={() => setMelding(null)}>
            Sluiten
          </button>
        </div>
      ) : null}
    </div>
  );
}
