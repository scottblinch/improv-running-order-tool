import { useSyncExternalStore } from 'react';
import { useAppStore } from './useAppStore';

/** Avoid rendering persisted UI until localStorage has been read. */
export function useAppHydration(): boolean {
  return useSyncExternalStore(
    useAppStore.persist.onFinishHydration,
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
