"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mobileExtra, nav } from "@/content/nova";

// Header + mobiel menu, gedrag gelijk aan render()/toggleMenu()/onScroll() uit het prototype.
const DONKER = ["", "experiences", "members", "lab", "demo", "one"];

export function SiteHeader() {
  const pathname = usePathname();
  const path = decodeURIComponent(pathname)
    .replace(/^\//, "")
    .replace(/\/$/, "");
  const dark =
    DONKER.includes(path) ||
    path.startsWith("work/") ||
    path.startsWith("spaces/") ||
    path.startsWith("experiences/");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Menu sluit bij elke routewissel (zoals render() deed).
  const [vorige, setVorige] = useState(pathname);
  if (vorige !== pathname) {
    setVorige(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cls = [
    "site-header",
    dark ? "dark" : "light",
    scrolled ? "scrolled" : "",
    open ? "nav-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={cls} id="header">
        <div className="header-inner">
          <Link aria-label="NOVA home" className="brand" href="/">
            NOVA<span>.</span>
          </Link>
          <nav className="primary-nav" id="primary" aria-label="Hoofdnavigatie">
            {nav.map(([titel, p]) => (
              <Link
                key={p}
                className={path === p ? "active" : ""}
                href={`/${p}`}
                aria-current={path === p ? "page" : undefined}
              >
                {titel}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="header-pill" href="/contact">
              Let&apos;s talk ↗
            </Link>
            <button
              aria-label={open ? "Sluit het menu" : "Open het menu"}
              aria-expanded={open}
              aria-controls="mobile"
              className="menu-toggle"
              id="menu-button"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "×" : "☰"}
            </button>
          </div>
        </div>
      </header>
      <nav
        className="mobile-nav"
        id="mobile"
        aria-label="Mobiel menu"
        style={{ display: open ? "block" : "none" }}
      >
        {[...nav, ...mobileExtra].map(([titel, p], i) => (
          <Link key={`${p}-${i}`} href={`/${p}`} onClick={() => setOpen(false)}>
            {titel} ↗
          </Link>
        ))}
        <p className="mob-note">NOVA · visuele demo voor Link & Lead One</p>
      </nav>
    </>
  );
}
