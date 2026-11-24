import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase-project "demo": de NOVA-demodatabase (geïsoleerd van het Link & Lead One-CMS).
// Alleen de publieke (publishable) sleutel; RLS bepaalt wat mag: gepubliceerde collecties lezen
// en aanvragen invoegen. Schema: supabase/migrations/.

// Standaard: het NOVA-project "demo". De publishable key is bedoeld om openbaar te zijn (net als
// een anon key in de browser); RLS bepaalt de rechten. Overschrijf met env-variabelen, of zet
// SUPABASE_URL="" om Supabase uit te schakelen (dan vaste demodata).
const STANDAARD_URL = "https://knkgvtmewegeczfdgjuq.supabase.co";
const STANDAARD_KEY = "sb_publishable_ZCyfFq_5EFMdjlO_JR4k4Q_7j-icx-l";

export function supabaseConfig(): { url: string; key: string } {
  return {
    url: (process.env.SUPABASE_URL ?? STANDAARD_URL).trim(),
    key: (process.env.SUPABASE_PUBLISHABLE_KEY ?? STANDAARD_KEY).trim(),
  };
}

let client: SupabaseClient | null | undefined;

export function supabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const { url, key } = supabaseConfig();
  client =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          // Collecties verversen elke 60 s, gelijk aan de CMS-koppeling.
          global: {
            fetch: (input, init) =>
              fetch(input, {
                ...init,
                ...(init?.method && init.method !== "GET"
                  ? { cache: "no-store" }
                  : { next: { revalidate: 60 } }),
              }),
          },
        })
      : null;
  return client;
}

export type SupabaseRij = Record<string, unknown>;

/** Gepubliceerde rijen van een tabel; null = Supabase niet ingesteld of niet bereikbaar. */
export async function leesTabel(
  tabel: string,
  kolommen: string,
  sorteer: { kolom: string; oplopend: boolean },
): Promise<SupabaseRij[] | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from(tabel)
    .select(kolommen)
    .order(sorteer.kolom, { ascending: sorteer.oplopend });
  if (error) {
    console.error(`Supabase: ${tabel} lezen mislukt`, error.message);
    return null;
  }
  return (data ?? []) as unknown as SupabaseRij[];
}

export type Inzending = {
  soort: "contact" | "nieuwsbrief" | "demo-aanvraag" | "formulier" | "review" | "nps";
  email?: string;
  naam?: string;
  bedrijf?: string;
  onderwerp?: string;
  vraag?: string;
  bron_pagina?: string;
  /** NPS 0–10 of review 1–5. */
  score?: number;
  /** Antwoorden uit de formulierbouwer (label → waarde). */
  gegevens?: Record<string, string>;
  /** Opruimcode van een E2E-testinzending (zie migratie nova_testinzendingen_opruimen). */
  testcode?: string;
};

/** Is dezelfde inzending zojuist al opgeslagen (een dubbelklik, of een verzoek dat de browser herhaalt)? Gelijk = zelfde
 *  soort, e-mailadres, naam, tekst en bronpagina binnen `seconden`. Dan telt de tweede niet mee. */
export async function isRecentDubbel(i: Inzending, seconden = 20): Promise<boolean> {
  const sb = supabase();
  if (!sb) return false;
  const vanaf = new Date(Date.now() - seconden * 1000).toISOString();
  let q = sb.from("aanvragen").select("id").eq("soort", i.soort).gte("aangemaakt_op", vanaf).limit(1);
  for (const [kolom, waarde] of [["email", i.email], ["naam", i.naam], ["vraag", i.vraag], ["bron_pagina", i.bron_pagina]] as const)
    q = waarde === undefined ? q.is(kolom, null) : q.eq(kolom, waarde);
  if (i.gegevens) q = q.eq("gegevens", i.gegevens);
  const { data, error } = await q;
  return !error && Array.isArray(data) && data.length > 0;
}

/** Slaat een inzending op in public.aanvragen. Er wordt niets gemaild. */
export async function bewaarInzending(
  i: Inzending,
): Promise<"opgeslagen" | "niet-ingesteld" | "fout"> {
  const sb = supabase();
  if (!sb) return "niet-ingesteld";
  const { error } = await sb.from("aanvragen").insert(i);
  if (error) {
    console.error("Supabase: inzending opslaan mislukt", error.message);
    return "fout";
  }
  return "opgeslagen";
}

/** Limiet per bezoeker (punt 18): SHA-256 van IP + dagelijks zout, nooit het IP zelf. Ontbreekt de
 *  databasefunctie of is Supabase onbereikbaar, dan laten we door (liever een spambericht dan een
 *  echte aanvraag weigeren). */
export async function magInzenden(request: Request): Promise<boolean> {
  const sb = supabase();
  if (!sb) return true;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "onbekend";
  const zout = `${process.env.INZENDING_ZOUT ?? "nova"}:${new Date().toISOString().slice(0, 10)}`;
  const data = new TextEncoder().encode(`${zout}:${ip}`);
  const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))].map((b) => b.toString(16).padStart(2, "0")).join("");
  const maximum = Number(process.env.INZENDING_LIMIET) || 8;
  const { data: mag, error } = await sb.rpc("mag_inzenden", { sleutel: hash, maximum });
  if (error) {
    console.error("Supabase: limietcontrole niet beschikbaar", error.message);
    return true;
  }
  return mag !== false;
}

export type GoedgekeurdeReview = { naam: string; score: number; tekst: string };

/** Goedgekeurde reviews uit de NOVA-demodatabase (alleen via de functie goedgekeurde_reviews). */
export async function goedgekeurdeReviews(aantal = 6): Promise<GoedgekeurdeReview[] | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data, error } = await sb.rpc("goedgekeurde_reviews", { aantal });
  if (error || !Array.isArray(data) || !data.length) return null;
  return (data as Array<Record<string, unknown>>).map((r) => ({
    naam: String(r.naam ?? ""),
    score: Number(r.score) || 5,
    tekst: String(r.tekst ?? ""),
  }));
}
