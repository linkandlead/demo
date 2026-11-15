"use client";

import { useEffect, useState } from "react";

// Pauzeknop voor de achtergrondvideo van de header (WCAG 2.2.2: bewegend beeld dat langer dan vijf
// seconden loopt, moet te stoppen zijn). Bij prefers-reduced-motion speelt de video niet af: de CSS
// verbergt hem (dan zie je de poster) en hier wordt hij ook gepauzeerd, zodat hij niet doorloopt.

export function VideoKnop({ doel }: { doel: string }) {
  const [gepauzeerd, zetGepauzeerd] = useState(false);

  useEffect(() => {
    const video = document.getElementById(doel);
    if (!(video instanceof HTMLVideoElement)) return;
    const rustig = window.matchMedia("(prefers-reduced-motion: reduce)");
    const volg = () => zetGepauzeerd(video.paused);
    const pasAan = () => {
      if (rustig.matches) video.pause();
    };
    video.addEventListener("play", volg);
    video.addEventListener("pause", volg);
    rustig.addEventListener("change", pasAan);
    pasAan();
    return () => {
      video.removeEventListener("play", volg);
      video.removeEventListener("pause", volg);
      rustig.removeEventListener("change", pasAan);
    };
  }, [doel]);

  function wissel() {
    const video = document.getElementById(doel);
    if (!(video instanceof HTMLVideoElement)) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  }

  return (
    <button
      type="button"
      className="video-knop"
      onClick={wissel}
      aria-controls={doel}
    >
      {gepauzeerd ? "Speel video af" : "Pauzeer video"}
    </button>
  );
}
