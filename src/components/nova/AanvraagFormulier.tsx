"use client";

import { useState, type FormEvent } from "react";

type Status =
  { soort: "bezig" } | { soort: "ok" | "fout" | "demo"; tekst: string } | null;

// Aanvraag/demo-afspraak: laatste stap van de verkoopflow. Stuurt naar /api/aanvraag, dat
// doorstuurt naar de bestaande CMS-leadflow — of eerlijk meldt dat er niets verstuurd is.
export function AanvraagFormulier() {
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
        tekst:
          "Versturen is niet gelukt. Controleer je verbinding en probeer het opnieuw.",
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
          placeholder="Je naam"
          {...veld("naam")}
        />
        {fouten.naam ? (
          <span id="fout-naam" className="form-status fout">
            {fouten.naam}
          </span>
        ) : null}
      </div>
      <div className="form-field">
        <label htmlFor="a-email">E-mailadres *</label>
        <input
          id="a-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jij@organisatie.nl"
          {...veld("email")}
        />
        {fouten.email ? (
          <span id="fout-email" className="form-status fout">
            {fouten.email}
          </span>
        ) : null}
      </div>
      <div className="form-field full">
        <label htmlFor="a-bedrijf">Organisatie</label>
        <input
          id="a-bedrijf"
          name="bedrijf"
          autoComplete="organization"
          placeholder="Naam van je organisatie"
        />
      </div>
      <div className="form-field full">
        <label htmlFor="a-vraag">Waar wil je meer over weten?</label>
        <textarea
          id="a-vraag"
          name="vraag"
          placeholder="Bijvoorbeeld: een eigen frontend voor ons merk, de blokken, collecties…"
        />
      </div>
      <div className="form-field full">
        <button
          className="btn btn-dark"
          style={{ width: "fit-content" }}
          disabled={status?.soort === "bezig"}
        >
          {status?.soort === "bezig"
            ? "Bezig met versturen…"
            : "Vraag een demo aan ↗"}
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
