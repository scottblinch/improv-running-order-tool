import '@/i18n';

import { describe, expect, it } from 'vitest';

import { cloneScene, formatDuplicateSceneName } from '@/lib/scene-workspace';
import type { Scene } from '@/types/app';

const sourceScene: Scene = {
  id: 'scene-1',
  name: 'Opening game',
  hostId: 'person-1',
  playerIds: ['person-2', 'person-3'],
  isAllPlay: false,
};

describe('formatDuplicateSceneName', () => {
  it('appends the copy suffix', () => {
    expect(formatDuplicateSceneName('Opening game')).toBe(
      'Opening game (copy)',
    );
  });
});

describe('cloneScene', () => {
  it('copies cast assignments with a new id and name', () => {
    const cloned = cloneScene(sourceScene);

    expect(cloned.id).not.toBe(sourceScene.id);
    expect(cloned.name).toBe('Opening game (copy)');
    expect(cloned.hostId).toBe('person-1');
    expect(cloned.playerIds).toEqual(['person-2', 'person-3']);
    expect(cloned.isAllPlay).toBe(false);
    expect(cloned.playerIds).not.toBe(sourceScene.playerIds);
  });
});
