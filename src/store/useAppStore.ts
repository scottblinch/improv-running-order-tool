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
import {
  canAddPerson,
  canAddScene,
  INPUT_LIMITS,
  isDeletePersonMode,
  isValidEntityId,
  sanitizePersistedState,
  sanitizePersonName,
  sanitizeSceneName,
  sanitizeShowName,
} from '@/lib/input-security';
import { isIsoDateString, toIsoDateString } from '@/lib/show-date';

const STORAGE_KEY = 'improv-running-order';

function createId(): string {
  return crypto.randomUUID();
}

function personExists(
  persons: PersistedState['persons'],
  personId: PersonId,
): boolean {
  return (
    isValidEntityId(personId) &&
    persons.some((person) => person.id === personId)
  );
}

function sceneExists(scenes: Scene[], sceneId: SceneId): boolean {
  return (
    isValidEntityId(sceneId) && scenes.some((scene) => scene.id === sceneId)
  );
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
  setShowName: (name: string) => void;
  setShowDate: (date: string) => void;
}

export type AppStore = PersistedState & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      persons: [],
      scenes: [],
      showName: '',
      showDate: toIsoDateString(),

      addPerson: (name) => {
        const sanitized = sanitizePersonName(name);
        if (!sanitized) return;

        set((state) => {
          if (!canAddPerson(state.persons.length)) return state;

          return {
            persons: [
              ...state.persons,
              {
                id: createId(),
                name: sanitized,
                isAbsent: false,
                isDeleted: false,
              },
            ],
          };
        });
      },

      renamePerson: (id, name) => {
        if (!isValidEntityId(id)) return;

        const sanitized = sanitizePersonName(name);
        if (!sanitized) return;

        set((state) => {
          if (!personExists(state.persons, id)) return state;

          return {
            persons: state.persons.map((person) =>
              person.id === id ? { ...person, name: sanitized } : person,
            ),
          };
        });
      },

      deletePerson: (id, mode) => {
        if (!isValidEntityId(id) || !isDeletePersonMode(mode)) return;

        set((state) => {
          if (!personExists(state.persons, id)) return state;

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
        if (!isValidEntityId(id)) return;

        set((state) => {
          if (!personExists(state.persons, id)) return state;

          return {
            persons: state.persons.map((person) =>
              person.id === id
                ? { ...person, isAbsent: !person.isAbsent }
                : person,
            ),
          };
        });
      },

      addScene: (name) => {
        const sanitized = sanitizeSceneName(name);
        if (!sanitized) return;

        set((state) => {
          if (!canAddScene(state.scenes.length)) return state;

          return {
            scenes: [
              ...state.scenes,
              {
                id: createId(),
                name: sanitized,
                hostId: null,
                playerIds: [],
                isAllPlay: false,
              },
            ],
          };
        });
      },

      renameScene: (id, name) => {
        if (!isValidEntityId(id)) return;

        const sanitized = sanitizeSceneName(name);
        if (!sanitized) return;

        set((state) => {
          if (!sceneExists(state.scenes, id)) return state;

          return {
            scenes: state.scenes.map((scene) =>
              scene.id === id ? { ...scene, name: sanitized } : scene,
            ),
          };
        });
      },

      removeScene: (id) => {
        if (!isValidEntityId(id)) return;

        set((state) => {
          if (!sceneExists(state.scenes, id)) return state;
          const scenes = state.scenes.filter((scene) => scene.id !== id);

          return {
            scenes,
            persons: purgeUnassignedSoftDeletedPersons(state.persons, scenes),
          };
        });
      },

      reorderScenes: (activeId, overId) => {
        if (
          activeId === overId ||
          !isValidEntityId(activeId) ||
          !isValidEntityId(overId)
        ) {
          return;
        }

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
        if (
          !isValidEntityId(sceneId) ||
          (direction !== 'up' && direction !== 'down')
        ) {
          return;
        }

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
        if (!isValidEntityId(sceneId) || !isValidEntityId(personId)) return;

        set((state) => {
          if (
            !sceneExists(state.scenes, sceneId) ||
            !personExists(state.persons, personId)
          ) {
            return state;
          }

          return {
            scenes: updateScene(state.scenes, sceneId, (scene) => ({
              ...scene,
              hostId: personId,
            })),
          };
        });
      },

      removeHost: (sceneId) => {
        if (!isValidEntityId(sceneId)) return;

        set((state) => {
          if (!sceneExists(state.scenes, sceneId)) return state;
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
        if (!isValidEntityId(sceneId) || !isValidEntityId(personId)) return;

        set((state) => {
          if (
            !sceneExists(state.scenes, sceneId) ||
            !personExists(state.persons, personId)
          ) {
            return state;
          }

          return {
            scenes: updateScene(state.scenes, sceneId, (scene) => {
              if (!scene.isAllPlay && scene.playerIds.includes(personId)) {
                return scene;
              }

              if (
                !scene.isAllPlay &&
                scene.playerIds.length >= INPUT_LIMITS.maxPlayersPerScene
              ) {
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
          };
        });
      },

      replacePlayer: (sceneId, currentPersonId, newPersonId) => {
        if (
          currentPersonId === newPersonId ||
          !isValidEntityId(sceneId) ||
          !isValidEntityId(currentPersonId) ||
          !isValidEntityId(newPersonId)
        ) {
          return;
        }

        set((state) => {
          if (
            !sceneExists(state.scenes, sceneId) ||
            !personExists(state.persons, newPersonId)
          ) {
            return state;
          }

          return {
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
          };
        });
      },

      removePlayer: (sceneId, personId) => {
        if (!isValidEntityId(sceneId) || !isValidEntityId(personId)) return;

        set((state) => {
          if (!sceneExists(state.scenes, sceneId)) return state;
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
        if (!isValidEntityId(sceneId)) return;

        set((state) => {
          if (!sceneExists(state.scenes, sceneId)) return state;

          return {
            scenes: updateScene(state.scenes, sceneId, (scene) => ({
              ...scene,
              isAllPlay,
              playerIds: isAllPlay ? [] : scene.playerIds,
            })),
          };
        });
      },

      setShowName: (name) => {
        set({ showName: sanitizeShowName(name) });
      },

      setShowDate: (date) => {
        if (!isIsoDateString(date)) return;

        set({ showDate: date });
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
        showName: state.showName,
        showDate: state.showDate,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        Object.assign(
          state,
          sanitizePersistedState({
            persons: state.persons,
            scenes: state.scenes,
            showName: state.showName,
            showDate: state.showDate,
          }),
        );
      },
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
