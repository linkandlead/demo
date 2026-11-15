"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SCENES, type Actie, type Scene } from "@/content/rondleiding";

// Automatische rondleiding: één klik op afspelen en de echte pagina's lopen vanzelf voorbij in een
// venster (zelfde site, in een iframe), met uitleg ernaast. De klok staat stil zolang een pagina laadt
// of de rondleiding gepauzeerd is. Links in het venster openen niets; de rondleiding bepaalt de route.

const SCHERM = { desktop: { b: 1440, h: 900 }, mobiel: { b: 390, h: 844 } } as const;
const totaal = SCENES.reduce((s, x) => s + x.duur, 0);
const minuten = Math.round(totaal / 60000);

function isPagina(s: Scene): s is Scene & { pad: string; scherm?: "desktop" | "mobiel" } {
  return "pad" in s;
}

export function Rondleiding() {
  const [index, setIndex] = useState(-1); // -1: startscherm
  const [speelt, setSpeelt] = useState(false);
  const [klaar, setKlaar] = useState(false); // pagina in het venster is geladen
  const [voortgang, setVoortgang] = useState(0); // 0..1 binnen de scène
  const [punt, setPunt] = useState(-1);
  const [voorlezen, setVoorlezen] = useState(false);
  const [maat, setMaat] = useState({ b: 960, h: 600 });
  const verstreken = useRef(0);
  const volgendeStap = useRef(0);
  const speler = useRef<HTMLDivElement>(null);
  const podium = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const gemarkeerd = useRef<HTMLElement | null>(null);

  const scene = index >= 0 ? SCENES[index] : null;
  const pagina = scene && isPagina(scene) ? scene : null;
  const scherm = SCHERM[pagina?.scherm ?? "desktop"];
  // De pagina in het venster blijft staan zolang opeenvolgende scènes over dezelfde pagina gaan.
  const [frameSrc, setFrameSrc] = useState<string | null>(null);

  // Podiumgrootte meten voor de schaal van het venster.
  useEffect(() => {
    const el = podium.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMaat({ b: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [index >= 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const schaal = Math.min(maat.b / scherm.b, (maat.h - 34) / scherm.h, 1); // 34 px: de adresbalk

  const doc = () => frame.current?.contentDocument ?? null;
  const ontmarkeer = () => {
    const el = gemarkeerd.current;
    if (el) {
      el.style.outline = "";
      el.style.outlineOffset = "";
      el.style.transition = "";
    }
    gemarkeerd.current = null;
  };

  const voerUit = useCallback((a: Actie) => {
    const d = doc();
    const win = frame.current?.contentWindow;
    if ("punt" in a) return setPunt(a.punt);
    if (!d || !win) return;
    if ("labels" in a) {
      d.documentElement.classList.toggle("demo-active", a.labels);
      return;
    }
    if ("naar" in a) {
      ontmarkeer();
      const rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (a.naar === "top") return win.scrollTo({ top: 0, behavior: rustig ? "auto" : "smooth" });
      const el = d.querySelector<HTMLElement>(a.naar);
      if (!el) return;
      const top = el.getBoundingClientRect().top + win.scrollY - 40;
      win.scrollTo({ top: Math.max(0, top), behavior: rustig ? "auto" : "smooth" });
      if (a.markeer) {
        el.style.transition = "outline-color .3s";
        el.style.outline = "5px solid #DBF866";
        el.style.outlineOffset = "-5px";
        gemarkeerd.current = el;
      }
      return;
    }
    if ("klik" in a) {
      const kandidaten = [...d.querySelectorAll<HTMLElement>(a.klik)];
      const el = a.tekst ? kandidaten.find((k) => k.textContent?.trim().includes(a.tekst!)) : kandidaten[0];
      el?.click();
    }
  }, []);

  // Naar een scène springen: klok terug op nul, en alleen een nieuwe pagina laden als het pad verandert.
  const gaNaar = useCallback(
    (i: number) => {
      if (i < 0 || i >= SCENES.length) {
        setSpeelt(false);
        return;
      }
      ontmarkeer();
      verstreken.current = 0;
      volgendeStap.current = 0;
      setVoortgang(0);
      setPunt(-1);
      setIndex(i);
      const s = SCENES[i];
      if (isPagina(s)) {
        const src = `${s.pad}#rondleiding`;
        const andereMaat = (SCENES[index] && isPagina(SCENES[index]) ? (SCENES[index] as { scherm?: string }).scherm : undefined) !== s.scherm;
        if (src !== frameSrc || andereMaat) {
          setKlaar(false);
          setFrameSrc(src);
        } else {
          setKlaar(true);
          const d = doc();
          d?.documentElement.classList.remove("demo-active");
        }
      }
    },
    [frameSrc, index],
  );

  // De klok: loopt alleen als er gespeeld wordt en de pagina klaar is.
  useEffect(() => {
    if (!speelt || !scene) return;
    if (pagina && !klaar) return;
    let vorige = performance.now();
    let id = 0;
    const tik = (nu: number) => {
      verstreken.current += nu - vorige;
      vorige = nu;
      const stappen = scene.stappen ?? [];
      while (volgendeStap.current < stappen.length && stappen[volgendeStap.current][0] <= verstreken.current) {
        voerUit(stappen[volgendeStap.current][1]);
        volgendeStap.current++;
      }
      setVoortgang(Math.min(1, verstreken.current / scene.duur));
      if (verstreken.current >= scene.duur) {
        if (index < SCENES.length - 1) gaNaar(index + 1);
        else setSpeelt(false);
        return;
      }
      id = requestAnimationFrame(tik);
    };
    id = requestAnimationFrame(tik);
    return () => cancelAnimationFrame(id);
  }, [speelt, scene, pagina, klaar, index, gaNaar, voerUit]);

  // Voorlezen (optioneel, met de Nederlandse stem van de browser).
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (!voorlezen || !speelt || !scene) return;
    const u = new SpeechSynthesisUtterance(`${scene.titel}. ${scene.tekst}`);
    u.lang = "nl-NL";
    u.rate = 1.05;
    const stem = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("nl"));
    if (stem) u.voice = stem;
    window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
  }, [index, voorlezen, speelt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toetsen: spatie = afspelen/pauze, pijlen = vorige/volgende.
  useEffect(() => {
    if (index < 0) return;
    const opToets = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === " ") {
        e.preventDefault();
        setSpeelt((s) => !s);
      } else if (e.key === "ArrowRight") gaNaar(index + 1);
      else if (e.key === "ArrowLeft") gaNaar(index - 1);
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, [index, gaNaar]);

  function opLaden() {
    const d = doc();
    if (d) {
      // Links openen niets: de rondleiding bepaalt waar je bent.
      d.addEventListener("click", (e) => {
        if ((e.target as Element | null)?.closest?.("a")) e.preventDefault();
      }, true);
    }
    // Even wachten tot de pagina interactief is (hydratatie) voordat de klok loopt.
    setTimeout(() => setKlaar(true), 700);
  }

  function start(i = 0) {
    setSpeelt(true);
    gaNaar(i);
  }

  function volledigScherm() {
    const el = speler.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => undefined);
  }

  if (index < 0) {
    return (
      <section className="rl-start">
        <div className="container">
          <span className="eyebrow">AUTOMATISCHE RONDLEIDING · ± {minuten} MINUTEN</span>
          <h1>
            Zie het hele systeem
            <br />
            in één keer.
          </h1>
          <p>
            Druk op afspelen en de rondleiding loopt vanzelf door de echte website: van de homepage en
            video tot formulieren, de blokkenbibliotheek en wat er achter de schermen gebeurt.
          </p>
          <button type="button" className="rl-play" onClick={() => start(0)} aria-label="Rondleiding afspelen">
            <span aria-hidden="true">▶</span> Afspelen
          </button>
          <ol className="rl-hoofdstukken">
            {SCENES.map((s, i) => (
              <li key={i}>
                <button type="button" onClick={() => start(i)}>
                  <span>{String(i + 1).padStart(2, "0")}</span> {s.titel}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="rl-speler" ref={speler} aria-label="Automatische rondleiding">
      <div className="rl-podium" ref={podium}>
        {pagina || frameSrc ? (
          <div
            className={`rl-venster${pagina ? "" : " verborgen"}`}
            style={{ width: scherm.b * schaal, height: scherm.h * schaal + 34 }}
          >
            <div className="rl-balk" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>demo.linkandlead.nl{pagina?.pad === "/" ? "" : pagina?.pad}</span>
            </div>
            <div className="rl-schaal" style={{ width: scherm.b * schaal, height: scherm.h * schaal }}>
              {frameSrc ? (
                <iframe
                  key={`${frameSrc}-${pagina?.scherm ?? "desktop"}`}
                  ref={frame}
                  src={frameSrc}
                  title={`Rondleiding: ${scene?.titel ?? ""}`}
                  onLoad={opLaden}
                  tabIndex={-1}
                  style={{ width: scherm.b, height: scherm.h, transform: `scale(${schaal})` }}
                />
              ) : null}
              {pagina && !klaar ? <div className="rl-laden">Pagina laden…</div> : null}
            </div>
          </div>
        ) : null}
        {scene && !pagina ? <Dia soort={(scene as { dia: string }).dia} opnieuw={() => start(0)} /> : null}
      </div>

      <aside className="rl-uitleg">
        <span className="eyebrow">
          {String(index + 1).padStart(2, "0")} / {SCENES.length}
        </span>
        <div aria-live="polite">
          <h2>{scene?.titel}</h2>
          <p>{scene?.tekst}</p>
        </div>
        {scene?.punten ? (
          <ul className="rl-punten">
            {scene.punten.map((p, i) => (
              <li key={p} className={i === punt ? "actief" : i < punt ? "gedaan" : ""}>
                {p}
              </li>
            ))}
          </ul>
        ) : null}
      </aside>

      <div className="rl-bediening">
        <div className="rl-tijdlijn" role="group" aria-label="Hoofdstukken">
          {SCENES.map((s, i) => (
            <button
              key={i}
              type="button"
              title={s.titel}
              aria-label={`Ga naar ${i + 1}: ${s.titel}`}
              aria-current={i === index ? "step" : undefined}
              style={{ flexGrow: s.duur }}
              onClick={() => gaNaar(i)}
            >
              <span style={{ width: `${i < index ? 100 : i === index ? voortgang * 100 : 0}%` }} />
            </button>
          ))}
        </div>
        <div className="rl-knoppen">
          <button type="button" className="chip" onClick={() => gaNaar(index - 1)} disabled={index === 0}>
            ← Vorige
          </button>
          <button type="button" className="btn btn-lime" onClick={() => setSpeelt((s) => !s)} aria-pressed={!speelt}>
            {speelt ? "❚❚ Pauze" : "▶ Afspelen"}
          </button>
          <button type="button" className="chip" onClick={() => gaNaar(index + 1)} disabled={index === SCENES.length - 1}>
            Volgende →
          </button>
          <button type="button" className={`chip ${voorlezen ? "active" : ""}`} aria-pressed={voorlezen} onClick={() => setVoorlezen((v) => !v)}>
            Voorlezen
          </button>
          <button type="button" className="chip" onClick={volledigScherm}>
            Volledig scherm
          </button>
        </div>
      </div>
    </section>
  );
}

function Dia({ soort, opnieuw }: { soort: string; opnieuw: () => void }) {
  if (soort === "intro")
    return (
      <div className="rl-dia rl-dia-intro">
        <div className="brand">
          NOVA<span>.</span>
        </div>
        <p className="eyebrow">EEN EIGEN WEBSITE OP</p>
        <h2>Link &amp; Lead One</h2>
      </div>
    );
  if (soort === "achter")
    return (
      <div className="rl-dia">
        <span className="eyebrow">ZO WERKT HET</span>
        <ol className="rl-stroom">
          <li>
            <b>Redacteur</b>
            <small>past tekst, beeld en blokken aan</small>
          </li>
          <li>
            <b>Link &amp; Lead One</b>
            <small>het CMS bewaart en publiceert</small>
          </li>
          <li>
            <b>Lees-API</b>
            <small>alleen gepubliceerde inhoud, met een token per site</small>
          </li>
          <li>
            <b>NOVA-website</b>
            <small>ververst binnen een minuut, of direct via een webhook</small>
          </li>
          <li>
            <b>Bezoeker</b>
            <small>ziet de nieuwe inhoud</small>
          </li>
        </ol>
        <div className="rl-zijtak">
          <b>Formulieren</b> → eigen database met beveiliging per rij (RLS) · nooit per mail · reviews pas
          zichtbaar na goedkeuring
        </div>
      </div>
    );
  if (soort === "kwaliteit")
    return (
      <div className="rl-dia">
        <span className="eyebrow">KWALITEIT</span>
        <div className="rl-tegels">
          {[
            ["Tests", "Automatisch bij elke wijziging, in Chrome en Safari"],
            ["Snelheid", "Lighthouse-meting op mobiel en desktop"],
            ["Toegankelijk", "Pauzeknop voor video, alt-teksten, toetsenbord"],
            ["Vindbaar", "Sitemap, deelbeelden en gestructureerde gegevens"],
            ["Robuust", "Valt één blok uit, dan blijft de pagina staan"],
            ["Veilig", "Geheimen alleen op de server, database met RLS"],
          ].map(([t, u]) => (
            <div key={t}>
              <b>{t}</b>
              <small>{u}</small>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="rl-dia rl-dia-intro">
      <h2>Zelf zien wat het kan?</h2>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <Link className="btn btn-lime" href="/one#aanvraag">
          Plan een kennismaking <span className="arrow">↗</span>
        </Link>
        <button type="button" className="btn btn-outline" onClick={opnieuw}>
          Opnieuw afspelen
        </button>
      </div>
    </div>
  );
}
