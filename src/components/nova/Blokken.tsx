import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { KERNBLOKKEN } from "@/content/kernblokken";
import { cmsMedia } from "@/lib/cms/client";
import { cmsRecords, getCases, getPartners, getPeople, getPosts } from "@/lib/cms/data";
import { goedgekeurdeReviews } from "@/lib/supabase/server";
import {
  voorbeeldKlanten,
  voorbeeldReviews,
  voorbeeldSlots,
  voorbeeldTestimonial,
  voorbeeldWedstrijden,
} from "@/content/voorbeelddata";
import { Aftelklok } from "./Aftelklok";
import { BlokGrens } from "./BlokGrens";
import { VideoAchtergrond } from "./VideoAchtergrond";
import { VIDEO } from "@/content/media";
import { persoonSlug } from "@/lib/slug";
import { CMS_MEDIA } from "@/content/cms-media";
import { merk } from "@/content/blauwdruk";
import type { Blok, PaginaInhoud } from "@/lib/cms/paginas";
import { AanvraagFormulier } from "./AanvraagFormulier";
import { DemoFormulier } from "./DemoFormulier";
import { DemoKnop } from "./DemoKnop";
import { TourStart } from "./DemoMode";
import { FormulierBouwer, ReviewFormulier } from "./LabFormulieren";
import { Configurator, Nps, Wissel } from "./LabInteractief";
import { WorkGrid } from "./WorkGrid";
import { VerhalenFilter } from "./VerhalenFilter";
import {
  Btn,
  EmptyState,
  Lines,
  PersonCard,
  PicCard,
  Photo,
  SectionLabel,
  SectionTitle,
  StoryCard,
} from "./ui";

// Rendert de blokken van een CMS-pagina met de NOVA-markup (klassen en volgorde uit het prototype).
// Elk bloktype en elk veld komt uit linkandlead-cms src/shared/blokregistry.ts; welke NOVA-vorm een
// blok krijgt, volgt uit de inhoud (bv. kaarten mét beeld en link = ruimtekaarten) en de pagina.
// Onbekende bloktypes worden overgeslagen (veilige terugval), nooit een kapotte pagina.

type Inhoud = Record<string, unknown>;
type Ctx = { slug: string; one: boolean; detail: boolean };

const tx = (c: Inhoud, k: string) => {
  const v = c[k];
  return typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
};
const lijst = (c: Inhoud, k: string): Inhoud[] =>
  Array.isArray(c[k]) ? (c[k] as unknown[]).filter((x): x is Inhoud => !!x && typeof x === "object") : [];
const nr = (n: number) => String(n).padStart(2, "0");
const media = (c: Inhoud, k: string) => cmsMedia(c[k]);
/** Links uit het CMS: interne paden, ankers en https; al het andere wordt genegeerd. */
const link = (c: Inhoud, k: string) => {
  const v = tx(c, k);
  return /^(\/|#|https:\/\/)/.test(v) ? v : "";
};

/** Tekstveld met regels die met "- " beginnen: die regels worden een lijst (chips of opsomming),
 *  de overige regels gewone alinea's. Zo blijft een opsomming in het CMS te beheren. */
function metLijst(tekst: string): { alineas: string[]; punten: string[] } {
  const regels = tekst.split("\n").map((r) => r.trim()).filter(Boolean);
  return {
    alineas: regels.filter((r) => !r.startsWith("- ")),
    punten: regels.filter((r) => r.startsWith("- ")).map((r) => r.slice(2).trim()),
  };
}

/** Sectiekop uit het titelveld. Voor blokken zonder eyebrow- of introveld: een eerste regel in
 *  HOOFDLETTERS wordt de eyebrow, regels na de titel worden de toelichting. Een eigen eyebrow- of
 *  introveld in het blok gaat voor. */
function kop(c: Inhoud, introVeld?: string): { eyebrow: string; title: string; desc: string } {
  const regels = tx(c, "titel").split("\n").map((r) => r.trim()).filter(Boolean);
  const isEyebrow = (r: string) => r.length <= 60 && /[A-ZÀ-Ý]/.test(r) && r === r.toLocaleUpperCase("nl");
  const eyebrow = regels.length > 1 && isEyebrow(regels[0]) ? regels.shift()! : "";
  const [titel = "", ...toelichting] = regels;
  return {
    eyebrow: tx(c, "eyebrow") || eyebrow,
    title: titel,
    desc: (introVeld ? tx(c, introVeld) : "") || toelichting.join(" "),
  };
}

/** Pictogrammen uit het CMS-veld "icoon" (kaarten, reeks), als typografische tekens in de NOVA-stijl. */
const ICOON: Record<string, string> = {
  doel: "◎",
  gesprek: "❝",
  groei: "↗",
  schakel: "⧉",
  klok: "◷",
  schild: "⛉",
  kompas: "✣",
  vonk: "✦",
  post: "✉",
  lijst: "☰",
};
const Icoon = ({ naam }: { naam: string }) =>
  ICOON[naam] ? (
    <span className="blok-icoon" aria-hidden="true">
      {ICOON[naam]}
    </span>
  ) : null;

const BG: Record<string, string> = {
  wit: "Licht",
  mist: "Zacht",
  limoenlicht: "Accent",
  diep: "Donker",
  nacht: "Diepst",
};
const NAAM = new Map(KERNBLOKKEN.filter((k) => k.cmsType).map((k) => [k.cmsType as string, k.naam]));
/** Label voor de Demo Mode-overlay ("Maak de blokken zichtbaar"). */
const label = (b: Blok) => [NAAM.get(b.type) ?? b.type, b.bg ? BG[b.bg] : ""].filter(Boolean).join(" · ");

const sectie = (bg: string | null) =>
  ["section", bg === "mist" ? "section-soft" : bg === "nacht" || bg === "diep" ? "section-dark" : bg === "limoenlicht" ? "section-lime" : ""]
    .filter(Boolean)
    .join(" ");

/** Kop met *accent* (→ <em> of limoen) en regeleinden. */
function Rijk({ tekst, accent = "em" }: { tekst: string; accent?: "em" | "limoen" }) {
  const delen = tekst.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {delen.map((d, i) =>
        d.startsWith("*") && d.endsWith("*") ? (
          accent === "em" ? (
            <em key={i}>
              <Lines text={d.slice(1, -1)} />
            </em>
          ) : (
            <span key={i} style={{ color: "var(--lime)" }}>
              <Lines text={d.slice(1, -1)} />
            </span>
          )
        ) : (
          <Fragment key={i}>
            <Lines text={d} />
          </Fragment>
        ),
      )}
    </>
  );
}

/** De NOVA-hero laat de afsluitende punt in limoen zien. */
function KopMetPunt({ tekst }: { tekst: string }) {
  if (tekst.includes("*")) return <Rijk tekst={tekst} accent="limoen" />;
  return tekst.endsWith(".") ? (
    <>
      <Lines text={tekst.slice(0, -1)} />
      <span style={{ color: "var(--lime)" }}>.</span>
    </>
  ) : (
    <Lines text={tekst} />
  );
}

// ---------- Header ----------
/** Knop uit de CMS-velden knop/knoptekst; anders de vaste NOVA-knop (alleen waar het ontwerp er een had). */
function BlokKnop({ c, vast, marge = 32 }: { c: Inhoud; vast?: { tekst: string; naar: string } | null; marge?: number }) {
  const naar = link(c, "knop") || vast?.naar;
  const tekst = tx(c, "knoptekst") || vast?.tekst;
  if (!naar || !tekst) return null;
  return (
    <div style={{ marginTop: marge }}>
      <Btn to={naar} cl="btn-dark">
        {tekst}
      </Btn>
    </div>
  );
}

/** Kruimelpad (CMS: kruimelpad, of auto_kruimelpad "aan" voor een pad uit het adres). */
function Kruimelpad({ c, ctx, donker }: { c: Inhoud; ctx: Ctx; donker: boolean }) {
  let delen = lijst(c, "kruimelpad")
    .map((k) => ({ titel: tx(k, "titel"), href: link(k, "href") }))
    .filter((k) => k.titel);
  if (!delen.length && tx(c, "auto_kruimelpad") === "aan" && ctx.slug !== "/") {
    const segmenten = ctx.slug.split("/").filter(Boolean);
    delen = [
      { titel: "Home", href: "/" },
      ...segmenten.slice(0, -1).map((seg, i) => {
        const href = "/" + segmenten.slice(0, i + 1).join("/");
        return { titel: merk.hoofd_nav.find((l) => l.href === href)?.titel ?? seg, href };
      }),
      { titel: tx(c, "heading").split("\n")[0].replace(/[.*]/g, "").trim(), href: "" },
    ];
  }
  if (!delen.length) return null;
  return (
    <nav aria-label="Kruimelpad" className={`kruimelpad${donker ? " donker" : ""}`}>
      <ol>
        {delen.map((d, i) => (
          <li key={d.titel + i}>
            {d.href && i < delen.length - 1 ? <Link href={d.href}>{d.titel}</Link> : <span aria-current="page">{d.titel}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Nieuwsbriefformulier in de header (CMS: extras "formulier", formulier_soort "nieuwsbrief"). */
function HeaderFormulier() {
  return (
    <DemoFormulier
      className="header-formulier"
      opslaan="nieuwsbrief"
      demoTekst="Dit is een voorbeeld van de aanmeldbevestiging. Er is geen inschrijving opgeslagen."
    >
      <label className="sr-only" htmlFor="header-nieuwsbrief">
        E-mailadres
      </label>
      <input id="header-nieuwsbrief" name="email" type="email" required placeholder="jij@voorbeeld.nl" autoComplete="email" />
      <label className="form-check" htmlFor="header-nieuwsbrief-akkoord">
        <input id="header-nieuwsbrief-akkoord" name="akkoord" type="checkbox" required />
        Ik wil de nieuwsbrief ontvangen en kan me later afmelden.
      </label>
      <button className="btn btn-lime">Aanmelden ↗</button>
    </DemoFormulier>
  );
}

/** Focuspunt (CMS: focal_x/focal_y, 0–100, standaard 50) als object-position. */
function focuspunt(c: Inhoud): string {
  const pct = (k: string) => {
    const n = Number(tx(c, k));
    return tx(c, k) && Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
  };
  return `${pct("focal_x")}% ${pct("focal_y")}%`;
}

function Header({ b, ctx, eerste = true }: { b: Blok; ctx: Ctx; eerste?: boolean }) {
  const c = b.content;
  // Alleen de eerste header van een pagina is de paginakop (h1); een volgende header is een sectie.
  const Kop = eerste ? "h1" : "h2";
  // Video (media_type "video"): alleen mp4/webm als achtergrond; YouTube/Vimeo passen niet in deze vorm.
  // De mobiele en middelgrote versie en de posters per video staan in src/content/media.ts. Het oude
  // adres op deze website zelf verwijst daar naar de CMS-bestanden.
  const ruweVideo = tx(c, "media_video").replace(/^https:\/\/demo\.linkandlead\.nl(?=\/media\/)/, "");
  const videoSrc =
    tx(c, "media_type") === "video" && /\.(mp4|webm)(\?|$)/i.test(ruweVideo) ? cmsMedia(ruweVideo) : "";
  const extra = VIDEO[ruweVideo] ?? {};
  const video = videoSrc ? (
    <VideoAchtergrond
      src={extra.src ?? videoSrc}
      mobielSrc={extra.mobiel}
      middelSrc={extra.middel}
      poster={media(c, "media_afbeelding") || extra.poster}
      mobielPoster={extra.mobielPoster}
      label={tx(c, "media_alt") || tx(c, "heading").replace(/\n/g, " ")}
      positie={focuspunt(c)}
      overlay={tx(c, "overlay")}
      direct={eerste}
    />
  ) : null;
  const beeld = media(c, "media_afbeelding");
  const alt = tx(c, "media_alt");
  const knop1 = link(c, "cta_primair_link");
  const knop2 = link(c, "cta_secundair_link");
  const knoppen =
    knop1 || knop2 ? (
      <div className={ctx.one ? "one-cta-row" : "hero-actions"}>
        {knop1 ? <Btn to={knop1}>{tx(c, "cta_primair_label")}</Btn> : null}
        {knop2 ? (
          <Link className="btn btn-outline" href={knop2}>
            {tx(c, "hoogte") === "fullscreen" ? (
              <>◉ &nbsp; {tx(c, "cta_secundair_label")}</>
            ) : (
              <>
                {tx(c, "cta_secundair_label")} <span className="arrow">↗</span>
              </>
            )}
          </Link>
        ) : null}
      </div>
    ) : null;
  const stats = tx(c, "extras") === "stats" ? lijst(c, "stats") : [];
  const formulier = tx(c, "extras") === "formulier" ? <HeaderFormulier /> : null;
  const meta = tx(lijst(c, "usps")[0] ?? {}, "tekst");

  if (tx(c, "hoogte") === "fullscreen")
    return (
      <section data-cms={label(b)} className="hero-home">
        {video ? (
          <div className="hero-visual">{video}</div>
        ) : beeld ? (
          <div className="hero-visual">
            <Photo src={beeld} alt={alt} priority />
          </div>
        ) : null}
        <div className="container hero-copy">
          <div className="eyebrow" style={{ color: "var(--lime)" }}>
            {tx(c, "eyebrow")}
          </div>
          <Kop className="hero-kop">
            <KopMetPunt tekst={tx(c, "heading")} />
          </Kop>
          {tx(c, "subheading") ? <p>{tx(c, "subheading")}</p> : null}
          {knoppen}
          {formulier}
        </div>
        <div className="hero-bottom">
          <div className="container">
            <div className="hero-stats">
              {stats.map((s) => (
                <div key={tx(s, "label")}>
                  <b>{tx(s, "waarde")}</b>
                  <small>{tx(s, "label")}</small>
                </div>
              ))}
            </div>
            <span className="scroll">SCROL OM TE ONTDEKKEN &nbsp; ↓</span>
          </div>
        </div>
      </section>
    );

  if (ctx.one)
    return (
      <section className="one-hero" data-cms={label(b)}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            {tx(c, "eyebrow")}
          </span>
          <Kop className="hero-kop">
            <Rijk tekst={tx(c, "heading")} accent="limoen" />
          </Kop>
          {tx(c, "subheading") ? <p className="one-intro">{tx(c, "subheading")}</p> : null}
          {knoppen}
          {formulier}
          {stats.length ? (
            <div className="one-proof">
              {stats.map((s) => (
                <div key={tx(s, "label")}>
                  <strong>{tx(s, "waarde")}</strong>
                  <small>{tx(s, "label")}</small>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    );

  if (tx(c, "layout") === "gecentreerd")
    return (
      <section data-cms={label(b)} className={`inner-hero hero-midden${b.bg === "nacht" || b.bg === "diep" ? " night" : ""}`}>
        <div className="container">
          <span className="eyebrow" style={b.bg === "nacht" || b.bg === "diep" ? { color: "var(--lime)" } : undefined}>
            {tx(c, "eyebrow")}
          </span>
          <Kop className="hero-kop">
            <KopMetPunt tekst={tx(c, "heading")} />
          </Kop>
          {tx(c, "subheading") ? <p className="hero-midden-tekst">{tx(c, "subheading")}</p> : null}
          {knoppen}
          {formulier}
        </div>
      </section>
    );

  if (tx(c, "layout") === "split-links" || tx(c, "layout") === "split-rechts") {
    const foto = beeld ? (
      <div className="image-frame intro-image">
        <Photo src={beeld} alt={alt} priority />
      </div>
    ) : null;
    const links = tx(c, "layout") === "split-links";
    return (
      <section data-cms={label(b)} className="section section-dark hero-split">
        <div className="container intro-grid">
          {links ? foto : null}
          <div>
            <span className="eyebrow" style={{ color: "var(--lime)" }}>
              {tx(c, "eyebrow")}
            </span>
            <Kop className="hero-kop">
              <KopMetPunt tekst={tx(c, "heading")} />
            </Kop>
            {tx(c, "subheading") ? <p>{tx(c, "subheading")}</p> : null}
            {knoppen}
          {formulier}
          </div>
          {links ? null : foto}
        </div>
      </section>
    );
  }

  if (tx(c, "layout") === "achtergrond") {
    const cls = ctx.detail ? "detail-hero" : "feature-media";
    return (
      <section data-cms={label(b)} className={video ? `${cls} met-video` : cls}>
        {video ?? (beeld ? <Photo src={beeld} alt={alt} priority={eerste} /> : null)}
        <div className="container copy">
          <Kruimelpad c={c} ctx={ctx} donker />
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            {tx(c, "eyebrow")}
          </span>
          <Kop className="hero-kop">
            <Lines text={tx(c, "heading")} />
          </Kop>
          {tx(c, "subheading") ? <p>{tx(c, "subheading")}</p> : null}
          {knoppen}
          {formulier}
        </div>
      </section>
    );
  }

  const donker = b.bg === "nacht" || b.bg === "diep";
  return (
    <section data-cms={label(b)} className={`inner-hero${donker ? " night" : ""}`}>
      <div className="container">
        <Kruimelpad c={c} ctx={ctx} donker={donker} />
        <span className="eyebrow" style={donker ? { color: "var(--lime)" } : undefined}>
          {tx(c, "eyebrow")}
        </span>
        <Kop className="hero-kop">
          <Lines text={tx(c, "heading")} />
        </Kop>
        {meta ? (
          <div className="hero-description">
            <span className="meta">{meta}</span>
            {tx(c, "subheading") ? <p>{tx(c, "subheading")}</p> : null}
          </div>
        ) : tx(c, "subheading") ? (
          <p style={{ maxWidth: 490, color: donker ? "#c0c7d8" : "#58626c" }}>{tx(c, "subheading")}</p>
        ) : null}
        {knoppen}
        {formulier}
        {beeld ? (
          <div className="lead-image image-frame">
            <Photo src={beeld} alt={alt} priority />
          </div>
        ) : null}
      </div>
    </section>
  );
}

// ---------- Tekst en beeld ----------
function Marquee({ b }: { b: Blok }) {
  const items = lijst(b.content, "items").map((i) => tx(i, "tekst")).filter(Boolean);
  return (
    <div data-cms={label(b)} className={`marquee marquee-${tx(b.content, "stijl") || "limoen"}`}>
      <div className="container">
        <span>{items.map((i) => `${i}  /  `).join(" ")}</span>
      </div>
    </div>
  );
}

function MediaTekst({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const beeld = media(c, "beeld");
  const alineas = lijst(c, "alineas").map((a) => tx(a, "tekst")).filter(Boolean);
  const punten = lijst(c, "punten").map((p) => tx(p, "tekst")).filter(Boolean);
  const knop = link(c, "knop");
  const links = tx(c, "beeldzijde") === "links";

  if (ctx.one) {
    const foto = beeld ? (
      <div className="one-shot">
        <Photo src={beeld} alt={tx(c, "beeld_alt")} />
      </div>
    ) : null;
    return (
      <section className={sectie(b.bg)} data-cms={label(b)}>
        <div className="container one-split">
          {links ? foto : null}
          <div>
            <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
            <h2 style={{ fontSize: "clamp(50px,6.5vw,90px)", lineHeight: 0.96, margin: "20px 0 25px" }}>
              <Rijk tekst={tx(c, "titel")} />
            </h2>
            {alineas.map((a) => (
              <p key={a}>{a}</p>
            ))}
            {knop ? (
              <div style={{ marginTop: 26 }}>
                <Btn to={knop} cl="btn-dark">
                  {tx(c, "knoptekst")}
                </Btn>
              </div>
            ) : null}
          </div>
          {links ? null : foto}
        </div>
      </section>
    );
  }

  const foto = beeld ? (
    <div className="image-frame intro-image">
      <Photo src={beeld} alt={tx(c, "beeld_alt")} />
      {punten.length === 1 ? <span className="image-tag">{punten[0]}</span> : null}
    </div>
  ) : null;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container intro-grid">
        {links ? foto : null}
        <div className="body-copy">
          <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
          <h2>
            <Rijk tekst={tx(c, "titel")} />
          </h2>
          {alineas.map((a) => (
            <p key={a}>{a}</p>
          ))}
          {punten.length > 1 ? (
            <ul className="kenmerken">
              {punten.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : null}
          {knop ? (
            <Btn to={knop} cl="btn-dark">
              {tx(c, "knoptekst")}
            </Btn>
          ) : null}
        </div>
        {links ? null : foto}
      </div>
    </section>
  );
}

function Statement({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const knop = link(c, "knop");
  if (ctx.one || b.bg === "diep")
    return (
      <section className="section one-dark" data-cms={label(b)}>
        <div className="container">
          <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
          <h2 style={{ fontSize: "clamp(55px,8vw,126px)", lineHeight: 0.98, maxWidth: 1020, margin: "24px 0" }}>
            <Rijk tekst={tx(c, "titel")} accent="limoen" />
          </h2>
          {metLijst(tx(c, "tekst")).alineas.map((a) => (
            <p key={a} style={{ maxWidth: 650 }}>
              {a}
            </p>
          ))}
          {metLijst(tx(c, "tekst")).punten.length ? (
            <div className="one-chip-row">
              {metLijst(tx(c, "tekst")).punten.map((p) => (
                <span className="one-chip" key={p}>
                  {p}
                </span>
              ))}
            </div>
          ) : null}
          {knop ? (
            <div style={{ marginTop: 30 }}>
              <Btn to={knop}>{tx(c, "knoptekst")}</Btn>
            </div>
          ) : null}
        </div>
      </section>
    );
  return (
    <section data-cms={label(b)} className="section section-dark statement">
      <div className="ring" />
      <div className="container">
        <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
        {tx(c, "cijfer") ? (
          <p className="stat-cijfer">
            <strong>{tx(c, "cijfer")}</strong> {tx(c, "cijfer_label")}
          </p>
        ) : null}
        <h2>
          <Rijk tekst={tx(c, "titel")} />
        </h2>
        {tx(c, "tekst") ? (
          <p style={{ maxWidth: 640, color: "#c9d2e1", fontSize: 17, marginBottom: knop ? 30 : 0 }}>{tx(c, "tekst")}</p>
        ) : null}
        {knop ? <Btn to={knop}>{tx(c, "knoptekst")}</Btn> : null}
      </div>
    </section>
  );
}

function Statistieken({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const items = lijst(c, "items");
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        <div className={`stats-grid${items.length === 4 ? " stats-4" : ""}`}>
          {items.map((s) => (
            <div className="stat" key={tx(s, "label")}>
              <strong>
                {tx(s, "voorvoegsel")}
                {tx(s, "waarde")}
                {tx(s, "achtervoegsel")}
              </strong>
              <p>{tx(s, "label")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Feiten({ b }: { b: Blok }) {
  return (
    <div className="container mini-info" data-cms={label(b)}>
      {lijst(b.content, "feiten").map((f) => (
        <div key={tx(f, "label")}>
          <span>{tx(f, "label")}</span>
          <strong>{tx(f, "waarde")}</strong>
        </div>
      ))}
    </div>
  );
}

function Flexibel({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const items = lijst(c, "items");
  // Op een projectpagina leidt de tekst terug naar het overzicht (het blok heeft geen knopveld).
  const terug = (
    <BlokKnop c={c} marge={0} vast={ctx.slug.startsWith("/work/") ? { tekst: "Bekijk meer projecten", naar: "/work" } : null} />
  );
  if (tx(c, "kolommen") === "1")
    return (
      <section data-cms={label(b)} className={sectie(b.bg)}>
        <div className="container detail-split">
          <p className="pullquote">{tx(c, "titel")}</p>
          <div className="body-copy">
            {items.map((i) => (
              <div key={tx(i, "kop") + tx(i, "tekst").slice(0, 20)}>
                {tx(i, "kop") ? <span className="eyebrow body-kop">{tx(i, "kop")}</span> : null}
                <p>{tx(i, "tekst")}</p>
              </div>
            ))}
            {terug}
          </div>
        </div>
      </section>
    );
  const kaarten = ctx.one ? (
    <div className="one-benefits">
      {items.map((i, k) => (
        <div className="one-benefit" key={tx(i, "kop")}>
          <span className="one-index">{nr(k + 1)}</span>
          <h3>{tx(i, "kop")}</h3>
          <p>{tx(i, "tekst")}</p>
        </div>
      ))}
    </div>
  ) : (
    <div className={tx(c, "kolommen") === "4" ? "card-3 card-4" : tx(c, "kolommen") === "2" ? "card-3 card-2" : "card-3"}>
      {items.map((i) => (
        <div className="info-tile" key={tx(i, "kop")}>
          <strong>{tx(i, "kop")}</strong>
          <p>{tx(i, "tekst")}</p>
        </div>
      ))}
    </div>
  );
  return (
    <section className={sectie(b.bg)} data-cms={label(b)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        {kaarten}
        <BlokKnop c={c} />
      </div>
    </section>
  );
}

function Kaarten({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const items = lijst(c, "items");
  const titel = tx(c, "titel") ? (
    <SectionTitle num={nr(n)} {...kop(c, "intro")} />
  ) : null;
  const metBeeld = items.some((i) => media(i, "beeld"));

  // Ruimtekaarten: beeld, tekst en link.
  if (metBeeld && items.every((i) => tx(i, "tekst") && link(i, "link")))
    return (
      <section data-cms={label(b)} className={sectie(b.bg)} style={{ paddingTop: 0 }}>
        <div className="container">
          {items.map((i, k) => (
            <Link className="space-card" href={link(i, "link")} key={tx(i, "titel")}>
              <div className="photo">
                <Photo src={media(i, "beeld")} alt={tx(i, "beeld_alt")} />
              </div>
              <div className="copy">
                <span className="eyebrow">
                  {nr(k + 1)} / {tx(c, "eyebrow")}
                </span>
                <h3>{tx(i, "titel")}.</h3>
                <p>{tx(i, "tekst")}</p>
                {/* Geen <a> in een <a>: de knopvorm als span binnen de kaartlink. */}
                <span className="btn btn-dark">
                  {tx(i, "knoptekst")}
                  <span className="arrow">↗</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );

  // Mozaïek: alleen beelden met een bijschrift.
  if (metBeeld)
    return (
      <section data-cms={label(b)} className={sectie(b.bg)} style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="community-mosaic">
            {items.map((i) => {
              const inhoud = (
                <>
                  <Photo src={media(i, "beeld")} alt={tx(i, "beeld_alt")} />
                  <div className="image-overlay" />
                  <div className="image-caption">
                    <h3>{tx(i, "titel")}</h3>
                    {link(i, "link") ? (
                      <span className="circle-arrow" aria-hidden="true">
                        ↗
                      </span>
                    ) : null}
                  </div>
                </>
              );
              return link(i, "link") ? (
                <Link className="image-frame" href={link(i, "link")} key={tx(i, "titel")}>
                  {inhoud}
                </Link>
              ) : (
                <div className="image-frame" key={tx(i, "titel")}>
                  {inhoud}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );

  // Doorverwijzingen: tegels die zelf een link zijn.
  if (items.length && items.every((i) => link(i, "link")))
    return (
      <section data-cms={label(b)} className={sectie(b.bg)}>
        <div className="container">
          {titel}
          <div className="showcase-table">
            {items.map((i) => (
              <Link className="showcase-tile" href={link(i, "link")} key={tx(i, "titel")}>
                <span className="eyebrow">{tx(i, "tekst")}</span>
                <h3>{tx(i, "titel")}</h3>
                <span className="meta">{tx(i, "knoptekst")} ↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );

  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        {titel}
        {ctx.one ? (
          <div className="one-benefits">
            {items.map((i) => (
              <div className="one-benefit" key={tx(i, "titel")}>
                <span className="one-index">{tx(i, "knoptekst")}</span>
                <h3>{tx(i, "titel")}</h3>
                <p>{tx(i, "tekst")}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={tx(c, "kolommen") === "4" ? "card-3 card-4" : "card-3"}>
            {items.map((i) => (
              <div className="info-tile" key={tx(i, "titel")}>
                {tx(i, "knoptekst") || tx(i, "icoon") ? (
                  <span className="eyebrow">
                    <Icoon naam={tx(i, "icoon")} />
                    {tx(i, "knoptekst")}
                  </span>
                ) : null}
                <strong>{tx(i, "titel")}</strong>
                <p>{tx(i, "tekst")}</p>
              </div>
            ))}
          </div>
        )}
        <BlokKnop
          c={c}
          marge={30}
          vast={ctx.detail && ctx.slug.startsWith("/spaces/") ? { tekst: "Probeer de configurator", naar: "/lab" } : null}
        />
      </div>
    </section>
  );
}

/** Bijschrift bij een portfoliobeeld: alleen als het CMS-item sector, jaar, resultaat of omschrijving heeft. */
function Bijschrift({ i }: { i: Inhoud }) {
  const meta = [tx(i, "sector"), tx(i, "jaar")].filter(Boolean).join(" · ");
  const tekst = tx(i, "resultaat") || tx(i, "omschrijving");
  if (!meta && !tekst) return null;
  const inhoud = (
    <>
      {meta ? <span className="meta">{meta}</span> : null}
      <strong>{tx(i, "titel")}</strong>
      {tekst ? <span>{tekst}</span> : null}
    </>
  );
  return (
    <figcaption className="portfolio-bijschrift">
      {link(i, "link") ? <Link href={link(i, "link")}>{inhoud}</Link> : inhoud}
    </figcaption>
  );
}

function Portfolio({ b }: { b: Blok }) {
  const items = lijst(b.content, "items").filter((i) => media(i, "beeld"));
  const [eerste, ...rest] = items;
  if (!eerste) return null;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)} style={{ paddingTop: 0 }}>
      <div className="container">
        <figure style={{ margin: 0 }}>
          <div className="wide-photo">
            <Photo src={media(eerste, "beeld")} alt={tx(eerste, "alt")} />
          </div>
          <Bijschrift i={eerste} />
        </figure>
        {rest.length ? (
          <div className="card-3" style={{ marginTop: 14 }}>
            {rest.map((i) => (
              <figure style={{ margin: 0 }} key={media(i, "beeld")}>
                <div className="image-frame" style={{ height: 300 }}>
                  <Photo src={media(i, "beeld")} alt={tx(i, "alt")} />
                </div>
                <Bijschrift i={i} />
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Reeks({ b, n }: { b: Blok; n: number }) {
  // "Label rechts" geldt als toelichting als er geen intro is.
  const c: Inhoud = { ...b.content, intro: tx(b.content, "intro") || tx(b.content, "label_rechts") };
  const stappen = lijst(c, "stappen");

  // Rondleiding: stappen die naar een pagina leiden, zonder tekst.
  if (stappen.length && stappen.every((s) => link(s, "link") && !tx(s, "tekst")))
    return (
      <section className={sectie(b.bg)} data-cms={label(b)}>
        <div className="container">
          <div className="demo-launch">
            <div>
              <span className="eyebrow" style={{ color: "var(--lime)" }}>
                {tx(c, "eyebrow")}
              </span>
              <h2>{tx(c, "titel")}</h2>
              {tx(c, "intro") ? <p>{tx(c, "intro")}</p> : null}
              {tx(c, "knoptekst_reeks") ? (
                <div style={{ marginTop: 25 }}>
                  <TourStart>{tx(c, "knoptekst_reeks")}</TourStart>
                </div>
              ) : null}
            </div>
            <div className="steps">
              {stappen.map((s, i) => (
                <Link className="step" key={tx(s, "titel")} href={link(s, "link")}>
                  <span>{nr(i + 1)}</span> {tx(s, "titel")} <b aria-hidden="true">↗</b>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    );

  // Programma: stappen met een label (tijd/dag); "titel" groepeert per dag.
  if (stappen.some((s) => tx(s, "label"))) {
    const groepen: Array<{ titel: string; rijen: Inhoud[] }> = [];
    for (const s of stappen) {
      const g = tx(s, "titel");
      const laatste = groepen[groepen.length - 1];
      if (laatste && laatste.titel === g) laatste.rijen.push(s);
      else groepen.push({ titel: g, rijen: [s] });
    }
    return (
      <section data-cms={label(b)} className={sectie(b.bg)}>
        <div className="container">
          <SectionTitle num={nr(n)} {...kop(c, "intro")} />
          <div className="schedule">
            <div>
              {groepen.map((g, k) => (
                <div key={g.titel + k} style={groepen.length > 1 ? { marginBottom: 28 } : undefined}>
                  {g.titel ? <span className="eyebrow">{g.titel}</span> : null}
                  {g.rijen.map((r) => (
                    <div className="schedule-row" key={tx(r, "label") + tx(r, "tekst")}>
                      <strong>{tx(r, "label")}</strong>
                      <span>{tx(r, "tekst")}</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="image-frame" style={{ height: 360 }}>
              <Photo src={CMS_MEDIA.event_gradient ?? "event_gradient"} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        <div className={`timeline${tx(c, "_vorm") ? ` reeks-${tx(c, "_vorm")}` : ""}`}>
          {stappen.map((s, i) => (
            <div className="timeline-item" key={tx(s, "titel") + i}>
              <strong>
                <Icoon naam={tx(s, "icoon")} />
                {tx(s, "sleutel") || tx(s, "nummer") || nr(i + 1)}
              </strong>
              <h3>{tx(s, "titel") || tx(s, "naam")}</h3>
              <p>{tx(s, "tekst")}</p>
              {tx(s, "belofte") ? <p className="reeks-belofte">{tx(s, "belofte")}</p> : null}
            </div>
          ))}
        </div>
        {lijst(c, "uitkomsten").length ? (
          <div className="chip-row" style={{ marginTop: 24 }}>
            {lijst(c, "uitkomsten").map((u) => (
              <span className="chip" key={tx(u, "label")}>
                {tx(u, "label")}
              </span>
            ))}
          </div>
        ) : null}
        {tx(c, "slotregel") ? <p className="reeks-slot">{tx(c, "slotregel")}</p> : null}
      </div>
    </section>
  );
}

function Faq({ b, n }: { b: Blok; n: number }) {
  return (
    <section className={sectie(b.bg)} data-cms={label(b)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(b.content)} />
        <div className="faq-lijst">
          {lijst(b.content, "vragen").map((v) => (
            <details key={tx(v, "vraag")}>
              <summary>{tx(v, "vraag")}</summary>
              <p>{tx(v, "antwoord")}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Overgang({ b, ctx }: { b: Blok; ctx: Ctx }) {
  // Eerste regel = kop, volgende regels = toelichting.
  const [kop, ...rest] = tx(b.content, "tekst").split("\n").map((r) => r.trim()).filter(Boolean);
  if (!kop) return null;
  return (
    <section className="section" style={{ padding: "0 0 40px" }} data-cms={label(b)}>
      <div className="container">
        <div className={`one-promo-ribbon${tx(b.content, "stijl") === "donker" ? " donker" : ""}`}>
          <div>
            <strong>{kop}</strong>
            {rest.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
          {ctx.one ? (
            <Link href="/demo" className="btn btn-dark">
              Open de demo <span className="arrow">↗</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Een cta midden op de pagina; de laatste cta is de afsluitende oproep (Footer). */
function Cta({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const knop = link(c, "knop");
  const meta = lijst(c, "meta").map((m) => tx(m, "tekst")).filter(Boolean);
  return (
    <section className="one-end" data-cms={label(b)}>
      <div className="container">
        <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
        <h2>
          <Rijk tekst={tx(c, "titel")} />
        </h2>
        {tx(c, "tekst") ? <p style={{ maxWidth: 620, marginTop: 20 }}>{tx(c, "tekst")}</p> : null}
        {knop ? (
          <div className="one-cta-row">
            <Btn to={knop} cl="btn-dark">
              {tx(c, "knoptekst")}
            </Btn>
            {knop !== "/demo" ? (
              <Link className="btn btn-outline" style={{ color: "var(--night)" }} href="/demo">
                Start de rondleiding <span className="arrow">↗</span>
              </Link>
            ) : null}
          </div>
        ) : null}
        {meta.map((m) => (
          <p className="one-honest" key={m}>
            {m}
          </p>
        ))}
      </div>
    </section>
  );
}

// ---------- Collecties ----------
async function CasesGrid({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const { items: alle } = await getCases();
  const sector = tx(c, "filter_sector").toUpperCase();
  const cases = sector ? alle.filter((x) => x.type === sector) : alle;
  const max = Number(c.maximaal) || 3;
  const overzicht = link(c, "link_naar_overzicht");

  if (max > 3)
    return (
      <section data-cms={label(b)} className={sectie(b.bg)} style={{ paddingTop: 0 }}>
        <div className="container">
          <WorkGrid cases={cases.slice(0, max)} />
        </div>
      </section>
    );
  // Ontwerp: één grote en twee kleinere kaarten (case 2, 1 en 4 uit de collectie).
  const uitgelicht = cases.length >= 4 ? [cases[1], cases[0], cases[3]] : cases.slice(0, max);
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c)} />
        {uitgelicht.length ? (
          <div className="portfolio-grid">
            {uitgelicht.map((x, i) => (
              <PicCard key={x.slug} item={x} large={i === 0} />
            ))}
          </div>
        ) : (
          <EmptyState>Er zijn nog geen projecten toegevoegd.</EmptyState>
        )}
        {overzicht && overzicht !== ctx.slug ? (
          <div style={{ marginTop: 33 }}>
            <Btn to={overzicht} cl="btn-dark">
              Bekijk alle projecten
            </Btn>
          </div>
        ) : null}
      </div>
    </section>
  );
}

async function ArtikelenGrid({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const { items: alle } = await getPosts();
  const rubriek = tx(c, "filter_rubriek").toUpperCase();
  const posts = (rubriek ? alle.filter((p) => p.cat === rubriek) : alle).slice(0, Number(c.maximaal) || 3);

  if (ctx.slug === "/journal") {
    const [uitgelicht, ...rest] = posts;
    return (
      <>
        {uitgelicht ? (
          <section data-cms="Artikelen · uitgelicht" className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <Link href={`/journal/${uitgelicht.slug}`} className="featured-story">
                <div className="photo">
                  <Photo src={uitgelicht.cover} alt={uitgelicht.title} />
                </div>
                <div className="copy">
                  <span className="eyebrow">UITGELICHT VERHAAL / {uitgelicht.cat}</span>
                  <div>
                    <h2>{uitgelicht.title}.</h2>
                    {uitgelicht.lead ? <p style={{ marginTop: 20 }}>{uitgelicht.lead}</p> : null}
                  </div>
                  <span className="meta">LEES HET ARTIKEL &nbsp; ↗</span>
                </div>
              </Link>
            </div>
          </section>
        ) : null}
        <section data-cms={label(b)} className={sectie(b.bg)}>
          <div className="container">
            <SectionTitle num={nr(n)} {...kop(c)} />
            {rest.length ? (
              <VerhalenFilter posts={rest} />
            ) : (
              <EmptyState>
                {posts.length ? "Dit is op dit moment het enige artikel." : "Er zijn nog geen artikelen gepubliceerd."}
              </EmptyState>
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c)} />
        {posts.length ? (
          <div className="article-grid">
            {posts.map((p) => (
              <StoryCard key={p.slug} post={p} />
            ))}
          </div>
        ) : (
          <EmptyState>Er zijn nog geen artikelen gepubliceerd.</EmptyState>
        )}
        <BlokKnop c={c} marge={34} vast={ctx.slug === "/" ? { tekst: "Lees de verhalen", naar: "/journal" } : null} />
      </div>
    </section>
  );
}

async function Mensen({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const { items } = await getPeople();
  const mensen = items.slice(0, Number(c.maximaal) || 4);
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        {mensen.length ? (
          <div className="people-grid">
            {mensen.map((p) => (
              <div key={p.name}>
                <PersonCard p={p} href={`/mensen/${persoonSlug(p.name)}`} />
                {p.bio && ctx.slug !== "/" ? <p className="person-bio">{p.bio}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>Er zijn nog geen teamleden beschikbaar.</EmptyState>
        )}
        <BlokKnop c={c} vast={ctx.slug === "/" ? { tekst: "Ontmoet de makers", naar: "/community" } : null} />
      </div>
    </section>
  );
}

async function Sprekers({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const team = await teamSlugs();
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "sub")} />
        <div className="people-grid">
          {lijst(c, "items").map((s) => (
            <PersonCard
              key={tx(s, "naam")}
              p={{ name: tx(s, "naam"), role: tx(s, "tekst"), cover: media(s, "foto"), alt: tx(s, "foto_alt") || undefined }}
              prefix="Spreker · "
              href={team.has(persoonSlug(tx(s, "naam"))) ? `/mensen/${persoonSlug(tx(s, "naam"))}` : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

async function teamSlugs(): Promise<Set<string>> {
  return new Set((await getPeople()).items.map((p) => persoonSlug(p.name)));
}

async function PartnersGrid({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const { items } = await getPartners();
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        {tx(c, "toon_filter") === "ja" && items.length ? (
          <div className="chip-row" style={{ marginBottom: 22 }} aria-label="Filter op branche (voorbeeld)">
            <span className="chip active">Alle partners</span>
            {[...new Set(items.map((p) => p.vak).filter(Boolean))].map((v) => (
              <span className="chip" key={v}>
                {v}
              </span>
            ))}
          </div>
        ) : null}
        {items.length ? (
          <div className="card-3 card-4">
            {items.map((p) => (
              <Link className="info-tile partner-tegel" href={`/partners/${p.slug}`} key={p.naam}>
                <span className="eyebrow">{p.vak}</span>
                <strong>{p.naam}</strong>
                <p>
                  {p.tekst} <span className="meta">Meer ↗</span>
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState>Er zijn nog geen partners toegevoegd.</EmptyState>
        )}
      </div>
    </section>
  );
}

async function PartnerUitgelicht({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const { items } = await getPartners();
  const p = items.find((x) => x.uitgelicht) ?? items[0];
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c)} />
        <div className="detail-split">
          <p className="pullquote">{p?.quote || (p ? `${p.naam}.` : kop(c).title)}</p>
          <div className="body-copy">
            {metLijst(tx(c, "intro")).alineas.map((a) => (
              <p key={a}>{a}</p>
            ))}
            {p?.quote && p.tekst ? <p>{p.tekst}</p> : null}
            {p ? (
              <p>
                <Link href={`/partners/${p.slug}`} className="meta" style={{ textDecoration: "underline" }}>
                  Meer over {p.naam} ↗
                </Link>
              </p>
            ) : null}
            <BlokKnop c={c} marge={0} vast={ctx.slug === "/community" ? { tekst: "Lees over onze aanpak", naar: "/about" } : null} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Citaten({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c)} />
        <div className="card-3">
          {lijst(c, "items").map((q, i) => (
            <div className="info-tile" key={tx(q, "naam") + i}>
              <span className="eyebrow">{tx(q, "organisatie") || kop(c).eyebrow || `CITAAT ${nr(i + 1)}`}</span>
              <strong style={{ fontSize: 23 }}>“{tx(q, "citaat")}”</strong>
              <p>— {[tx(q, "naam"), tx(q, "functie")].filter(Boolean).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Prijskaarten({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  // Intro: eerste regel naast de kop, volgende regels als opmerking onder de kaarten.
  const [intro, ...opmerking] = tx(c, "intro").split("\n").map((r) => r.trim()).filter(Boolean);
  const kopProps = { ...kop(c), desc: intro ?? "" };
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kopProps} />
        <div className="tickets">
          {lijst(c, "items").map((t) => {
            const featured = tx(t, "accent") === "ja";
            const knop = link(t, "knop");
            return (
              <div className={`ticket${featured ? " featured" : ""}`} key={tx(t, "naam")}>
                <div>
                  {tx(t, "badge") ? <span className="eyebrow">{tx(t, "badge")}</span> : null}
                  <h3 style={{ marginTop: 13 }}>{tx(t, "naam")}</h3>
                  <p style={{ marginTop: 12 }}>{tx(t, "voordeel")}</p>
                  {tx(t, "incl") ? (
                    <ul className="ticket-incl">
                      {tx(t, "incl")
                        .split("\n")
                        .map((r) => r.replace(/^[-•]\s*/, "").trim())
                        .filter(Boolean)
                        .map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                    </ul>
                  ) : null}
                </div>
                <div>
                  <strong>
                    {tx(t, "prijs")}
                    {tx(t, "eenheid") ? <small> {tx(t, "eenheid")}</small> : null}
                  </strong>
                  {knop ? (
                    <div style={{ marginTop: 15 }}>
                      <Btn to={knop} cl="btn-dark">
                        {tx(t, "knoptekst")}
                      </Btn>
                    </div>
                  ) : tx(t, "knoptekst") ? (
                    <DemoKnop
                      style={{ display: "flex", marginTop: 15 }}
                      melding="Dit is een visueel ontwerp. Er worden geen tickets verkocht en er vindt geen betaling plaats."
                    >
                      {tx(t, "knoptekst")} ↗
                    </DemoKnop>
                  ) : null}
                  {link(t, "knop2") && tx(t, "knoptekst2") ? (
                    <Link className="meta ticket-knop2" href={link(t, "knop2")}>
                      {tx(t, "knoptekst2")} ↗
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        {opmerking.length ? (
          <p className={b.bg === "nacht" || b.bg === "diep" ? "ticket-noot" : "demo-note"} style={{ marginTop: 20 }}>
            {opmerking.join(" ")}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function Tabel({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const rijen = lijst(c, "rijen");
  const kolommen = lijst(c, "kolommen").map((k) => tx(k, "label"));
  // Uitgelichte rij: de rij die de tekst uit "markeer" bevat, anders de eerste.
  // c3 = korte kop, c4 = toelichting, c5 = label (bv. THUIS).
  const markeer = tx(c, "markeer").toLowerCase();
  const uit =
    (markeer && rijen.find((r) => ["c1", "c2", "c3", "c4", "c5", "c6"].some((k) => tx(r, k).toLowerCase().includes(markeer)))) ||
    rijen[0];
  const [wedstrijd, ...details] = tx(uit ?? {}, "c2").split(" · ");
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        {uit ? (
          <div className="featured-story" style={{ background: "#dff29e", minHeight: 300, color: "var(--night)" }}>
            <div style={{ padding: 60 }}>
              <span className="eyebrow">{[kop(c).eyebrow, tx(uit, "c5")].filter(Boolean).join(" / ")}</span>
              <h2 style={{ fontSize: "clamp(44px,6vw,80px)", marginTop: 15 }}>{tx(uit, "c3") || wedstrijd}</h2>
              <p style={{ fontSize: 15, color: "#1b2b3c", marginTop: 15 }}>
                {tx(uit, "c4") || [tx(uit, "c1"), ...details].join(" · ")}
              </p>
            </div>
            <div style={{ padding: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 150, fontWeight: 950, letterSpacing: "-.1em" }} aria-hidden="true">
                N<span style={{ color: "#738900" }}>.</span>
              </div>
            </div>
          </div>
        ) : null}
        <div className="schedule" style={{ marginTop: 40 }}>
          <div>
            {kolommen[1] && kolommen[1].length > 12 ? (
              <span className="eyebrow">
                {nr(n + 1)} / {kolommen[1]}
              </span>
            ) : null}
            {rijen.map((r) => (
              <div className="schedule-row" key={tx(r, "c1") + tx(r, "c2")}>
                <strong>{tx(r, "c1")}</strong>
                <span>{tx(r, "c2")}</span>
                <span aria-hidden="true">↗</span>
              </div>
            ))}
          </div>
          {tx(c, "voettekst") ? <div className="demo-note">{tx(c, "voettekst")}</div> : null}
        </div>
      </div>
    </section>
  );
}

// ---------- Formulieren en interactie ----------
const ONDERWERPEN = [
  "Een project",
  "Een evenement",
  "Een ruimte",
  "Een samenwerking",
  "Demonstratie van Link & Lead One",
  "Iets anders",
];

function Contactformulier({ c }: { c: Inhoud }) {
  return (
    <DemoFormulier
      className="form-grid"
      opslaan="contact"
      bevestiging={tx(c, "bevestigingstekst")}
      naVerzenden={link(c, "na_verzenden") || undefined}
      demoTekst="Dit is de bevestigingsweergave. Je bericht is niet verzonden omdat er geen database is ingesteld."
    >
      <div className="form-field">
        <label htmlFor="first-name">Voornaam *</label>
        <input id="first-name" name="naam" required placeholder="Bijvoorbeeld Sam" autoComplete="given-name" />
      </div>
      <div className="form-field">
        <label htmlFor="last-name">Achternaam</label>
        <input id="last-name" name="achternaam" placeholder="Bijvoorbeeld De Vries" autoComplete="family-name" />
      </div>
      <div className="form-field">
        <label htmlFor="email">Zakelijk e-mailadres *</label>
        <input id="email" name="email" type="email" required placeholder="naam@organisatie.nl" autoComplete="email" />
      </div>
      <div className="form-field">
        <label htmlFor="organisatie">Organisatie</label>
        <input id="organisatie" name="bedrijf" placeholder="Naam van je organisatie" autoComplete="organization" />
      </div>
      <div className="form-field full">
        <label htmlFor="interest">Waar gaat je vraag over? *</label>
        <select id="interest" name="onderwerp" required defaultValue="">
          <option value="" disabled>
            Kies een onderwerp
          </option>
          {ONDERWERPEN.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="form-field full">
        <label htmlFor="message">Vertel ons meer *</label>
        <textarea id="message" name="vraag" placeholder="Wat wil je maken of weten?" required minLength={10} />
      </div>
      <div className="form-field full">
        <label className="form-check" htmlFor="contact-akkoord">
          <input id="contact-akkoord" name="akkoord" type="checkbox" required />
          {tx(c, "voetnoot") || "Ik ga akkoord met het verwerken van mijn gegevens."}
        </label>
      </div>
      <div className="form-field full">
        <button className="btn btn-dark" style={{ width: "fit-content" }}>
          {tx(c, "knoptekst") || "Verstuur"} ↗
        </button>
      </div>
    </DemoFormulier>
  );
}

function Formulier({ b, ctx, n, kaart }: { b: Blok; ctx: Ctx; n: number; kaart?: Blok }) {
  const c = b.content;
  if (tx(c, "soort") === "nieuwsbrief")
    return (
      <section data-cms={label(b)} className="section section-lime">
        <div
          className="container"
          style={{ display: "flex", justifyContent: "space-between", gap: 30, alignItems: "end", flexWrap: "wrap" }}
        >
          <div>
            <span className="eyebrow">{tx(c, "eyebrow")}</span>
            <h2 style={{ fontSize: "clamp(55px,7vw,108px)", lineHeight: 0.96, maxWidth: 720 }}>{tx(c, "titel")}</h2>
            {tx(c, "intro") ? <p style={{ marginTop: 20, maxWidth: 520 }}>{tx(c, "intro")}</p> : null}
          </div>
          <DemoFormulier
            opslaan="nieuwsbrief"
            bevestiging={tx(c, "bevestigingstekst")}
            naVerzenden={link(c, "na_verzenden") || undefined}
            demoTekst="Dit is een voorbeeld van de aanmeldbevestiging. Er is geen inschrijving opgeslagen."
          >
            <div className="form-field">
              <label htmlFor="newsletter">E-mailadres</label>
              <input
                type="email"
                id="newsletter"
                name="email"
                placeholder="jij@voorbeeld.nl"
                required
                autoComplete="email"
                style={{ minWidth: 250 }}
              />
            </div>
            <label className="form-check" htmlFor="nieuwsbrief-akkoord">
              <input id="nieuwsbrief-akkoord" name="akkoord" type="checkbox" required />
              {tx(c, "voetnoot")}
            </label>
            <button className="btn btn-dark" style={{ marginTop: 10 }}>
              {tx(c, "knoptekst")} ↗
            </button>
          </DemoFormulier>
        </div>
      </section>
    );

  if (tx(c, "soort") === "scan_url")
    return (
      <section data-cms={label(b)} className={sectie(b.bg)}>
        <div className="container contact-layout">
          <div>
            <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
            <h2 style={{ marginTop: 18 }}>{tx(c, "titel")}</h2>
            {tx(c, "intro") ? <p className="side-note">{tx(c, "intro")}</p> : null}
          </div>
          <DemoFormulier
            className="form-grid"
            demoTekst="Dit is een voorbeeld van de scan. Er is geen website opgehaald of gecontroleerd."
          >
            <div className="form-field full">
              <label htmlFor="scan-url">Websiteadres *</label>
              <input id="scan-url" name="url" type="url" required placeholder="https://www.jouwwebsite.nl" />
            </div>
            <div className="form-field full">
              <button className="btn btn-dark" style={{ width: "fit-content" }}>
                {tx(c, "knoptekst") || "Scan mijn website"} ↗
              </button>
            </div>
          </DemoFormulier>
        </div>
      </section>
    );

  // Op de CMS-promotiepagina is het formulier de demo-aanvraag voor Link & Lead One.
  if (ctx.one)
    return (
      <section className="section section-soft one-aanvraag" id="aanvraag" data-cms={label(b)}>
        <div className="container contact-layout">
          <div>
            <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
            <h2 style={{ marginTop: 18 }}>{tx(c, "titel")}</h2>
            {metLijst(tx(c, "intro")).alineas.map((a) => (
              <p className="side-note" key={a}>
                {a}
              </p>
            ))}
            {metLijst(tx(c, "intro")).punten.length ? (
              <ul style={{ listStyle: "none", padding: 0, marginTop: 24, display: "grid", gap: 8 }}>
                {metLijst(tx(c, "intro")).punten.map((p) => (
                  <li className="info-tile" key={p} style={{ minHeight: 0, padding: "14px 18px", fontSize: 14 }}>
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
            {process.env.DEMO_AANVRAAG_URL?.trim().startsWith("https://") ? (
              <div style={{ marginTop: 24 }}>
                <a className="btn btn-outline" href={process.env.DEMO_AANVRAAG_URL.trim()} rel="noopener">
                  Plan direct een afspraak <span className="arrow">↗</span>
                </a>
              </div>
            ) : null}
          </div>
          <div>
            <AanvraagFormulier knoptekst={tx(c, "knoptekst") || undefined} voetnoot={tx(c, "voetnoot") || undefined} />
          </div>
        </div>
      </section>
    );

  const k = kaart?.content;
  return (
    <section data-cms={kaart ? `${label(b)} · ${label(kaart)}` : label(b)} className={sectie(b.bg)} style={{ paddingTop: 25 }}>
      <div className="container contact-layout">
        <div>
          <span className="eyebrow">{tx(c, "eyebrow")}</span>
          <h2>{tx(c, "titel")}</h2>
          {tx(c, "intro") ? <p className="side-note">{tx(c, "intro")}</p> : null}
          {k ? (
            <div style={{ marginTop: 70 }}>
              <span className="eyebrow">{tx(k, "eyebrow")}</span>
              <h3 style={{ fontSize: 30, margin: "12px 0" }}>{tx(k, "titel")}</h3>
              {tx(k, "intro") ? <p style={{ maxWidth: 380, color: "#596476" }}>{tx(k, "intro")}</p> : null}
              <Adres c={k} />
            </div>
          ) : null}
        </div>
        <div>
          <Contactformulier c={c} />
          <p className="demo-note" style={{ marginTop: 25 }}>
            Je bericht wordt opgeslagen in de NOVA-demodatabase. Er wordt geen e-mail verstuurd.
          </p>
        </div>
      </div>
    </section>
  );
}

function Adres({ c }: { c: Inhoud }) {
  const regels = [tx(c, "adres"), tx(c, "telefoon"), tx(c, "email")].filter(Boolean);
  return regels.length ? (
    <p style={{ marginTop: 12, color: "#596476" }}>
      {regels.map((r, i) => (
        <Fragment key={r}>
          {i > 0 && <br />}
          {r}
        </Fragment>
      ))}
    </p>
  ) : null;
}

function Kaart({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        <div className="kaart-blok">
          <div className="kaart-visual" role="img" aria-label="Kaartweergave (illustratie)">
            <span className="kaart-pin" aria-hidden="true" />
          </div>
          <div>
            <Adres c={c} />
            {link(c, "knop") ? (
              <Btn to={link(c, "knop")} cl="btn-dark">
                {tx(c, "knoptekst") || "Plan je route"}
              </Btn>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConfiguratorBlok({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const opties = lijst(c, "opties")
    .map((o) => ({
      label: tx(o, "label"),
      prijs: Number(tx(o, "prijs").replace(",", ".")) || 0,
      toelichting: tx(o, "toelichting") || undefined,
      standaard: tx(o, "standaard_aan") === "ja",
    }))
    .filter((o) => o.label);
  const groep = tx(lijst(c, "opties")[0] ?? {}, "groep") || "Keuze";
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        <div className="detail-split">
          <div className="image-frame" style={{ height: 470 }}>
            <Photo src={CMS_MEDIA.space_atrium ?? "space_atrium"} />
          </div>
          <div style={{ display: "grid", alignContent: "start", gap: 20 }}>
            <Configurator
              opties={opties}
              groep={groep}
              aantalLabel={tx(c, "aantal_label") || "Aantal deelnemers"}
              vraagAantal={tx(c, "vraag_aantal") !== "nee"}
              bevestiging={tx(c, "bevestiging")}
            />
            {tx(c, "knoptekst") ? (
              <Btn to="/contact" cl="btn-dark">
                {tx(c, "knoptekst")}
              </Btn>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Enquête, A/B-test en personalisatie staan naast elkaar als drie tegels (zoals in NOVA Lab). */
const KORT: Record<string, string> = { enquete: "Enquête", ab_blok: "A/B-test", personalisatie: "Personalisatie" };
const TELWOORD: Record<number, string> = { 2: "twee", 3: "drie" };

function Interacties({ blokken, n }: { blokken: Blok[]; n: number }) {
  return (
    <section data-cms={blokken.map(label).join(" · ")} className={sectie(blokken[0].bg)} style={blokken.length > 1 ? undefined : { paddingTop: 40 }}>
      <div className="container">
        {blokken.length > 1 ? (
          <SectionTitle
            num={nr(n)}
            eyebrow="SLIMME INTERACTIES"
            title="Zie wat er nog meer kan."
            desc={`${blokken
              .map((b, i) => (i ? KORT[b.type].toLowerCase() : KORT[b.type]))
              .join(", ")
              .replace(/, ([^,]*)$/, " en $1")
              .replace("a/b-test", "A/B-test")}: ${TELWOORD[blokken.length] ?? blokken.length} bestaande CMS-blokken, hier als veilige demonstratie.`}
          />
        ) : null}
        <div className={`showcase-table${blokken.length === 1 ? " showcase-los" : ""}`}>
          {blokken.map((b, i) => {
            const c = b.content;
            if (b.type === "enquete")
              return (
                <div className="showcase-tile" key={i}>
                  <div>
                    <span className="eyebrow">{tx(c, "eyebrow")}</span>
                    <h3 style={{ marginTop: 12 }}>{tx(c, "titel")}</h3>
                  </div>
                  <Nps
                    vraag={tx(c, "vraag")}
                    toelichting={tx(c, "toelichtinglabel")}
                    knoptekst={tx(c, "knoptekst")}
                    bevestiging={tx(c, "bevestigingstekst")}
                    sterren={tx(c, "soort") === "sterren"}
                  />
                </div>
              );
            if (b.type === "ab_blok")
              return (
                <div className="showcase-tile" key={i}>
                  <Wissel
                    id="ab-text"
                    eyebrow={tx(c, "eyebrow")}
                    a={{ titel: tx(c, "titel_a"), tekst: tx(c, "tekst_a"), knoptekst: tx(c, "knoptekst_a"), knop: link(c, "knop_a") }}
                    b={{
                      titel: tx(c, "titel_b") || tx(c, "titel_a"),
                      tekst: tx(c, "tekst_b"),
                      knoptekst: tx(c, "knoptekst_b"),
                      knop: link(c, "knop_b"),
                    }}
                    knop="Wissel tekstvariant ↗"
                    startMetB={tx(c, "_start") === "b"}
                  />
                </div>
              );
            return (
              <div className="showcase-tile" key={i}>
                <Wissel
                  id="person-text"
                  eyebrow={tx(c, "eyebrow")}
                  a={{ titel: tx(c, "titel"), tekst: tx(c, "tekst"), knoptekst: tx(c, "knoptekst"), knop: link(c, "knop") }}
                  b={{
                    eyebrow: tx(c, "warm_eyebrow"),
                    titel: tx(c, "warm_titel") || tx(c, "titel"),
                    tekst: tx(c, "warm_tekst"),
                    knoptekst: tx(c, "warm_knoptekst"),
                    knop: link(c, "warm_knop"),
                  }}
                  knop="Simuleer terugkerende bezoeker ↗"
                  startMetB={tx(c, "_start") === "b"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FormulierBouwerBlok({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const velden = lijst(c, "velden")
    .map((v) => ({
      label: tx(v, "label"),
      type: tx(v, "type") || "tekst",
      opties: tx(v, "opties")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
      verplicht: tx(v, "verplicht") === "ja",
      toonAls: tx(v, "toon_als"),
    }))
    .filter((v) => v.label);
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container contact-layout">
        <div>
          <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
          <h2 style={{ marginTop: 18 }}>{tx(c, "titel")}</h2>
          {tx(c, "intro") ? <p className="side-note">{tx(c, "intro")}</p> : null}
        </div>
        <FormulierBouwer
          velden={velden}
          knoptekst={tx(c, "knoptekst") || "Verstuur"}
          voetnoot={tx(c, "voetnoot")}
          bevestiging={tx(c, "bevestigingstekst")}
          naVerzenden={link(c, "na_verzenden") || undefined}
        />
      </div>
    </section>
  );
}

function ReviewBlok({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container contact-layout">
        <div>
          <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
          <h2 style={{ marginTop: 18 }}>{tx(c, "titel")}</h2>
          {tx(c, "intro") ? <p className="side-note">{tx(c, "intro")}</p> : null}
        </div>
        <ReviewFormulier knoptekst={tx(c, "knoptekst") || "Plaats mijn review"} bevestiging={tx(c, "bevestigingstekst")} />
      </div>
    </section>
  );
}

function LedenToegang({ b }: { b: Blok }) {
  const c = b.content;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container" style={{ maxWidth: 640 }}>
        <span className="eyebrow">LEDENTOEGANG</span>
        <h2 style={{ fontSize: "clamp(48px,7vw,68px)", margin: "18px 0" }}>{tx(c, "titel")}</h2>
        {tx(c, "intro") ? <p style={{ marginBottom: 24 }}>{tx(c, "intro")}</p> : null}
        <DemoFormulier
          className="form-grid"
          demoTekst="Dit is een voorbeeld van een ledenomgeving. Er is geen echte inlogsessie aangemaakt."
        >
          <div className="form-field full">
            <label htmlFor="member-email">E-mailadres</label>
            <input id="member-email" type="email" placeholder="jij@voorbeeld.nl" required autoComplete="off" />
          </div>
          <div className="form-field full">
            <label htmlFor="member-pass">Wachtwoord</label>
            <input id="member-pass" type="password" placeholder="Voer je wachtwoord in" required autoComplete="off" />
          </div>
          <button className="btn btn-dark" style={{ width: "fit-content" }}>
            Inloggen ↗
          </button>
        </DemoFormulier>
        <p className="demo-note" style={{ marginTop: 22 }}>
          Dit is een visuele demo. Er worden geen wachtwoorden gecontroleerd of opgeslagen.
        </p>
      </div>
    </section>
  );
}

// ---------- Overige kernblokken ----------
const datumNl = (d: string) => {
  const t = Date.parse(d);
  return Number.isNaN(t)
    ? d
    : new Date(t).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "long", timeZone: "Europe/Amsterdam" });
};

/** Melding bij blokken die zonder CMS-records fictieve voorbeeldgegevens tonen. */
const Voorbeeldnoot = ({ children }: { children: ReactNode }) => (
  <p className="demo-note" style={{ marginTop: 22 }}>
    {children}
  </p>
);

function TekstBlok({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  // Richtext: HTML-tags weg; witregels scheiden alinea's, "## " is een tussenkop.
  const tekst = tx(c, "tekst").replace(/<\/(p|h2|h3|li)>/gi, "\n\n").replace(/<[^>]+>/g, "");
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container tekstblok">
        <SectionLabel num={nr(n)}>{tx(c, "eyebrow")}</SectionLabel>
        <h2>{tx(c, "titel")}</h2>
        <div className="article-body">
          {tekst
            .split(/\n\s*\n/)
            .map((a) => a.trim())
            .filter(Boolean)
            .map((a, i) => (a.startsWith("## ") ? <h3 key={i}>{a.slice(3)}</h3> : <p key={i}>{a}</p>))}
        </div>
        {tx(c, "bijgewerkt") ? <p className="meta">Laatst bijgewerkt: {datumNl(tx(c, "bijgewerkt"))}</p> : null}
      </div>
    </section>
  );
}

function Intake({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container contact-layout">
        <div>
          <SectionLabel num={nr(n)}>INTAKE</SectionLabel>
          <h2 style={{ marginTop: 18 }}>{tx(c, "titel")}</h2>
          {tx(c, "tekst") ? <p className="side-note">{tx(c, "tekst")}</p> : null}
          {tx(c, "muted") ? <p className="side-note" style={{ opacity: 0.7, fontSize: 13 }}>{tx(c, "muted")}</p> : null}
        </div>
        <ol className="intake-stappen">
          {lijst(c, "stappen").map((s, i) => (
            <li key={tx(s, "vraag") + i}>
              <strong>{tx(s, "nummer") || nr(i + 1)}</strong>
              <div>
                <h3>{tx(s, "vraag")}</h3>
                {tx(s, "veld") ? <span className="intake-hint">{tx(s, "veld")}</span> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

async function Bewijsstrook({ b }: { b: Blok }) {
  const c = b.content;
  const klanten = (await cmsRecords("klanten"))?.map((k) => tx(k, "naam")).filter(Boolean) ?? voorbeeldKlanten;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)} style={{ padding: "60px 0" }}>
      <div className="container">
        <div className="stats-grid stats-4" style={{ marginTop: 0 }}>
          {lijst(c, "cijfers").map((s) => (
            <div className="stat" key={tx(s, "label")}>
              <strong>{tx(s, "waarde")}</strong>
              <p>{tx(s, "label")}</p>
            </div>
          ))}
        </div>
        {tx(c, "toon_logos") !== "nee" && tx(c, "logos_titel") ? (
          <span className="eyebrow" style={{ display: "block", marginTop: 34 }}>
            {tx(c, "logos_titel")}
          </span>
        ) : null}
        {tx(c, "toon_logos") !== "nee" ? (
          <div className="logo-rij" aria-label="Klanten">
            {klanten.slice(0, Number(c.maximaal_logos) || 6).map((k) => (
              <span key={k}>{k}</span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

async function Quote({ b }: { b: Blok }) {
  const c = b.content;
  const rij = (await cmsRecords("testimonials"))?.find((t) => !tx(c, "testimonial_id") || t.id === c.testimonial_id);
  const q = rij
    ? { citaat: tx(rij, "citaat"), naam: tx(rij, "naam"), functie: tx(rij, "functie"), organisatie: tx(rij, "organisatie"), foto: media(rij, "foto") }
    : voorbeeldTestimonial;
  const metFoto = tx(c, "toon_foto") !== "nee" && q.foto;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className={`container testimonial${metFoto ? "" : " zonder-foto"}`}>
        {metFoto ? (
          <div className="image-frame">
            <Photo src={q.foto} alt={q.naam} />
          </div>
        ) : null}
        <figure>
          <blockquote>“{q.citaat}”</blockquote>
          <figcaption>
            <strong>{q.naam}</strong> · {[q.functie, q.organisatie].filter(Boolean).join(", ")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Logostrook({ b }: { b: Blok }) {
  const c = b.content;
  const items = lijst(c, "items");
  const namen = items.length ? items : voorbeeldKlanten.map((alt) => ({ alt }));
  return (
    <section data-cms={label(b)} className={sectie(b.bg)} style={{ padding: "60px 0" }}>
      <div className="container">
        {tx(c, "eyebrow") ? <span className="eyebrow">{tx(c, "eyebrow")}</span> : null}
        {tx(c, "titel") ? <h2 style={{ fontSize: "clamp(32px,4vw,52px)", margin: "12px 0 0" }}>{tx(c, "titel")}</h2> : null}
        <div className={`logo-rij${tx(c, "grijs") === "ja" ? " grijs" : ""}`}>
          {namen.map((l, i) =>
            media(l, "logo") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={media(l, "logo")} alt={tx(l, "alt")} />
            ) : (
              <span key={i}>{tx(l, "alt")}</span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function Rolvoorbeelden({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        <div className="rollen">
          {lijst(c, "items").map((r) => (
            <div className="rol" key={tx(r, "tab")}>
              <span className="chip active">{tx(r, "tab")}</span>
              <div>
                <span className="eyebrow">NU</span>
                <p>{tx(r, "nu")}</p>
              </div>
              <div>
                <span className="eyebrow">MET LINK & LEAD ONE</span>
                <p>{tx(r, "met")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Sterren = ({ n }: { n: number }) => (
  <span className="review-sterren" aria-label={`${n} van 5 sterren`}>
    {"★".repeat(n)}
    <span aria-hidden="true">{"★".repeat(5 - n)}</span>
  </span>
);

async function Reviews({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  // Bron: goedgekeurde reviews uit het CMS, anders goedgekeurde reviews uit de NOVA-database,
  // anders gemarkeerde voorbeeldreviews.
  const max = Number(c.maximaal) || 3;
  const rij = await cmsRecords("reviews");
  const nova = rij ? null : await goedgekeurdeReviews(max);
  const echt =
    rij?.map((r) => ({ naam: tx(r, "naam"), bedrijf: tx(r, "bedrijf"), rating: Number(r.rating) || 5, tekst: tx(r, "tekst") })) ??
    nova?.map((r) => ({ naam: r.naam, bedrijf: "", rating: r.score, tekst: r.tekst })) ??
    null;
  const reviews = (echt ?? voorbeeldReviews).slice(0, max);
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        <div className="card-3">
          {reviews.map((r) => (
            <div className="info-tile" key={r.naam + r.tekst.slice(0, 10)}>
              <Sterren n={Math.min(5, Math.max(1, r.rating))} />
              <strong style={{ fontSize: 21 }}>“{r.tekst}”</strong>
              <p>
                — {r.naam}
                {r.bedrijf ? ` · ${r.bedrijf}` : ""}
              </p>
            </div>
          ))}
        </div>
        {echt ? null : <Voorbeeldnoot>Voorbeeldreviews: goedgekeurde reviews verschijnen hier automatisch.</Voorbeeldnoot>}
      </div>
    </section>
  );
}

type Wedstrijd = { datum: string; tijd: string; thuis: boolean; tegenstander: string; competitie: string; locatie: string };
async function wedstrijden(): Promise<{ items: Wedstrijd[]; voorbeeld: boolean }> {
  const rij = await cmsRecords("wedstrijden");
  if (!rij) return { items: voorbeeldWedstrijden, voorbeeld: true };
  return {
    voorbeeld: false,
    items: rij.map((w) => ({
      datum: tx(w, "datum"),
      tijd: tx(w, "tijd").slice(0, 5),
      thuis: w.thuis === true,
      tegenstander: tx(w, "tegenstander"),
      competitie: tx(w, "competitie"),
      locatie: tx(w, "locatie"),
    })),
  };
}

async function Wedstrijden({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const { items, voorbeeld } = await wedstrijden();
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        <div>
          {items.map((w) => (
            <div className="schedule-row" key={w.datum + w.tegenstander}>
              <strong>{datumNl(w.datum)}</strong>
              <span>
                {w.thuis ? `NOVA United — ${w.tegenstander}` : `${w.tegenstander} — NOVA United`} · {w.competitie} · {w.tijd} uur
              </span>
              <span aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
        {voorbeeld ? <Voorbeeldnoot>Fictieve wedstrijden: met wedstrijden in het CMS verschijnt hier het echte programma.</Voorbeeldnoot> : null}
      </div>
    </section>
  );
}

async function VolgendeWedstrijd({ b }: { b: Blok }) {
  const c = b.content;
  const { items } = await wedstrijden();
  const w = items.find((x) => tx(c, "alleen_thuis") !== "ja" || x.thuis);
  if (!w) return null;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <div className="featured-story" style={{ background: "#dff29e", minHeight: 300, color: "var(--night)" }}>
          <div style={{ padding: 60 }}>
            <span className="eyebrow">
              {tx(c, "titel") || "VOLGENDE WEDSTRIJD"} / {w.thuis ? "THUIS" : "UIT"}
            </span>
            <h2 style={{ fontSize: "clamp(44px,6vw,80px)", marginTop: 15 }}>
              {w.thuis ? `NOVA / ${w.tegenstander}` : `${w.tegenstander} / NOVA`}
            </h2>
            <p style={{ fontSize: 15, color: "#1b2b3c", marginTop: 15 }}>
              {datumNl(w.datum)} · {w.tijd} uur · {w.locatie}
            </p>
          </div>
          <div style={{ padding: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 150, fontWeight: 950, letterSpacing: "-.1em" }} aria-hidden="true">
              N<span style={{ color: "#738900" }}>.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function Agenda({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const rij = await cmsRecords("agenda_slots");
  const slots = (rij?.map((r) => ({ datum: tx(r, "datum"), tijd: tx(r, "tijd").slice(0, 5), persoon: tx(r, "persoon") })) ?? voorbeeldSlots)
    .filter((sl) => !tx(c, "persoon") || sl.persoon === tx(c, "persoon"))
    .slice(0, Number(c.maximaal_slots) || 6);
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        {[tx(c, "afspraak_naam"), tx(c, "duur"), tx(c, "kanaal")].some(Boolean) ? (
          <p className="meta" style={{ marginBottom: 16 }}>
            {[tx(c, "afspraak_naam"), tx(c, "duur"), tx(c, "kanaal")].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        <div className="slots">
          {slots.map((sl) => (
            <DemoKnop
              key={sl.datum + sl.tijd + sl.persoon}
              melding="Dit is een voorbeeld: er wordt geen afspraak ingepland."
              stijl="slot"
            >
              <strong>{datumNl(sl.datum)}</strong> {sl.tijd} uur
              {tx(c, "tijdzone") && tx(c, "tijdzone") !== "Europe/Amsterdam" ? ` (${tx(c, "tijdzone")})` : ""} · {sl.persoon}
            </DemoKnop>
          ))}
        </div>
        {rij ? null : <Voorbeeldnoot>Voorbeeldtijden: vrije agendaslots uit het CMS verschijnen hier automatisch.</Voorbeeldnoot>}
      </div>
    </section>
  );
}

function AftelklokBlok({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const knop = link(c, "knop");
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c, "intro")} />
        <Aftelklok
          doel={tx(c, "doeldatum")}
          tijdzone={tx(c, "tijdzone") || "Europe/Amsterdam"}
          verlopen={tx(c, "verlopen_tekst") || "Het is zover."}
        />
        {knop ? (
          <div style={{ marginTop: 30 }}>
            <Btn to={knop}>{tx(c, "knoptekst")}</Btn>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Collectie (lijst): staat in de specificatie maar heeft nog geen CMS-bloktype. Alleen voor de verkenner. */
async function CollectieLijst({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const { items } = await getCases();
  const vorm = tx(c, "_vorm") || "raster";
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} {...kop(c)} />
        {vorm === "lijst" ? (
          <div>
            {items.slice(0, 5).map((x) => (
              <Link className="schedule-row" href={`/work/${x.slug}`} key={x.slug}>
                <strong>{x.type}</strong>
                <span>{x.name}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        ) : vorm === "uitgelicht" && items[0] ? (
          <Link href={`/work/${items[0].slug}`} className="featured-story">
            <div className="photo">
              <Photo src={items[0].cover} alt={items[0].name} />
            </div>
            <div className="copy">
              <span className="eyebrow">UITGELICHT / {items[0].type}</span>
              <h2>{items[0].name}.</h2>
              <span className="meta">BEKIJK HET PROJECT &nbsp; ↗</span>
            </div>
          </Link>
        ) : (
          <div className="article-grid">
            {items.slice(0, 3).map((x) => (
              <PicCard key={x.slug} item={x} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Paginaopbouw ----------

/** Rendert één blok. Een fout (bv. een onverwacht veld of een mislukte collectie) wordt gelogd en het
 *  blok overgeslagen, in plaats van dat de hele pagina faalt. */
async function VeiligBlok({ naam, maak }: { naam: string; maak: () => ReactNode | Promise<ReactNode> }) {
  // maak() roept de blokfunctie direct aan, dus fouten in dat blok zelf vallen in deze try.
  let inhoud: ReactNode;
  try {
    inhoud = await maak();
  } catch (fout) {
    console.error(`Blok "${naam}" kon niet worden getoond`, fout);
    return null;
  }
  return <BlokGrens naam={naam}>{inhoud}</BlokGrens>;
}
const ZONDER_NUMMER = new Set([
  "header",
  "marquee",
  "feiten",
  "overgang",
  "portfolio",
  "leden_toegang",
  "bewijsstrook",
  "quote",
  "logostrook",
  "volgende_wedstrijd",
]);
const INTERACTIE = new Set(["enquete", "ab_blok", "personalisatie"]);

/** Splitst de afsluitende oproep (laatste cta-blok) af; die rendert de Footer. */
export function splitsOproep(blokken: Blok[]): { blokken: Blok[]; oproep: Blok | null } {
  const laatste = blokken[blokken.length - 1];
  return laatste?.type === "cta" ? { blokken: blokken.slice(0, -1), oproep: laatste } : { blokken, oproep: null };
}

export function Blokken({
  pagina,
  blokken,
  na,
}: {
  pagina: PaginaInhoud;
  blokken: Blok[];
  /** Extra (niet-CMS) inhoud direct na het eerste blok van een type, bv. de blokkenverkenner. */
  na?: Partial<Record<string, ReactNode>>;
}) {
  const ctx: Ctx = {
    slug: pagina.slug,
    one: pagina.slug === "/one",
    detail: pagina.slug.split("/").filter(Boolean).length > 1,
  };
  const uit: ReactNode[] = [];
  const gehad = new Set<string>();
  let n = 0;
  for (let i = 0; i < blokken.length; i++) {
    const b = blokken[i];
    if (!ZONDER_NUMMER.has(b.type)) n++;
    const nHier = n; // vastzetten: de blokken renderen pas na deze lus
    const k = `${b.type}-${i}`;
    const voor = uit.length;
    switch (b.type) {
      case "header":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Header({ b, ctx, eerste: !blokken.slice(0, i).some((x) => x.type === "header") })} />);
        break;
      case "marquee":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Marquee({ b })} />);
        break;
      case "mediatekst":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => MediaTekst({ b, ctx, n: nHier })} />);
        break;
      case "statement":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Statement({ b, ctx, n: nHier })} />);
        break;
      case "statistieken":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Statistieken({ b, n: nHier })} />);
        break;
      case "feiten":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Feiten({ b })} />);
        break;
      case "flexibel":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Flexibel({ b, ctx, n: nHier })} />);
        break;
      case "kaarten":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Kaarten({ b, ctx, n: nHier })} />);
        break;
      case "portfolio":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Portfolio({ b })} />);
        break;
      case "reeks":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Reeks({ b, n: nHier })} />);
        break;
      case "faq":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Faq({ b, n: nHier })} />);
        break;
      case "overgang":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Overgang({ b, ctx })} />);
        break;
      case "cta":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Cta({ b, n: nHier })} />);
        break;
      case "cases_grid":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => CasesGrid({ b, ctx, n: nHier })} />);
        break;
      case "artikelen_grid":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => ArtikelenGrid({ b, ctx, n: nHier })} />);
        break;
      case "mensen":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Mensen({ b, ctx, n: nHier })} />);
        break;
      case "sprekers":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Sprekers({ b, n: nHier })} />);
        break;
      case "partners_grid":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => PartnersGrid({ b, n: nHier })} />);
        break;
      case "partner_uitgelicht":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => PartnerUitgelicht({ b, ctx, n: nHier })} />);
        break;
      case "citaten_carrousel":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Citaten({ b, n: nHier })} />);
        break;
      case "prijskaarten":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Prijskaarten({ b, n: nHier })} />);
        break;
      case "tabel":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Tabel({ b, n: nHier })} />);
        break;
      case "formulier": {
        // Contactformulier + kaart/locatie vormen samen één contactsectie.
        const volgende = blokken[i + 1];
        const kaart = volgende?.type === "kaart" ? volgende : undefined;
        if (kaart) i++;
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Formulier({ b, ctx, n: nHier, kaart })} />);
        break;
      }
      case "kaart":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Kaart({ b, n: nHier })} />);
        break;
      case "configurator":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => ConfiguratorBlok({ b, n: nHier })} />);
        break;
      case "formulier_bouwer":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => FormulierBouwerBlok({ b, n: nHier })} />);
        break;
      case "review_verzamelen":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => ReviewBlok({ b, n: nHier })} />);
        break;
      case "leden_toegang":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => LedenToegang({ b })} />);
        break;
      case "tekst":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => TekstBlok({ b, n: nHier })} />);
        break;
      case "intake":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Intake({ b, n: nHier })} />);
        break;
      case "bewijsstrook":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Bewijsstrook({ b })} />);
        break;
      case "quote":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Quote({ b })} />);
        break;
      case "logostrook":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Logostrook({ b })} />);
        break;
      case "rolvoorbeelden":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Rolvoorbeelden({ b, n: nHier })} />);
        break;
      case "reviews":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Reviews({ b, n: nHier })} />);
        break;
      case "wedstrijden":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Wedstrijden({ b, n: nHier })} />);
        break;
      case "volgende_wedstrijd":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => VolgendeWedstrijd({ b })} />);
        break;
      case "agenda":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Agenda({ b, n: nHier })} />);
        break;
      case "aftelklok":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => AftelklokBlok({ b, n: nHier })} />);
        break;
      case "collectie_lijst":
        uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => CollectieLijst({ b, n: nHier })} />);
        break;
      default:
        if (INTERACTIE.has(b.type)) {
          const groep = [b];
          while (blokken[i + 1] && INTERACTIE.has(blokken[i + 1].type)) groep.push(blokken[++i]);
          uit.push(<VeiligBlok key={k} naam={label(b)} maak={() => Interacties({ blokken: groep, n: nHier })} />);
        }
      // Onbekend bloktype: overslaan (veilige terugval).
    }
    // Bewerkmodus (B-090): het blok in een omhulsel met de sectie-id, zodat de bewerkbalk de velden in dit
    // blok kan vinden. display: contents (nova-extra.css), dus de opmaak verandert niet. Bezoekers nooit.
    if (pagina.bewerkbaar && b.id && b.bewerken && uit.length > voor)
      uit[voor] = (
        <div key={`sectie-${k}`} className="cms-sectie" data-cms-sectie={b.id}>
          {uit[voor]}
        </div>
      );
    if (na?.[b.type] && !gehad.has(b.type)) {
      gehad.add(b.type);
      uit.push(<Fragment key={`na-${k}`}>{na[b.type]}</Fragment>);
    }
  }
  return <>{uit}</>;
}
