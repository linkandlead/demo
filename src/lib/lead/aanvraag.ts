// Validatie van een demo-aanvraag (Link & Lead One). Puur en los testbaar.

export type Aanvraag = {
  naam: string;
  email: string;
  bedrijf?: string;
  websiteType?: string;
  vraag?: string;
};
export type Validatie =
  { ok: true; data: Aanvraag } | { ok: false; fouten: Record<string, string> };

const tekst = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function valideerAanvraag(body: unknown): Validatie {
  const b = (body && typeof body === "object" ? body : {}) as Record<
    string,
    unknown
  >;
  const naam = tekst(b.naam, 200);
  const email = tekst(b.email, 254);
  const fouten: Record<string, string> = {};
  const bedrijf = tekst(b.bedrijf, 200);
  const websiteType = tekst(b.websiteType, 80);
  if (!naam) fouten.naam = "Vul dit veld in.";
  if (!EMAIL.test(email)) fouten.email = "Vul een geldig e-mailadres in.";
  if (!bedrijf) fouten.bedrijf = "Vul dit veld in.";
  if (!websiteType) fouten.websiteType = "Vul dit veld in.";
  if (b.akkoord !== "on")
    fouten.akkoord = "Geef toestemming om je aanvraag te verwerken.";
  if (Object.keys(fouten).length) return { ok: false, fouten };
  return {
    ok: true,
    data: {
      naam,
      email,
      bedrijf,
      websiteType,
      vraag: tekst(b.vraag) || undefined,
    },
  };
}

/** Spamsignalen, gelijk aan ruiktNaarBot() in linkandlead-cms (honeypot + minimaal 2 s invultijd). */
export function lijktSpam(body: unknown, nu = Date.now()): boolean {
  const b = (body && typeof body === "object" ? body : {}) as Record<
    string,
    unknown
  >;
  if (typeof b._website === "string" && b._website.trim() !== "") return true;
  const ts = Number(b._ts);
  return Number.isFinite(ts) && nu - ts < 2000;
}
