import { sanitizePersistedState } from '@/lib/input-security';
import type { PersistedState, PersonId } from '@/types/app';

export const SHOW_SHARE_PARAM = 'show';
export const SHOW_SHARE_VERSION = 1;

/** Keep share links paste-friendly in chat apps and email. */
export const MAX_SHARE_PARAM_LENGTH = 8_000;

export type SharedShowPayload = {
  v: typeof SHOW_SHARE_VERSION;
  showName: string;
  showDate: string;
  persons: PersistedState['persons'];
  scenes: PersistedState['scenes'];
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

export function encodeShowShareParam(state: PersistedState): ShareUrlResult {
  const sanitized = sanitizePersistedState(state);
  const payload: SharedShowPayload = {
    v: SHOW_SHARE_VERSION,
    showName: sanitized.showName,
    showDate: sanitized.showDate,
    persons: sanitized.persons,
    scenes: sanitized.scenes,
  };

  try {
    const json = JSON.stringify(payload);
    const param = base64UrlEncode(new TextEncoder().encode(json));

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
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${window.location.origin}${normalizedBase}#${SHOW_SHARE_PARAM}=${param}`;
}

export function decodeShowShareParam(param: string): PersistedState | null {
  const bytes = base64UrlDecode(param);
  if (!bytes) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }

  if (!isRecord(parsed) || parsed.v !== SHOW_SHARE_VERSION) {
    return null;
  }

  const slice: PersistedState = {
    showName: typeof parsed.showName === 'string' ? parsed.showName : '',
    showDate: typeof parsed.showDate === 'string' ? parsed.showDate : '',
    persons: Array.isArray(parsed.persons) ? parsed.persons : [],
    scenes: Array.isArray(parsed.scenes) ? parsed.scenes : [],
  };

  return prepareSharedShowForImport(slice);
}

/** Regenerate entity IDs and sanitize before importing into local storage. */
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

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;

  if (hash) {
    const hashParams = new URLSearchParams(hash);
    const fromHash = hashParams.get(SHOW_SHARE_PARAM);
    if (fromHash) return fromHash;
  }

  return new URLSearchParams(window.location.search).get(SHOW_SHARE_PARAM);
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
