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
};

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
