# NOVA-demodatabase (Supabase)

NOVA gebruikt het Supabase-project **`demo`** (`knkgvtmewegeczfdgjuq`, eu-central-1) als eigen,
geïsoleerde database. Het Link & Lead One-CMS en de andere sites worden niet aangeraakt.

De projectgegevens staan als standaard in `src/lib/supabase/server.ts`. De publishable key is
openbaar bedoeld; de rechten worden door RLS bepaald. Daardoor werkt Vercel zonder extra
instellingen. `SUPABASE_URL` en `SUPABASE_PUBLISHABLE_KEY` overschrijven die standaard, en
`SUPABASE_URL=""` schakelt Supabase uit.

## Volgorde van databronnen

1. **Link & Lead One-CMS** (`CMS_URL` + `CMS_TOKEN`): cases, artikelen, teamleden en paginateksten
2. **Supabase** (`SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY`): cases, artikelen, teamleden,
   ruimtes en evenementen, plus de opslag van formulierinzendingen
3. **Vaste demodata** uit het ontwerp (`src/content/nova.ts`)

Ruimtes en evenementen kent het CMS niet; die komen altijd uit Supabase (of de demodata). Het
demopaneel toont de actieve bron ("CMS · live", "Supabase · live" of "Demodata").

## Tabellen (migraties in `supabase/migrations/`)

| Tabel         | Inhoud                                                                                             | Publieke rechten (RLS)                                   |
| ------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `cases`       | slug, naam, sector, jaar, omschrijving, cover, volgorde                                            | lezen als `gepubliceerd`                                 |
| `artikelen`   | slug, titel, rubriek, leestijd, samenvatting, hoofdtekst, cover, gepubliceerd_op                   | lezen als `gepubliceerd`                                 |
| `teamleden`   | naam, functie, foto, volgorde                                                                      | lezen als `gepubliceerd`                                 |
| `ruimtes`     | slug, naam, omschrijving, cover, cover_alt, knoptekst, volgorde                                    | lezen als `gepubliceerd`                                 |
| `evenementen` | slug, naam                                                                                         | lezen als `gepubliceerd`                                 |
| `aanvragen`   | soort (contact / nieuwsbrief / demo-aanvraag), naam, email, bedrijf, onderwerp, vraag, bron_pagina | **alleen invoegen**: niet lezen, wijzigen of verwijderen |

`cover`/`foto` is een mediasleutel uit `public/media` (bv. `hero_arch`) of een volledige https-URL.
Hoofdtekst: alinea's gescheiden door een lege regel, tussenkopjes beginnen met `## `. Is de hoofdtekst leeg, dan toont de site de standaardtekst uit `src/content/teksten.ts`. Constraints bewaken lengtes, slugs en e-mailformaat.
De security-advisor van Supabase meldt geen problemen. Geverifieerd met de publieke sleutel: lezen
van `aanvragen` wordt geweigerd, ongeldige inzendingen geven 400 en updates op collecties hebben
geen effect.

## Formulieren

| Formulier                                      | Gedrag                                                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Contact (`/contact`), nieuwsbrief (`/journal`) | `POST /api/inzending` → tabel `aanvragen`. **Geen e-mail.**                                                           |
| Demo-aanvraag (`/one#aanvraag`)                | `POST /api/aanvraag` → tabel `aanvragen`, en daarnaast naar het CMS (`/api/cms/lead`) als `CMS_LEAD_SITE_ID` is gezet |
| Ledenlogin, tickets                            | blijven een zichtbare demonstratie                                                                                    |

Spamfilter (gelijk aan het CMS): honeypot `_website` en minimaal 2 seconden invultijd. Inzendingen
bekijk je in het Supabase-dashboard → Table editor → `aanvragen`.

## Content beheren

Supabase-dashboard → Table editor. Zet `gepubliceerd` aan om een rij te tonen; de site ververst
binnen ongeveer 60 seconden. Nieuwe slugs (bv. een extra ruimte) renderen zonder nieuwe deploy.

## NOVA Lab-formulieren (migratie `20261114180000_nova_lab_formulieren`)

`aanvragen.soort` kent nu ook `formulier` (formulierbouwer; antwoorden in `gegevens` jsonb),
`review` (sterren 1–5 in `score`, naam, tekst in `vraag`) en `nps` (score 0–10, toelichting in `vraag`).
Voor die drie is een e-mailadres optioneel. RLS blijft aan; anoniem mag alleen invoegen.

## E2E-tests ruimen zelf op (migratie `20261114200000_nova_testinzendingen_opruimen`)

`npm run e2e` stuurt bij elke inzending een willekeurige opruimcode mee (`_testcode`, kolom
`testcode`). Aan het eind roept de test `ruim_testinzendingen_op(code)` aan, die alleen rijen met
precies die code van het afgelopen uur wist. Er komen geen algemene lees- of verwijderrechten bij.
Breekt een testrun halverwege af, dan blijven de rijen van die run staan (herkenbaar aan `testcode`).
