# Things Are Better Than You Think

An evidence-based antidote to the doom cycle. A single story about how humanity is quietly winning, every time you refresh.

Claude searches rigorous progress journalism — Our World in Data, Fix The News, Human Progress, Reasons to be Cheerful, the Guardian Upside — writes summaries, and saves ~20 structural-progress stories to a JSON cache. The site picks a random one on every page load.

## Setup

```bash
cp .env.example .env.local
# add your ANTHROPIC_API_KEY
npm install
```

## Refresh the story pool

Runs Claude with web search and overwrites `data/stories.json`. Takes a few minutes and costs a few cents per run.

```bash
npm run refresh
```

Re-run whenever you want a fresh pool (weekly is fine).

## Run locally

```bash
npm run dev
```

Open <http://localhost:3000>. Every refresh shows a new random story.

## How it works

- `scripts/refresh-stories.ts` — Claude Opus 4.7 with `web_search_20260209`. Prompt explicitly favors structural civilization-scale progress (disease eradication, poverty decline, renewables milestones, rewilding) over individual feel-good stories. Writes to `data/stories.json`.
- `app/page.tsx` — server component with `dynamic = "force-dynamic"`, picks a random story per request.
- `lib/stories.ts` — reads cache, picks random, fetches the article's OpenGraph image on-demand (cached 24h).

## Deploy

Railway or Vercel both work. Add `ANTHROPIC_API_KEY` as an env var. To refresh the cache, run `npm run refresh` locally, commit the updated `data/stories.json`, and push — the host auto-redeploys.
