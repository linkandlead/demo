# NOVA gekoppeld aan Link & Lead One

NOVA is een eigen frontend (model A) op het Link & Lead One-CMS. De live site leest **alles** uit de
CMS-site **Demo Klant** (`demo.linkandlead.nl`, site-id `22222222-2222-2222-2222-222222222222`):
pagina's, blokken, navigatie, merk, huisstijl en collecties. Een redacteur past het in `/admin` aan en
binnen 60 seconden staat het op de site. Andere sites ("Nova Studio", "Stadstheater Nova") worden niet
gelezen of beschreven: het token is hard op Demo Klant gescopet.

## Wat je in het CMS beheert

| Op de site | In het CMS (Demo Klant) |
| --- | --- |
| Elke pagina (25): volgorde, teksten, beelden, knoppen | Pagina's → blokken. Een blok toevoegen, verwijderen of verslepen verandert de pagina. |
| Titel en beschrijving (SEO) per pagina | Pagina → titel / beschrijving |
| Afsluitende oproep onderaan | Het **laatste `cta`-blok** van de pagina |
| Hoofdmenu, footerkolommen, knop "Neem contact op" | Merk → `hoofd_nav`, `footer_kolommen`, `primaire_actie` |
| Kleuren (nacht, diep, wit, mist, limoen, steen) | Huisstijl → design tokens |
| Projecten (`/work`, home) | Collectie **Cases**: klantnaam, sector, jaar (`resultaat_periode`), uitdaging, citaat, diensten (`schakels`), foto |
| Verhalen (`/journal`, home, detail) | Collectie **Artikelen**: slug, titel, rubriek, samenvatting, hoofdtekst (`## kop` + alinea's), foto |
| Team (home, over ons, community) | Collectie **Teamleden**: naam, functie, tekst (bio), foto |
| Partners (community) | Collectie **Partners**: naam, branche, tagline, uitgelicht |
| Nieuwe ruimte/evenement/project | Nieuwe pagina met slug `/spaces/<naam>`, `/experiences/<naam>` of `/work/<naam>` |

Formulieren (contact, nieuwsbrief, formulierbouwer, review, NPS) nemen hun teksten (titel, intro,
knoptekst, voetnoot, bevestiging, velden) uit het blok. Inzendingen gaan naar Supabase (`aanvragen`),
nooit per mail. Alleen de demo-aanvraag op `/one` gaat daarnaast naar de CMS-leadflow (met `CMS_LEAD_SITE_ID`).

Hoe een blok eruitziet volgt uit de NOVA-vormgeving (`src/components/nova/Blokken.tsx`): bijvoorbeeld
kaarten mét beeld en link worden ruimtekaarten, een `reeks` met labels wordt een programma, een `header`
met hoogte "fullscreen" wordt de home-hero. Onbekende bloktypes worden overgeslagen.

**Niet uit het CMS** (bewust): de blokkenverkenner op `/playground`, de Demo Mode-rondleiding, de
footerregel "Gemaakt om te inspireren…" (de lees-API geeft `merk.footer` niet door) en vaste
veiligheidsteksten zoals "er wordt geen e-mail verstuurd".

## Terugval

Zonder `CMS_URL`/`CMS_TOKEN`, of als het CMS onbereikbaar is, rendert de site dezelfde inhoud uit
`src/content/blauwdruk.ts`. Collecties vallen terug op Supabase (project "demo") en daarna op de demodata.

## Blauwdruk opnieuw in het CMS zetten

`src/content/blauwdruk.ts` is de bron die in Demo Klant is gezet. Na een wijziging:

```bash
CMS_URL=https://linkandlead.nl CMS_TOKEN_FILE=<pad-naar-token> node scripts/cms-push.mjs
```

Let op: dit **overschrijft** de blokken van de pagina's in de blauwdruk (upsert op slug), dus ook
wijzigingen die een redacteur intussen in het CMS deed. De collecties staan in `cms/demo-klant-*.sql`.

## Variabelen (Vercel → Environment Variables, niet committen)

| Variabele | Doel |
| --- | --- |
| `CMS_URL` | `https://linkandlead.nl` |
| `CMS_TOKEN` | Bouwtoken van Demo Klant (gevoelig) |
| `CMS_LEAD_SITE_ID` | Optioneel: site die demo-aanvragen voor Link & Lead One ontvangt |
| `LEAD_PROXY_SECRET` | Optioneel, gelijk aan die in het CMS (rate-limit per bezoeker) |
| `DEMO_AANVRAAG_URL` | Optioneel: externe afsprakenpagina |

## Lokaal testen zonder productie

```bash
PORT=4000 TOKEN=cms_test node scripts/mock-cms.mjs
```

```bash
CMS_URL=http://localhost:4000 CMS_TOKEN=cms_test npm run build && npm start
```
