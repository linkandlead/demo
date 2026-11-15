"use client";

import { useEffect, useRef, useState } from "react";

// Achtergrondvideo voor het Header-blok (CMS: media_type "video", media_video = mp4/webm).
// Speelt zonder geluid en herhaalt, alleen als het blok in beeld is. Op een telefoon de mobiele
// versie (staand) als die er is. Met "beweging verminderen" start hij niet vanzelf. De pauzeknop
// voldoet aan WCAG 2.2.2 (bewegende inhoud langer dan 5 seconden moet te stoppen zijn).
//
// Robuust in Safari/iOS: de video is altijd zichtbaar (met poster) en de knop volgt de échte
// afspeelstatus. Weigert de browser automatisch afspelen (bv. in energiebesparingsstand), dan
// staat er "Speel video af" en start een tik de video alsnog.
export function VideoAchtergrond({
  src,
  mobielSrc,
  poster,
  mobielPoster,
  label,
  positie,
  overlay,
  direct = false,
}: {
  src: string;
  mobielSrc?: string;
  poster?: string;
  mobielPoster?: string;
  label: string;
  /** Focuspunt (CMS: focal_x/focal_y) als object-position, bv. "50% 40%". */
  positie?: string;
  /** CMS-veld overlay: "licht" of "sterk" legt een extra laag over het ontwerpverloop. */
  overlay?: string;
  /** Bovenaan de pagina: poster direct laden in plaats van lui. */
  direct?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [speelt, setSpeelt] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Zeker weten dat de video stil is (Safari staat alleen stille video's toe om vanzelf te spelen).
    v.muted = true;
    v.defaultMuted = true;
    const opPlay = () => setSpeelt(true);
    const opPauze = () => setSpeelt(false);
    v.addEventListener("play", opPlay);
    v.addEventListener("playing", opPlay);
    v.addEventListener("pause", opPauze);
    const rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speel = () => {
      const p = v.play();
      if (p) p.catch(() => setSpeelt(false));
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !v.dataset.handmatig && !rustig) speel();
        else if (!e.isIntersecting && !v.paused) v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("play", opPlay);
      v.removeEventListener("playing", opPlay);
      v.removeEventListener("pause", opPauze);
    };
  }, []);

  function wissel() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      delete v.dataset.handmatig;
      const p = v.play();
      if (p) p.catch(() => setSpeelt(false));
    } else {
      v.dataset.handmatig = "1";
      v.pause();
    }
  }

  const stijl = positie ? { objectPosition: positie } : undefined;
  return (
    <div className="video-achtergrond">
      {poster ? (
        <picture>
          {mobielPoster ? <source media="(max-width: 760px)" srcSet={mobielPoster} /> : null}
          <img
            src={poster}
            alt=""
            loading={direct ? "eager" : "lazy"}
            fetchPriority={direct ? "high" : undefined}
            decoding="async"
            style={stijl}
          />
        </picture>
      ) : null}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={label}
        style={stijl}
      >
        {mobielSrc ? <source media="(max-width: 760px)" src={mobielSrc} type="video/mp4" /> : null}
        <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
      </video>
      {overlay === "licht" || overlay === "sterk" ? (
        <span className={`hero-overlay hero-overlay-${overlay}`} aria-hidden="true" />
      ) : null}
      <button type="button" className="video-knop" onClick={wissel} aria-pressed={!speelt}>
        {speelt ? "❚❚ Pauzeer video" : "▶ Speel video af"}
      </button>
    </div>
  );
}
