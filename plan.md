# Implementation Plan

Roadmap for building the Improv Show app. Product behavior and data rules live in [`spec.md`](spec.md); this file tracks **how** to build it and what’s left.

## Component architecture

Layered folders under `src/components/` — **no barrel `index.ts` files**; import from the module path.

| Layer       | Path                                              | Role                                                                                                                                                    |
| ----------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ui**      | `components/ui/`                                  | shadcn/Radix primitives (CLI-managed): `button`, `alert-dialog`, `tooltip`, `sonner`, …                                                                 |
| **layout**  | `components/layout/`                              | App chrome — shell, header, footer, empty workspace, share/import dialogs, show switcher, show details dialog, duplicate/delete show dialogs, skip link |
| **shared**  | `components/shared/`                              | Cross-feature UI (`EmptyState`, `CastSlot`, `RenameDialog`, `QuickAddForm`, `IconButtonTooltip`, `TitleWithIcon`, `FieldLabel`)                         |
| **a11y**    | `components/a11y/`                                | Live region for screen-reader announcements                                                                                                             |
| **feature** | `components/roster/`, `components/running-order/` | Domain panels and subcomponents                                                                                                                         |
| **theme**   | `components/theme/`                               | Theme provider, hook, toggle                                                                                                                            |
| **dnd**     | `components/dnd/`                                 | Desktop drag-and-drop provider and drag preview                                                                                                         |

Supporting folders (not under `components/`):

| Path         | Role                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `src/lib/`   | Pure logic — share encode/decode, import bootstrap, print fit, dates/times, cast a11y, a11y IDs, cast role styles |
| `src/store/` | Zustand stores and selectors (`useAppStore`, `useA11yAnnounceStore`, …)                                           |
| `src/hooks/` | Cross-cutting React hooks (`useDocumentTitle`, `useA11yAnnounce`, print fit scale)                                |
| `src/pwa/`   | Service worker registration and update toasts                                                                     |
| `src/test/`  | Vitest setup (e.g. `localStorage` mock for jsdom)                                                                 |

**Composition flow:** `App.tsx` → providers (`TooltipProvider`, `Toaster`) → `AppShell` (header + content + footer) → feature panels → list/item → `ui` + `shared`.

**Conventions:**

- Feature **panels** wire store + compose children; business logic lives in `store/` and `lib/`.
- User-visible strings live in `src/locales/en.json` (i18next + ICU).
- Code folder `running-order/` maps to UI label **Lineup**; persisted domain entity is **Show**.

## Status

| Step | Description                                   | Status |
| ---- | --------------------------------------------- | ------ |
| 1    | Vite + React + TypeScript scaffold            | Done   |
| 2    | Tailwind + shadcn/ui                          | Done   |
| 3    | Types + Zustand store                         | Done   |
| 4    | Static two-column layout                      | Done   |
| 5    | Roster + scenes (no drag)                     | Done   |
| 6    | Desktop drag-and-drop                         | Done   |
| 7    | Mobile assignment (dropdowns)                 | Done   |
| 8    | Print styles                                  | Done   |
| 9    | Polish & edge cases                           | Done   |
| 10   | Show metadata (name + date)                   | Done   |
| 11   | Multi-show workspace                          | Done   |
| 12   | All play scenes                               | Done   |
| 13   | Print preview + fit-to-page                   | Done   |
| 14   | i18n (i18next + ICU)                          | Done   |
| 15   | Input sanitization + persist hydration        | Done   |
| 16   | App footer                                    | Done   |
| 17   | Show sharing (URL + import)                   | Done   |
| 18   | PWA (installable + offline shell)             | Done   |
| 19   | Privacy (share confirm + footer note)         | Done   |
| 20   | Sonner toasts (share, import, PWA)            | Done   |
| 21   | Tooltips on icon-only buttons                 | Done   |
| 22   | Shared rename dialog + document title         | Done   |
| 23   | Accessibility pass (a11y audit + fixes)       | Done   |
| 24   | axe smoke tests + Vitest setup                | Done   |
| 25   | ESLint jsx-a11y                               | Done   |
| 26   | Husky pre-commit                              | Done   |
| 27   | DRY shared helpers (forms, cast, announce)    | Done   |
| 28   | Show details dialog (venue, time, v2 persist) | Done   |
| 29   | Deploy workflow hardening (split permissions) | Done   |
| 30   | Empty workspace (default first view)          | Done   |
| 31   | Duplicate show + duplicate scene              | Done   |
| 32   | Delete last show → empty workspace            | Done   |
| 33   | UI icons + Drama branding                     | Done   |
| 34   | PWA deploy refresh (NetworkFirst HTML)        | Done   |
| 35   | Mobile collapsible panels + sticky headers    | Done   |
| 36   | Launch hardening (CI, privacy, metadata)      | Done   |

---

## 1. Scaffold — Done

- [x] Vite + React + TypeScript
- [x] `package.json`: ESM, `GPL-2.0-only`, app scripts
- [x] GitHub Actions CI (PRs) and Pages deploy (`main` push, split job permissions)

---

## 2. Design system — Done

- [x] Tailwind CSS 4 + `@tailwindcss/vite`
- [x] shadcn/ui (`radix-nova`, Lucide, Geist)
- [x] Components: `button`, `input`, `card`, `badge`, `alert-dialog`, `dropdown-menu`, `select`, `popover`, `calendar`, `spinner`, `empty`, `tooltip`, `sonner`
- [x] `ThemeProvider` — light / dark / system toggle in header

---

## 3. Types + Zustand store — Done

- [x] `src/types/app.ts` — `Person`, `Scene`, `ShowRecord`, workspace types
- [x] `src/store/useAppStore.ts` — roster, scene, cast, show, and workspace actions
- [x] `src/store/selectors.ts` — active/castable persons, sorted lists, slot resolution
- [x] `src/store/useAppHydration.ts` — gate UI until `localStorage` rehydrates
- [x] `persist` → key `improv-running-order`; partialize `activeShowId` + `shows[]`
- [x] `hydrate-persisted-state.ts` — parse, normalize, sanitize on load
- [x] `migrate-persisted-state.ts` — `PERSIST_VERSION` + `migrate` hook (no legacy migrations; ready for future bumps)

---

## 4. Static layout — Done

- [x] Two-column shell: **Roster** (left) | **Lineup** (right); `EmptyWorkspace` when no shows
- [x] `AppHeader`, `AppFooter`, `PanelShell`, empty states
- [x] Desktop-first (`md:` side-by-side; stacked on narrow viewports)
- [x] Hydration gate before persisted UI

---

## 5. Roster + scenes — Done

- [x] Quick-add, rename, delete (with mode), mark absent
- [x] `CastSlot` / `AllPlaySlot` — normal vs warning slots
- [x] Scene cards: host, players, all play, rename, duplicate, remove
- [x] Roster sorted present A–Z then absent A–Z; castable lists alphabetized

---

## 6. Desktop drag-and-drop — Done

- [x] Scene reorder + roster → scene casting via `@dnd-kit`
- [x] DragOverlay stamp palette; scrollable columns

---

## 7. Mobile assignment — Done

- [x] `PersonSlotSelect` / `PersonAssignSelect` below `md`
- [x] `SceneReorderButtons` below `md`

---

## 8. Print — Done

- [x] `RunningOrderPrintView` — show title + date + scene/cast lines
- [x] `print:hidden` on chrome; `@media print` in `index.css`
- [x] `PrintPreviewToggle` + off-screen print target
- [x] `usePrintFitScale` / `lib/print-fit.ts` for fit-to-page

---

## 9. Polish & edge cases — Done

- [x] Keyboard: Enter on quick-adds and rename dialogs
- [x] a11y: labels, sr-only headings, `role="status"`, scene list as `ol`
- [x] CI: `pnpm check` on PRs; `check:pages` + deploy on `main` push
- [x] Roster hover highlight synced to lineup slots
- [x] Expanded in steps 23–27 (skip links, live region, axe tests, jsx-a11y lint, Husky, shared helpers)

---

## 10. Show metadata — Done

- [x] `showName` + `showDate` on `PersistedState`
- [x] `ShowDetailsDialog` — name, date (popover calendar), optional time and venue; explicit Save/Cancel
- [x] `setShowDetails` store action; `PERSIST_VERSION` 2 adds `showVenue` + `showTime`
- [x] Print header: title, date/time line, optional venue; document title includes time/venue when set
- [x] Share v2 payload keys `vn`, `tm`; switcher labels include metadata when set
- [x] Default name: "Untitled Show"

---

## 11. Multi-show workspace — Done

- [x] `WorkspacePersistedState` — `activeShowId`, `shows[]`
- [x] `createShow`, `switchShow`, `duplicateShow`, `deleteShow` actions
- [x] `ShowSwitcher` — upcoming vs past sections; sort by date then name; per-row duplicate/delete
- [x] `DeleteShowDialog`, `DuplicateShowDialog`; max 32 shows (`INPUT_LIMITS.maxShows`)
- [x] Deleting the last show returns to empty workspace

---

## 12. All play — Done

- [x] `isAllPlay` on `Scene`; `setAllPlay` store action
- [x] `SetAllPlayDialog` when players are assigned
- [x] Print suffix `+ ALL PLAY`

---

## 13. Print preview + fit-to-page — Done

- [x] `usePrintPreviewStore` toggles screen preview mode
- [x] Dynamic font scaling for long lineups

---

## 14. i18n — Done

- [x] `i18next`, `i18next-icu`, `react-i18next`
- [x] `src/locales/en.json` — all UI strings
- [x] `lib/i18n-labels.ts`, print/date formatters use i18n

---

## 15. Input sanitization + persist hydration — Done

- [x] `lib/input-security.ts` — limits, sanitization, `canAdd*` guards
- [x] `hydrate-persisted-state.ts` — normalize workspace on load
- [x] `migrate-persisted-state.ts` — `PERSIST_VERSION` 2 (`showVenue`, `showTime`); normalize on load via hydrate

---

## 16. App footer — Done

- [x] Author credit, GitHub issues link, GPL-2.0 summary with license link; Drama icon
- [x] `Trans` for inline links; hidden when printing and in print preview mode
- [x] `PrivacyDialog` — local storage, share links, GitHub Pages hosting note

---

## 17. Show sharing — Done

- [x] `lib/show-share.ts` — compact v2 payload, deflate + base64url, `?show=` query param; legacy v1 fallback
- [x] `lib/share-show-action.ts` — Web Share API with clipboard fallback; privacy skip preference in `localStorage`
- [x] `lib/import-shared-show.ts` — bootstrap import from URL on load
- [x] `lib/show-share-feedback.ts` — Sonner success/error toasts for share flows
- [x] `ShareShowButton`, `ShareConfirmDialog`, `ImportSharedShowDialog` in `layout/`
- [x] `shareKey` on `ShowRecord` — dedupe re-opened links (`importSharedShow` → `'imported' | 'existing' | 'full'`)
- [x] Max share param length guard; invalid/full workspace → error dialog; success → toast

---

## 18. PWA — Done

- [x] `vite-plugin-pwa` — manifest, Workbox, `registerType: 'autoUpdate'`
- [x] `src/pwa/register-service-worker.ts` — prod registration; update-available toast with Refresh action; visibility-based update check
- [x] NetworkFirst HTML navigations; no precached `index.html`
- [x] Icons via `pnpm generate:pwa-assets` from Drama `favicon.svg`; GitHub Pages uses `pnpm build:pages`

---

## 19. Privacy — Done

- [x] Share confirmation dialog before first share (optional “Don’t show again”)
- [x] Footer **Privacy** link → `PrivacyDialog` with plain-language notes

---

## 20. Sonner toasts — Done

- [x] `Toaster` in `App.tsx` (bottom-center)
- [x] Share success (copied / native shared), share errors, import success, PWA update prompt
- [x] Import/encode failures stay as dialogs when they need longer copy

---

## 21. Tooltips — Done

- [x] `TooltipProvider` in `App.tsx`
- [x] `IconButtonTooltip` in `shared/` — all icon-only buttons (header, roster, lineup, cast slots)
- [x] Dropdown triggers (theme, actions menus) use nested tooltip + menu pattern

---

## 22. Shared rename + document title — Done

- [x] `RenameDialog` in `shared/` — focus + select-all; wrappers for person and scene (show uses `ShowDetailsDialog`)
- [x] `lib/document-title.ts` + `useDocumentTitle` — `"[name] - [date] [time] - [venue] - …"` when metadata is set

---

## 23. Accessibility — Done

- [x] Skip links to roster and lineup headings (`SkipLink`, `lib/a11y-ids.ts`)
- [x] Landmarks: roster `<aside>`, lineup `<main>`, panel heading IDs
- [x] `useA11yAnnounceStore` + `A11yLiveRegion` — polite live announcements (clear-then-set for repeats)
- [x] `useA11yAnnounce` hook — i18n keys under `a11y.*`
- [x] Cast/reorder/rename/show-switch/print-preview/show-details announcements
- [x] Desktop keyboard cast path; mobile labeled selects; calendar month labels
- [x] Decorative icons and drag overlay `aria-hidden`; tooltips not in tab order where redundant

---

## 24. axe smoke tests — Done

- [x] `vitest-axe` + `axe-core` in `src/a11y-smoke.test.tsx`
- [x] Covers quick-add forms, dialogs, skip link, roster row, cast slots (light/dark), assign select, drag chip
- [x] `src/test/setup.ts` — `localStorage` mock + axe matchers; `src/test/vitest-axe.d.ts` for Vitest 4 types
- [x] Store unit tests: hydration, migrate, input-security, show-share, announce store

---

## 25. ESLint jsx-a11y — Done

- [x] `eslint-plugin-jsx-a11y` recommended flat config in `eslint.config.js`
- [x] shadcn `ui/` exempt from `heading-has-content` only

---

## 26. Husky pre-commit — Done

- [x] `husky` + `prepare` script
- [x] `.husky/pre-commit` → `pnpm check:precommit` (lint + format:check + test)

---

## 27. DRY shared helpers — Done

- [x] `QuickAddForm` — shared by `RosterQuickAdd` and `SceneQuickAdd`
- [x] `RenameDialog` — optional `announceMessageKey` / `getAnnounceParams` for rename wrappers
- [x] `lib/cast-a11y.ts` — performer name resolution + cast announcement helpers
- [x] `lib/cast-role-styles.ts` — `castDropSurfaceClasses` for host/player drop zones
- [x] `useA11yAnnounce` — single entry point for translated announcements

---

## 28. Show details expansion — Done

- [x] `showVenue` + `showTime` on `PersistedState`; `ShowDetails` type
- [x] `ShowDetailsDialog` replaces header rename button + inline date picker; includes delete show
- [x] `sanitizeShowVenue`, `sanitizeShowTime`; `formatShowDateTime` / `formatPrintTime`
- [x] Print, document title, switcher labels, and share encode/decode updated
- [x] `PERSIST_VERSION` 2 (single bump for venue + time)

---

## 29. Deploy workflow hardening — Done

- [x] `deploy-pages.yml` triggers on `main` push (not `workflow_run`)
- [x] Split permissions: build job `contents: read`; deploy job `pages: write` + `id-token: write`
- [x] `ci.yml` runs on pull requests only (`pnpm check`)

---

## 30. Empty workspace — Done

- [x] `EmptyWorkspace` — welcome blurb, Drama icon, **New show** button, footer pinned to bottom
- [x] `createInitialState()` and invalid persist fallback → zero shows (`createEmptyWorkspaceSlice`)
- [x] `AppShell` — roster/lineup only when `hasSavedShows`; header adapts (app title + Drama when empty)
- [x] Print preview toggle hidden until a show exists

---

## 31. Duplicate show + duplicate scene — Done

- [x] `duplicateShow` store action — clones roster, lineup, metadata; “(copy)” name suffix; switches to new show
- [x] `DuplicateShowDialog` + copy button on each row in `ShowSwitcher`
- [x] `duplicateScene` store action — inserts copy after source scene; no confirmation
- [x] Scene card dropdown **Duplicate** item
- [x] `cloneShowRecord`, `cloneScene`, `formatDuplicateShowName`, `formatDuplicateSceneName` in `lib/`

---

## 32. Delete last show — Done

- [x] `deleteShow` returns `createEmptyWorkspaceSlice()` when the last show is removed
- [x] `DeleteShowDialog` special copy for last show (`deleteLastDescription`)
- [x] Delete from show switcher and from **Show details** dialog footer

---

## 33. UI icons + Drama branding — Done

- [x] Lucide icons on panel headings, form labels (`FieldLabel`), dialogs, and action buttons (add/save/delete/duplicate/share)
- [x] Drama icon in empty-state header, welcome blurb (`EmptyMedia`), and footer
- [x] `public/favicon.svg` — Drama motif; `pnpm generate:pwa-assets` for ICO/PNG/PWA icons

---

## 34. PWA deploy refresh — Done

- [x] Workbox: no precached `index.html`; `navigateFallback: null`
- [x] NetworkFirst runtime cache for HTML navigations
- [x] `register-service-worker.ts` — check for SW updates on tab visibility

---

## 35. Mobile collapsible panels — Done

- [x] `MobileCollapsiblePanel` — full-width heading trigger, chevron, sticky headers on mobile
- [x] Single page scroll on mobile; independent column scroll at `md+`
- [x] Footer outside lineup collapsible on mobile; inside lineup scroll on desktop
- [x] `Collapsible` UI primitive (Radix)

---

## 36. Launch hardening — Done

- [x] CI PR checks use `check:pages` (same build as deploy)
- [x] Store tests for create/duplicate/delete show and duplicate scene
- [x] Privacy copy: no cloud backup, generic share link previews
- [x] `site-metadata.ts` — single source for title, description, PWA manifest
- [x] Single `PrivacyDialog` in `App.tsx`; footer links only in `AppFooter`
- [x] `public/robots.txt`; axe smoke for key dialogs and empty workspace
- [x] Expanded a11y smoke coverage

---

## Post-MVP (not yet implemented)

- [ ] Export / import JSON
- [ ] Back-to-back cast warning (same person in consecutive scenes)
- [ ] Additional locales beyond English

**Optional verification debt:** expand axe coverage to composite views (e.g. full `SceneCard`); jsdom does not fully evaluate color contrast.

---

## References

- [`spec.md`](spec.md) — requirements, data model, product decisions
- [`README.md`](README.md) — setup, scripts, deploy
