"use client";

import {
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

// NOVA-formulieren. Met `opslaan` gaat een geldige inzending naar /api/inzending, dat hem in de
// NOVA-demodatabase (Supabase) bewaart. Er wordt nooit gemaild. Zonder `opslaan` (bv. de
// ledenlogin) of zonder database blijft het een zichtbare demonstratie, nooit een nep-bevestiging.
// Validatie en foutstaat zijn echt (native constraint validation).
export function DemoFormulier({
  children,
  className,
  style,
  demoTekst,
  opslaan,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  demoTekst: string;
  opslaan?: "contact" | "nieuwsbrief";
}) {
  const [status, setStatus] = useState<{
    soort: "ok" | "fout";
    tekst: string;
  } | null>(null);
  const [bezig, setBezig] = useState(false);
  const [start] = useState(() => Date.now());

  async function verstuur(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const ongeldig = [...form.elements].filter(
      (el): el is HTMLInputElement =>
        "checkValidity" in el && !(el as HTMLInputElement).checkValidity(),
    );
    for (const el of form.querySelectorAll("[aria-invalid]"))
      el.removeAttribute("aria-invalid");
    if (ongeldig.length) {
      for (const el of ongeldig) el.setAttribute("aria-invalid", "true");
      ongeldig[0].focus();
      setStatus({
        soort: "fout",
        tekst:
          "Controleer de gemarkeerde velden: " +
          ongeldig.map((el) => el.validationMessage).join(" "),
      });
      return;
    }
    if (!opslaan) {
      setStatus({ soort: "ok", tekst: demoTekst });
      return;
    }
    setBezig(true);
    try {
      const res = await fetch("/api/inzending", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form).entries()),
          soort: opslaan,
          bron_pagina: window.location.pathname,
          _ts: start,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        demo?: boolean;
        melding: string;
      };
      if (data.demo) setStatus({ soort: "ok", tekst: demoTekst });
      else setStatus({ soort: data.ok ? "ok" : "fout", tekst: data.melding });
      if (data.ok) form.reset();
    } catch {
      setStatus({
        soort: "fout",
        tekst: "Je lijkt offline te zijn. Controleer je verbinding.",
      });
    } finally {
      setBezig(false);
    }
  }

  return (
    <form
      className={className}
      style={style}
      onSubmit={verstuur}
      noValidate
      aria-busy={bezig}
    >
      {opslaan ? (
        <div className="honeypot" aria-hidden="true">
          <label htmlFor={`_website-${opslaan}`}>Laat dit veld leeg</label>
          <input
            id={`_website-${opslaan}`}
            name="_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      ) : null}
      {children}
      <div
        className={`form-status ${status?.soort ?? ""}`}
        role="status"
        aria-live="polite"
        style={{ gridColumn: "1/-1" }}
      >
        {bezig ? "Bezig met verzenden…" : status?.tekst}
      </div>
    </form>
  );
}
