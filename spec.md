# Improv Running Order App - Technical Specification

## 1. Project Overview
A purely client-side React single-page application (SPA) for building and managing running orders for improv shows. The app provides a drag-and-drop interface to assign available performers to scenes, reorder the show lineup, and handle real-time cast adjustments (e.g., performers marked absent). Data is persisted locally in the browser. No backend is required.

## 2. Tech Stack & Libraries
- **Framework:** React + Vite (TypeScript)
- **Styling & UI:** shadcn/ui on Radix primitives; use component `variant` / `size` props first. Tailwind utilities as bundled with shadcn are expected; avoid hand-rolled component class strings and bespoke `.css` files unless unavoidable (e.g. minimal `@media print` rules).
- **State Management:** Zustand (`persist` middleware → `localStorage`)
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable` (desktop)
- **Icons:** `lucide-react`
- **IDs:** `crypto.randomUUID()` at runtime (no npm `uuid` package required for MVP)

## 3. Data Models (TypeScript Interfaces)

Use branded string types for compile-time safety; at runtime IDs are strings.

```typescript
export type PersonId = string;
export type SceneId = string;

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
}

export type DeletePersonMode = "clearScenes" | "keepAssignments";

export interface AppState {
  persons: Person[];
  scenes: Scene[];

  // Person Actions
  addPerson: (name: string) => void;
  renamePerson: (id: PersonId, name: string) => void;
  deletePerson: (id: PersonId, mode: DeletePersonMode) => void;
  togglePersonAbsence: (id: PersonId) => void;

  // Scene Actions
  addScene: (name: string) => void;
  renameScene: (id: SceneId, name: string) => void;
  removeScene: (id: SceneId) => void; // Deletes scene and all host/player assignments for that scene
  reorderScenes: (activeId: SceneId, overId: SceneId) => void;

  // Casting Actions (drag-and-drop / mobile selects)
  assignHost: (sceneId: SceneId, personId: PersonId) => void;
  removeHost: (sceneId: SceneId) => void;
  addPlayer: (sceneId: SceneId, personId: PersonId) => void; // Appends; no-op if personId already in playerIds
  removePlayer: (sceneId: SceneId, personId: PersonId) => void;
}
```

### ID generation & deduping
- Generate new `PersonId` / `SceneId` values with `crypto.randomUUID()`.
- Keep `playerIds` as a **array** (order matters for print; JSON-serializable). Do **not** persist a `Set` in Zustand state. Enforce uniqueness in `addPlayer` (e.g. `if (playerIds.includes(personId)) return`).

### Active roster
- **Roster UI** lists only persons where `isDeleted === false`.
- Casting (drag / dropdowns) may only target non-deleted, non-absent persons unless replacing an existing slot.

## 4. UI Layout & Architecture
Desktop: two-column layout. Mobile: assignment via dropdowns/selects per slot (see §8).

### Left Column: The Roster
- Quick-add: shadcn `Input` + submit / Enter.
- Scrollable list of active persons (`!isDeleted`).
- Each row: draggable (desktop) when **not** absent; clone/ghost drag preview; original stays in roster (stamp palette).
- **Rename**, **delete**, and **Absent** toggle (with confirmation when marking absent).
- Absent persons: not draggable; distinct roster styling.

### Right Column: The Running Order
- Quick-add scenes; sortable scene cards (`@dnd-kit/sortable`).
- Per card: editable scene name, remove scene (confirmed), drag handle, host zone (max 1), players zone (append-only, deduped).
- Slot remove (`X`) does not require confirmation.

### Mobile
- Assign host/players via shadcn `Select` (or similar) per slot instead of cross-column drag.

## 5. Key Behaviors & Mechanics

### Casting rules
- Same person in multiple scenes: allowed.
- Same person as host and player on one scene: allowed.
- No duplicate entries in one scene's `playerIds`.
- Player order within a scene: append-only (MVP).

### Drag & drop (desktop)
1. Reorder scene cards.
2. Drag persons from roster into host/players zones (non-absent, non-deleted sources only).

### Absent (`isAbsent`)
- Toggles **on and off**; confirm when turning **on** (marking absent). Clearing absent does not require confirmation.
- Absent persons are not draggable.
- Scene slots referencing an absent person use the **warning slot** presentation (see below).

### Warning slots (absent & deleted-from-roster)
Scene cards resolve each `hostId` / `playerIds` entry against `persons`:
- **Active** (`!isAbsent && !isDeleted`): normal badge.
- **Warning** (`isAbsent || isDeleted`): same visual treatment—red/amber border, distinct background, strikethrough on the **display name** (still show `person.name` for deleted-but-referenced persons via soft delete).
- **Orphan** (ID in scene but no matching `Person`—should not occur if invariants hold): treat as warning slot with fallback label e.g. "Unknown".

Use a shared shadcn `Badge` (or similar) variant for warning slots; avoid one-off Tailwind in feature components when a variant suffices.

### Deleting a person
Show shadcn `AlertDialog` with two explicit choices:

| Mode | Behavior |
|------|----------|
| `clearScenes` | Set `isDeleted` or remove person from store; clear this `personId` from every scene's `hostId` and `playerIds`. Person gone from roster and all assignments. |
| `keepAssignments` | **Soft delete:** set `isDeleted: true`, hide from roster; **keep** scene `hostId` / `playerIds` entries; slots render as **warning** (same as absent). |

Implementation note: soft delete (`isDeleted`) keeps the `Person` record so slotted names still resolve and match absent styling. Hard-remove from `persons[]` while keeping orphan IDs is discouraged (loses names).

### Deleting a scene
- Confirm via `AlertDialog`.
- `removeScene` deletes the scene and **all** host/player assignments for that scene. No ghost slots remain.

### Confirmations (MVP)
Use shadcn `AlertDialog` for:
- Delete person (include mode choice: clear all scenes vs keep assignments as warning slots)
- Delete scene
- Mark person absent

No confirmation required for: clearing absent, removing a single slot (`X`), rename.

## 6. Export & Print
No PDF library. Minimal print CSS or Tailwind `print:` modifiers.
- **Hide:** roster column, inputs, drag handles, remove buttons, dialogs/chrome.
- **Show:** running order only, full width, ink-friendly typography.
- **Print header (MVP):** minimal—scene order + host + players only (no show title/date/venue yet).

## 7. Development Guidelines
- Semantic HTML; shadcn/Radix defaults for a11y.
- `dnd-kit` must work inside scrollable panels.
- Zustand `persist`: guard hydration (Vite SPA; no SSR expected).
- Single page; no router for MVP.
- **Styling:** prefer shadcn components and their variants; use Tailwind only as shadcn does or when no variant exists; avoid custom CSS files except minimal print rules.

## 8. MVP Product Decisions

| Topic | Decision |
|--------|-----------|
| Multi-scene casting | Allowed |
| Host + player, same scene | Allowed |
| Duplicate performer slots | Not allowed (`playerIds` deduped in store) |
| Persisted dedupe type | `PersonId[]` + logic in `addPlayer` (not `Set` in state) |
| Absent | Toggle both ways; confirm when marking absent |
| Drag while absent | Not allowed |
| Roster CRUD | Add, rename, delete (with mode choice) |
| Scene CRUD | Add, rename, remove (removes all slots for that scene) |
| Delete person | User chooses clear scenes vs keep warning slots |
| Warning slot visuals | Same for absent and deleted-from-roster |
| Player order | Append-only |
| Print | Scenes + cast only |
| Persistence | `localStorage` (MVP) |
| Export / import | Post-MVP |
| Mobile | Dropdowns/selects for slots |
| Back-to-back cast warning | Post-MVP |
| Terminology | UI: **Absent** (not "Sick call"); code: `isAbsent` |
