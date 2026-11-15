-- 17. Reviews met goedkeuring: alleen goedgekeurde reviews zijn openbaar (via een functie, niet de tabel).
alter table public.aanvragen add column if not exists goedgekeurd boolean not null default false;

create or replace function public.goedgekeurde_reviews(aantal integer default 6)
returns table (naam text, score smallint, tekst text, aangemaakt_op timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select a.naam, a.score, a.vraag, a.aangemaakt_op
  from public.aanvragen a
  where a.soort = 'review' and a.goedgekeurd and a.testcode is null
  order by a.aangemaakt_op desc
  limit least(greatest(coalesce(aantal, 6), 1), 24);
$$;
revoke execute on function public.goedgekeurde_reviews(integer) from public;
grant execute on function public.goedgekeurde_reviews(integer) to anon, authenticated;

-- 16. Overzicht voor het dashboard (Table Editor / SQL): leesbaar, nieuwste eerst, zonder testinzendingen.
-- Alleen voor de eigenaar: anon en authenticated hebben er geen rechten op.
create or replace view public.inzendingen_overzicht with (security_invoker = true) as
  select aangemaakt_op as ontvangen, soort, naam, email, bedrijf, onderwerp, score,
         coalesce(vraag, gegevens::text) as inhoud, bron_pagina as pagina,
         case when soort = 'review' then (case when goedgekeurd then 'goedgekeurd' else 'wacht op goedkeuring' end) end as review_status
  from public.aanvragen
  where testcode is null
  order by aangemaakt_op desc;
revoke all on public.inzendingen_overzicht from anon, authenticated;

-- 18. Limiet per bezoeker: hoogstens `maximum` (standaard 8, hoogstens 1000) inzendingen per 10 minuten per
-- (gehashte) bezoeker.
-- De sleutel is een SHA-256 van IP + dagelijks wisselend zout; het IP-adres zelf wordt nergens bewaard.
create table if not exists public.inzending_pogingen (
  sleutel text not null check (char_length(sleutel) = 64),
  tijd timestamptz not null default now()
);
create index if not exists inzending_pogingen_idx on public.inzending_pogingen (sleutel, tijd desc);
alter table public.inzending_pogingen enable row level security;
revoke all on public.inzending_pogingen from anon, authenticated;

create or replace function public.mag_inzenden(sleutel text, maximum integer default 8)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  aantal integer;
begin
  if sleutel !~ '^[0-9a-f]{64}$' then return false; end if;
  delete from public.inzending_pogingen where tijd < now() - interval '1 hour';
  select count(*) into aantal from public.inzending_pogingen p
    where p.sleutel = mag_inzenden.sleutel and p.tijd > now() - interval '10 minutes';
  if aantal >= least(greatest(coalesce(maximum, 8), 1), 1000) then return false; end if;
  insert into public.inzending_pogingen (sleutel) values (mag_inzenden.sleutel);
  return true;
end;
$$;
revoke execute on function public.mag_inzenden(text, integer) from public;
grant execute on function public.mag_inzenden(text, integer) to anon, authenticated;
