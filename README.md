# Nieuwe website

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Vercel

## Aan de slag

```bash
npm install
cp .env.example .env.local   # vul Supabase URL + publishable key in
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script              | Doel                                       |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Dev-server                                 |
| `npm run build`     | Productiebuild                             |
| `npm run lint`      | ESLint                                     |
| `npm run typecheck` | TypeScript-controle                        |
| `npm run format`    | Prettier (incl. Tailwind-klassensortering) |

## Deploy

Koppel de repo aan een Vercel-project en zet `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` als environment variables.
