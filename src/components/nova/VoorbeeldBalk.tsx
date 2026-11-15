import { voorbeeldStand } from "@/lib/cms/concept";
import { SluitLink } from "./VoorbeeldSluiten";

/** Balk "Voorbeeld van het concept" ("Voorbeeld op de site" uit het CMS). Alleen in draft mode;
 *  buiten draft mode rendert hij niets en leest hij geen cookies. */
export async function VoorbeeldBalk() {
  const stand = await voorbeeldStand();
  if (!stand.aan) return null;
  return (
    <div className="voorbeeld-balk" role="region" aria-label="Voorbeeld">
      {stand.token ? (
        <>
          <strong>Voorbeeld van het concept</strong>
          <span>Niet gepubliceerd. Bezoekers zien dit niet.</span>
        </>
      ) : (
        <>
          <strong>Voorbeeldlink verlopen</strong>
          <span>
            Je ziet de gepubliceerde versie. Open het voorbeeld opnieuw vanuit
            het CMS.
          </span>
        </>
      )}
      <SluitLink />
    </div>
  );
}
