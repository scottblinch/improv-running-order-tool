# Implementation Plan

Roadmap for building the Improv Running Order app. Product behavior and data rules live in [`spec.md`](spec.md); this file tracks **how** to build it in sensible chunks.

## Component architecture

Layered folders under `src/components/` — **no barrel `index.ts` files**; import from the module path.

| Layer       | Path                                              | Role                                                                        |
| ----------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| **ui**      | `components/ui/`                                  | shadcn/Radix primitives (CLI-managed; ESLint exception for variant exports) |
| **layout**  | `components/layout/`                              | App chrome — shell, header, loading screen, shared panel wrapper            |
| **shared**  | `components/shared/`                              | Cross-feature UI (e.g. `EmptyState`, future `CastSlot`)                     |
| **feature** | `components/roster/`, `components/running-order/` | Domain panels composed of feature-specific subcomponents                    |
| **theme**   | `components/theme/`                               | Theme provider, hook, toggle                                                |

**Composition flow:** `App.tsx` → layout → feature panel → feature list/item → `ui` + `shared`.

**Conventions:**

- Feature **panels** (`RosterPanel`, `RunningOrderPanel`) wire store + compose children; keep business logic in `store/`.
- **List/item** pairs live in the feature folder (`RosterList` / `RosterListItem`).
- New step 5 pieces: `RosterQuickAdd`, `PersonRow`, `SceneCard`, `CastSlot` in their feature or `shared/` folders.

## Status

| Step | Description                        | Status      |
| ---- | ---------------------------------- | ----------- |
| 1    | Vite + React + TypeScript scaffold | Done        |
| 2    | Tailwind + shadcn/ui               | Done        |
| 3    | Types + Zustand store              | Done        |
| 4    | Static two-column layout           | Done        |
| 5    | Roster + scenes (no drag)          | Done        |
| 6    | Desktop drag-and-drop              | Done        |
| 7    | Mobile assignment (dropdowns)      | Not started |
| 8    | Print styles                       | Not started |
| 9    | Polish & edge cases                | Not started |

---

## 1. Scaffold — Done

- [x] `npm create vite@latest` — React + TypeScript
- [x] `package.json`: ESM (`"type": "module"`), license `GPL-2.0-only`, app scripts (`dev`, `build`, `preview`, `lint`)

**Cleanup:** Default Vite demo removed; minimal shell with app title only.

---

## 2. Design system — Done

- [x] Tailwind CSS + `@tailwindcss/vite`
- [x] shadcn/ui init (`radix-nova`, Lucide, Geist)
- [x] Components in `src/components/ui/`: `button`, `input`, `card`, `badge`, `alert-dialog`, `dropdown-menu`, `select`
- [x] Path fix: `components.json` uses `src/...` paths (not `@/...`) so CLI does not create a literal `@/` folder; root `tsconfig.json` includes `@/*` → `./src/*` for validation
- [ ] Prefer component **variants** over custom class strings; avoid new `.css` files except minimal print rules (per spec §7)

**Dependencies to add (when implementing):** `zustand`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `lucide-react`, `tailwindcss`, shadcn peer deps as prompted by CLI.

---

## 3. Types + Zustand store — Done

- [x] `src/types/app.ts` — `Person`, `Scene`, IDs, `DeletePersonMode`, `PersistedState`
- [x] `src/store/useAppStore.ts` — all spec actions + invariants
- [x] `src/store/selectors.ts` — active/castable persons, lookups
- [x] `src/store/useAppHydration.ts` — gate UI until `localStorage` rehydrates
- [x] `persist` → key `improv-running-order`; partialize `persons` + `scenes` only
- Import directly from module paths (no barrel `index.ts` files)

---

## 4. Static layout (no drag yet) — Done

- [x] Two-column shell: **Roster** (left) | **Running order** (right)
- [x] Empty states when roster / scenes are empty
- [x] Page header; desktop-first (`md:` side-by-side, stacked on narrow viewports)
- [x] `useAppHydration()` gate before rendering persisted UI
- [x] `print:hidden` on header and roster column (print step builds on this)
- Hydration loading uses **`Spinner`**; consider **`Skeleton`** placeholders once layout/content design is stable
- **`ThemeProvider`** — default `system`; follows OS `prefers-color-scheme`; Light / Dark / System toggle in header

---

## 5. Roster + scenes without drag

Wire UI to the store before adding `@dnd-kit`.

### Roster — Done

- [x] Quick-add person (`Input` + Enter / button)
- [x] List active persons only (`!isDeleted`)
- [x] Rename person
- [x] Delete person → `AlertDialog` with mode choice: **clear all scenes** vs **keep assignments** (warning slots)
- [x] Mark **Absent** → confirm when turning on; no confirm when clearing absent
- [x] Absent styling in roster; absent persons not draggable (`data-draggable="false"`, step 6)

### Running order — Done

- [x] Quick-add scene
- [x] Scene cards: name (rename), remove scene (confirm), host slot, players list
- [x] Assign host/players via **Select** controls before DnD; empty drop zones stubbed (`data-drop-zone`)
- [x] `CastSlot` shared component: normal vs **warning** slot (`isAbsent || isDeleted`) — same visual per spec
- [x] Remove host/player with `X` (no confirm)
- [x] Resolve person by id; orphan fallback label if missing

---

## 6. Desktop drag-and-drop — Done

- [x] Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- [x] **Scene list:** sortable reorder → `reorderScenes`
- [x] **Roster → scenes:** drag with **DragOverlay** clone; roster item stays in place (stamp palette)
- [x] Valid sources: non-absent, non-deleted persons only
- [x] Host zone: max one; drop replaces
- [x] Players zone: append; dedupe on drop
- [x] Multiple contexts / sensors / collision detection so scene sort vs casting don’t conflict
- [x] Scrollable columns behave well while dragging

---

## 7. Mobile assignment — Done

- [x] Breakpoint strategy (`md:`): base UI is mobile; desktop DnD and inline cast zones at `md+`
- [x] Below `md`: host + each player slot use shadcn `Select` from active, non-absent roster (`PersonSlotSelect`)
- [x] Scene reorder on mobile: up/down buttons (`SceneReorderButtons`); sortable DnD at `md+` only
- [x] Mobile-first layout: stacked cast sections, full-width selects; roster hover highlight at `md+` only

---

## 8. Print

- [ ] Tailwind `print:` modifiers and/or minimal global `@media print` rules
- [ ] Hide: roster column, inputs, drag handles, remove buttons, dialogs/chrome
- [ ] Show: running order full width; scenes + host + players; ink-friendly type
- [ ] MVP print header: scenes + cast only (no show title/date/venue) — spec Option A

---

## 9. Polish & edge cases

- [ ] Keyboard: Enter to submit quick-adds; focus management in dialogs
- [ ] a11y: labels, `AlertDialog` focus trap, draggable alternatives where needed
- [ ] Persisted data shape changes: version/migrate key if store shape evolves
- [ ] Lint + `npm run build` clean in CI locally

### Post-MVP (do not block MVP)

- Export / import JSON
- Back-to-back cast warning (same person in consecutive scenes)
- Richer print metadata (title, date, venue)

---

## Suggested PR / commit chunks

1. Tailwind + shadcn + empty two-column shell
2. Store + types + persist
3. Roster + scene CRUD + warning slots + confirmations
4. Desktop DnD
5. Mobile selects
6. Print
7. Polish

---

## References

- [`spec.md`](spec.md) — requirements, data model, MVP decisions
- [`README.md`](README.md) — project intro (update with dev commands when helpful)
