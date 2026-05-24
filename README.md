# improv-running-order-tool

A client-side tool for building and managing improv **shows** — roster, lineup, cast assignments, and print-ready output. No backend; everything persists in the browser.

**Live site:** [scottblinch.github.io/improv-running-order-tool](https://scottblinch.github.io/improv-running-order-tool/)

## Features

- **Multi-show workspace** — create, switch, and delete saved shows in `localStorage` (grouped upcoming vs past by date)
- **Roster** — add, rename, mark absent, soft-delete with assignment choices; alphabetized list (present first, then absent)
- **Lineup** — scenes with host, players, or **all play**; drag-and-drop on desktop, selects on mobile
- **Print** — show title and date on the cast sheet; on-screen print preview; fit-to-page scaling
- **Theme** — light, dark, or system
- **i18n** — UI strings in `src/locales/en.json` (i18next + ICU; English only for now)

## Requirements

- Node.js 22+ (see [`.nvmrc`](.nvmrc))

## Setup

```bash
npm ci
```

## Development

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Start dev server                             |
| `npm run build`         | Typecheck + production build                 |
| `npm run build:pages`   | Production build for GitHub Pages base path  |
| `npm run check`         | `lint` + `format:check` + `build`            |
| `npm run check:pages`   | `lint` + `format:check` + `build:pages`      |
| `npm run preview`       | Preview production build locally             |
| `npm run preview:pages` | Build for GitHub Pages base path and preview |
| `npm run lint`          | Run ESLint                                   |
| `npm run lint:fix`      | ESLint with auto-fix                         |
| `npm run format`        | Prettier write                               |
| `npm run format:check`  | Prettier check                               |
| `npm run fix`           | `lint:fix` then `format`                     |

Pushes to `main` and pull requests run [`ci.yml`](.github/workflows/ci.yml) (`npm run check`).

## Deploy

Pushes to `main` deploy to GitHub Pages via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). In the repo **Settings → Pages**, set the source to **GitHub Actions**.

## Docs

- [`spec.md`](spec.md) — product requirements and data model
- [`plan.md`](plan.md) — implementation roadmap and status

## License

[GPL-2.0-only](LICENSE) — free to share and remix; keep it free for the next person.
