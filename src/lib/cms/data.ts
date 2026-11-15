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
import { designTokens as blauwdrukTokens, merk as blauwdrukMerk } from "@/content/blauwdruk";
import { bios, partners as demoPartners } from "@/content/teksten";
import { leesTabel, supabase, supabaseConfig } from "@/lib/supabase/server";
import { cmsMedia, cmsUrl, laadCms, type CmsStatus } from "./client";
import type { CmsNavigatie } from "./valideer";

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
        year: s(r.resultaat_periode),
        cover: cmsMedia(r.foto),
        desc: s(r.uitdaging),
        statement: s(r.citaat),
        diensten: Array.isArray(r.schakels) ? r.schakels.map(s).filter(Boolean) : [],
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
          bio: bios[s(r.naam)] ? `${bios[s(r.naam)].kort} ${bios[s(r.naam)].lang}` : undefined,
        })),
      };
    return {
      items: demoPeople.map((p) => ({ ...p, bio: bios[p.name] ? `${bios[p.name].kort} ${bios[p.name].lang}` : undefined })),
      bron: "demo",
    };
  }
  return {
    bron: "cms",
    items: rij
      .map((r) => ({
        name: s(r.naam),
        role: s(r.functie),
        cover: cmsMedia(r.foto),
        bio: s(r.tekst) || undefined,
      }))
      .filter((p) => p.name),
  };
}

/** Ruwe records van een soort uit het CMS (alleen als een blok op een pagina ze opvraagt). */
export async function cmsRecords(soort: string): Promise<Record<string, unknown>[] | null> {
  const st = await cmsStatus();
  const rij = st.bron === "cms" ? st.site.records[soort] : undefined;
  return rij?.length ? rij : null;
}

export type Partner = { naam: string; vak: string; tekst: string; uitgelicht: boolean; quote?: string };

/** Partners (CMS-collectie "partners"); zonder CMS de fictieve partners uit de teksten. */
export async function getPartners(): Promise<Collectie<Partner>> {
  const st = await cmsStatus();
  const rij = st.bron === "cms" ? st.site.records.partners : undefined;
  if (!rij)
    return {
      bron: "demo",
      items: demoPartners.map(([naam, vak, tekst], i) => ({
        naam,
        vak,
        tekst,
        uitgelicht: i === 0,
        quote: i === 0 ? "Mooie dingen ontstaan als werelden elkaar ontmoeten." : undefined,
      })),
    };
  return {
    bron: "cms",
    items: rij
      .map((r) => ({
        naam: s(r.naam),
        vak: s(r.branche),
        tekst: s(r.tagline) || s(r.over_tekst),
        uitgelicht: r.uitgelicht === true,
        quote: s(r.quote) || undefined,
      }))
      .filter((p) => p.naam),
  };
}

export type SiteInstellingen = {
  naam: string;
  navigatie: CmsNavigatie;
  /** CSS-variabelen uit de twaalf huisstijlkleuren van het CMS. */
  cssVars: Record<string, string>;
};

const TOKEN_NAAR_VAR: Record<string, string> = {
  nacht: "--night",
  diep: "--deep",
  wit: "--cream",
  mist: "--mist",
  limoen: "--lime",
  steen: "--muted",
};

/** Merk, navigatie en huisstijl: uit het CMS, anders uit de blauwdruk. */
export async function siteInstellingen(): Promise<SiteInstellingen> {
  const st = await cmsStatus();
  const nav: CmsNavigatie =
    st.bron === "cms" && st.site.navigatie.hoofd.length
      ? st.site.navigatie
      : {
          hoofd: blauwdrukMerk.hoofd_nav,
          footer: blauwdrukMerk.footer_kolommen,
          actie: blauwdrukMerk.primaire_actie,
        };
  const tokens: Record<string, string> =
    st.bron === "cms" && Object.keys(st.site.designTokens).length ? st.site.designTokens : blauwdrukTokens;
  const cssVars: Record<string, string> = {};
  for (const [k, v] of Object.entries(TOKEN_NAAR_VAR)) if (tokens[k]) cssVars[v] = tokens[k];
  const merkNaam = st.bron === "cms" ? s(st.site.merk.naam) : "";
  return { naam: merkNaam || blauwdrukMerk.naam, navigatie: nav, cssVars };
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
