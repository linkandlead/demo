"use client";

import { useState, type FormEvent } from "react";
import { zichtbaar, type Veld } from "@/lib/lead/veldvoorwaarde";

// Formulierbouwer, review- en NPS-formulier (CMS-blokken formulier_bouwer, review_verzamelen en
// enquete). Inzendingen gaan naar /api/inzending en worden opgeslagen in de NOVA-demodatabase;
// er wordt nooit gemaild. Validatie en foutmeldingen zijn echt (client én server).

type Status = { soort: "ok" | "fout"; tekst: string } | null;

type Uitkomst = { status: NonNullable<Status>; fouten: Record<string, string> };
// Dezelfde inzending die nog onderweg is (een dubbelklik) wordt niet nog eens verstuurd: de tweede aanroep wacht op de eerste.
const onderweg = new Map<string, Promise<Uitkomst>>();

export function verstuurInzending(data: Record<string, unknown>, bevestiging: string): Promise<Uitkomst> {
  const sleutel = JSON.stringify([data, bevestiging]);
  const loopt = onderweg.get(sleutel);
  if (loopt) return loopt;
  const nieuw = verstuurEenmalig(data, bevestiging).finally(() => onderweg.delete(sleutel));
  onderweg.set(sleutel, nieuw);
  return nieuw;
}

async function verstuurEenmalig(data: Record<string, unknown>, bevestiging: string): Promise<Uitkomst> {
  try {
    const res = await fetch("/api/inzending", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, bron_pagina: window.location.pathname }),
    });
    const r = (await res.json()) as { ok: boolean; demo?: boolean; melding: string; fouten?: Record<string, string> };
    return {
      status: { soort: r.ok || r.demo ? "ok" : "fout", tekst: r.ok && bevestiging ? bevestiging : r.melding },
      fouten: r.fouten ?? {},
    };
  } catch {
    return { status: { soort: "fout", tekst: "Je lijkt offline te zijn. Controleer je verbinding." }, fouten: {} };
  }
}

function Melding({ status }: { status: Status }) {
  return (
    <p className={`form-status${status ? ` ${status.soort}` : ""}`} role="status" aria-live="polite">
      {status?.tekst}
    </p>
  );
}

function Fout({ id, tekst }: { id: string; tekst?: string }) {
  return tekst ? (
    <span id={id} className="form-status fout">
      {tekst}
    </span>
  ) : null;
}

export type { Veld } from "@/lib/lead/veldvoorwaarde";


const sleutel = (label: string, i: number) => `veld-${i}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export function FormulierBouwer({
  velden,
  knoptekst,
  voetnoot,
  bevestiging,
  naVerzenden,
}: {
  velden: Veld[];
  knoptekst: string;
  voetnoot: string;
  bevestiging: string;
  naVerzenden?: string;
}) {
  const [status, setStatus] = useState<Status>(null);
  // Huidige antwoorden per label, voor velden met "toon_als".
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>({});
  const [fouten, setFouten] = useState<Record<string, string>>({});
  const [bezig, setBezig] = useState(false);

  async function verstuur(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nieuw: Record<string, string> = {};
    const gegevens: Record<string, string> = {};
    velden.forEach((v, i) => {
      if (!zichtbaar(v, antwoorden)) return;
      const id = sleutel(v.label, i);
      const waarde = String(fd.get(id) ?? "").trim();
      if (v.verplicht && !waarde) nieuw[id] = `Vul “${v.label}” in.`;
      else if (v.type === "telefoon" && waarde && !/^[+()\d\s-]{8,20}$/.test(waarde))
        nieuw[id] = "Vul een geldig telefoonnummer in.";
      if (waarde) gegevens[v.label] = waarde;
    });
    setFouten(nieuw);
    if (Object.keys(nieuw).length) {
      setStatus({ soort: "fout", tekst: `Controleer ${Object.keys(nieuw).length === 1 ? "het gemarkeerde veld" : "de gemarkeerde velden"}.` });
      form.querySelector<HTMLElement>(`[name="${Object.keys(nieuw)[0]}"]`)?.focus();
      return;
    }
    setBezig(true);
    const r = await verstuurInzending({ soort: "formulier", gegevens, _website: fd.get("_website") }, bevestiging);
    setBezig(false);
    setStatus(r.status);
    if (r.status.soort === "ok") {
      form.reset();
      setAntwoorden({});
      if (naVerzenden && /^\/(?!\/)/.test(naVerzenden)) window.location.assign(naVerzenden);
    }
  }

  return (
    <form
      className="form-grid"
      onSubmit={verstuur}
      noValidate
      onChange={(e) => {
        const el = e.target as unknown as HTMLInputElement;
        const i = velden.findIndex((v, k) => sleutel(v.label, k) === el.name);
        if (i >= 0) setAntwoorden((a) => ({ ...a, [velden[i].label]: el.value }));
      }}
    >
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="fb-website">Laat dit veld leeg</label>
        <input id="fb-website" name="_website" tabIndex={-1} autoComplete="off" />
      </div>
      {velden.map((v, i) => {
        if (!zichtbaar(v, antwoorden)) return null;
        const id = sleutel(v.label, i);
        const aria = {
          "aria-invalid": fouten[id] ? true : undefined,
          "aria-describedby": fouten[id] ? `${id}-fout` : undefined,
          required: v.verplicht,
        };
        const lbl = `${v.label}${v.verplicht ? " *" : ""}`;
        return (
          <div className={`form-field${v.type === "tekstvak" ? " full" : ""}`} key={id}>
            <label htmlFor={id}>{lbl}</label>
            {v.type === "tekstvak" ? (
              <textarea id={id} name={id} {...aria} />
            ) : v.type === "keuze" ? (
              <select id={id} name={id} defaultValue="" {...aria}>
                <option value="">Maak een keuze</option>
                {v.opties.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={id}
                type={v.type === "telefoon" ? "tel" : "text"}
                autoComplete={v.type === "telefoon" ? "tel" : v.type === "bedrijf" ? "organization" : "off"}
                {...aria}
              />
            )}
            <Fout id={`${id}-fout`} tekst={fouten[id]} />
          </div>
        );
      })}
      {voetnoot ? <p className="form-field full" style={{ fontSize: 12, color: "#596476" }}>{voetnoot}</p> : null}
      <div className="form-field full">
        <button className="btn btn-dark" style={{ width: "fit-content" }} disabled={bezig}>
          {bezig ? "Bezig met versturen…" : `${knoptekst} ↗`}
        </button>
        <Melding status={status} />
      </div>
    </form>
  );
}

export function ReviewFormulier({ knoptekst, bevestiging }: { knoptekst: string; bevestiging: string }) {
  const [sterren, setSterren] = useState(0);
  const [status, setStatus] = useState<Status>(null);
  const [fouten, setFouten] = useState<Record<string, string>>({});
  const [bezig, setBezig] = useState(false);

  async function verstuur(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nieuw: Record<string, string> = {};
    if (!sterren) nieuw.score = "Kies een aantal sterren van 1 tot 5.";
    if (!String(fd.get("naam") ?? "").trim()) nieuw.naam = "Vul je naam in.";
    if (String(fd.get("vraag") ?? "").trim().length < 10) nieuw.vraag = "Schrijf minimaal tien tekens.";
    if (fd.get("akkoord") !== "on") nieuw.akkoord = "Geef toestemming om je review te tonen.";
    setFouten(nieuw);
    if (Object.keys(nieuw).length) {
      setStatus({ soort: "fout", tekst: "Controleer de gemarkeerde velden." });
      return;
    }
    setBezig(true);
    const r = await verstuurInzending({ ...Object.fromEntries(fd.entries()), soort: "review", score: sterren }, bevestiging);
    setBezig(false);
    setStatus(r.status);
    setFouten(r.fouten);
    if (r.status.soort === "ok") {
      form.reset();
      setSterren(0);
    }
  }

  return (
    <form className="form-grid" onSubmit={verstuur} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="r-website">Laat dit veld leeg</label>
        <input id="r-website" name="_website" tabIndex={-1} autoComplete="off" />
      </div>
      <fieldset className="form-field full sterren" aria-describedby={fouten.score ? "r-score-fout" : undefined}>
        <legend>Jouw beoordeling *</legend>
        <div role="radiogroup" aria-label="Aantal sterren" className="sterren-rij">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              role="radio"
              aria-checked={sterren === n}
              aria-label={`${n} ${n === 1 ? "ster" : "sterren"}`}
              className={n <= sterren ? "aan" : ""}
              onClick={() => setSterren(n)}
            >
              ★
            </button>
          ))}
        </div>
        <Fout id="r-score-fout" tekst={fouten.score} />
      </fieldset>
      <div className="form-field full">
        <label htmlFor="r-naam">Naam *</label>
        <input
          id="r-naam"
          name="naam"
          autoComplete="name"
          aria-invalid={fouten.naam ? true : undefined}
          aria-describedby={fouten.naam ? "r-naam-fout" : undefined}
        />
        <Fout id="r-naam-fout" tekst={fouten.naam} />
      </div>
      <div className="form-field full">
        <label htmlFor="r-tekst">Je review *</label>
        <textarea
          id="r-tekst"
          name="vraag"
          placeholder="Wat viel je op?"
          aria-invalid={fouten.vraag ? true : undefined}
          aria-describedby={fouten.vraag ? "r-tekst-fout" : undefined}
        />
        <Fout id="r-tekst-fout" tekst={fouten.vraag} />
      </div>
      <div className="form-field full">
        <label className="form-check" htmlFor="r-akkoord">
          <input id="r-akkoord" name="akkoord" type="checkbox" aria-invalid={fouten.akkoord ? true : undefined} />
          Mijn review mag (na controle) op de website worden getoond.
        </label>
        <Fout id="r-akkoord-fout" tekst={fouten.akkoord} />
      </div>
      <div className="form-field full">
        <button className="btn btn-dark" style={{ width: "fit-content" }} disabled={bezig}>
          {bezig ? "Bezig met versturen…" : `${knoptekst} ↗`}
        </button>
        <Melding status={status} />
      </div>
    </form>
  );
}
