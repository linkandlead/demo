# NOVA × Link & Lead One

NOVA is een fictieve creatieve website: het visuele bewijs van wat je met een **eigen frontend (model A)**
op het **Link & Lead One-CMS** kunt bouwen. De route **`/one`** is de productpromotie van het CMS.

Next.js (App Router) · TypeScript · originele NOVA-CSS · lokaal gehoste Inter · CMS-lees-API

## Starten

```bash
npm install
```

```bash
npm run dev
```

Zonder `.env.local` draait de site op vaste demodata en verstuurt hij niets. Met `SUPABASE_URL` en `SUPABASE_PUBLISHABLE_KEY` komen de collecties uit de NOVA-demodatabase en worden formulieren daar opgeslagen (zie [`docs/supabase.md`](docs/supabase.md)). Koppelen aan het CMS: zie
[`docs/cms-koppeling.md`](docs/cms-koppeling.md).

## Live

**https://demo-link-and-lead.vercel.app** (Vercel-team Link-and-Lead, project `demo`). Productie is
openbaar; previews (per push) vragen een Vercel-login. Pushes naar deze branch maken automatisch een
preview. Productie is handmatig bijgewerkt, omdat de repo nog geen `main`-branch heeft. Zodra die er is
en als productiebranch is ingesteld, gaat dat vanzelf.

## Routes

`/` · `/work` · `/work/:slug` · `/journal` · `/journal/:slug` · `/experiences` · `/experiences/:slug` ·
`/spaces` · `/spaces/:slug` · `/community` · `/about` · `/contact` · `/lab` · `/members` · `/playground` ·
`/playground/sports` · `/demo` · `/one` (+ `POST /api/aanvraag`, `GET /__voorvertoning`)

Verkoopflow: homepage → _Ontdek het CMS_ (`/one`) → rondleiding (`/demo`, 7 stappen) → blokken
(`/playground`) → aanvraag (`/one#aanvraag`).

## Voorbeeld op de site (concept vanuit het CMS)

In het CMS-beheer opent de knop **"Voorbeeld op de site"** in de pagina-editor deze route:

`GET /__voorvertoning?pad=/x&token=<token>`

Het protocol komt uit linkandlead-cms (`src/features/voorvertoning/`, `src/core/auth/voorvertoning.ts`,
`src/routes/api/v1/pagina.ts`, `docs/bouwwijze.md` §6.3). De site kent geen geheim: ze controleert het
kortlevende token (30 minuten) door het CMS te vragen om `GET {CMS_URL}/api/v1/pagina?pad=…&voorvertoning=<token>`
met het leestoken (`CMS_TOKEN`). Alleen als het CMS `concept: true` teruggeeft, zet de site Next.js
draft mode aan, bewaart het token in een httpOnly-cookie en stuurt door naar het (interne) pad. Daarna
tonen de pagina's het concept (zonder cache), met onderaan de balk "Voorbeeld van het concept" en de
link "Voorbeeld sluiten" (`/__voorvertoning/sluiten`). Een ongeldig of verlopen token geeft geen
concept: de bezoeker gaat naar de gepubliceerde pagina. Bezoekers zonder draft mode zien niets anders.
Alle voorbeeldantwoorden zijn `no-store` en `noindex`.

**Instellen**

1. Vercel-project **demo** → Environment Variables (alleen namen hier; waarden nooit in git):
   - `CMS_URL`: het adres van het CMS (al ingesteld voor de koppeling);
   - `CMS_TOKEN`: het leestoken van de site **Demo Klant** (al ingesteld). Het voorvertoningstoken geldt
     alleen samen met een leestoken van dezelfde site.
   Er is geen extra variabele nodig.
2. CMS → **Siteregister** → Demo Klant → **Adres voor "Voorbeeld op de site"**:
   `https://demo.linkandlead.nl/__voorvertoning`
3. Het CMS controleert per website (tien minuten bewaard) of `?pad=/` met een geldig token 200 geeft;
   pas dan staat de knop aan. Het CMS zelf heeft daarvoor `VOORVERTONING_GEHEIM` (of
   `ADMIN_SESSIE_SECRET`) nodig; dat staat in het CMS-project, niet hier.

Lokaal testen: start het nep-CMS en een build ertegen, en draai dan
`ALLEEN=voorvertoning SITE_CMS=http://localhost:3001 MOCK_CMS=http://localhost:4000 npm run e2e`
(zie [`docs/cms-koppeling.md`](docs/cms-koppeling.md)).

## Scripts

| Script                                            | Doel                                                                   |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run build` / `npm start`                     | Productiebuild / starten                                               |
| `npm run lint` · `npm run typecheck` · `npm test` | Kwaliteitscontroles (unit-tests met `node --test`)                     |
| `npm run e2e`                                     | End-to-end + axe-core op een draaiende site (`SITE=…`)                 |
| `npm run visueel`                                 | Screenshotvergelijking met het prototype (prototype serveren op :8080) |
| `npm run mock-cms`                                | Nep-CMS met het echte API-contract, om de koppeling lokaal te testen   |

## Documentatie

- `src/content/teksten.ts`: alle definitieve websiteteksten (Nederlands), gebaseerd op _NOVA — alle definitieve websiteteksten_

- [`docs/supabase.md`](docs/supabase.md): NOVA-demodatabase in Supabase (collecties, formulierinzendingen, RLS)

- [`docs/fase-a-audit.md`](docs/fase-a-audit.md): verificatietabel CMS (bevestigd / ontbreekt / simulatie)
- [`docs/visuele-controle.md`](docs/visuele-controle.md): visuele vergelijking, afwijkingen, toegankelijkheid, performance
- [`docs/cms-koppeling.md`](docs/cms-koppeling.md): koppelen aan een geïsoleerde NOVA-demosite
- [`docs/vervolgstappen.md`](docs/vervolgstappen.md): wat er nog moet gebeuren
- `referentie/nova-bouwpakket/`: het aangeleverde overdrachtspakket (ontwerpbron, ongewijzigd)
- `cms/nova-blauwdruk.mjs`: blauwdruk voor `scripts/cms-push.mjs` in de CMS-repo
