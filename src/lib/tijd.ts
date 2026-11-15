// Tijdrekenen zonder bibliotheek (puur, los te testen).

/** "2027-06-12T12:00" in een IANA-tijdzone → tijdstip in ms (zonder bibliotheek). */
export function doelInTijdzone(doel: string, tijdzone: string): number {
  const m = doel.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return Date.parse(doel);
  const alsUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  try {
    // Hoe laat is het in de tijdzone op dat UTC-moment? Het verschil is de verschuiving.
    const d = new Intl.DateTimeFormat("en-US", {
      timeZone: tijdzone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(new Date(alsUtc));
    const deel = (t: string) => Number(d.find((p) => p.type === t)?.value);
    const daar = Date.UTC(deel("year"), deel("month") - 1, deel("day"), deel("hour"), deel("minute"));
    return alsUtc - (daar - alsUtc);
  } catch {
    return alsUtc;
  }
}

