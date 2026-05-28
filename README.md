# improv-running-order-tool

Client-side improv **show** builder — roster, lineup, cast assignments, print/share. Data stays in the browser.

**Live:** [scottblinch.github.io/improv-running-order-tool](https://scottblinch.github.io/improv-running-order-tool/)

## Features

- **Shows** — create, switch, duplicate, delete (up to 32); empty workspace on first visit / after last delete
- **Roster & lineup** — absent/soft-delete; host, players, or all play; DnD on desktop, selects on mobile; collapsible panels on mobile
- **Show details** — name, date, optional time/venue; print + share
- **Share** — `?show=` URL import/export; generic link previews in chat apps
- **Print** — running order with fit-to-page preview
- **PWA** — offline shell, update toast; theme light/dark/system
- **Privacy** — local only, no cloud backup; share confirm + footer dialog

## Setup & dev

Node 22+ ([`.nvmrc`](.nvmrc)), pnpm 11+.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## Scripts

| Command                    | Description                                     |
| -------------------------- | ----------------------------------------------- |
| `pnpm check:pages`         | lint + format + audit + test + Pages build (CI) |
| `pnpm check`               | same, default base path                         |
| `pnpm check:precommit`     | lint + format + test (Husky)                    |
| `pnpm test`                | Vitest + axe smoke                              |
| `pnpm build:pages`         | GitHub Pages build                              |
| `pnpm preview:pages`       | build + preview Pages locally                   |
| `pnpm fix`                 | ESLint fix + Prettier                           |
| `pnpm generate:pwa-assets` | PWA icons + multi-size `favicon.ico` from SVG   |
| `pnpm generate:og-image`   | `public/og-image.png` from SVG                  |

After changing `public/favicon.svg`:

```bash
pnpm generate:pwa-assets && pnpm generate:og-image
```

## CI & deploy

PRs: [`ci.yml`](.github/workflows/ci.yml) → `pnpm check:pages`. `main` push: [`deploy-pages.yml`](.github/workflows/deploy-pages.yml). Pages source: **GitHub Actions**.

Metadata: [`site-metadata.ts`](site-metadata.ts). Bundle ~240 KB gzipped JS.

## Docs

- [`spec.md`](spec.md) — requirements & data model
- [`plan.md`](plan.md) — roadmap

## License

[GPL-2.0-only](LICENSE)
