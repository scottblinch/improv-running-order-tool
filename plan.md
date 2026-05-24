# Implementation Plan

Roadmap for building the Improv Show app. Product behavior and data rules live in [`spec.md`](spec.md); this file tracks **how** to build it and what’s left.

## Component architecture

Layered folders under `src/components/` — **no barrel `index.ts` files**; import from the module path.

| Layer       | Path                                              | Role |
| ----------- | ------------------------------------------------- | ---- |
| **ui**      | `components/ui/`                                  | shadcn/Radix primitives (CLI-managed) |
| **layout**  | `components/layout/`                              | App chrome — shell, header, footer, loading, panel wrapper, show switcher, date picker, dialogs |
| **shared**  | `components/shared/`                              | Cross-feature UI (`EmptyState`, `CastSlot`, `AllPlaySlot`) |
| **feature** | `components/roster/`, `components/running-order/` | Domain panels and subcomponents |
| **theme**   | `components/theme/`                               | Theme provider, hook, toggle |
| **dnd**     | `components/dnd/`                                 | Desktop drag-and-drop provider and drag preview |

**Composition flow:** `App.tsx` → `AppShell` (header + content + footer) → feature panels → list/item → `ui` + `shared`.

**Conventions:**

- Feature **panels** wire store + compose children; business logic lives in `store/` and `lib/`.
- User-visible strings live in `src/locales/en.json` (i18next + ICU).
- Code folder `running-order/` maps to UI label **Lineup**; persisted domain entity is **Show**.

## Status

| Step | Description | Status |
| ---- | ----------- | ------ |
| 1 | Vite + React + TypeScript scaffold | Done |
| 2 | Tailwind + shadcn/ui | Done |
| 3 | Types + Zustand store | Done |
| 4 | Static two-column layout | Done |
| 5 | Roster + scenes (no drag) | Done |
| 6 | Desktop drag-and-drop | Done |
| 7 | Mobile assignment (dropdowns) | Done |
| 8 | Print styles | Done |
| 9 | Polish & edge cases | Done |
| 10 | Show metadata (name + date) | Done |
| 11 | Multi-show workspace | Done |
| 12 | All play scenes | Done |
| 13 | Print preview + fit-to-page | Done |
| 14 | i18n (i18next + ICU) | Done |
| 15 | Input sanitization + persist hydration | Done |
| 16 | App footer | Done |

---

## 1. Scaffold — Done

- [x] Vite + React + TypeScript
- [x] `package.json`: ESM, `GPL-2.0-only`, app scripts
- [x] GitHub Actions CI and Pages deploy

---

## 2. Design system — Done

- [x] Tailwind CSS 4 + `@tailwindcss/vite`
- [x] shadcn/ui (`radix-nova`, Lucide, Geist)
- [x] Components: `button`, `input`, `card`, `badge`, `alert-dialog`, `dropdown-menu`, `select`, `popover`, `calendar`, `spinner`, `empty`
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

- [x] Two-column shell: **Roster** (left) | **Lineup** (right)
- [x] `AppHeader`, `AppFooter`, `PanelShell`, empty states
- [x] Desktop-first (`md:` side-by-side; stacked on narrow viewports)
- [x] Hydration gate before persisted UI

---

## 5. Roster + scenes — Done

- [x] Quick-add, rename, delete (with mode), mark absent
- [x] `CastSlot` / `AllPlaySlot` — normal vs warning slots
- [x] Scene cards: host, players, all play, rename, remove
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
- [x] CI: `npm run check` on PRs; `check:pages` on deploy
- [x] Roster hover highlight synced to lineup slots

---

## 10. Show metadata — Done

- [x] `showName` + `showDate` on `PersistedState`
- [x] `RenameShowDialog`, `ShowDatePicker` in header
- [x] Print header uses title and formatted date
- [x] Default name: "Untitled Show"

---

## 11. Multi-show workspace — Done

- [x] `WorkspacePersistedState` — `activeShowId`, `shows[]`
- [x] `createShow`, `switchShow`, `deleteShow` actions
- [x] `ShowSwitcher` — upcoming vs past sections; sort by date then name
- [x] `DeleteShowDialog`; max 32 shows (`INPUT_LIMITS.maxShows`)

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
- [x] `migrate-persisted-state.ts` — version scaffold (legacy migrations removed; bump `PERSIST_VERSION` when schema changes)

---

## 16. App footer — Done

- [x] Author credit, GitHub issues link, GPL-2.0 summary with license link
- [x] `Trans` for inline links; hidden when printing

---

## Post-MVP (not yet implemented)

- [ ] Export / import JSON
- [ ] Back-to-back cast warning (same person in consecutive scenes)
- [ ] Venue field on show + print output
- [ ] Additional locales beyond English

---

## References

- [`spec.md`](spec.md) — requirements, data model, product decisions
- [`README.md`](README.md) — setup, scripts, deploy
