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
`/playground/sports` · `/demo` · `/one` (+ `POST /api/aanvraag`)

Verkoopflow: homepage → _Ontdek het CMS_ (`/one`) → rondleiding (`/demo`, 7 stappen) → blokken
(`/playground`) → aanvraag (`/one#aanvraag`).

## Scripts

| Script                                            | Doel                                                                   |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run build` / `npm start`                     | Productiebuild / starten                                               |
| `npm run lint` · `npm run typecheck` · `npm test` | Kwaliteitscontroles (unit-tests met `node --test`)                     |
| `npm run e2e`                                     | End-to-end + axe-core op een draaiende site (`SITE=…`)                 |
| `npm run visueel`                                 | Screenshotvergelijking met het prototype (prototype serveren op :8080) |
| `npm run mock-cms`                                | Nep-CMS met het echte API-contract, om de koppeling lokaal te testen   |

## Documentatie

- [`docs/supabase.md`](docs/supabase.md): NOVA-demodatabase in Supabase (collecties, formulierinzendingen, RLS)

- [`docs/fase-a-audit.md`](docs/fase-a-audit.md): verificatietabel CMS (bevestigd / ontbreekt / simulatie)
- [`docs/visuele-controle.md`](docs/visuele-controle.md): visuele vergelijking, afwijkingen, toegankelijkheid, performance
- [`docs/cms-koppeling.md`](docs/cms-koppeling.md): koppelen aan een geïsoleerde NOVA-demosite
- [`docs/vervolgstappen.md`](docs/vervolgstappen.md): wat er nog moet gebeuren
- `referentie/nova-bouwpakket/`: het aangeleverde overdrachtspakket (ontwerpbron, ongewijzigd)
- `cms/nova-blauwdruk.mjs`: blauwdruk voor `scripts/cms-push.mjs` in de CMS-repo
