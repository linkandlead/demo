import "server-only";
import { cache } from "react";
import {
  cases as demoCases,
  people as demoPeople,
  events as demoEvents,
  posts as demoPosts,
  slugify,
  spaces as demoSpaces,
  type Case,
  type Person,
  type Post,
  type Space,
} from "@/content/nova";
import { leesTabel, supabase, supabaseConfig } from "@/lib/supabase/server";
import { cmsMedia, cmsUrl, laadCms, type CmsStatus } from "./client";

// Eén plek die bepaalt waar de content vandaan komt. Volgorde: het gekoppelde Link & Lead One-CMS,
// anders de NOVA-demodatabase in Supabase (project "demo"), anders de vaste demodata uit het ontwerp.
// Alleen velden die écht in de CMS-lees-API bestaan worden gebruikt (allowlist in
// linkandlead-cms src/features/content/headlessrecords.ts). Velden die het NOVA-ontwerp
// toont maar die het CMS niet kent (bv. jaartal van een case) blijven dan leeg.

export type Bron = "cms" | "supabase" | "demo";
export type Collectie<T> = { items: T[]; bron: Bron };

export const cmsStatus = cache(laadCms);

const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function leestijd(tekst: string): string {
  const woorden = tekst.split(/\s+/).filter(Boolean).length;
  return woorden ? `${Math.max(1, Math.round(woorden / 200))} min lezen` : "";
}

export async function getCases(): Promise<Collectie<Case>> {
  const st = await cmsStatus();
  const rij = st.bron === "cms" ? st.site.records.cases : undefined;
  if (!rij) {
    const db = await leesTabel(
      "cases",
      "slug, naam, sector, jaar, omschrijving, cover",
      { kolom: "volgorde", oplopend: true },
    );
    if (db)
      return {
        bron: "supabase",
        items: db.map((r) => ({
          slug: s(r.slug),
          name: s(r.naam),
          type: s(r.sector),
          year: s(r.jaar),
          cover: s(r.cover),
          desc: s(r.omschrijving),
        })),
      };
    return { items: demoCases, bron: "demo" };
  }
  return {
    bron: "cms",
    items: rij
      .map((r) => ({
        slug: slugify(s(r.klantnaam)),
        name: s(r.klantnaam),
        type: s(r.sector).toUpperCase(),
        year: "",
        cover: cmsMedia(r.foto),
        desc: s(r.uitdaging),
      }))
      .filter((c) => c.name),
  };
}

export type PostDetail = Post & { lead?: string; body?: string[] };

export async function getPosts(): Promise<Collectie<PostDetail>> {
  const st = await cmsStatus();
  const rij = st.bron === "cms" ? st.site.records.artikelen : undefined;
  if (!rij) {
    const db = await leesTabel(
      "artikelen",
      "slug, titel, rubriek, leestijd, samenvatting, hoofdtekst, cover",
      {
        kolom: "gepubliceerd_op",
        oplopend: false,
      },
    );
    if (db)
      return {
        bron: "supabase",
        items: db.map((r) => ({
          slug: s(r.slug),
          title: s(r.titel),
          cat: s(r.rubriek),
          time: s(r.leestijd) || leestijd(s(r.hoofdtekst)),
          cover: s(r.cover),
          lead: s(r.samenvatting) || undefined,
          body: s(r.hoofdtekst)
            .split(/\n\s*\n/)
            .map((x) => x.trim())
            .filter(Boolean),
        })),
      };
    return { items: demoPosts, bron: "demo" };
  }
  return {
    bron: "cms",
    items: rij
      .map((r) => ({
        slug: s(r.slug) || slugify(s(r.titel)),
        title: s(r.titel),
        cat: s(r.rubriek).toUpperCase(),
        time: leestijd(s(r.hoofdtekst)),
        cover: cmsMedia(r.foto),
        lead: s(r.samenvatting),
        body: s(r.hoofdtekst)
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
      }))
      .filter((p) => p.title),
  };
}

export async function getPeople(): Promise<Collectie<Person>> {
  const st = await cmsStatus();
  const rij = st.bron === "cms" ? st.site.records.teamleden : undefined;
  if (!rij) {
    const db = await leesTabel("teamleden", "naam, functie, foto", {
      kolom: "volgorde",
      oplopend: true,
    });
    if (db)
      return {
        bron: "supabase",
        items: db.map((r) => ({
          name: s(r.naam),
          role: s(r.functie),
          cover: s(r.foto),
        })),
      };
    return { items: demoPeople, bron: "demo" };
  }
  return {
    bron: "cms",
    items: rij
      .map((r) => ({
        name: s(r.naam),
        role: s(r.functie),
        cover: cmsMedia(r.foto),
      }))
      .filter((p) => p.name),
  };
}

/** Ruimtes: het CMS kent geen ruimtecollectie, dus Supabase of demodata. */
export async function getSpaces(): Promise<Collectie<Space>> {
  const db = await leesTabel(
    "ruimtes",
    "slug, naam, omschrijving, cover, cover_alt, knoptekst",
    { kolom: "volgorde", oplopend: true },
  );
  if (!db) return { items: demoSpaces, bron: "demo" };
  return {
    bron: "supabase",
    items: db.map((r) => ({
      slug: s(r.slug),
      name: s(r.naam),
      desc: s(r.omschrijving),
      cover: s(r.cover),
      alt: s(r.cover_alt),
      cta: s(r.knoptekst),
    })),
  };
}

export async function getEvents(): Promise<
  Collectie<{ slug: string; name: string }>
> {
  const db = await leesTabel("evenementen", "slug, naam", {
    kolom: "id",
    oplopend: true,
  });
  if (!db) return { items: demoEvents, bron: "demo" };
  return {
    bron: "supabase",
    items: db.map((r) => ({ slug: s(r.slug), name: s(r.naam) })),
  };
}

/** Blokinhoud van een CMS-pagina, per bloktype en volgnummer. Leeg object = gebruik ontwerpcopy. */
export type BlokLezer = (type: string, n?: number) => Record<string, unknown>;

export async function pagina(slug: string): Promise<BlokLezer> {
  const st = await cmsStatus();
  const p =
    st.bron === "cms"
      ? st.site.paginas.find((x) => x.slug === slug)
      : undefined;
  return (type, n = 0) =>
    p?.blokken.filter((b) => b.type === type)[n]?.content ?? {};
}

/** Gedeelde Afsluitende oproep: het eerste cta-blok op de home (gedeeld blok in het CMS). */
export async function gedeeldeOproep(): Promise<Record<string, unknown>> {
  return (await pagina("/"))("cta");
}

export type CmsInfo = {
  bron: Bron;
  site: string | null;
  melding: string | null;
  beheerUrl: string | null;
};

export async function cmsInfo(): Promise<CmsInfo> {
  const st: CmsStatus = await cmsStatus();
  const beheer = cmsUrl();
  if (st.bron === "cms")
    return {
      bron: "cms",
      site: st.site.naam,
      melding: null,
      beheerUrl: beheer ? `${beheer}/admin/paginas` : null,
    };
  const sbUrl = supabaseConfig().url;
  if (supabase() && sbUrl) {
    const ref = new URL(sbUrl).hostname.split(".")[0];
    return {
      bron: "supabase",
      site: "NOVA-demodatabase (Supabase)",
      melding: st.reden === "fout" ? `CMS: ${st.melding}` : null,
      beheerUrl: `https://supabase.com/dashboard/project/${ref}/editor`,
    };
  }
  return {
    bron: "demo",
    site: null,
    melding:
      st.reden === "fout"
        ? st.melding
        : "Geen CMS- of Supabase-koppeling ingesteld",
    beheerUrl: null,
  };
}
