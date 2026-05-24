import type { PersistedState, Person, Scene } from '@/types/app';

export const PERSIST_VERSION = 1;

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

  const playerIds = Array.isArray(raw.playerIds)
    ? raw.playerIds.filter((id): id is string => typeof id === 'string')
    : [];

  return {
    id: raw.id,
    name: raw.name,
    hostId: typeof raw.hostId === 'string' ? raw.hostId : null,
    playerIds: [...new Set(playerIds)],
  };
}

export function migratePersistedState(
  persistedState: unknown,
  version: number,
): PersistedState {
  let state = persistedState;

  if (version < PERSIST_VERSION) {
    state = persistedState;
  }

  if (!isRecord(state)) {
    return { persons: [], scenes: [] };
  }

  const persons = Array.isArray(state.persons)
    ? state.persons
        .map(normalizePerson)
        .filter((person): person is Person => person !== null)
    : [];

  const scenes = Array.isArray(state.scenes)
    ? state.scenes
        .map(normalizeScene)
        .filter((scene): scene is Scene => scene !== null)
    : [];

  return { persons, scenes };
}
