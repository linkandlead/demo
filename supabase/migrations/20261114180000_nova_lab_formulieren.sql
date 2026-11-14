-- NOVA Lab: formulierbouwer, reviews en NPS worden net als contact/nieuwsbrief opgeslagen in `aanvragen`.
-- Reviews en NPS-scores mogen zonder e-mailadres; contact, nieuwsbrief en demo-aanvraag niet.
alter table public.aanvragen drop constraint if exists aanvragen_soort_check;
alter table public.aanvragen add constraint aanvragen_soort_check
  check (soort in ('contact', 'nieuwsbrief', 'demo-aanvraag', 'formulier', 'review', 'nps'));
alter table public.aanvragen alter column email drop not null;
alter table public.aanvragen add constraint aanvragen_email_verplicht
  check (email is not null or soort in ('formulier', 'review', 'nps'));
alter table public.aanvragen add column score smallint check (score between 0 and 10);
alter table public.aanvragen add column gegevens jsonb check (pg_column_size(gegevens) <= 8000);
