"use client";

import {
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

// NOVA-formulieren (fictief merk) versturen bewust NIETS: geen mails, geen opslag. Na een geldige
// inzending tonen ze een duidelijke demonstratiestatus i.p.v. een nep-bevestiging. Validatie en
// foutstaat zijn echt (native constraint validation + gekoppelde foutmelding).
export function DemoFormulier({
  children,
  className,
  style,
  demoTekst,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  demoTekst: string;
}) {
  const [status, setStatus] = useState<{
    soort: "ok" | "fout";
    tekst: string;
  } | null>(null);

  function verstuur(e: FormEvent<HTMLFormElement>) {
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
    setStatus({ soort: "ok", tekst: demoTekst });
  }

  return (
    <form className={className} style={style} onSubmit={verstuur} noValidate>
      {children}
      <div
        className={`form-status ${status?.soort ?? ""}`}
        role="status"
        aria-live="polite"
        style={{ gridColumn: "1/-1" }}
      >
        {status?.tekst}
      </div>
    </form>
  );
}
