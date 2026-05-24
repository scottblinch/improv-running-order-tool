import type {
  DeletePersonMode,
  PersistedState,
  Person,
  Scene,
} from '@/types/app';
import { isIsoDateString, toIsoDateString } from '@/lib/show-date';

export const INPUT_LIMITS = {
  maxPersonNameLength: 32,
  maxSceneNameLength: 32,
  maxShowNameLength: 32,
  maxPersons: 32,
  maxScenes: 32,
  maxPlayersPerScene: 16,
} as const;

const CONTROL_CHARS =
  // eslint-disable-next-line no-control-regex -- strip unsafe control characters from user input
  /[\u0000-\u001F\u007F-\u009F]/g;

export function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(CONTROL_CHARS, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function sanitizePersonName(value: string): string {
  return sanitizeText(value, INPUT_LIMITS.maxPersonNameLength);
}

export function sanitizeSceneName(value: string): string {
  return sanitizeText(value, INPUT_LIMITS.maxSceneNameLength);
}

export function sanitizeShowName(value: string): string {
  return sanitizeText(value, INPUT_LIMITS.maxShowNameLength);
}

export function isValidEntityId(id: string): boolean {
  return id.length > 0 && id.length <= 64 && /^[\w-]+$/.test(id);
}

export function isDeletePersonMode(value: string): value is DeletePersonMode {
  return value === 'clearScenes' || value === 'keepAssignments';
}

function fallbackPersonName(name: string): string {
  return sanitizePersonName(name) || 'Unknown';
}

function fallbackSceneName(name: string): string {
  return sanitizeSceneName(name) || 'Scene';
}

function normalizePlayerIds(
  playerIds: string[],
  personIds: ReadonlySet<string>,
): string[] {
  const unique: string[] = [];

  for (const id of playerIds) {
    if (!isValidEntityId(id) || !personIds.has(id) || unique.includes(id)) {
      continue;
    }

    unique.push(id);
    if (unique.length >= INPUT_LIMITS.maxPlayersPerScene) break;
  }

  return unique;
}

/** Harden persisted state loaded from localStorage (may be hand-edited). */
export function sanitizePersistedState(state: PersistedState): PersistedState {
  const persons: Person[] = [];

  for (const raw of state.persons.slice(0, INPUT_LIMITS.maxPersons)) {
    if (!isValidEntityId(raw.id)) continue;

    persons.push({
      id: raw.id,
      name: fallbackPersonName(raw.name),
      isAbsent: Boolean(raw.isAbsent),
      isDeleted: Boolean(raw.isDeleted),
    });
  }

  const personIds = new Set(persons.map((person) => person.id));
  const scenes: Scene[] = [];

  for (const raw of state.scenes.slice(0, INPUT_LIMITS.maxScenes)) {
    if (!isValidEntityId(raw.id)) continue;

    const isAllPlay = Boolean(raw.isAllPlay);
    const hostId =
      typeof raw.hostId === 'string' &&
      isValidEntityId(raw.hostId) &&
      personIds.has(raw.hostId)
        ? raw.hostId
        : null;

    scenes.push({
      id: raw.id,
      name: fallbackSceneName(raw.name),
      hostId,
      isAllPlay,
      playerIds: isAllPlay ? [] : normalizePlayerIds(raw.playerIds, personIds),
    });
  }

  const showName = sanitizeShowName(state.showName);
  const showDate = isIsoDateString(state.showDate)
    ? state.showDate
    : toIsoDateString();

  return { persons, scenes, showName, showDate };
}

export function canAddPerson(personCount: number): boolean {
  return personCount < INPUT_LIMITS.maxPersons;
}

export function canAddScene(sceneCount: number): boolean {
  return sceneCount < INPUT_LIMITS.maxScenes;
}
