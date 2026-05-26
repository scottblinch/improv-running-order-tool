import '@/i18n';

import { describe, expect, it } from 'vitest';

import { INPUT_LIMITS } from '@/lib/input-security';
import {
  hydrateWorkspaceState,
  parsePersistedWorkspace,
} from '@/store/hydrate-persisted-state';

function makeShow(
  id: string,
  overrides: Partial<{
    showName: string;
    showDate: string;
    showVenue: string;
    showTime: string;
    shareKey: string;
    updatedAt: string;
  }> = {},
) {
  return {
    id,
    showName: overrides.showName ?? 'Test Show',
    showDate: overrides.showDate ?? '2025-06-01',
    showVenue: overrides.showVenue ?? '',
    showTime: overrides.showTime ?? '',
    persons: [
      {
        id: `${id}-person`,
        name: 'Alex',
        isAbsent: false,
        isDeleted: false,
      },
    ],
    scenes: [
      {
        id: `${id}-scene`,
        name: 'Opening',
        hostId: `${id}-person`,
        playerIds: [],
        isAllPlay: false,
      },
    ],
    updatedAt: overrides.updatedAt ?? '2025-06-01T12:00:00.000Z',
    ...(overrides.shareKey ? { shareKey: overrides.shareKey } : {}),
  };
}

describe('parsePersistedWorkspace', () => {
  it('returns a default workspace for invalid persisted data', () => {
    const workspace = parsePersistedWorkspace(null);

    expect(workspace.shows).toHaveLength(1);
    expect(workspace.activeShowId).toBe(workspace.shows[0]?.id);
    expect(workspace.shows[0]?.persons).toEqual([]);
  });

  it('falls back to the first show when activeShowId is missing', () => {
    const workspace = parsePersistedWorkspace({
      activeShowId: 'missing-show',
      shows: [makeShow('show-1'), makeShow('show-2')],
    });

    expect(workspace.activeShowId).toBe('show-1');
    expect(workspace.shows).toHaveLength(2);
  });

  it('drops malformed show records and invalid share keys', () => {
    const workspace = parsePersistedWorkspace({
      activeShowId: 'valid-show',
      shows: [
        makeShow('valid-show', { shareKey: 'abc123def4567890' }),
        { showName: 'missing id' },
        makeShow('ignored-show', { shareKey: 'not-a-valid-share-key' }),
      ],
    });

    expect(workspace.shows).toHaveLength(2);
    expect(workspace.shows[0]?.id).toBe('valid-show');
    expect(workspace.shows[0]?.shareKey).toBe('abc123def4567890');
    expect(workspace.shows[1]?.id).toBe('ignored-show');
    expect(workspace.shows[1]?.shareKey).toBeUndefined();
  });

  it('sanitizes invalid dates and hostile names from stored shows', () => {
    const workspace = parsePersistedWorkspace({
      activeShowId: 'show-1',
      shows: [
        {
          ...makeShow('show-1'),
          showName: '  Evil Show\u0000  ',
          showDate: '2025-02-30',
          persons: [
            {
              id: 'person-1',
              name: '  Alice\u0007  ',
              isAbsent: false,
              isDeleted: false,
            },
          ],
        },
      ],
    });

    expect(workspace.shows[0]?.showName).toBe('Evil Show');
    expect(workspace.shows[0]?.showDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(workspace.shows[0]?.showDate).not.toBe('2025-02-30');
    expect(workspace.shows[0]?.persons[0]?.name).toBe('Alice');
  });
});

describe('hydrateWorkspaceState', () => {
  it('caps the number of saved shows', () => {
    const shows = Array.from({ length: INPUT_LIMITS.maxShows + 3 }, (_, i) =>
      makeShow(`show-${i}`),
    );

    const hydrated = hydrateWorkspaceState({
      activeShowId: shows[0]!.id,
      shows,
    });

    expect(hydrated.shows).toHaveLength(INPUT_LIMITS.maxShows);
  });

  it('projects the active show slice onto the hydrated workspace', () => {
    const active = makeShow('active-show', { showName: 'Active Show' });
    const other = makeShow('other-show', { showName: 'Other Show' });

    const hydrated = hydrateWorkspaceState({
      activeShowId: active.id,
      shows: [active, other],
    });

    expect(hydrated.showName).toBe('Active Show');
    expect(hydrated.persons).toHaveLength(1);
    expect(hydrated.scenes[0]?.hostId).toBe(`${active.id}-person`);
  });
});
