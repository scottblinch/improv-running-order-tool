# Implementation Plan

Roadmap for building the Improv Running Order app. Product behavior and data rules live in [`spec.md`](spec.md); this file tracks **how** to build it in sensible chunks.

## Status

| Step | Description                        | Status      |
| ---- | ---------------------------------- | ----------- |
| 1    | Vite + React + TypeScript scaffold | Done        |
| 2    | Tailwind + shadcn/ui               | Done        |
| 3    | Types + Zustand store              | Done        |
| 4    | Static two-column layout           | Not started |
| 5    | Roster + scenes (no drag)          | Not started |
| 6    | Desktop drag-and-drop              | Not started |
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

## 4. Static layout (no drag yet)

- [ ] Replace demo `App` with two-column shell: **Roster** (left) | **Running order** (right)
- [ ] Empty states for empty roster / no scenes
- [ ] Page title / minimal chrome; desktop-first layout
- [ ] Remove or replace default Vite styling (`App.css`, demo assets) as needed

---

## 5. Roster + scenes without drag

Wire UI to the store before adding `@dnd-kit`.

### Roster

- [ ] Quick-add person (`Input` + Enter / button)
- [ ] List active persons only (`!isDeleted`)
- [ ] Rename person
- [ ] Delete person → `AlertDialog` with mode choice: **clear all scenes** vs **keep assignments** (warning slots)
- [ ] Mark **Absent** → confirm when turning on; no confirm when clearing absent
- [ ] Absent styling in roster; absent persons not draggable (disable until step 6)

### Running order

- [ ] Quick-add scene
- [ ] Scene cards: name (rename), remove scene (confirm), host slot, players list
- [ ] Assign host/players via **click or temporary controls** if needed before DnD (or stub empty drop zones)
- [ ] `CastSlot` / shared component: normal vs **warning** slot (`isAbsent || isDeleted`) — same visual per spec
- [ ] Remove host/player with `X` (no confirm)
- [ ] Resolve person by id; orphan fallback label if missing

---

## 6. Desktop drag-and-drop

- [ ] Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- [ ] **Scene list:** sortable reorder → `reorderScenes`
- [ ] **Roster → scenes:** drag with **DragOverlay** clone; roster item stays in place (stamp palette)
- [ ] Valid sources: non-absent, non-deleted persons only
- [ ] Host zone: max one; drop replaces
- [ ] Players zone: append; dedupe on drop
- [ ] Multiple contexts / sensors / collision detection so scene sort vs casting don’t conflict
- [ ] Scrollable columns behave well while dragging

---

## 7. Mobile assignment

- [ ] Breakpoint strategy (e.g. `md:`): below breakpoint, hide cross-column drag for casting
- [ ] Host + each player slot: shadcn `Select` populated from active, non-absent roster
- [ ] Scene reorder on mobile: TBD (sortable DnD vs up/down buttons) — prefer simple controls if DnD is awkward on touch

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
