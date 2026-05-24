import { deflateSync, inflateSync } from 'fflate';

import { sanitizePersistedState } from '@/lib/input-security';
import type { Person, PersistedState, PersonId, Scene } from '@/types/app';

export const SHOW_SHARE_PARAM = 'show';
export const SHOW_SHARE_VERSION = 2;
const LEGACY_SHARE_VERSION = 1;

/** Keep share links paste-friendly in chat apps and email. */
export const MAX_SHARE_PARAM_LENGTH = 8_000;

/** v2 compact wire format — indices instead of UUIDs. */
type CompactPerson = [string] | [string, number];
type CompactScene =
  | [string, number | null, number[]]
  | [string, number | null, number[], number];

type CompactSharedShowPayload = {
  v: 2;
  n: string;
  d: string;
  p: CompactPerson[];
  s: CompactScene[];
};

export type ShareUrlResult =
  | { url: string }
  | { error: 'too_large' | 'encode_failed' };

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(value: string): Uint8Array | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/');
    const remainder = padded.length % 4;
    const base64 =
      remainder === 0 ? padded : `${padded}${'='.repeat(4 - remainder)}`;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseJsonBytes(bytes: Uint8Array): unknown {
  return JSON.parse(new TextDecoder().decode(bytes));
}

function personFlags(person: Person): number {
  return (person.isAbsent ? 1 : 0) | (person.isDeleted ? 2 : 0);
}

function toCompactPayload(state: PersistedState): CompactSharedShowPayload {
  const personIndex = new Map<PersonId, number>(
    state.persons.map((person, index) => [person.id, index]),
  );

  return {
    v: SHOW_SHARE_VERSION,
    n: state.showName,
    d: state.showDate,
    p: state.persons.map((person) => {
      const flags = personFlags(person);
      return flags === 0 ? [person.name] : [person.name, flags];
    }),
    s: state.scenes.map((scene) => {
      const hostIdx =
        scene.hostId === null ? null : (personIndex.get(scene.hostId) ?? null);
      const playerIndices = scene.isAllPlay
        ? []
        : scene.playerIds
            .map((id) => personIndex.get(id))
            .filter((index): index is number => index !== undefined);

      if (scene.isAllPlay) {
        return [scene.name, hostIdx, playerIndices, 1];
      }

      return [scene.name, hostIdx, playerIndices];
    }),
  };
}

function decodeCompactPerson(entry: unknown): Person | null {
  if (!Array.isArray(entry) || typeof entry[0] !== 'string') {
    return null;
  }

  const flags = typeof entry[1] === 'number' ? entry[1] : 0;

  return {
    id: crypto.randomUUID(),
    name: entry[0],
    isAbsent: (flags & 1) !== 0,
    isDeleted: (flags & 2) !== 0,
  };
}

function decodeCompactScene(entry: unknown, persons: Person[]): Scene | null {
  if (
    !Array.isArray(entry) ||
    typeof entry[0] !== 'string' ||
    !Array.isArray(entry[2])
  ) {
    return null;
  }

  const hostIdx = typeof entry[1] === 'number' ? entry[1] : null;
  const isAllPlay = entry[3] === 1;
  const hostId =
    hostIdx !== null && persons[hostIdx] ? persons[hostIdx].id : null;
  const playerIds = isAllPlay
    ? []
    : entry[2]
        .filter((index): index is number => typeof index === 'number')
        .filter((index) => index >= 0 && index < persons.length)
        .map((index) => persons[index].id);

  return {
    id: crypto.randomUUID(),
    name: entry[0],
    hostId,
    playerIds,
    isAllPlay,
  };
}

function expandCompactPayload(
  parsed: Record<string, unknown>,
): PersistedState | null {
  if (parsed.v !== SHOW_SHARE_VERSION) return null;
  if (typeof parsed.n !== 'string' || typeof parsed.d !== 'string') {
    return null;
  }
  if (!Array.isArray(parsed.p) || !Array.isArray(parsed.s)) return null;

  const persons = parsed.p
    .map(decodeCompactPerson)
    .filter((person): person is Person => person !== null);

  const scenes = parsed.s
    .map((entry) => decodeCompactScene(entry, persons))
    .filter((scene): scene is Scene => scene !== null);

  return sanitizePersistedState({
    showName: parsed.n,
    showDate: parsed.d,
    persons,
    scenes,
  });
}

function expandLegacyPayload(
  parsed: Record<string, unknown>,
): PersistedState | null {
  if (parsed.v !== LEGACY_SHARE_VERSION) return null;

  const slice: PersistedState = {
    showName: typeof parsed.showName === 'string' ? parsed.showName : '',
    showDate: typeof parsed.showDate === 'string' ? parsed.showDate : '',
    persons: Array.isArray(parsed.persons) ? parsed.persons : [],
    scenes: Array.isArray(parsed.scenes) ? parsed.scenes : [],
  };

  return prepareSharedShowForImport(slice);
}

function decodePayload(parsed: unknown): PersistedState | null {
  if (!isRecord(parsed) || typeof parsed.v !== 'number') return null;

  if (parsed.v === SHOW_SHARE_VERSION) {
    return expandCompactPayload(parsed);
  }

  if (parsed.v === LEGACY_SHARE_VERSION) {
    return expandLegacyPayload(parsed);
  }

  return null;
}

export function encodeShowShareParam(state: PersistedState): ShareUrlResult {
  const sanitized = sanitizePersistedState(state);

  try {
    const payload = toCompactPayload(sanitized);
    const json = JSON.stringify(payload);
    const compressed = deflateSync(new TextEncoder().encode(json));
    const param = base64UrlEncode(compressed);

    if (param.length > MAX_SHARE_PARAM_LENGTH) {
      return { error: 'too_large' };
    }

    return { url: buildShareUrl(param) };
  } catch {
    return { error: 'encode_failed' };
  }
}

export function buildShareUrl(param: string): string {
  const base = import.meta.env.BASE_URL;
  const path = base.endsWith('/') ? base : `${base}/`;
  const url = new URL(path, window.location.origin);
  url.searchParams.set(SHOW_SHARE_PARAM, param);
  return url.toString();
}

export function decodeShowShareParam(param: string): PersistedState | null {
  const bytes = base64UrlDecode(param);
  if (!bytes) return null;

  try {
    const inflated = inflateSync(bytes);
    const fromCompressed = decodePayload(parseJsonBytes(inflated));
    if (fromCompressed) return fromCompressed;
  } catch {
    // Uncompressed legacy v1 links fall through.
  }

  try {
    return decodePayload(parseJsonBytes(bytes));
  } catch {
    return null;
  }
}

/** Regenerate entity IDs and sanitize before importing legacy v1 payloads. */
export function prepareSharedShowForImport(
  state: PersistedState,
): PersistedState {
  const sanitized = sanitizePersistedState(state);
  const personIdMap = new Map<PersonId, PersonId>();

  for (const person of sanitized.persons) {
    personIdMap.set(person.id, crypto.randomUUID());
  }

  const persons = sanitized.persons.map((person) => ({
    ...person,
    id: personIdMap.get(person.id) ?? crypto.randomUUID(),
  }));

  const personIds = new Set(persons.map((person) => person.id));
  const scenes = sanitized.scenes.map((scene) => ({
    ...scene,
    id: crypto.randomUUID(),
    hostId:
      scene.hostId && personIdMap.has(scene.hostId)
        ? (personIdMap.get(scene.hostId) ?? null)
        : null,
    playerIds: scene.isAllPlay
      ? []
      : scene.playerIds
          .map((id) => personIdMap.get(id))
          .filter(
            (id): id is PersonId => typeof id === 'string' && personIds.has(id),
          ),
  }));

  return sanitizePersistedState({
    showName: sanitized.showName,
    showDate: sanitized.showDate,
    persons,
    scenes,
  });
}

export function readShareParamFromLocation(): string | null {
  if (typeof window === 'undefined') return null;

  const fromQuery = new URLSearchParams(window.location.search).get(
    SHOW_SHARE_PARAM,
  );
  if (fromQuery) return fromQuery;

  // Legacy hash links from earlier builds.
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;

  if (!hash) return null;

  return new URLSearchParams(hash).get(SHOW_SHARE_PARAM);
}

export function clearShareParamFromLocation(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHOW_SHARE_PARAM);

  if (url.hash) {
    const hashParams = new URLSearchParams(url.hash.slice(1));
    hashParams.delete(SHOW_SHARE_PARAM);
    const rest = hashParams.toString();
    url.hash = rest ? `#${rest}` : '';
  }

  window.history.replaceState({}, '', url);
}
