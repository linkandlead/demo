"use client";

import { useEffect, useRef, useState } from "react";

// Achtergrondvideo voor het Header-blok (CMS: media_type "video", media_video = mp4/webm).
// Speelt zonder geluid en herhaalt, alleen als het blok in beeld is. Op een telefoon de mobiele
// versie (staand) als die er is. Met "beweging verminderen" start hij niet vanzelf. De pauzeknop
// voldoet aan WCAG 2.2.2 (bewegende inhoud langer dan 5 seconden moet te stoppen zijn).
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
  const [gepauzeerd, setGepauzeerd] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const eersteKeer = setTimeout(() => setGepauzeerd(rustig), 0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !v.dataset.handmatig && !rustig) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => {
      clearTimeout(eersteKeer);
      io.disconnect();
    };
  }, []);

  function wissel() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      delete v.dataset.handmatig;
      v.play().catch(() => {});
      setGepauzeerd(false);
    } else {
      v.dataset.handmatig = "1";
      v.pause();
      setGepauzeerd(true);
    }
  }

  return (
    <div className="video-achtergrond">
      {poster ? (
        <picture>
          {mobielPoster ? <source media="(max-width: 760px)" srcSet={mobielPoster} /> : null}
          <img src={poster} alt="" loading={direct ? "eager" : "lazy"} fetchPriority={direct ? "high" : undefined} decoding="async" style={positie ? { objectPosition: positie } : undefined} />
        </picture>
      ) : null}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className={speelt ? "speelt" : ""}
        style={positie ? { objectPosition: positie } : undefined}
        onPlaying={() => setSpeelt(true)}
      >
        {mobielSrc ? <source media="(max-width: 760px)" src={mobielSrc} type="video/mp4" /> : null}
        <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
      </video>
      {overlay === "licht" || overlay === "sterk" ? (
        <span className={`hero-overlay hero-overlay-${overlay}`} aria-hidden="true" />
      ) : null}
      <button type="button" className="video-knop" onClick={wissel} aria-pressed={gepauzeerd}>
        {gepauzeerd ? "▶ Speel video af" : "❚❚ Pauzeer video"}
      </button>
    </div>
  );
}
