-- NOVA-demodatabase (Supabase-project "demo"). Geïsoleerd van het Link & Lead One-CMS.
-- Collecties zijn publiek leesbaar zodra ze gepubliceerd zijn; aanvragen mogen anoniem worden
-- ingevoegd (met validatie in constraints) maar nooit anoniem gelezen.

create table public.cases (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  naam text not null check (char_length(naam) between 1 and 120),
  sector text not null default '' check (char_length(sector) <= 40),
  jaar text not null default '' check (char_length(jaar) <= 10),
  omschrijving text not null default '' check (char_length(omschrijving) <= 600),
  cover text not null default '' check (char_length(cover) <= 300),
  volgorde int not null default 0,
  gepubliceerd boolean not null default false,
  aangemaakt_op timestamptz not null default now()
);

create table public.artikelen (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,120}$'),
  titel text not null check (char_length(titel) between 1 and 200),
  rubriek text not null default '' check (char_length(rubriek) <= 40),
  leestijd text not null default '' check (char_length(leestijd) <= 30),
  samenvatting text not null default '' check (char_length(samenvatting) <= 600),
  hoofdtekst text not null default '',
  cover text not null default '' check (char_length(cover) <= 300),
  gepubliceerd_op date not null default current_date,
  gepubliceerd boolean not null default false,
  aangemaakt_op timestamptz not null default now()
);

create table public.teamleden (
  id bigint generated always as identity primary key,
  naam text not null check (char_length(naam) between 1 and 120),
  functie text not null default '' check (char_length(functie) <= 120),
  foto text not null default '' check (char_length(foto) <= 300),
  volgorde int not null default 0,
  gepubliceerd boolean not null default false
);

create table public.ruimtes (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  naam text not null check (char_length(naam) between 1 and 120),
  omschrijving text not null default '' check (char_length(omschrijving) <= 600),
  cover text not null default '' check (char_length(cover) <= 300),
  cover_alt text not null default '' check (char_length(cover_alt) <= 200),
  knoptekst text not null default 'Bekijk de ruimte' check (char_length(knoptekst) <= 60),
  volgorde int not null default 0,
  gepubliceerd boolean not null default false
);

create table public.evenementen (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  naam text not null check (char_length(naam) between 1 and 120),
  gepubliceerd boolean not null default false
);

create table public.aanvragen (
  id bigint generated always as identity primary key,
  soort text not null check (soort in ('contact', 'nieuwsbrief', 'demo-aanvraag')),
  naam text check (char_length(naam) <= 200),
  email text not null check (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  bedrijf text check (char_length(bedrijf) <= 200),
  onderwerp text check (char_length(onderwerp) <= 200),
  vraag text check (char_length(vraag) <= 2000),
  bron_pagina text check (char_length(bron_pagina) <= 200),
  aangemaakt_op timestamptz not null default now()
);

alter table public.cases enable row level security;
alter table public.artikelen enable row level security;
alter table public.teamleden enable row level security;
alter table public.ruimtes enable row level security;
alter table public.evenementen enable row level security;
alter table public.aanvragen enable row level security;

create policy "gepubliceerde cases lezen" on public.cases for select to anon, authenticated using (gepubliceerd);
create policy "gepubliceerde artikelen lezen" on public.artikelen for select to anon, authenticated using (gepubliceerd);
create policy "gepubliceerde teamleden lezen" on public.teamleden for select to anon, authenticated using (gepubliceerd);
create policy "gepubliceerde ruimtes lezen" on public.ruimtes for select to anon, authenticated using (gepubliceerd);
create policy "gepubliceerde evenementen lezen" on public.evenementen for select to anon, authenticated using (gepubliceerd);

-- Alleen invoegen; geen select/update/delete-policy, dus inzendingen zijn niet uit te lezen met de publieke sleutel.
create policy "aanvraag indienen" on public.aanvragen for insert to anon, authenticated with check (aangemaakt_op >= now() - interval '1 minute');
revoke select, update, delete on public.aanvragen from anon, authenticated;

create index cases_volgorde_idx on public.cases (volgorde) where gepubliceerd;
create index artikelen_datum_idx on public.artikelen (gepubliceerd_op desc) where gepubliceerd;
create index aanvragen_datum_idx on public.aanvragen (aangemaakt_op desc);
