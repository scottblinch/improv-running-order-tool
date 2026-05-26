import '@/i18n';

import { beforeEach, describe, expect, it } from 'vitest';

import {
  createEmptyShow,
  createEmptyWorkspaceSlice,
  EMPTY_ACTIVE_SHOW_ID,
} from '@/lib/show-workspace';
import { useAppStore } from '@/store/useAppStore';

function seedShow(showName = 'Friday Show') {
  const show = createEmptyShow();
  show.showName = showName;
  return show;
}

function resetStore(shows = [seedShow()]) {
  const active = shows[0]!;
  useAppStore.setState({
    activeShowId: active.id,
    shows,
    persons: active.persons,
    scenes: active.scenes,
    showName: active.showName,
    showDate: active.showDate,
    showVenue: active.showVenue,
    showTime: active.showTime,
  });
}

describe('useAppStore workspace actions', () => {
  beforeEach(() => {
    useAppStore.setState(createEmptyWorkspaceSlice());
  });

  it('createShow from an empty workspace adds the first show', () => {
    useAppStore.getState().createShow();

    const state = useAppStore.getState();
    expect(state.shows).toHaveLength(1);
    expect(state.activeShowId).toBe(state.shows[0]?.id);
    expect(state.persons).toEqual([]);
  });

  it('duplicateShow copies the show and switches to the copy', () => {
    resetStore([seedShow('Friday Show')]);
    const sourceId = useAppStore.getState().activeShowId;

    useAppStore.getState().duplicateShow(sourceId);

    const state = useAppStore.getState();
    expect(state.shows).toHaveLength(2);
    expect(state.activeShowId).not.toBe(sourceId);
    expect(state.showName).toContain('(copy)');
    expect(state.shows.find((show) => show.id === sourceId)?.showName).toBe(
      'Friday Show',
    );
  });

  it('deleteShow on the last show returns to an empty workspace', () => {
    resetStore();
    const showId = useAppStore.getState().activeShowId;

    useAppStore.getState().deleteShow(showId);

    const state = useAppStore.getState();
    expect(state.shows).toEqual([]);
    expect(state.activeShowId).toBe(EMPTY_ACTIVE_SHOW_ID);
    expect(state.persons).toEqual([]);
    expect(state.scenes).toEqual([]);
  });

  it('duplicateScene inserts a copy after the source scene', () => {
    resetStore();
    useAppStore.getState().addScene('Opening');
    const sceneId = useAppStore.getState().scenes[0]!.id;

    useAppStore.getState().duplicateScene(sceneId);

    const state = useAppStore.getState();
    expect(state.scenes).toHaveLength(2);
    expect(state.scenes[0]?.name).toBe('Opening');
    expect(state.scenes[1]?.name).toContain('(copy)');
    expect(state.scenes[1]?.id).not.toBe(sceneId);
  });
});
