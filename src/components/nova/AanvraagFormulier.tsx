"use client";

import { useState, type FormEvent } from "react";

type Status =
  { soort: "bezig" } | { soort: "ok" | "fout" | "demo"; tekst: string } | null;

// Aanvraag/demo-afspraak: laatste stap van de verkoopflow. Stuurt naar /api/aanvraag, dat
// doorstuurt naar de bestaande CMS-leadflow — of eerlijk meldt dat er niets verstuurd is.
const WEBSITETYPES = [
  "Corporate website",
  "Portfolio of bureauwebsite",
  "Eventwebsite",
  "Locatie- of reserveringswebsite",
  "Community of ledenomgeving",
  "Anders",
];

export function AanvraagFormulier({
  knoptekst = "Vraag mijn demo aan",
  voetnoot = "Ik geef toestemming om contact met mij op te nemen over mijn aanvraag.",
}: {
  knoptekst?: string;
  voetnoot?: string;
}) {
  const [status, setStatus] = useState<Status>(null);
  const [fouten, setFouten] = useState<Record<string, string>>({});
  const [start] = useState(() => Date.now());

  async function verstuur(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = { ...Object.fromEntries(fd.entries()), _ts: start };
    setStatus({ soort: "bezig" });
    setFouten({});
    try {
      const res = await fetch("/api/aanvraag", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        ok: boolean;
        demo?: boolean;
        melding: string;
        fouten?: Record<string, string>;
      };
      if (data.fouten) setFouten(data.fouten);
      setStatus({
        soort: data.ok ? "ok" : data.demo ? "demo" : "fout",
        tekst: data.melding,
      });
      if (data.ok) form.reset();
    } catch {
      setStatus({
        soort: "fout",
        tekst: "Je lijkt offline te zijn. Controleer je verbinding.",
      });
    }
  }

  const veld = (naam: string) => ({
    "aria-invalid": fouten[naam] ? true : undefined,
    "aria-describedby": fouten[naam] ? `fout-${naam}` : undefined,
  });

  return (
    <form className="form-grid" onSubmit={verstuur} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="_website">Laat dit veld leeg</label>
        <input id="_website" name="_website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-field">
        <label htmlFor="a-naam">Naam *</label>
        <input
          id="a-naam"
          name="naam"
          required
          autoComplete="name"
          placeholder="Voor- en achternaam"
          {...veld("naam")}
        />
        {fouten.naam ? (
          <span id="fout-naam" className="form-status fout">
            {fouten.naam}
          </span>
        ) : null}
      </div>
      <div className="form-field">
        <label htmlFor="a-email">Zakelijk e-mailadres *</label>
        <input
          id="a-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="naam@organisatie.nl"
          {...veld("email")}
        />
        {fouten.email ? (
          <span id="fout-email" className="form-status fout">
            {fouten.email}
          </span>
        ) : null}
      </div>
      <div className="form-field">
        <label htmlFor="a-bedrijf">Organisatie *</label>
        <input
          id="a-bedrijf"
          name="bedrijf"
          required
          autoComplete="organization"
          placeholder="Jouw organisatie"
          {...veld("bedrijf")}
        />
        {fouten.bedrijf ? (
          <span id="fout-bedrijf" className="form-status fout">
            {fouten.bedrijf}
          </span>
        ) : null}
      </div>
      <div className="form-field">
        <label htmlFor="a-type">Wat voor website wil je bouwen? *</label>
        <select
          id="a-type"
          name="websiteType"
          required
          defaultValue=""
          {...veld("websiteType")}
        >
          <option value="" disabled>
            Kies een type
          </option>
          {WEBSITETYPES.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
        {fouten.websiteType ? (
          <span id="fout-websiteType" className="form-status fout">
            {fouten.websiteType}
          </span>
        ) : null}
      </div>
      <div className="form-field full">
        <label htmlFor="a-vraag">Wat wil je graag zien?</label>
        <textarea
          id="a-vraag"
          name="vraag"
          placeholder="Bijvoorbeeld collecties, formulieren of meerdere websites"
        />
      </div>
      <div className="form-field full">
        <label className="form-check" htmlFor="a-akkoord">
          <input
            id="a-akkoord"
            name="akkoord"
            type="checkbox"
            required
            {...veld("akkoord")}
          />
          {voetnoot}
        </label>
        {fouten.akkoord ? (
          <span id="fout-akkoord" className="form-status fout">
            {fouten.akkoord}
          </span>
        ) : null}
      </div>
      <div className="form-field full">
        <button
          className="btn btn-dark"
          style={{ width: "fit-content" }}
          disabled={status?.soort === "bezig"}
        >
          {status?.soort === "bezig"
            ? "Bezig met verzenden…"
            : `${knoptekst} ↗`}
        </button>
        <div
          className={`form-status ${status && status.soort !== "bezig" ? (status.soort === "fout" ? "fout" : "ok") : ""}`}
          role="status"
          aria-live="polite"
        >
          {status && status.soort !== "bezig" ? status.tekst : null}
        </div>
      </div>
    </form>
  );
}
