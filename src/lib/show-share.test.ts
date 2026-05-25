import { deflateSync } from 'fflate';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  decodeShowShareParam,
  encodeShowShareParam,
  MAX_INFLATED_BYTES,
  MAX_SHARE_PARAM_LENGTH,
} from '@/lib/show-share';
import type { PersistedState } from '@/types/app';

const sampleShow: PersistedState = {
  showName: 'Friday Night',
  showDate: '2025-06-01',
  persons: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Alex',
      isAbsent: false,
      isDeleted: false,
    },
  ],
  scenes: [
    {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Opening',
      hostId: '11111111-1111-4111-8111-111111111111',
      playerIds: [],
      isAllPlay: false,
    },
  ],
};

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

describe('decodeShowShareParam', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: { origin: 'https://example.com' },
    });
  });

  it('round-trips a valid shared show payload', () => {
    const encoded = encodeShowShareParam(sampleShow);
    expect(encoded).toEqual(expect.objectContaining({ url: expect.any(String) }));

    if (!('url' in encoded)) return;

    const param = new URL(encoded.url).searchParams.get('show');
    expect(param).toBeTruthy();

    const decoded = decodeShowShareParam(param!);

    expect(decoded?.showName).toBe('Friday Night');
    expect(decoded?.persons[0]?.name).toBe('Alex');
    expect(decoded?.scenes[0]?.name).toBe('Opening');
  });

  it('rejects invalid base64 payloads', () => {
    expect(decodeShowShareParam('not-valid-base64!!!')).toBeNull();
  });

  it('rejects params longer than the share URL limit', () => {
    expect(decodeShowShareParam('a'.repeat(MAX_SHARE_PARAM_LENGTH + 1))).toBeNull();
  });

  it('rejects decompression bombs that exceed the inflated byte limit', () => {
    const bomb = deflateSync(new Uint8Array(MAX_INFLATED_BYTES + 1));
    const param = base64UrlEncode(bomb);

    expect(param.length).toBeLessThan(MAX_SHARE_PARAM_LENGTH);
    expect(decodeShowShareParam(param)).toBeNull();
  });

  it('rejects oversized uncompressed legacy JSON payloads', () => {
    const oversized = new Uint8Array(MAX_INFLATED_BYTES + 1);
    oversized.fill(0x7b); // "{"
    const param = base64UrlEncode(oversized);

    expect(decodeShowShareParam(param)).toBeNull();
  });

  it('sanitizes malicious names from compact share payloads', () => {
    const payload = {
      v: 2,
      n: '  Evil Show\u0000  ',
      d: '2025-06-01',
      p: [['  Alice\u0007  ']],
      s: [['Opening', 0, []]],
    };
    const param = base64UrlEncode(
      deflateSync(new TextEncoder().encode(JSON.stringify(payload))),
    );

    const decoded = decodeShowShareParam(param);

    expect(decoded?.showName).toBe('Evil Show');
    expect(decoded?.persons[0]?.name).toBe('Alice');
  });
});
