import '@/i18n';

import { describe, expect, it } from 'vitest';

import {
  migratePersistedState,
  PERSIST_VERSION,
} from '@/store/migrate-persisted-state';

describe('migratePersistedState', () => {
  it('parses a valid workspace at the current persist version', () => {
    const migrated = migratePersistedState(
      {
        activeShowId: 'show-1',
        shows: [
          {
            id: 'show-1',
            showName: 'Friday Night',
            showDate: '2025-06-01',
            persons: [],
            scenes: [],
            updatedAt: '2025-06-01T12:00:00.000Z',
          },
        ],
      },
      PERSIST_VERSION,
    );

    expect(migrated.activeShowId).toBe('show-1');
    expect(migrated.shows[0]?.showName).toBe('Friday Night');
  });

  it('normalizes legacy persisted data below the current version', () => {
    const migrated = migratePersistedState(
      {
        activeShowId: 'show-1',
        shows: [
          {
            id: 'show-1',
            showName: '  Legacy Show\u0000  ',
            showDate: 'not-a-date',
            persons: [{ id: 'bad id', name: 'Ignored' }],
            scenes: [],
            updatedAt: 'invalid',
          },
        ],
      },
      0,
    );

    expect(migrated.activeShowId).toBe('show-1');
    expect(migrated.shows[0]?.showName).toBe('Legacy Show');
    expect(migrated.shows[0]?.showVenue).toBe('');
    expect(migrated.shows[0]?.showTime).toBe('');
    expect(migrated.shows[0]?.showDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(migrated.shows[0]?.persons).toEqual([]);
    expect(migrated.shows[0]?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('returns a default workspace for completely invalid persisted state', () => {
    const migrated = migratePersistedState('totally invalid', PERSIST_VERSION);

    expect(migrated.shows).toHaveLength(1);
    expect(migrated.activeShowId).toBe(migrated.shows[0]?.id);
  });
});
