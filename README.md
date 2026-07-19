# Priors

A home for open, pre-registered quantitative research across topics.
Each research project lives in its own repository, with its own data
pipeline and its own published site — this repo is the index: it lists
every project and aggregates each one's decision board (`board.md`)
live at build time, so the state of every hypothesis is visible in one
place without manually copying anything.

## How it works

- `src/data/projects.ts` — the list of linked research repositories
  (name, description, site URL, and where to find `board.md`).
- `src/lib/fetchBoard.ts` — at build time, fetches and parses each
  linked repo's `board.md` directly from GitHub (raw content, no
  submodules, no manual sync).
- `src/pages/index.astro` — renders the project list and the
  aggregated status table.

Adding a new research project means adding one entry to
`projects.ts` — nothing else changes.

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds
the site with Astro and publishes it to GitHub Pages.

## Linked projects

- [btc_candles_research](https://github.com/nobodywhois0/btc_candles_research) — is there a statistical edge in BTC/USDT's 5-minute candle direction?
