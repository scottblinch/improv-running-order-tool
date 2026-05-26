# Improv Show App — Technical Specification

## 1. Project Overview

A purely client-side React single-page application (SPA) for building and managing improv **shows**. The app provides a drag-and-drop interface to assign available performers to scenes, reorder the lineup, handle real-time cast adjustments (e.g., performers marked absent), and print a cast sheet. Data is persisted locally in the browser. No backend is required.

### Terminology

| Term              | Meaning                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Show**          | A saved unit of work: roster + lineup + show metadata (name, date, optional time/venue) |
| **Lineup**        | User-facing label for the scene list (right column)                                     |
| **Running order** | Legacy code/doc name for the lineup feature folder                                      |

## 2. Tech Stack & Libraries

- **Framework:** React + Vite (TypeScript)
- **Styling & UI:** shadcn/ui on Radix primitives; Tailwind CSS 4. Prefer component `variant` / `size` props first. Minimal custom CSS (print rules, third-party overrides e.g. calendar).
- **State Management:** Zustand (`persist` middleware → `localStorage`)
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable` (desktop)
- **Icons:** `lucide-react`
- **i18n:** `i18next`, `i18next-icu`, `react-i18next` — strings in `src/locales/en.json`
- **Dates & times:** `date-fns`, `react-day-picker` (show date in details dialog); optional show time as 24h `HH:mm`
- **Share encoding:** `fflate` (deflate/inflate for compact URL payloads)
- **PWA:** `vite-plugin-pwa` (manifest + service worker)
- **Toasts:** Sonner via shadcn `sonner` component
- **Testing:** Vitest + Testing Library; `vitest-axe` for accessibility smoke tests
- **Lint:** ESLint (TypeScript, React Hooks, `eslint-plugin-jsx-a11y` recommended rules)
- **Git hooks:** Husky pre-commit → `pnpm check:precommit`
- **IDs:** `crypto.randomUUID()` at runtime

## 3. Data Models (TypeScript Interfaces)

Use branded string types for compile-time safety; at runtime IDs are strings.

```typescript
export type PersonId = string;
export type SceneId = string;
export type ShowId = string;

export interface Person {
  id: PersonId;
  name: string;
  isAbsent: boolean;
  isDeleted: boolean; // True when removed from roster but still referenced in scenes (soft delete)
}

export interface Scene {
  id: SceneId;
  name: string;
  hostId: PersonId | null;
  playerIds: PersonId[]; // Ordered list; no duplicate IDs (dedupe in addPlayer, not via Set in persisted state)
  isAllPlay: boolean; // When true, all castable performers play; playerIds is empty
}

export type DeletePersonMode = 'clearScenes' | 'keepAssignments';

export interface PersistedState {
  persons: Person[];
  scenes: Scene[];
  showName: string;
  showDate: string; // ISO date YYYY-MM-DD
  showVenue: string; // Optional; empty when unset
  showTime: string; // Optional 24h HH:mm; empty when unset
}

export type ShowDetails = Pick<
  PersistedState,
  'showName' | 'showDate' | 'showVenue' | 'showTime'
>;

export interface ShowRecord extends PersistedState {
  id: ShowId;
  updatedAt: string; // ISO timestamp
  shareKey?: string; // Content fingerprint for deduplicating shared-link imports
}

export interface WorkspacePersistedState {
  activeShowId: ShowId;
  shows: ShowRecord[];
}
```

Store actions cover roster, scene, and cast CRUD, plus `setAllPlay`, `setShowDetails`, `createShow`, `duplicateShow`, `duplicateScene`, `switchShow`, `deleteShow`, and `importSharedShow`.

### ID generation & deduping

- Generate new IDs with `crypto.randomUUID()`.
- Keep `playerIds` as an **array** (order matters for print; JSON-serializable). Enforce uniqueness in `addPlayer`.
- Enabling **all play** clears `playerIds`; adding a player clears `isAllPlay`.

### Active roster

- **Roster UI** lists only persons where `isDeleted === false`.
- Present performers first (A–Z), then absent performers (A–Z among themselves).
- Casting dropdowns list castable persons (`!isDeleted && !isAbsent`) alphabetically.
- Scene player lists in dropdowns are sorted alphabetically by name.

## 4. UI Layout & Architecture

Desktop: two-column layout with header and footer when at least one show exists. Mobile: stacked columns; assignment via dropdowns/selects per slot (see §8). With **no saved shows**, the main area is a dedicated empty workspace (welcome copy, **New show** button, footer pinned to the bottom).

### Empty workspace

- Shown on first visit and after deleting the last show.
- Header shows the app title with a **Drama** icon (no show switcher or share controls).
- Print preview toggle is hidden until a show exists.
- **New show** creates the first saved show and switches to the normal two-column layout.

### Header

- **Show switcher** — dropdown of saved shows (upcoming vs past sections); create, duplicate, and delete shows; menu labels include date/time/venue when set
- **Edit show details** — dialog for `showName`, `showDate`, optional `showTime` and `showVenue` (explicit Save/Cancel; **Delete show** in footer; scrollable on small viewports)
- **Share show** — copy or native-share a URL encoding the current show (`?show=`); privacy confirmation on first use
- **Theme toggle** — light / dark / system (separate `localStorage` key)
- **Print preview** — on-screen WYSIWYG before printing (hidden when no shows)
- **Tooltips** — on icon-only controls (hover/focus labels)
- **Icons** — Lucide icons on panel headings, form labels, and common actions (add, save, delete, duplicate, share, etc.)

### Left Column: The Roster

- Quick-add: shadcn `Input` + submit / Enter.
- Scrollable list of active persons (`!isDeleted`), sorted as above.
- Each row: draggable (desktop) when **not** absent; clone/ghost drag preview; original stays in roster (stamp palette).
- **Rename**, **delete**, and **Absent** toggle (with confirmation when marking absent).
- Absent persons: not draggable; distinct roster styling; role counts (host/player scene totals).

### Right Column: The Lineup

- Quick-add scenes; sortable scene cards (`@dnd-kit/sortable`).
- Per card: editable scene name, remove scene (confirmed), duplicate scene (no confirm; copy inserted after original), drag handle, host zone (max 1), players zone (append-only, deduped), **all play** toggle.
- Slot remove (`X`) does not require confirmation.

### Footer

- **Drama** icon beside author credit, GitHub feedback link, short GPL-2.0 summary, **Privacy** link
- Hidden when printing and in print preview mode

### App-level providers

- `TooltipProvider` — icon button tooltips
- `Toaster` (Sonner) — ephemeral feedback for share, import, and PWA update
- `A11yLiveRegion` — polite `aria-live` region for screen-reader announcements (cast changes, reorders, renames, show switch, print preview, etc.)
- `SkipLink` — skip navigation to roster and lineup headings (roster link hidden in print preview)

### Landmarks & structure

- Roster column: `<aside aria-labelledby="…">`; lineup: `<main aria-labelledby="…">`
- Panel headings use stable IDs from `lib/a11y-ids.ts` (skip-link targets)
- Scene list: semantic `<ol>`; loading gate: `role="status"` sr-only “ready” message
- Icon-only controls: visible tooltips and/or `aria-label` (decorative icons `aria-hidden`)
- Drag overlay preview: `aria-hidden` (announcements describe the action instead)

### Mobile

- Assign host/players via shadcn `Select` (or similar) per slot instead of cross-column drag.
- Scene reorder via up/down buttons; sortable DnD at `md+` only.

## 5. Key Behaviors & Mechanics

### Casting rules

- Same person in multiple scenes: allowed.
- Same person as host and player on one scene: allowed.
- No duplicate entries in one scene's `playerIds`.
- Player order within a scene: append-only.
- **All play:** scene treats every castable performer as playing; confirmed when switching from named players.

### Drag & drop (desktop)

1. Reorder scene cards.
2. Drag persons from roster into host/players zones (non-absent, non-deleted sources only).

### Absent (`isAbsent`)

- Toggles **on and off**; confirm when turning **on**. Clearing absent does not require confirmation.
- Absent persons are not draggable.
- Scene slots referencing an absent person use the **warning slot** presentation.

### Warning slots (absent & deleted-from-roster)

Scene cards resolve each `hostId` / `playerIds` entry against `persons`:

- **Active** (`!isAbsent && !isDeleted`): normal badge.
- **Warning** (`isAbsent || isDeleted`): red/amber border, distinct background, strikethrough on display name.
- **Orphan** (ID in scene but no matching `Person`): warning slot with fallback label.

### Deleting a person

| Mode              | Behavior                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `clearScenes`     | Remove person; clear this `personId` from every scene's `hostId` and `playerIds`.                       |
| `keepAssignments` | **Soft delete:** set `isDeleted: true`, hide from roster; keep scene refs; slots render as **warning**. |

### Deleting a scene

- Confirm via `AlertDialog`.
- `removeScene` deletes the scene and all host/player assignments for that scene.

### Multi-show workspace

- Up to 32 saved shows; each holds its own roster, lineup, and show metadata.
- **First visit** (or invalid/corrupt saved data with no recoverable shows): empty workspace with zero shows — user creates the first show explicitly.
- Switching shows updates the active slice in the store; `localStorage` persists the full workspace.
- **Duplicate show** is confirmed; copies roster, lineup, and metadata with a “(copy)” suffix on the name; switches to the new show.
- **Delete show** is confirmed; deleting the **last** show returns to the empty workspace (special confirmation copy).
- Show switcher lists upcoming shows (date ≥ today) and past shows separately, sorted by date then name.

### Show sharing

- **Export:** encode show data (metadata, roster, lineup) into a `?show=` query param on the app URL (compressed v2 format with `n`, `d`, `vn`, `tm` keys; legacy uncompressed v1 still readable).
- **Import:** opening a share link on load imports the show into the workspace (or switches to an existing show with the same content fingerprint).
- **Dedup:** `shareKey` (16-char hex hash of canonical show content) prevents duplicate imports when the same link is opened again.
- **Limits:** share param max length; workspace max 32 shows — failures surface via dialog or toast.
- **Privacy:** confirmation before first share explains that performer names are in the URL; optional “Don’t show again”. Footer **Privacy** dialog describes local storage, share links, and GitHub Pages hosting logs.
- **Feedback:** Sonner toast on successful share/copy/import; errors via toast (share) or dialog (invalid link, workspace full).

### PWA

- Installable; hashed JS/CSS and static assets cached after first load via service worker.
- **HTML navigations** use NetworkFirst (not precached `index.html`) so deploys are visible on the next refresh.
- Service worker checks for updates when the tab becomes visible again.
- Show data remains in `localStorage` only (not uploaded).
- When a new app version is deployed, a toast offers **Refresh** to activate the updated service worker.
- App icon / favicon: Lucide **Drama** motif; regenerate PNG/ICO assets with `pnpm generate:pwa-assets` from `public/favicon.svg`.
- **Link previews:** Open Graph and Twitter Card meta tags (injected at build/dev via `vite-social-meta.ts`); `public/og-image.png` (512×512 drama icon) generated from `public/favicon.svg` with `pnpm generate:og-image`. Twitter uses the `summary` card (small square thumbnail beside title/description).

### Confirmations

Use shadcn `AlertDialog` for:

- Delete person (mode choice)
- Delete scene
- Delete show (including last show → empty workspace)
- Duplicate show
- Mark person absent
- Switch scene to all play (when players are assigned)
- Share show (first time only; skippable via `localStorage`)

No confirmation for: clearing absent, removing a slot (`X`), rename, duplicate scene.

## 6. Export & Print

No PDF library. Tailwind `print:` modifiers + minimal global `@media print` rules.

- **Hide:** roster column, inputs, drag handles, remove buttons, header/footer chrome, dialogs, toasts, tooltips.
- **Show:** lineup full width, ink-friendly black on white.
- **Print header:** show title (uppercase), formatted date/time line, optional venue line, centered above the scene list.
- **Print preview:** screen-only mode that mirrors print layout before invoking the browser print dialog.
- **Fit-to-page:** dynamic font scaling so long lineups fit one printed page when possible.
- **Scene line format:** `SCENE NAME - HOST HOST` / `+ ALL PLAY` / `+ NAMES PLAY`; warning suffix for absent/removed performers.

## 7. Persistence & Security

- **Storage key:** `improv-running-order`
- **Version:** `PERSIST_VERSION` in `migrate-persisted-state.ts` (currently `2` — adds `showVenue`, `showTime`); Zustand `migrate` hook normalizes on load
- **Persisted shape:** `{ activeShowId, shows[] }` — not the flat single-show shape
- **Hydration:** `hydrate-persisted-state.ts` normalizes and sanitizes on load; invalid data or an empty `shows[]` array falls back to an **empty workspace** (no auto-created show)
- **Input limits:** caps on persons, scenes, shows, name lengths, and IDs; sanitization strips control characters and drops invalid cross-references (defense against hand-edited `localStorage`)
- **Share links:** user-initiated; data is encoded in the URL, not stored on a server by this app. GitHub Pages may log HTTP access metadata.

## 8. Accessibility

### Screen reader announcements

- Zustand `useA11yAnnounceStore` holds the live-region message; `A11yLiveRegion` renders it.
- Components call `useA11yAnnounce()` — wraps `t()` + store `announce()` so copy stays in `en.json` under `a11y.*` keys.
- Cast assign/remove/replace (drag, select, keyboard): `lib/cast-a11y.ts` resolves performer names and builds consistent messages.
- Repeating the same announcement clears then re-sets the message so assistive tech re-reads it.

### Keyboard & mobile

- Quick-add forms and rename dialogs: Enter to submit; dialogs trap focus via Radix.
- Desktop cast: keyboard path on cast drop zones (`CastDropZone` as `role="group"`).
- Mobile: host/player assignment via labeled selects; scene reorder via up/down buttons with announcements.
- Print preview toggle and show-details save announce changes; calendar lives in the details dialog popover.

### Lint & tests

- ESLint `jsx-a11y` recommended rules project-wide (shadcn `ui/` folder exempt from `heading-has-content` only).
- `src/a11y-smoke.test.tsx` — axe smoke tests on shared forms, dialogs, roster row, cast slots (light + dark), skip link, etc.
- Vitest setup mocks `localStorage` for store tests in jsdom.

## 9. Development Guidelines

- Semantic HTML (`ol` for scene list, sr-only headings, `role="status"` on loading, landmarks as above).
- shadcn/Radix defaults for a11y; keyboard submit on quick-add forms and rename dialogs.
- `dnd-kit` must work inside scrollable panels.
- Zustand `persist`: guard hydration before rendering persisted UI.
- Single page; no router.
- **i18n:** user-visible strings in `src/locales/en.json`; use `useTranslation` / `Trans` — no hardcoded UI copy in components.
- **Styling:** prefer shadcn components and variants; avoid custom CSS except print rules and unavoidable third-party overrides.
- **Shared UI:** `QuickAddForm`, `RenameDialog` (+ optional announce props), `IconButtonTooltip`, `CastSlot` — feature wrappers stay thin.
- **DRY helpers:** `useA11yAnnounce`, `cast-a11y`, `cast-role-styles` (`castDropSurfaceClasses`).

## 10. Product Decisions

| Topic                     | Decision                                                |
| ------------------------- | ------------------------------------------------------- |
| Multi-scene casting       | Allowed                                                 |
| Host + player, same scene | Allowed                                                 |
| All play                  | Allowed; clears named players                           |
| Duplicate performer slots | Not allowed (`playerIds` deduped in store)              |
| Absent                    | Toggle both ways; confirm when marking absent           |
| Drag while absent         | Not allowed                                             |
| Roster sort               | Present A–Z, then absent A–Z                            |
| Roster CRUD               | Add, rename, delete (with mode choice)                  |
| Scene CRUD                | Add, rename, duplicate, remove                          |
| Multi-show workspace      | Up to 32 shows; switch/create/duplicate/delete          |
| Empty workspace           | Default first view; last show delete returns here       |
| Show metadata             | Name, ISO date, optional time (`HH:mm`) and venue       |
| Warning slot visuals      | Same for absent and deleted-from-roster                 |
| Player order              | Append-only                                             |
| Print                     | Title, date/time, venue, scenes + cast                  |
| Persistence               | `localStorage` workspace                                |
| Theme                     | Light / dark / system                                   |
| i18n                      | i18next + ICU; English only                             |
| Share                     | URL query param; import on load; dedup                  |
| PWA                       | Installable; offline shell; update toast                |
| Privacy                   | Share confirm + footer dialog                           |
| Accessibility             | Skip links, live region, jsx-a11y lint, axe smoke tests |
| Export / import JSON      | Post-MVP                                                |
| Mobile                    | Dropdowns/selects for slots                             |
| Back-to-back cast warning | Post-MVP                                                |
| Terminology               | UI: **Absent**; code: `isAbsent`                        |
