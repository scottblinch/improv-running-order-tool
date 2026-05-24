import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  DeletePersonMode,
  PersonId,
  PersistedState,
  Scene,
  SceneId,
} from '@/types/app';
import { personHasSceneAssignments } from '@/store/selectors';
import {
  migratePersistedState,
  PERSIST_VERSION,
} from '@/store/migrate-persisted-state';

const STORAGE_KEY = 'improv-running-order';

function createId(): string {
  return crypto.randomUUID();
}

function trimName(name: string): string {
  return name.trim();
}

function clearPersonFromScenes(scenes: Scene[], personId: PersonId): Scene[] {
  return scenes.map((scene) => ({
    ...scene,
    hostId: scene.hostId === personId ? null : scene.hostId,
    playerIds: scene.playerIds.filter((id) => id !== personId),
  }));
}

function updateScene(
  scenes: Scene[],
  sceneId: SceneId,
  updater: (scene: Scene) => Scene,
): Scene[] {
  return scenes.map((scene) => (scene.id === sceneId ? updater(scene) : scene));
}

function purgeUnassignedSoftDeletedPersons(
  persons: PersistedState['persons'],
  scenes: Scene[],
): PersistedState['persons'] {
  return persons.filter(
    (person) =>
      !person.isDeleted ||
      personHasSceneAssignments(scenes, person.id, persons),
  );
}

export interface AppActions {
  addPerson: (name: string) => void;
  renamePerson: (id: PersonId, name: string) => void;
  deletePerson: (id: PersonId, mode: DeletePersonMode) => void;
  togglePersonAbsence: (id: PersonId) => void;
  addScene: (name: string) => void;
  renameScene: (id: SceneId, name: string) => void;
  removeScene: (id: SceneId) => void;
  reorderScenes: (activeId: SceneId, overId: SceneId) => void;
  moveScene: (sceneId: SceneId, direction: 'up' | 'down') => void;
  assignHost: (sceneId: SceneId, personId: PersonId) => void;
  removeHost: (sceneId: SceneId) => void;
  addPlayer: (sceneId: SceneId, personId: PersonId) => void;
  replacePlayer: (
    sceneId: SceneId,
    currentPersonId: PersonId,
    newPersonId: PersonId,
  ) => void;
  removePlayer: (sceneId: SceneId, personId: PersonId) => void;
  setAllPlay: (sceneId: SceneId, isAllPlay: boolean) => void;
}

export type AppStore = PersistedState & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      persons: [],
      scenes: [],

      addPerson: (name) => {
        const trimmed = trimName(name);
        if (!trimmed) return;

        set((state) => ({
          persons: [
            ...state.persons,
            {
              id: createId(),
              name: trimmed,
              isAbsent: false,
              isDeleted: false,
            },
          ],
        }));
      },

      renamePerson: (id, name) => {
        const trimmed = trimName(name);
        if (!trimmed) return;

        set((state) => ({
          persons: state.persons.map((person) =>
            person.id === id ? { ...person, name: trimmed } : person,
          ),
        }));
      },

      deletePerson: (id, mode) => {
        set((state) => {
          const assigned = personHasSceneAssignments(
            state.scenes,
            id,
            state.persons,
          );

          if (!assigned || mode === 'clearScenes') {
            return {
              persons: state.persons.filter((person) => person.id !== id),
              scenes: clearPersonFromScenes(state.scenes, id),
            };
          }

          return {
            persons: state.persons.map((person) =>
              person.id === id ? { ...person, isDeleted: true } : person,
            ),
          };
        });
      },

      togglePersonAbsence: (id) => {
        set((state) => ({
          persons: state.persons.map((person) =>
            person.id === id
              ? { ...person, isAbsent: !person.isAbsent }
              : person,
          ),
        }));
      },

      addScene: (name) => {
        const trimmed = trimName(name);
        if (!trimmed) return;

        set((state) => ({
          scenes: [
            ...state.scenes,
            {
              id: createId(),
              name: trimmed,
              hostId: null,
              playerIds: [],
              isAllPlay: false,
            },
          ],
        }));
      },

      renameScene: (id, name) => {
        const trimmed = trimName(name);
        if (!trimmed) return;

        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === id ? { ...scene, name: trimmed } : scene,
          ),
        }));
      },

      removeScene: (id) => {
        set((state) => {
          const scenes = state.scenes.filter((scene) => scene.id !== id);

          return {
            scenes,
            persons: purgeUnassignedSoftDeletedPersons(state.persons, scenes),
          };
        });
      },

      reorderScenes: (activeId, overId) => {
        if (activeId === overId) return;

        set((state) => {
          const scenes = [...state.scenes];
          const fromIndex = scenes.findIndex((scene) => scene.id === activeId);
          const toIndex = scenes.findIndex((scene) => scene.id === overId);

          if (fromIndex === -1 || toIndex === -1) return state;

          const [moved] = scenes.splice(fromIndex, 1);
          scenes.splice(toIndex, 0, moved);

          return { scenes };
        });
      },

      moveScene: (sceneId, direction) => {
        set((state) => {
          const scenes = [...state.scenes];
          const index = scenes.findIndex((scene) => scene.id === sceneId);

          if (index === -1) return state;

          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= scenes.length) return state;

          const [moved] = scenes.splice(index, 1);
          scenes.splice(targetIndex, 0, moved);

          return { scenes };
        });
      },

      assignHost: (sceneId, personId) => {
        set((state) => ({
          scenes: updateScene(state.scenes, sceneId, (scene) => ({
            ...scene,
            hostId: personId,
          })),
        }));
      },

      removeHost: (sceneId) => {
        set((state) => {
          const scenes = updateScene(state.scenes, sceneId, (scene) => ({
            ...scene,
            hostId: null,
          }));

          return {
            scenes,
            persons: purgeUnassignedSoftDeletedPersons(state.persons, scenes),
          };
        });
      },

      addPlayer: (sceneId, personId) => {
        set((state) => ({
          scenes: updateScene(state.scenes, sceneId, (scene) => {
            if (!scene.isAllPlay && scene.playerIds.includes(personId)) {
              return scene;
            }

            return {
              ...scene,
              isAllPlay: false,
              playerIds: scene.isAllPlay
                ? [personId]
                : [...scene.playerIds, personId],
            };
          }),
        }));
      },

      replacePlayer: (sceneId, currentPersonId, newPersonId) => {
        if (currentPersonId === newPersonId) return;

        set((state) => ({
          scenes: updateScene(state.scenes, sceneId, (scene) => {
            if (!scene.playerIds.includes(currentPersonId)) return scene;

            const playerIds = scene.playerIds.map((id) =>
              id === currentPersonId ? newPersonId : id,
            );
            const firstNewIndex = playerIds.indexOf(newPersonId);

            return {
              ...scene,
              playerIds: playerIds.filter(
                (id, index) => id !== newPersonId || index === firstNewIndex,
              ),
            };
          }),
        }));
      },

      removePlayer: (sceneId, personId) => {
        set((state) => {
          const scenes = updateScene(state.scenes, sceneId, (scene) => ({
            ...scene,
            playerIds: scene.playerIds.filter((id) => id !== personId),
          }));

          return {
            scenes,
            persons: purgeUnassignedSoftDeletedPersons(state.persons, scenes),
          };
        });
      },

      setAllPlay: (sceneId, isAllPlay) => {
        set((state) => ({
          scenes: updateScene(state.scenes, sceneId, (scene) => ({
            ...scene,
            isAllPlay,
            playerIds: isAllPlay ? [] : scene.playerIds,
          })),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      version: PERSIST_VERSION,
      migrate: migratePersistedState,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        persons: state.persons,
        scenes: state.scenes,
      }),
    },
  ),
);

export function waitForAppHydration(): Promise<void> {
  return new Promise((resolve) => {
    if (useAppStore.persist.hasHydrated()) {
      resolve();
      return;
    }

    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
}
