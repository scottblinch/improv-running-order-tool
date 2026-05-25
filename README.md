# improv-running-order-tool

A client-side tool for building and managing improv **shows** — roster, lineup, cast assignments, and print-ready output. No backend; everything persists in the browser.

**Live site:** [scottblinch.github.io/improv-running-order-tool](https://scottblinch.github.io/improv-running-order-tool/)

## Features

- **Multi-show workspace** — create, switch, and delete saved shows in `localStorage` (grouped upcoming vs past by date)
- **Roster** — add, rename, mark absent, soft-delete with assignment choices; alphabetized list (present first, then absent)
- **Lineup** — scenes with host, players, or **all play**; drag-and-drop on desktop, selects on mobile
- **Share** — copy or native-share a link to the current show; open a link to import (deduped by content fingerprint)
- **Print** — show title and date on the cast sheet; on-screen print preview; fit-to-page scaling
- **Theme** — light, dark, or system
- **PWA** — installable; works offline after first load (show data stays in `localStorage`); update toast after deploys
- **Privacy** — share confirmation and footer privacy note (local storage, share URLs, hosting)
- **Accessibility** — skip links, landmarks, screen-reader live announcements, keyboard paths for cast/reorder/print, ESLint `jsx-a11y`
- **i18n** — UI strings in `src/locales/en.json` (i18next + ICU; English only for now)

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

Pushes to `main` and pull requests run [`ci.yml`](.github/workflows/ci.yml) (`pnpm check`).

Local commits run [`check:precommit`](package.json) via [Husky](.husky/pre-commit) (lint, format check, tests — no build or audit).

## Testing

Vitest runs in `src/**/*.test.{ts,tsx}`. Component tests use jsdom; [`src/test/setup.ts`](src/test/setup.ts) mocks `localStorage` for Zustand persist.

[`src/a11y-smoke.test.tsx`](src/a11y-smoke.test.tsx) runs [axe-core](https://github.com/dequelabs/axe-core) smoke checks on key UI (forms, dialogs, roster/lineup controls, cast slots in light and dark).

## Deploy

Successful pushes to `main` run CI first; [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) deploys to GitHub Pages only after CI passes. You can also trigger a deploy manually from the Actions tab. In the repo **Settings → Pages**, set the source to **GitHub Actions**.

## Docs

- [`spec.md`](spec.md) — product requirements and data model
- [`plan.md`](plan.md) — implementation roadmap and status

## License

[GPL-2.0-only](LICENSE) — free to share and remix; keep it free for the next person.
