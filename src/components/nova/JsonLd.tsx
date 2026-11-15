// Structured data (schema.org) als JSON-LD. "<" wordt geëscaped, zodat CMS-tekst het script niet kan
// afsluiten.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c") }}
    />
  );
}
