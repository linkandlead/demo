-- E2E-tests ruimen hun eigen inzendingen op. Een testinzending krijgt een willekeurige opruimcode
-- (uuid, gekozen door de test). Alleen wie die code kent, kan precies die rijen verwijderen, en
-- alleen het eerste uur. Er komt geen algemene delete-rechten bij: anon kan nog steeds niets lezen.
alter table public.aanvragen add column testcode uuid;
create index aanvragen_testcode_idx on public.aanvragen (testcode) where testcode is not null;

create function public.ruim_testinzendingen_op(code uuid)
returns integer
language sql
security definer
set search_path = ''
as $$
  with weg as (
    delete from public.aanvragen
    where testcode = code
      and aangemaakt_op > now() - interval '1 hour'
    returning 1
  )
  select count(*)::integer from weg;
$$;

revoke execute on function public.ruim_testinzendingen_op(uuid) from public;
grant execute on function public.ruim_testinzendingen_op(uuid) to anon, authenticated;
