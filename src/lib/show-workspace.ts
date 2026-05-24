import i18n from '@/i18n';
import {
  formatPrintDate,
  formatShowDisplayName,
  toIsoDateString,
} from '@/lib/show-date';
import type { PersistedState, ShowId, ShowRecord } from '@/types/app';

export function createShowId(): ShowId {
  return crypto.randomUUID();
}

export function createEmptyShow(): ShowRecord {
  return {
    id: createShowId(),
    persons: [],
    scenes: [],
    showName: i18n.t('app.defaultShowName'),
    showDate: toIsoDateString(),
    updatedAt: new Date().toISOString(),
  };
}

export type WorkspaceSlice = PersistedState & {
  activeShowId: ShowId;
  shows: ShowRecord[];
};

export function patchActiveShow(
  state: WorkspaceSlice,
  patch: Partial<PersistedState>,
): WorkspaceSlice {
  const next: PersistedState = {
    persons: patch.persons ?? state.persons,
    scenes: patch.scenes ?? state.scenes,
    showName: patch.showName ?? state.showName,
    showDate: patch.showDate ?? state.showDate,
  };
  const updatedAt = new Date().toISOString();

  return {
    ...state,
    ...next,
    shows: state.shows.map((show) =>
      show.id === state.activeShowId ? { ...show, ...next, updatedAt } : show,
    ),
  };
}

export function formatShowMenuLabel(
  showName: string,
  showDate: string,
): string {
  return `${formatShowDisplayName(showName)} · ${formatPrintDate(showDate)}`;
}

export function compareShowsByDateThenName(
  a: ShowRecord,
  b: ShowRecord,
): number {
  const dateCompare = a.showDate.localeCompare(b.showDate);
  if (dateCompare !== 0) return dateCompare;

  return formatShowDisplayName(a.showName).localeCompare(
    formatShowDisplayName(b.showName),
    undefined,
    { sensitivity: 'base' },
  );
}

export function selectSortedShows(shows: ShowRecord[]): ShowRecord[] {
  return [...shows].sort(compareShowsByDateThenName);
}

export function isPastShowDate(showDate: string): boolean {
  return showDate < toIsoDateString();
}

export function partitionShowsByShowDate(shows: ShowRecord[]): {
  currentAndUpcoming: ShowRecord[];
  past: ShowRecord[];
} {
  const sorted = selectSortedShows(shows);
  const currentAndUpcoming: ShowRecord[] = [];
  const past: ShowRecord[] = [];

  for (const show of sorted) {
    if (isPastShowDate(show.showDate)) {
      past.push(show);
    } else {
      currentAndUpcoming.push(show);
    }
  }

  return { currentAndUpcoming, past };
}

export function pickMostRecentlyUpdatedShow(shows: ShowRecord[]): ShowRecord {
  return (
    [...shows].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ??
    createEmptyShow()
  );
}
