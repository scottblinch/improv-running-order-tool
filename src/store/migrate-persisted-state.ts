import { selectCastablePersons } from '@/store/selectors';
import { sanitizePersistedState, sanitizeShowName } from '@/lib/input-security';
import type { PersistedState, Person, Scene } from '@/types/app';
import { toIsoDateString } from '@/lib/show-date';

export const PERSIST_VERSION = 4;

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

function migrateLegacyAllPlay(state: PersistedState): PersistedState {
  const castable = selectCastablePersons(state.persons);

  const scenes = state.scenes.map((scene) => {
    if (scene.isAllPlay) {
      return { ...scene, playerIds: [] };
    }

    if (scene.playerIds.length > 0 && castable.length > 0) {
      const everyonePlaying = castable.every(
        (person) =>
          person.id === scene.hostId || scene.playerIds.includes(person.id),
      );

      if (everyonePlaying) {
        return { ...scene, isAllPlay: true, playerIds: [] };
      }
    }

    return scene;
  });

  return { ...state, scenes };
}

export function migratePersistedState(
  persistedState: unknown,
  version: number,
): PersistedState {
  if (!isRecord(persistedState)) {
    return sanitizePersistedState({
      persons: [],
      scenes: [],
      showName: '',
      showDate: toIsoDateString(),
    });
  }

  const persons = Array.isArray(persistedState.persons)
    ? persistedState.persons
        .map(normalizePerson)
        .filter((person): person is Person => person !== null)
    : [];

  const scenes = Array.isArray(persistedState.scenes)
    ? persistedState.scenes
        .map(normalizeScene)
        .filter((scene): scene is Scene => scene !== null)
    : [];

  let state: PersistedState = {
    persons,
    scenes,
    showName: normalizeShowName(persistedState.showName),
    showDate: normalizeShowDate(persistedState.showDate),
  };

  if (version < 2) {
    state = migrateLegacyAllPlay(state);
  }

  return sanitizePersistedState(state);
}
