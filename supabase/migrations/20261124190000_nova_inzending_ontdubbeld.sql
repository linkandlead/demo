-- Dubbele inzendingen (testrapport T3): de site gebruikt de publieke sleutel, waarmee RLS wel invoegen maar geen lezen
-- toestaat. De controle "is dit zojuist al verstuurd?" in de applicatie zag daardoor nooit een bestaande rij. Deze functie
-- doet controle en opslaan in één stap, met een lock per inzending zodat ook twee gelijktijdige verzoeken één rij geven.
-- Alleen de bekende kolommen worden gevuld (geen goedgekeurd, geen testcode): een aanroeper kan er dus niets extra's mee.

create or replace function public.inzending_opslaan(p jsonb, seconden integer default 20)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  sleutel text;
begin
  if p is null or jsonb_typeof(p) <> 'object' then return 'fout'; end if;
  if (p->>'soort') not in ('contact', 'nieuwsbrief', 'demo-aanvraag', 'formulier', 'review', 'nps') then return 'fout'; end if;
  sleutel := md5(concat_ws('|', p->>'soort', p->>'email', p->>'naam', p->>'vraag', p->>'bron_pagina', (p->'gegevens')::text));
  perform pg_advisory_xact_lock(hashtext(sleutel));
  if exists (
    select 1 from public.aanvragen a
    where a.soort = p->>'soort'
      and a.email is not distinct from p->>'email'
      and a.naam is not distinct from p->>'naam'
      and a.vraag is not distinct from p->>'vraag'
      and a.bron_pagina is not distinct from p->>'bron_pagina'
      and a.gegevens is not distinct from (p->'gegevens')
      and a.testcode is null
      and a.aangemaakt_op >= now() - make_interval(secs => least(greatest(coalesce(seconden, 20), 1), 300))
  ) then
    return 'dubbel';
  end if;
  insert into public.aanvragen (soort, email, naam, bedrijf, onderwerp, vraag, bron_pagina, score, gegevens)
  values (
    p->>'soort', p->>'email', p->>'naam', p->>'bedrijf', p->>'onderwerp', p->>'vraag', p->>'bron_pagina',
    nullif(p->>'score', '')::smallint, p->'gegevens'
  );
  return 'opgeslagen';
end;
$$;
revoke execute on function public.inzending_opslaan(jsonb, integer) from public;
grant execute on function public.inzending_opslaan(jsonb, integer) to anon, authenticated;
