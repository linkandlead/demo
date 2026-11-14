import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { KERNBLOKKEN } from "@/content/kernblokken";
import { cmsMedia } from "@/lib/cms/client";
import { getCases, getPartners, getPeople, getPosts } from "@/lib/cms/data";
import type { Blok, PaginaInhoud } from "@/lib/cms/paginas";
import { AanvraagFormulier } from "./AanvraagFormulier";
import { DemoFormulier } from "./DemoFormulier";
import { DemoKnop } from "./DemoKnop";
import { TourStart } from "./DemoMode";
import { FormulierBouwer, ReviewFormulier } from "./LabFormulieren";
import { Configurator, Nps, Wissel } from "./LabInteractief";
import { WorkGrid } from "./WorkGrid";
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
function Header({ b, ctx }: { b: Blok; ctx: Ctx }) {
  const c = b.content;
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
            {tx(c, "cta_secundair_label")} <span className="arrow">↗</span>
          </Link>
        ) : null}
      </div>
    ) : null;
  const stats = tx(c, "extras") === "stats" ? lijst(c, "stats") : [];
  const meta = tx(lijst(c, "usps")[0] ?? {}, "tekst");

  if (tx(c, "hoogte") === "fullscreen")
    return (
      <section data-cms={label(b)} className="hero-home">
        {beeld ? (
          <div className="hero-visual">
            <Photo src={beeld} alt={alt} priority />
          </div>
        ) : null}
        <div className="container hero-copy">
          <div className="eyebrow" style={{ color: "var(--lime)" }}>
            {tx(c, "eyebrow")}
          </div>
          <h1>
            <KopMetPunt tekst={tx(c, "heading")} />
          </h1>
          {tx(c, "subheading") ? <p>{tx(c, "subheading")}</p> : null}
          {knoppen}
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
          <h1>
            <Rijk tekst={tx(c, "heading")} accent="limoen" />
          </h1>
          {tx(c, "subheading") ? <p className="one-intro">{tx(c, "subheading")}</p> : null}
          {knoppen}
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

  if (tx(c, "layout") === "achtergrond") {
    const cls = ctx.detail ? "detail-hero" : "feature-media";
    return (
      <section data-cms={label(b)} className={cls}>
        {beeld ? <Photo src={beeld} alt={alt} priority /> : null}
        <div className="container copy">
          <span className="eyebrow" style={{ color: "var(--lime)" }}>
            {tx(c, "eyebrow")}
          </span>
          <h1>
            <Lines text={tx(c, "heading")} />
          </h1>
          {tx(c, "subheading") ? <p>{tx(c, "subheading")}</p> : null}
          {knoppen}
        </div>
      </section>
    );
  }

  const donker = b.bg === "nacht" || b.bg === "diep";
  return (
    <section data-cms={label(b)} className={`inner-hero${donker ? " night" : ""}`}>
      <div className="container">
        <span className="eyebrow" style={donker ? { color: "var(--lime)" } : undefined}>
          {tx(c, "eyebrow")}
        </span>
        <h1>
          <Lines text={tx(c, "heading")} />
        </h1>
        {meta ? (
          <div className="hero-description">
            <span className="meta">{meta}</span>
            {tx(c, "subheading") ? <p>{tx(c, "subheading")}</p> : null}
          </div>
        ) : tx(c, "subheading") ? (
          <p style={{ maxWidth: 490, color: donker ? "#c0c7d8" : "#58626c" }}>{tx(c, "subheading")}</p>
        ) : null}
        {knoppen}
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
    <div data-cms={label(b)} className="marquee">
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
        <SectionTitle num={nr(n)} title={tx(c, "titel")} desc={tx(c, "intro")} />
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
    <div className={tx(c, "kolommen") === "4" ? "card-3 card-4" : "card-3"}>
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
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} desc={tx(c, "intro")} />
        {kaarten}
      </div>
    </section>
  );
}

function Kaarten({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
  const items = lijst(c, "items");
  const titel = tx(c, "titel") ? (
    <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} desc={tx(c, "intro")} />
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
                {tx(i, "knoptekst") ? <span className="eyebrow">{tx(i, "knoptekst")}</span> : null}
                <strong>{tx(i, "titel")}</strong>
                <p>{tx(i, "tekst")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Portfolio({ b }: { b: Blok }) {
  const items = lijst(b.content, "items").filter((i) => media(i, "beeld"));
  const [eerste, ...rest] = items;
  if (!eerste) return null;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)} style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="wide-photo">
          <Photo src={media(eerste, "beeld")} alt={tx(eerste, "alt")} />
        </div>
        {rest.length ? (
          <div className="card-3" style={{ marginTop: 14 }}>
            {rest.map((i) => (
              <div className="image-frame" style={{ height: 300 }} key={media(i, "beeld")}>
                <Photo src={media(i, "beeld")} alt={tx(i, "alt")} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Reeks({ b, ctx, n }: { b: Blok; ctx: Ctx; n: number }) {
  const c = b.content;
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
          <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} desc={tx(c, "intro")} />
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
              <Photo src="event_gradient" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} desc={tx(c, "intro")} />
        <div className="timeline">
          {stappen.map((s, i) => (
            <div className="timeline-item" key={tx(s, "titel") + i}>
              <strong>{tx(s, "nummer") || nr(i + 1)}</strong>
              <h3>{tx(s, "titel")}</h3>
              <p>{tx(s, "tekst")}</p>
            </div>
          ))}
        </div>
        {ctx.one ? null : null}
      </div>
    </section>
  );
}

function Faq({ b, n }: { b: Blok; n: number }) {
  return (
    <section className={sectie(b.bg)} data-cms={label(b)}>
      <div className="container">
        <SectionTitle num={nr(n)} title={tx(b.content, "titel")} />
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
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} />
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
    const rubrieken = [...new Set(posts.map((p) => p.cat).filter(Boolean))];
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
            <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} />
            {rubrieken.length > 1 ? (
              <div className="chip-row" style={{ marginBottom: 25 }} aria-label="Rubrieken">
                <span className="chip active">Alles</span>
                {rubrieken.map((r) => (
                  <span className="chip" key={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>
            ) : null}
            {rest.length ? (
              <div className="article-grid">
                {rest.map((p) => (
                  <StoryCard key={p.slug} post={p} />
                ))}
              </div>
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
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} />
        {posts.length ? (
          <div className="article-grid">
            {posts.map((p) => (
              <StoryCard key={p.slug} post={p} />
            ))}
          </div>
        ) : (
          <EmptyState>Er zijn nog geen artikelen gepubliceerd.</EmptyState>
        )}
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
        <SectionTitle num={nr(n)} title={tx(c, "titel")} desc={tx(c, "intro")} />
        {mensen.length ? (
          <div className="people-grid">
            {mensen.map((p) => (
              <div key={p.name}>
                <PersonCard p={p} />
                {p.bio && ctx.slug !== "/" ? <p className="person-bio">{p.bio}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>Er zijn nog geen teamleden beschikbaar.</EmptyState>
        )}
      </div>
    </section>
  );
}

function Sprekers({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} title={tx(c, "titel")} desc={tx(c, "sub")} />
        <div className="people-grid">
          {lijst(c, "items").map((s) => (
            <PersonCard
              key={tx(s, "naam")}
              p={{ name: tx(s, "naam"), role: tx(s, "tekst"), cover: media(s, "foto") }}
              prefix="Spreker · "
            />
          ))}
        </div>
      </div>
    </section>
  );
}

async function PartnersGrid({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const { items } = await getPartners();
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} desc={tx(c, "intro")} />
        {items.length ? (
          <div className="card-3 card-4">
            {items.map((p) => (
              <div className="info-tile" key={p.naam}>
                <span className="eyebrow">{p.vak}</span>
                <strong>{p.naam}</strong>
                <p>{p.tekst}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>Er zijn nog geen partners toegevoegd.</EmptyState>
        )}
      </div>
    </section>
  );
}

async function PartnerUitgelicht({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const { items } = await getPartners();
  const p = items.find((x) => x.uitgelicht) ?? items[0];
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} />
        <div className="detail-split">
          <p className="pullquote">{p ? `${p.naam}.` : tx(c, "titel")}</p>
          <div className="body-copy">
            {tx(c, "intro") ? <p>{tx(c, "intro")}</p> : null}
            {p?.tekst ? <p>{p.tekst}</p> : null}
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
        <SectionTitle num={nr(n)} title={tx(c, "titel")} />
        <div className="card-3">
          {lijst(c, "items").map((q, i) => (
            <div className="info-tile" key={tx(q, "naam") + i}>
              <span className="eyebrow">{tx(q, "organisatie") || `CITAAT ${nr(i + 1)}`}</span>
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
  const intro = tx(c, "intro");
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} title={tx(c, "titel")} desc={intro} />
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Tabel({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const rijen = lijst(c, "rijen");
  const [eerste] = rijen;
  const [wedstrijd, ...details] = tx(eerste ?? {}, "c2").split(" · ");
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} desc={tx(c, "intro")} />
        {eerste ? (
          <div className="featured-story" style={{ background: "#dff29e", minHeight: 300, color: "var(--night)" }}>
            <div style={{ padding: 60 }}>
              <span className="eyebrow">{tx(c, "eyebrow")}</span>
              <h2 style={{ fontSize: "clamp(44px,6vw,80px)", marginTop: 15 }}>{wedstrijd}</h2>
              <p style={{ fontSize: 15, color: "#1b2b3c", marginTop: 15 }}>
                {[tx(eerste, "c1"), ...details].join(" · ")}
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
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} desc={tx(c, "intro")} />
        <Adres c={c} />
      </div>
    </section>
  );
}

function ConfiguratorBlok({ b, n }: { b: Blok; n: number }) {
  const c = b.content;
  const opties = lijst(c, "opties")
    .map((o) => ({ label: tx(o, "label"), prijs: Number(tx(o, "prijs").replace(",", ".")) || 0 }))
    .filter((o) => o.label);
  const groep = tx(lijst(c, "opties")[0] ?? {}, "groep") || "Keuze";
  return (
    <section data-cms={label(b)} className={sectie(b.bg)}>
      <div className="container">
        <SectionTitle num={nr(n)} eyebrow={tx(c, "eyebrow")} title={tx(c, "titel")} desc={tx(c, "intro")} />
        <div className="detail-split">
          <div className="image-frame" style={{ height: 470 }}>
            <Photo src="space_atrium" />
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
function Interacties({ blokken }: { blokken: Blok[] }) {
  return (
    <section data-cms={blokken.map(label).join(" · ")} className={sectie(blokken[0].bg)} style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="showcase-table">
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
                  />
                </div>
              );
            if (b.type === "ab_blok")
              return (
                <div className="showcase-tile" key={i}>
                  <Wissel
                    id="ab-text"
                    eyebrow={tx(c, "eyebrow")}
                    a={tx(c, "titel_a")}
                    b={tx(c, "titel_b") || tx(c, "titel_a")}
                    knop={`${tx(c, "knoptekst_a") || "Wissel variant"} ↗`}
                  />
                </div>
              );
            return (
              <div className="showcase-tile" key={i}>
                <Wissel
                  id="person-text"
                  eyebrow={tx(c, "eyebrow")}
                  a={tx(c, "titel")}
                  b={tx(c, "warm_titel") || tx(c, "titel")}
                  knop={`${tx(c, "knoptekst") || "Wissel"} ↗`}
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

// ---------- Paginaopbouw ----------
const ZONDER_NUMMER = new Set(["header", "marquee", "feiten", "overgang", "portfolio", "leden_toegang"]);
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
    const k = `${b.type}-${i}`;
    switch (b.type) {
      case "header":
        uit.push(<Header key={k} b={b} ctx={ctx} />);
        break;
      case "marquee":
        uit.push(<Marquee key={k} b={b} />);
        break;
      case "mediatekst":
        uit.push(<MediaTekst key={k} b={b} ctx={ctx} n={n} />);
        break;
      case "statement":
        uit.push(<Statement key={k} b={b} ctx={ctx} n={n} />);
        break;
      case "statistieken":
        uit.push(<Statistieken key={k} b={b} n={n} />);
        break;
      case "feiten":
        uit.push(<Feiten key={k} b={b} />);
        break;
      case "flexibel":
        uit.push(<Flexibel key={k} b={b} ctx={ctx} n={n} />);
        break;
      case "kaarten":
        uit.push(<Kaarten key={k} b={b} ctx={ctx} n={n} />);
        break;
      case "portfolio":
        uit.push(<Portfolio key={k} b={b} />);
        break;
      case "reeks":
        uit.push(<Reeks key={k} b={b} ctx={ctx} n={n} />);
        break;
      case "faq":
        uit.push(<Faq key={k} b={b} n={n} />);
        break;
      case "overgang":
        uit.push(<Overgang key={k} b={b} ctx={ctx} />);
        break;
      case "cta":
        uit.push(<Cta key={k} b={b} n={n} />);
        break;
      case "cases_grid":
        uit.push(<CasesGrid key={k} b={b} ctx={ctx} n={n} />);
        break;
      case "artikelen_grid":
        uit.push(<ArtikelenGrid key={k} b={b} ctx={ctx} n={n} />);
        break;
      case "mensen":
        uit.push(<Mensen key={k} b={b} ctx={ctx} n={n} />);
        break;
      case "sprekers":
        uit.push(<Sprekers key={k} b={b} n={n} />);
        break;
      case "partners_grid":
        uit.push(<PartnersGrid key={k} b={b} n={n} />);
        break;
      case "partner_uitgelicht":
        uit.push(<PartnerUitgelicht key={k} b={b} n={n} />);
        break;
      case "citaten_carrousel":
        uit.push(<Citaten key={k} b={b} n={n} />);
        break;
      case "prijskaarten":
        uit.push(<Prijskaarten key={k} b={b} n={n} />);
        break;
      case "tabel":
        uit.push(<Tabel key={k} b={b} n={n} />);
        break;
      case "formulier": {
        // Contactformulier + kaart/locatie vormen samen één contactsectie.
        const volgende = blokken[i + 1];
        const kaart = volgende?.type === "kaart" ? volgende : undefined;
        if (kaart) i++;
        uit.push(<Formulier key={k} b={b} ctx={ctx} n={n} kaart={kaart} />);
        break;
      }
      case "kaart":
        uit.push(<Kaart key={k} b={b} n={n} />);
        break;
      case "configurator":
        uit.push(<ConfiguratorBlok key={k} b={b} n={n} />);
        break;
      case "formulier_bouwer":
        uit.push(<FormulierBouwerBlok key={k} b={b} n={n} />);
        break;
      case "review_verzamelen":
        uit.push(<ReviewBlok key={k} b={b} n={n} />);
        break;
      case "leden_toegang":
        uit.push(<LedenToegang key={k} b={b} />);
        break;
      default:
        if (INTERACTIE.has(b.type)) {
          const groep = [b];
          while (blokken[i + 1] && INTERACTIE.has(blokken[i + 1].type)) groep.push(blokken[++i]);
          uit.push(<Interacties key={k} blokken={groep} />);
        }
      // Onbekend bloktype: overslaan (veilige terugval).
    }
    if (na?.[b.type] && !gehad.has(b.type)) {
      gehad.add(b.type);
      uit.push(<Fragment key={`na-${k}`}>{na[b.type]}</Fragment>);
    }
  }
  return <>{uit}</>;
}
