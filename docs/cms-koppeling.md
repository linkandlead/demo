# NOVA koppelen aan Link & Lead One

Zonder configuratie draait NOVA op de demodata uit het ontwerp, en zegt dat ook (demopaneel → _Databron: Demodata_).
Er wordt dan niets verstuurd. Koppelen gaat in drie stappen. Geen van die stappen is in deze
overdracht uitgevoerd: ze raken het productie-CMS en vragen jouw akkoord.

## 1. Geïsoleerde NOVA-demosite in het CMS

1. Ga in het CMS naar `/admin/platform` → **+ Nieuwe website** en maak een nieuwe site, bijvoorbeeld
   "NOVA demo". Gebruik **niet** de bestaande sites "Nova Studio" of "Stadstheater Nova".
2. Genereer het API-token (`cms_…`) van die site. Het token is hard op die ene site gescopet, dus
   andere sites kunnen er nooit mee worden gelezen of gewijzigd.
3. Vul de site vanuit de `linkandlead-cms`-repo met de blauwdruk uit deze repo:

```bash
CMS_URL=https://<cms-domein> CMS_TOKEN=cms_... node scripts/cms-push.mjs ../demo/cms/nova-blauwdruk.mjs
```

4. Voeg in `/admin` de collecties toe (cases, artikelen, teamleden). Die zitten niet in de blauwdruk.

## 2. Frontend-variabelen (Vercel → Environment Variables, niet committen)

| Variabele           | Doel                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `CMS_URL`           | Basis-URL van het CMS                                                                                                 |
| `CMS_TOKEN`         | Token van de NOVA-demosite (stap 1)                                                                                   |
| `CMS_LEAD_SITE_ID`  | Site-id (uuid) die **demo-aanvragen voor Link & Lead One** ontvangt, dus de eigen verkoopsite. Niet de NOVA-demosite. |
| `LEAD_PROXY_SECRET` | Optioneel, gelijk aan die in het CMS: dan telt de rate-limit per bezoeker in plaats van per server                    |
| `DEMO_AANVRAAG_URL` | Optioneel: externe afsprakenpagina, getoond naast het formulier op `/one#aanvraag`                                    |

Content ververst elke 60 seconden. Het demopaneel toont dan _CMS · live_ en een link naar `/admin/paginas`.

## 3. Wat er uit het CMS komt

| NOVA-onderdeel                                 | CMS-bron                 | Velden                                                                          |
| ---------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------- |
| Home-hero                                      | blok `header` op `/`     | `eyebrow`, `heading` (regels met `\n`), `subheading`, `cta_primair_label/_link` |
| Home "Our world"                               | blok `mediatekst` op `/` | `eyebrow`, `titel`, `knop`, `knoptekst`                                         |
| Home-statement                                 | blok `statement` op `/`  | `eyebrow`, `titel`, `knop`, `knoptekst`                                         |
| Gedeelde oproep (alle pagina's)                | eerste blok `cta` op `/` | `eyebrow`, `titel`, `knop`, `knoptekst`                                         |
| Cases (home, `/work`, `/work/:slug`)           | `records.cases`          | `klantnaam`, `sector`, `uitdaging`, `foto` (geen jaartal in het CMS)            |
| Artikelen (home, `/journal`, `/journal/:slug`) | `records.artikelen`      | `slug`, `titel`, `rubriek`, `samenvatting`, `hoofdtekst`, `foto`                |
| Team / sprekers                                | `records.teamleden`      | `naam`, `functie`, `foto`                                                       |

Records komen alleen mee als het bijbehorende blok (`cases_grid`, `artikelen_grid`, `mensen`) op een
gepubliceerde pagina staat. De blauwdruk zet ze op de home.

## Lokaal testen zonder productie

```bash
PORT=4000 TOKEN=cms_test node scripts/mock-cms.mjs
```

```bash
CMS_URL=http://localhost:4000 CMS_TOKEN=cms_test CMS_LEAD_SITE_ID=00000000-0000-4000-8000-000000000001 npm run build && npm start
```

`scripts/mock-cms.mjs` volgt exact het contract van `/api/cms/content` en `/api/cms/lead`. Het schrijft leads naar een lokaal bestand.
