import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { MEDIA } from "@/content/media";
import { altTeksten } from "@/content/teksten";
import type { Case, Person, Post } from "@/content/nova";

// Herbruikbare NOVA-bouwstenen. DOM en klassen zijn exact die van het prototype
// (02_WEBSITE/scripts/nova-app.js); alleen hash-links (#/x) zijn echte routes (/x) geworden.

export const href = (pad: string) => "/" + pad.replace(/^\//, "");

/** Mediasleutel (bv. "hero_arch") → lokaal WebP-bestand; een URL blijft een URL. */
export function mediaSrc(bron: string): string {
  if (!bron) return "";
  if (bron.startsWith("/") || bron.startsWith("https://")) return bron;
  return `/media/${bron}.webp`;
}

/** "/media/hero_arch.webp" of "hero_arch" → "hero_arch"; andere bronnen blijven gelijk. */
export const mediaSleutel = (bron: string) =>
  bron.match(/^\/media\/([\w-]+)\.webp$/)?.[1] ?? bron;

/** srcset voor lokale media (640 / 1280 / origineel); leeg voor CMS-URL's. */
export function mediaSrcSet(bron: string): string | undefined {
  bron = mediaSleutel(bron);
  const m = MEDIA[bron];
  if (!m) return undefined;
  return [
    ...m.varianten.map((b) => `/media/${bron}-${b}.webp ${b}w`),
    `/media/${bron}.webp ${m.w}w`,
  ].join(", ");
}

export function Photo({
  src,
  alt = "",
  priority = false,
  sizes,
}: {
  src: string;
  alt?: string;
  priority?: boolean;
  /** Hoe breed het beeld getoond wordt; bepaalt welke srcset-breedte de browser kiest. */
  sizes?: string;
}) {
  const url = mediaSrc(src);
  if (!url) return null;
  const srcSet = mediaSrcSet(src);
  return (
    // biome-ignore: bewust <img>; de CSS van het ontwerp stijlt img direct (object-fit, hover-zoom).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      srcSet={srcSet}
      // Hero-beelden (priority) zijn schermbreed; de rest is hooguit een halve kolom.
      sizes={
        srcSet
          ? (sizes ?? (priority ? "100vw" : "(max-width: 760px) 100vw, 50vw"))
          : undefined
      }
      alt={
        alt ||
        altTeksten[mediaSleutel(src)] ||
        "Decoratieve afbeelding van het fictieve NOVA-concept."
      }
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}

/** Tekst uit het CMS mag regeleinden bevatten; die worden <br> zoals in het ontwerp. */
export function Lines({ text }: { text: string }) {
  const delen = text.split("\n");
  return (
    <>
      {delen.map((d, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {d}
        </Fragment>
      ))}
    </>
  );
}

/** Lees een tekstveld uit CMS-inhoud, met de ontwerpcopy als terugval. */
export function t(
  c: Record<string, unknown>,
  veld: string,
  terugval: string,
): string {
  const v = c[veld];
  return typeof v === "string" && v.trim() ? v : terugval;
}

export function Btn({
  to,
  children,
  cl = "btn-lime",
}: {
  to: string;
  children: ReactNode;
  cl?: string;
}) {
  const extern = /^https?:\/\//.test(to);
  const cls = `btn ${cl}`;
  const inner = (
    <>
      {children}
      <span className="arrow">↗</span>
    </>
  );
  return extern ? (
    <a className={cls} href={to}>
      {inner}
    </a>
  ) : (
    <Link className={cls} href={href(to)}>
      {inner}
    </Link>
  );
}

export function SectionLabel({
  num,
  children,
}: {
  num: string;
  children: ReactNode;
}) {
  // Een eyebrow die al met een nummer begint ("08 / …") krijgt geen tweede nummer.
  if (typeof children === "string" && /^\d{2} \//.test(children))
    return <span className="eyebrow">{children}</span>;
  return (
    <span className="eyebrow">
      <span className="label-index">
        {num}
        {children ? " / " : ""}
      </span>{" "}
      {children}
    </span>
  );
}

export function SectionTitle({
  num,
  eyebrow,
  title,
  desc,
}: {
  num: string;
  eyebrow?: string;
  title: ReactNode;
  desc?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <SectionLabel num={num}>{eyebrow}</SectionLabel>
        <h2>{title}</h2>
      </div>
      {desc ? <p>{desc}</p> : null}
    </div>
  );
}

export function PicCard({
  item,
  large = false,
}: {
  item: Case;
  large?: boolean;
}) {
  return (
    <Link href={`/work/${item.slug}`} className="tagged-card">
      <div className={`image-frame ${large ? "tall" : ""}`}>
        <Photo src={item.cover} alt={item.name} />
        <div className="image-overlay" />
        <div className="image-caption">
          <div>
            <span className="meta">
              {[item.type, item.year].filter(Boolean).join(" · ")}
            </span>
            <h3>{item.name}</h3>
          </div>
          <span className="circle-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </Link>
  );
}

export function StoryCard({ post }: { post: Post & { lead?: string } }) {
  return (
    <Link href={`/journal/${post.slug}`} className="article-card">
      <div className="image-frame">
        <Photo src={post.cover} alt={post.title} />
      </div>
      <div className="meta">
        {post.cat}
        {post.time ? <> &nbsp;·&nbsp; {post.time}</> : null}
      </div>
      <h3>{post.title}</h3>
      <p>
        {post.lead || "Perspectieven, verhalen en ideeën die ons verder brengen."}{" "}
        <span style={{ whiteSpace: "nowrap" }}>Lees verder ↗</span>
      </p>
    </Link>
  );
}

export function PersonCard({ p, prefix = "" }: { p: Person; prefix?: string }) {
  return (
    <div className="person-card">
      <div className="image-frame">
        <Photo src={p.cover} alt={p.name} />
      </div>
      <h3>{p.name}</h3>
      <p>
        {prefix}
        {p.role}
      </p>
    </div>
  );
}

/** Lege stand van een collectieblok (ontwerpregel uit de PDF: ontwerp ook de stand zonder items). */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="demo-note" role="status">
      {children}
    </div>
  );
}
