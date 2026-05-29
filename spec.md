# Improv Show App — Technical Specification

## 1. Overview

Client-side React SPA for improv **shows**: roster, lineup (scene order + cast), print/share running order. Persisted in `localStorage`; no backend.

| Term              | Meaning                                            |
| ----------------- | -------------------------------------------------- |
| **Show**          | Saved roster + lineup + metadata                   |
| **Lineup**        | Scene list (UI label; code folder `running-order`) |
| **Running order** | Print/share output (scene sequence + cast)         |

## 2. Stack

React, Vite, TypeScript, Tailwind 4, shadcn/Radix, Zustand + persist, `@dnd-kit` (desktop), i18next/ICU, `fflate` (share URLs), `vite-plugin-pwa`, Vitest + axe, ESLint jsx-a11y, Husky.

## 3. Data model

```typescript
export type PersonId = string;
export type SceneId = string;
export type ShowId = string;

export interface Person {
  id: PersonId;
  name: string;
  isAbsent: boolean;
  isDeleted: boolean; // soft delete; still referenced in scenes
}

export interface Scene {
  id: SceneId;
  name: string;
  hostId: PersonId | null;
  playerIds: PersonId[]; // ordered, deduped in addPlayer
  isAllPlay: boolean; // true → playerIds empty
}

export type DeletePersonMode = 'clearScenes' | 'keepAssignments';

export interface PersistedState {
  persons: Person[];
  scenes: Scene[];
  showName: string;
  showDate: string; // YYYY-MM-DD
  showVenue: string;
  showTime: string; // HH:mm or empty
}

export interface ShowRecord extends PersistedState {
  id: ShowId;
  updatedAt: string;
  shareKey?: string; // dedupe shared-link imports
}

export interface WorkspacePersistedState {
  activeShowId: ShowId;
  shows: ShowRecord[];
}
```

- IDs: `crypto.randomUUID()`. Max 32 shows; input limits in `lib/input-security.ts`.
- Roster UI: `!isDeleted`; present A–Z then absent A–Z. Casting: `!isDeleted && !isAbsent`, A–Z.
- Persist key `improv-running-order`, version `2` (`migrate-persisted-state.ts`). Invalid/empty → empty workspace.

## 4. UI

**Empty workspace** — no shows; New show in empty state; drama blurb below; footer pinned.

**With shows** — header: switcher, edit details, share, theme, print preview. Two columns (stacked mobile): roster | lineup. Footer outside lineup collapsible on mobile.

**Mobile** — one page scroll; collapsible roster/lineup; sticky headers; selects + reorder buttons (no DnD).

**Print** — hide chrome; show title, date/time, venue, scene lines; letter-size preview with adjustable font size.

## 5. Rules

**Casting:** multi-scene OK; host+player same scene OK; no duplicate `playerIds`; append-only player order; all play clears players (confirm if replacing names).

**Absent:** toggle both ways; confirm when marking on; not draggable; warning slots in lineup.

**Delete person:** `clearScenes` or soft `keepAssignments` (warning slots).

**Shows:** duplicate show (confirm, “(copy)”); duplicate scene (after original, no confirm); delete last → empty workspace.

**Share:** compressed `?show=`; import on load; `shareKey` dedupe; privacy confirm (skippable); performer names in URL; generic OG previews.

**PWA:** NetworkFirst HTML; SW update on visibility; data stays local. Icons from `public/favicon.svg` (`pnpm generate:pwa-assets`, `generate:og-image`). `site-metadata.ts` for meta/manifest.

**Confirmations** (`AlertDialog`): delete person/scene/show, duplicate show, mark absent, all play with players, first share. No confirm: clear absent, slot remove, rename, duplicate scene.

## 6. Accessibility

Skip links, landmarks, live region (`a11y.*` strings), keyboard cast path (desktop), labeled selects (mobile), tooltips on icon buttons, jsx-a11y lint, axe smoke tests.

## 7. Conventions

Strings in `src/locales/en.json`. Layered `components/` (ui, layout, shared, feature folders — no barrels). Logic in `store/` + `lib/`.

## 8. Decisions

| Topic              | Decision                     |
| ------------------ | ---------------------------- |
| Casting            | Multi-scene; host+player OK  |
| All play           | Clears named players         |
| Absent             | Toggle; confirm on mark      |
| Multi-show         | Up to 32; empty default      |
| Share              | URL param; no server storage |
| Print              | Browser print; running order |
| Export/import JSON | Post-MVP                     |
| Back-to-back cast  | Post-MVP                     |
| i18n               | English only                 |
