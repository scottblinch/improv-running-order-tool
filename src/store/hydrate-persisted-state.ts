import {
  sanitizePersistedState,
  sanitizeShowName,
  INPUT_LIMITS,
} from '@/lib/input-security';
import { createEmptyShow } from '@/lib/show-workspace';
import { toIsoDateString } from '@/lib/show-date';
import type {
  PersistedState,
  Person,
  Scene,
  ShowRecord,
  WorkspacePersistedState,
} from '@/types/app';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizePerson(raw: unknown): Person | null {
  if (
    !isRecord(raw) ||
    typeof raw.id !== 'string' ||
    typeof raw.name !== 'string'
  ) {
    return null;
  }

  return {
    id: raw.id,
    name: raw.name,
    isAbsent: typeof raw.isAbsent === 'boolean' ? raw.isAbsent : false,
    isDeleted: typeof raw.isDeleted === 'boolean' ? raw.isDeleted : false,
  };
}

function normalizeScene(raw: unknown): Scene | null {
  if (
    !isRecord(raw) ||
    typeof raw.id !== 'string' ||
    typeof raw.name !== 'string'
  ) {
    return null;
  }

  const isAllPlay = typeof raw.isAllPlay === 'boolean' ? raw.isAllPlay : false;
  const playerIds = Array.isArray(raw.playerIds)
    ? raw.playerIds.filter((id): id is string => typeof id === 'string')
    : [];

  return {
    id: raw.id,
    name: raw.name,
    hostId: typeof raw.hostId === 'string' ? raw.hostId : null,
    isAllPlay,
    playerIds: isAllPlay ? [] : [...new Set(playerIds)],
  };
}

function normalizeShowName(raw: unknown): string {
  return typeof raw === 'string' ? sanitizeShowName(raw) : '';
}

function normalizeShowDate(raw: unknown): string {
  if (typeof raw !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return toIsoDateString();
  }

  const [year, month, day] = raw.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return toIsoDateString();
  }

  return raw;
}

function normalizeUpdatedAt(raw: unknown): string {
  if (typeof raw === 'string' && !Number.isNaN(Date.parse(raw))) {
    return raw;
  }

  return new Date().toISOString();
}

function normalizePersistedSlice(raw: unknown): PersistedState {
  if (!isRecord(raw)) {
    return sanitizePersistedState({
      persons: [],
      scenes: [],
      showName: '',
      showDate: toIsoDateString(),
    });
  }

  const persons = Array.isArray(raw.persons)
    ? raw.persons
        .map(normalizePerson)
        .filter((person): person is Person => person !== null)
    : [];

  const scenes = Array.isArray(raw.scenes)
    ? raw.scenes
        .map(normalizeScene)
        .filter((scene): scene is Scene => scene !== null)
    : [];

  return {
    persons,
    scenes,
    showName: normalizeShowName(raw.showName),
    showDate: normalizeShowDate(raw.showDate),
  };
}

function normalizeShowRecord(raw: unknown): ShowRecord | null {
  if (!isRecord(raw) || typeof raw.id !== 'string') {
    return null;
  }

  const slice = sanitizePersistedState(normalizePersistedSlice(raw));

  return {
    id: raw.id,
    ...slice,
    updatedAt: normalizeUpdatedAt(raw.updatedAt),
    ...(typeof raw.shareKey === 'string' && /^[\da-f]{16}$/.test(raw.shareKey)
      ? { shareKey: raw.shareKey }
      : {}),
  };
}

function emptyWorkspace(): WorkspacePersistedState {
  const empty = createEmptyShow();
  return { activeShowId: empty.id, shows: [empty] };
}

export function parsePersistedWorkspace(raw: unknown): WorkspacePersistedState {
  if (
    !isRecord(raw) ||
    typeof raw.activeShowId !== 'string' ||
    !Array.isArray(raw.shows)
  ) {
    return emptyWorkspace();
  }

  const shows = raw.shows
    .map(normalizeShowRecord)
    .filter((show): show is ShowRecord => show !== null);

  if (shows.length === 0) {
    return emptyWorkspace();
  }

  const activeShowId = shows.some((show) => show.id === raw.activeShowId)
    ? raw.activeShowId
    : shows[0].id;

  return { activeShowId, shows };
}

export function hydrateWorkspaceState(
  workspace: WorkspacePersistedState,
): WorkspacePersistedState & PersistedState {
  const shows = workspace.shows
    .map((show) => {
      const slice = sanitizePersistedState(show);
      return {
        id: show.id,
        updatedAt: show.updatedAt,
        ...slice,
      };
    })
    .slice(0, INPUT_LIMITS.maxShows);

  if (shows.length === 0) {
    const empty = createEmptyShow();
    return {
      activeShowId: empty.id,
      shows: [empty],
      ...sanitizePersistedState(empty),
    };
  }

  const activeShowId = shows.some((show) => show.id === workspace.activeShowId)
    ? workspace.activeShowId
    : shows[0].id;

  const activeSlice = sanitizePersistedState(
    shows.find((show) => show.id === activeShowId) ?? shows[0],
  );

  return {
    activeShowId,
    shows: shows.map((show) =>
      show.id === activeShowId ? { ...show, ...activeSlice } : show,
    ),
    ...activeSlice,
  };
}
