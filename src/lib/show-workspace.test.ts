import '@/i18n';

import { describe, expect, it } from 'vitest';

import { cloneShowRecord, formatDuplicateShowName } from '@/lib/show-workspace';
import type { ShowRecord } from '@/types/app';

function makeShow(overrides: Partial<ShowRecord> = {}): ShowRecord {
  return {
    id: 'show-1',
    showName: 'Friday Show',
    showDate: '2025-06-01',
    showVenue: 'Main Stage',
    showTime: '19:30',
    updatedAt: '2025-06-01T12:00:00.000Z',
    shareKey: 'abc123def4567890',
    persons: [
      {
        id: 'person-1',
        name: 'Alex',
        isAbsent: false,
        isDeleted: false,
      },
      {
        id: 'person-2',
        name: 'Blake',
        isAbsent: true,
        isDeleted: false,
      },
    ],
    scenes: [
      {
        id: 'scene-1',
        name: 'Opening',
        hostId: 'person-1',
        playerIds: ['person-2'],
        isAllPlay: false,
      },
    ],
    ...overrides,
  };
}

describe('formatDuplicateShowName', () => {
  it('appends the copy suffix', () => {
    expect(formatDuplicateShowName('Friday Show')).toBe('Friday Show (copy)');
  });

  it('truncates long names to fit the suffix', () => {
    const longName = 'A'.repeat(32);

    expect(formatDuplicateShowName(longName)).toHaveLength(32);
    expect(formatDuplicateShowName(longName)).toMatch(/\(copy\)$/);
  });
});

describe('cloneShowRecord', () => {
  it('creates a deep copy with remapped ids and no share key', () => {
    const source = makeShow();
    const cloned = cloneShowRecord(source);

    expect(cloned.id).not.toBe(source.id);
    expect(cloned.shareKey).toBeUndefined();
    expect(cloned.showName).toBe('Friday Show (copy)');
    expect(cloned.showDate).toBe(source.showDate);
    expect(cloned.showVenue).toBe(source.showVenue);
    expect(cloned.showTime).toBe(source.showTime);
    expect(cloned.persons).toHaveLength(2);
    expect(cloned.scenes).toHaveLength(1);

    for (const person of cloned.persons) {
      expect(source.persons.some((item) => item.id === person.id)).toBe(false);
    }

    for (const scene of cloned.scenes) {
      expect(source.scenes.some((item) => item.id === scene.id)).toBe(false);
    }

    const hostId = cloned.scenes[0]?.hostId;
    const playerId = cloned.scenes[0]?.playerIds[0];
    const host = cloned.persons.find((person) => person.id === hostId);
    const player = cloned.persons.find((person) => person.id === playerId);

    expect(host?.name).toBe('Alex');
    expect(player?.name).toBe('Blake');
    expect(
      cloned.persons.find((person) => person.id === hostId)?.isAbsent,
    ).toBe(false);
    expect(
      cloned.persons.find((person) => person.id === playerId)?.isAbsent,
    ).toBe(true);
  });
});
