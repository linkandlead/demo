@AGENTS.md

# NOVA × Link & Lead One — projectregels

Eigen frontend (model A) voor het Link & Lead One-CMS (`linkandlead/linkandlead-cms`). Content komt
uit `GET {CMS_URL}/api/cms/content` (token per site); zonder koppeling uit `src/content/nova.ts`.

## Visueel contract

- `src/styles/nova.css` is een **ongewijzigde** kopie van het prototype. Niet bewerken; aanvullingen
  en correcties horen in `src/styles/nova-extra.css`, met een korte reden erbij.
- Markup volgt `referentie/nova-bouwpakket/02_WEBSITE/scripts/nova-app.js` (zelfde klassen en volgorde).
  Een visuele afwijking komt eerst in `docs/visuele-controle.md` (verschilrapport).
- Geen Tailwind of componentbibliotheek. Gebruik de bestaande klassen.

## Structuur

- `src/app/` routes · `src/components/nova/` NOVA-componenten · `src/content/` demodata + 43 kernblokken
- `src/lib/supabase/` NOVA-demodatabase (project "demo"; schema in `supabase/migrations/`, zie `docs/supabase.md`)
- `src/lib/cms/` CMS-koppeling (server-only, runtime-validatie) · `src/lib/lead/` aanvraagvalidatie
- `cms/nova-blauwdruk.mjs` blauwdruk voor de CMS-sync · `scripts/` e2e, visuele vergelijking, nep-CMS

## Eerlijkheid en veiligheid

- Claim geen CMS-functies die niet in de CMS-repo bevestigd zijn (zie `docs/fase-a-audit.md`).
- NOVA-formulieren mailen nooit. Contact, nieuwsbrief en demo-aanvraag worden opgeslagen in Supabase
  (`aanvragen`); alleen `/api/aanvraag` stuurt daarnaast door naar het CMS, en alleen met `CMS_LEAD_SITE_ID`.
- Databaseschema alleen via migraties in `supabase/migrations/`; RLS blijft altijd aan.
- Nooit schrijven naar productie-CMS-data of naar andere sites ("Nova Studio" en "Stadstheater Nova"
  zijn andere sites). Secrets nooit committen.

## Controles voor een PR

`npm run lint && npm run typecheck && npm test && npm run build`. Bij visuele wijzigingen ook
`npm run visueel` en `npm run e2e` (zie README).

## Live zetten (main)

Er werken meerdere sessies aan deze site. **Voeg vóór elke push naar `main` eerst `origin/main`
samen** en controleer opnieuw; overschrijf nooit andermans werk (geen force-push). `npm run naar-main`
doet dat in één stap: fetch + merge van `origin/main`, lint, typecheck, tests, build, push van de
branch en van `main`. Bij een conflict: oplossen (beide wijzigingen behouden), committen, opnieuw
draaien. Raakt de wijziging CMS-inhoud, push dan alleen de betreffende pagina's
(`CMS_PAGINAS=… node scripts/cms-push.mjs`) en controleer eerst of ze in het CMS niet zijn aangepast.
