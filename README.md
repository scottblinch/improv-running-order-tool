# improv-running-order-tool

A client-side tool for building and managing improv **shows** — roster, lineup, cast assignments, and print-ready output. No backend; everything persists in the browser.

**Live site:** [scottblinch.github.io/improv-running-order-tool](https://scottblinch.github.io/improv-running-order-tool/)

## Features

- **Empty workspace** — first visit starts with no shows; welcome blurb and **New show** to begin; deleting the last show returns here
- **Multi-show workspace** — create, switch, duplicate, and delete saved shows in `localStorage` (grouped upcoming vs past by date)
- **Show details** — name, date, optional time and venue in one dialog (header edit button); delete show from the same dialog; included on print and in share links
- **Duplicate** — copy a show (confirmed) or a scene (from the scene menu, placed after the original)
- **Roster** — add, rename, mark absent, soft-delete with assignment choices; alphabetized list (present first, then absent)
- **Lineup** — scenes with host, players, or **all play**; drag-and-drop on desktop, selects on mobile; on mobile, roster and lineup are **collapsible** with sticky section headers and one page scroll
- **Share** — copy or native-share a link to the current show; open a link to import (deduped by content fingerprint). Chat apps show the generic app preview, not the show name
- **Print** — show title, date/time, venue, and lineup on the cast sheet; on-screen print preview (hidden when no shows); fit-to-page scaling
- **Theme** — light, dark, or system
- **PWA** — installable; works offline after first load (show data stays in `localStorage`); update toast after deploys; HTML fetched from network first so deploys show on the next refresh
- **Privacy** — share confirmation and footer privacy note (local storage, no cloud backup, share URLs, hosting)
- **Accessibility** — skip links, landmarks, screen-reader live announcements, keyboard paths for cast/reorder/print, ESLint `jsx-a11y`
- **i18n** — UI strings in `src/locales/en.json` (i18next + ICU; English only for now)
- **Branding** — Lucide **Drama** icon in the header (empty state), welcome blurb, and footer; PWA/favicon assets generated from `public/favicon.svg`; Open Graph / Twitter Card meta for link previews (512×512 icon thumbnail)

## Requirements

- Node.js 22+ (see [`.nvmrc`](.nvmrc))
- [pnpm](https://pnpm.io/installation) 11+ (see `packageManager` in `package.json`)

## Setup

```bash
pnpm install --frozen-lockfile
```

For local development, `pnpm install` is fine too.

## Development

```bash
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command                    | Description                                                 |
| -------------------------- | ----------------------------------------------------------- |
| `pnpm dev`                 | Start dev server                                            |
| `pnpm build`               | Typecheck + production build                                |
| `pnpm build:pages`         | Production build for GitHub Pages base path                 |
| `pnpm check`               | `lint` + `format:check` + `audit` + `test` + `build`        |
| `pnpm check:precommit`     | `lint` + `format:check` + `test` (runs on commit via Husky) |
| `pnpm check:pages`         | `lint` + `format:check` + `audit` + `test` + `build:pages`  |
| `pnpm test`                | Vitest unit + axe smoke tests                               |
| `pnpm audit`               | Dependency vulnerability audit (moderate+)                  |
| `pnpm fix`                 | ESLint auto-fix + Prettier write                            |
| `pnpm preview`             | Preview production build locally                            |
| `pnpm preview:pages`       | Build for GitHub Pages base path and preview                |
| `pnpm lint`                | Run ESLint                                                  |
| `pnpm lint:fix`            | ESLint with auto-fix                                        |
| `pnpm format`              | Prettier write                                              |
| `pnpm format:check`        | Prettier check                                              |
| `pnpm generate:pwa-assets` | Regenerate PWA icons from `public/favicon.svg`              |
| `pnpm generate:og-image`   | Regenerate `public/og-image.png` from `public/favicon.svg`  |

When you change `public/favicon.svg`, regenerate icons manually:

```bash
pnpm generate:pwa-assets && pnpm generate:og-image
```

Pull requests run [`ci.yml`](.github/workflows/ci.yml) (`pnpm check:pages` — same build as deploy). Pushes to `main` run [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) separately (`pnpm check:pages`, then GitHub Pages deploy) with split job permissions.

Local commits run [`check:precommit`](package.json) via [Husky](.husky/pre-commit) (lint, format check, tests — no build or audit).

## Testing

Vitest runs in `src/**/*.test.{ts,tsx}`. Component tests use jsdom; [`src/test/setup.ts`](src/test/setup.ts) mocks `localStorage` for Zustand persist.

[`src/a11y-smoke.test.tsx`](src/a11y-smoke.test.tsx) runs [axe-core](https://github.com/dequelabs/axe-core) smoke checks on key UI (forms, dialogs, empty workspace, collapsible panels, roster/lineup controls, cast slots in light and dark). [`src/test/vitest-axe.d.ts`](src/test/vitest-axe.d.ts) augments Vitest matchers for `tsc -b`.

Site title and description live in [`site-metadata.ts`](site-metadata.ts) and feed the HTML meta tags, Open Graph tags, and PWA manifest at build time.

Production JS is ~240 KB gzipped (single bundle). No server round-trips after load; acceptable for a client-side tool.

## Deploy

Pushes to `main` run [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) (`pnpm check:pages`, then deploy). You can also trigger a deploy manually from the Actions tab. In the repo **Settings → Pages**, set the source to **GitHub Actions**.

## Docs

- [`spec.md`](spec.md) — product requirements and data model
- [`plan.md`](plan.md) — implementation roadmap and status

## License

[GPL-2.0-only](LICENSE) — free to share and remix; keep it free for the next person.
