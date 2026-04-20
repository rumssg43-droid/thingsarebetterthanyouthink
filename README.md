# Good News Generator

A fresh dose of good news every time you refresh. Claude searches a curated list of positive-news sites, writes summaries, and saves them to a JSON cache. The site picks a random story from the cache on every page load.

## Setup

```bash
cp .env.example .env.local
# add your ANTHROPIC_API_KEY
npm install
```

## Refresh the story pool

Runs Claude with web search and overwrites `data/stories.json`. Takes a minute or two and costs a few cents per run.

```bash
npm run refresh
```

Re-run whenever you want fresh stories (e.g. daily via cron or GitHub Actions).

## Run locally

```bash
npm run dev
```

Open <http://localhost:3000>. Each refresh shows a new random story from the cache.

## How it works

- `scripts/refresh-stories.ts` — one-shot Claude call with `web_search_20260209` + `web_fetch_20260209`. Returns ~30 stories as JSON, written to `data/stories.json`.
- `app/page.tsx` — server component, `dynamic = "force-dynamic"` so every request picks a fresh random story.
- `lib/stories.ts` — reads the cache, picks randomly, fetches the article's OpenGraph image on-demand (cached 24h by Next.js).

## Deploy

Vercel works out of the box. Add `ANTHROPIC_API_KEY` as an env var. To refresh the cache on a schedule, run `npm run refresh` in GitHub Actions and commit the updated `data/stories.json`.
