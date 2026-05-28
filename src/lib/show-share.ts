import { deflateSync, inflateSync } from 'fflate';

import { sanitizePersistedState } from '@/lib/input-security';
import type { Person, PersistedState, PersonId, Scene } from '@/types/app';

export const SHOW_SHARE_PARAM = 'show';
export const SHOW_SHARE_VERSION = 2;

/** Keep share links paste-friendly in chat apps and email. */
export const MAX_SHARE_PARAM_LENGTH = 8_000;

/** Reject decompression bombs before JSON.parse. */
export const MAX_INFLATED_BYTES = 256 * 1024;

/** Compact wire format — indices instead of UUIDs. */
type CompactPerson = [string] | [string, number];
type CompactScene =
  | [string, number | null, number[]]
  | [string, number | null, number[], number];

type CompactSharedShowPayload = {
  v: 2;
  n: string;
  d: string;
  vn: string;
  tm: string;
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

type InflateResult =
  | { ok: true; data: Uint8Array }
  | { ok: false; reason: 'error' | 'too_large' };

function safeInflate(bytes: Uint8Array): InflateResult {
  try {
    const inflated = inflateSync(bytes);
    if (inflated.length > MAX_INFLATED_BYTES) {
      return { ok: false, reason: 'too_large' };
    }

    return { ok: true, data: inflated };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

function safeParseJsonBytes(bytes: Uint8Array): unknown | null {
  if (bytes.length > MAX_INFLATED_BYTES) return null;

  try {
    return parseJsonBytes(bytes);
  } catch {
    return null;
  }
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
    vn: state.showVenue,
    tm: state.showTime,
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

/** Stable fingerprint for deduplicating shared imports of the same show. */
export function computeShareKey(state: PersistedState): string {
  const json = JSON.stringify(toCompactPayload(sanitizePersistedState(state)));
  return hashString(json);
}

function hashString(value: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code;
    h2 = Math.imul(h2, 0x01000193) ^ index;
  }

  return `${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
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
    showVenue: typeof parsed.vn === 'string' ? parsed.vn : '',
    showTime: typeof parsed.tm === 'string' ? parsed.tm : '',
    persons,
    scenes,
  });
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
  if (param.length > MAX_SHARE_PARAM_LENGTH) return null;

  const bytes = base64UrlDecode(param);
  if (!bytes) return null;

  const inflation = safeInflate(bytes);
  if (!inflation.ok) return null;

  const parsed = safeParseJsonBytes(inflation.data);
  if (!isRecord(parsed)) return null;

  return expandCompactPayload(parsed);
}

export function readShareParamFromLocation(): string | null {
  if (typeof window === 'undefined') return null;

  return new URLSearchParams(window.location.search).get(SHOW_SHARE_PARAM);
}

export function clearShareParamFromLocation(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(SHOW_SHARE_PARAM);
  window.history.replaceState({}, '', url);
}
