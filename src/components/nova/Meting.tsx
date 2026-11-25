"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { metingPad } from "@/lib/meting/config";
import { maakToestemming, TOESTEMMING_TEKSTEN, type MeetToestemming } from "@/lib/meting/toestemming";
import { startTracking, type Tracker } from "@/lib/meting/tracking";

// Bezoekmeting naar het CMS, alleen na toestemming (besluit B5). Zonder keuze wordt niets opgeslagen of
// verstuurd. De keuze kun je altijd wijzigen via "Cookie-instellingen" in de voet. Niet in het voorbeeld in de
// editor (een iframe) en niet op de voorvertoning: die bezoeken horen niet in de statistieken.
const OPEN_INSTELLINGEN = "nova:meting-instellingen";

export function Meting({ basisUrl, siteId }: { basisUrl: string; siteId: string }) {
  const pad = usePathname();
  const toestemming = useRef<MeetToestemming | null>(null);
  const tracker = useRef<Tracker | null>(null);
  const [vraag, setVraag] = useState(false);
  const meetbaar = metingPad(pad);

  // Eén toestemmingsbeheer en één tracker per pagina-lading; de tracker vraagt de toestemming bij elke gebeurtenis opnieuw.
  useEffect(() => {
    if (window.self !== window.top) return; // ingesloten (voorbeeld in de editor)
    const t = maakToestemming({ consent: { banner: true, analytics: "eigen" } });
    const tr = startTracking({ basisUrl, siteId, toestemming: () => t.toestemming(), paginabezoekBijStart: false });
    toestemming.current = t;
    tracker.current = tr;
    const stopKlik = tr.volgKlikken();
    const stopScroll = tr.volgScroll();
    let vorige = t.keuze();
    const stopLuister = t.luister((k) => {
      if (k === "akkoord" && vorige !== "akkoord") tr.paginabezoek(window.location.pathname);
      if (k !== "akkoord") tr.vergeet();
      vorige = k;
      setVraag(t.moetVragen());
    });
    const heropen = () => {
      t.wis();
      setVraag(true);
    };
    window.addEventListener(OPEN_INSTELLINGEN, heropen);
    // Niet synchroon in de effect: de eerste vraag komt een tik later, na de eerste weergave.
    const eerste = window.setTimeout(() => setVraag(t.moetVragen()), 0);
    return () => {
      window.clearTimeout(eerste);
      stopKlik();
      stopScroll();
      stopLuister();
      window.removeEventListener(OPEN_INSTELLINGEN, heropen);
      toestemming.current = null;
      tracker.current = null;
    };
  }, [basisUrl, siteId]);

  // Elke paginawissel (ook zonder volledige herlaad) is een paginabezoek; zonder toestemming gebeurt er niets.
  useEffect(() => {
    if (meetbaar) tracker.current?.paginabezoek(pad);
  }, [pad, meetbaar]);

  if (!vraag || !meetbaar) return null;
  const t = toestemming.current;
  return (
    <div className="meting-banner" role="dialog" aria-modal="false" aria-labelledby="meting-titel" aria-describedby="meting-uitleg">
      <div className="meting-tekst">
        <strong id="meting-titel">{TOESTEMMING_TEKSTEN.titel}</strong>
        <span id="meting-uitleg">{TOESTEMMING_TEKSTEN.uitleg}</span>
      </div>
      <div className="meting-knoppen">
        <button type="button" className="btn btn-ghost btn-mini" onClick={() => t?.geef(false)}>
          {TOESTEMMING_TEKSTEN.weigeren}
        </button>
        <button type="button" className="btn btn-lime btn-mini" onClick={() => t?.geef(true)}>
          {TOESTEMMING_TEKSTEN.akkoord}
        </button>
      </div>
    </div>
  );
}

/** "Cookie-instellingen" in de voet: wist de keuze en toont de vraag opnieuw. */
export function CookieInstellingen() {
  return (
    <button type="button" className="meting-instellingen" onClick={() => window.dispatchEvent(new Event(OPEN_INSTELLINGEN))}>
      Cookie-instellingen
    </button>
  );
}
