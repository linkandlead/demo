import "server-only";
import { cache } from "react";
import {
  cases as demoCases,
  people as demoPeople,
  posts as demoPosts,
  slugify,
  type Case,
  type Person,
  type Post,
} from "@/content/nova";
import { cmsMedia, cmsUrl, laadCms, type CmsStatus } from "./client";

// Eén plek die bepaalt waar de content vandaan komt: het gekoppelde CMS of de demodata.
// Alleen velden die écht in de CMS-lees-API bestaan worden gebruikt (allowlist in
// linkandlead-cms src/features/content/headlessrecords.ts). Velden die het NOVA-ontwerp
// toont maar die het CMS niet kent (bv. jaartal van een case) blijven dan leeg.

export type Bron = "cms" | "demo";
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
  if (!rij) return { items: demoCases, bron: "demo" };
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
  if (!rij) return { items: demoPosts, bron: "demo" };
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
  if (!rij) return { items: demoPeople, bron: "demo" };
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
  return {
    bron: "demo",
    site: null,
    melding: st.reden === "fout" ? st.melding : "Geen CMS-koppeling ingesteld",
    beheerUrl: null,
  };
}
