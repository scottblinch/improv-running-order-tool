import '@/i18n';

import { describe, expect, it } from 'vitest';

import {
  INPUT_LIMITS,
  sanitizePersistedState,
  sanitizePersonName,
  sanitizeText,
} from '@/lib/input-security';
import type { PersistedState } from '@/types/app';

describe('sanitizeText', () => {
  it('strips control characters and collapses whitespace', () => {
    expect(sanitizeText('  hello\u0000\nworld  ', 32)).toBe('helloworld');
    expect(sanitizeText('  hello   world  ', 32)).toBe('hello world');
  });

  it('truncates to max length', () => {
    expect(sanitizeText('abcdefghij', 5)).toBe('abcde');
  });
});

describe('sanitizePersonName', () => {
  it('rejects script-like markup in names', () => {
    expect(sanitizePersonName('<img onerror=alert(1)>')).toBe(
      '<img onerror=alert(1)>',
    );
  });
});

describe('sanitizePersistedState', () => {
  it('caps persons and scenes at configured limits', () => {
    const state: PersistedState = {
      showName: 'Show',
      showDate: '2025-06-01',
      persons: Array.from({ length: INPUT_LIMITS.maxPersons + 5 }, (_, i) => ({
        id: `person-${i}`,
        name: `Person ${i}`,
        isAbsent: false,
        isDeleted: false,
      })),
      scenes: Array.from({ length: INPUT_LIMITS.maxScenes + 5 }, (_, i) => ({
        id: `scene-${i}`,
        name: `Scene ${i}`,
        hostId: null,
        playerIds: [],
        isAllPlay: false,
      })),
    };

    const sanitized = sanitizePersistedState(state);

    expect(sanitized.persons).toHaveLength(INPUT_LIMITS.maxPersons);
    expect(sanitized.scenes).toHaveLength(INPUT_LIMITS.maxScenes);
  });

  it('drops invalid entity ids and orphan references', () => {
    const state: PersistedState = {
      showName: 'Show',
      showDate: 'not-a-date',
      persons: [
        {
          id: 'valid-person',
          name: 'Alex',
          isAbsent: false,
          isDeleted: false,
        },
        {
          id: 'bad id with spaces',
          name: 'Ignored',
          isAbsent: false,
          isDeleted: false,
        },
      ],
      scenes: [
        {
          id: 'valid-scene',
          name: 'Opening',
          hostId: 'missing-host',
          playerIds: ['valid-person', 'missing-player'],
          isAllPlay: false,
        },
      ],
    };

    const sanitized = sanitizePersistedState(state);

    expect(sanitized.persons).toHaveLength(1);
    expect(sanitized.persons[0]?.name).toBe('Alex');
    expect(sanitized.scenes[0]?.hostId).toBeNull();
    expect(sanitized.scenes[0]?.playerIds).toEqual(['valid-person']);
    expect(sanitized.showDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('sanitizes names loaded from untrusted persisted data', () => {
    const state: PersistedState = {
      showName: '  My Show\u0007  ',
      showDate: '2025-06-01',
      persons: [
        {
          id: 'p1',
          name: '  Alice\u0000  ',
          isAbsent: false,
          isDeleted: false,
        },
      ],
      scenes: [],
    };

    const sanitized = sanitizePersistedState(state);

    expect(sanitized.showName).toBe('My Show');
    expect(sanitized.persons[0]?.name).toBe('Alice');
  });
});
