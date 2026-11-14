@AGENTS.md

# Projectnotities

Nieuwe website, gebouwd met Next.js (App Router) + TypeScript + Tailwind CSS v4, gehost op Vercel, met Supabase als backend.

## Structuur

- `src/app/` — routes, layouts en pagina's (App Router)
- `src/lib/supabase/client.ts` — Supabase-client voor Client Components
- `src/lib/supabase/server.ts` — Supabase-client voor Server Components / Server Actions
- `public/` — statische bestanden

## Commando's

- `npm run dev` — dev-server op http://localhost:3000
- `npm run lint` / `npm run typecheck` / `npm run format`
- `npm run build` — productiebuild (moet slagen voor een PR)

## Afspraken

- Teksten op de site zijn in het Nederlands; `<html lang="nl">`.
- Server Components standaard; `"use client"` alleen waar nodig.
- Secrets nooit committen; alleen `.env.example` staat in git.
