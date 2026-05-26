import { parsePersistedWorkspace } from '@/store/hydrate-persisted-state';
import type { WorkspacePersistedState } from '@/types/app';

/** Bump when persisted shape changes. v2 adds showVenue and showTime. */
export const PERSIST_VERSION = 2;

export function migratePersistedState(
  persistedState: unknown,
  version: number,
): WorkspacePersistedState {
  if (version < PERSIST_VERSION) {
    // When adding migrations, use a `let state = persistedState` chain here.
    // if (version < 2) {
    //   state = migrateV1ToV2(state);
    // }
    // return parsePersistedWorkspace(state);
  }

  return parsePersistedWorkspace(persistedState);
}
