# improv-running-order-tool

A client-side tool for building and managing running orders for improv shows.

**Live site:** [scottblinch.github.io/improv-running-order-tool](https://scottblinch.github.io/improv-running-order-tool/)

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
- [`plan.md`](plan.md) — implementation roadmap
