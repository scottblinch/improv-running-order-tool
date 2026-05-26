import i18n from '@/i18n';
import { INPUT_LIMITS, sanitizeShowName } from '@/lib/input-security';
import {
  formatShowDateTime,
  formatShowDisplayName,
  toIsoDateString,
} from '@/lib/show-date';
import type { PersistedState, PersonId, ShowId, ShowRecord } from '@/types/app';

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
    showVenue: '',
    showTime: '',
    updatedAt: new Date().toISOString(),
  };
}

/** Sentinel when the workspace has no saved shows. */
export const EMPTY_ACTIVE_SHOW_ID = '' as ShowId;

export function createEmptyWorkspaceSlice(): WorkspaceSlice {
  return {
    activeShowId: EMPTY_ACTIVE_SHOW_ID,
    shows: [],
    persons: [],
    scenes: [],
    showName: '',
    showDate: toIsoDateString(),
    showVenue: '',
    showTime: '',
  };
}

export function formatDuplicateShowName(showName: string): string {
  const suffix = i18n.t('workspace.duplicateNameSuffix');
  const base = formatShowDisplayName(showName);
  const maxLength = INPUT_LIMITS.maxShowNameLength;

  if (base.length + suffix.length <= maxLength) {
    return sanitizeShowName(`${base}${suffix}`);
  }

  return sanitizeShowName(
    `${base.slice(0, maxLength - suffix.length)}${suffix}`,
  );
}

export function cloneShowRecord(source: ShowRecord): ShowRecord {
  const personIdMap = new Map<PersonId, PersonId>();

  const persons = source.persons.map((person) => {
    const id = createShowId();
    personIdMap.set(person.id, id);
    return { ...person, id };
  });

  const scenes = source.scenes.map((scene) => ({
    ...scene,
    id: createShowId(),
    hostId: scene.hostId ? (personIdMap.get(scene.hostId) ?? null) : null,
    playerIds: scene.playerIds.flatMap((personId) => {
      const nextId = personIdMap.get(personId);
      return nextId ? [nextId] : [];
    }),
  }));

  return {
    id: createShowId(),
    persons,
    scenes,
    showName: formatDuplicateShowName(source.showName),
    showDate: source.showDate,
    showVenue: source.showVenue,
    showTime: source.showTime,
    updatedAt: new Date().toISOString(),
  };
}

export function hasSavedShows(state: Pick<WorkspaceSlice, 'shows'>): boolean {
  return state.shows.length > 0;
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
    showVenue: patch.showVenue ?? state.showVenue,
    showTime: patch.showTime ?? state.showTime,
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
  showVenue = '',
  showTime = '',
): string {
  const base = `${formatShowDisplayName(showName)} · ${formatShowDateTime(showDate, showTime)}`;
  const venue = showVenue.trim();

  return venue ? `${base} · ${venue}` : base;
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
