import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  DeletePersonMode,
  PersonId,
  PersistedState,
  ShowDetails,
  ShowId,
  Scene,
  SceneId,
} from '@/types/app';
import { personHasSceneAssignments } from '@/store/selectors';
import {
  hydrateWorkspaceState,
  parsePersistedWorkspace,
} from '@/store/hydrate-persisted-state';
import {
  migratePersistedState,
  PERSIST_VERSION,
} from '@/store/migrate-persisted-state';
import {
  canAddPerson,
  canAddShow,
  canAddScene,
  INPUT_LIMITS,
  isDeletePersonMode,
  isValidEntityId,
  sanitizePersistedState,
  sanitizePersonName,
  sanitizeSceneName,
  sanitizeShowName,
  sanitizeShowTime,
  sanitizeShowVenue,
} from '@/lib/input-security';
import { cloneScene } from '@/lib/scene-workspace';
import { isIsoDateString } from '@/lib/show-date';
import {
  cloneShowRecord,
  createEmptyShow,
  createEmptyWorkspaceSlice,
  createShowId,
  patchActiveShow,
  pickMostRecentlyUpdatedShow,
  type WorkspaceSlice,
} from '@/lib/show-workspace';

const STORAGE_KEY = 'improv-running-order';

function createId(): string {
  return crypto.randomUUID();
}

function createInitialState(): WorkspaceSlice {
  return createEmptyWorkspaceSlice();
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
  duplicateScene: (id: SceneId) => void;
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
  setShowDetails: (details: ShowDetails) => void;
  createShow: () => void;
  duplicateShow: (id: ShowId) => void;
  switchShow: (id: ShowId) => void;
  deleteShow: (id: ShowId) => void;
  importSharedShow: (
    payload: PersistedState,
    shareKey: string,
  ) => 'imported' | 'existing' | 'full';
}

export type AppStore = WorkspaceSlice & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      addPerson: (name) => {
        const sanitized = sanitizePersonName(name);
        if (!sanitized) return;

        set((state) => {
          if (!canAddPerson(state.persons.length)) return state;

          return patchActiveShow(state, {
            persons: [
              ...state.persons,
              {
                id: createId(),
                name: sanitized,
                isAbsent: false,
                isDeleted: false,
              },
            ],
          });
        });
      },

      renamePerson: (id, name) => {
        if (!isValidEntityId(id)) return;

        const sanitized = sanitizePersonName(name);
        if (!sanitized) return;

        set((state) => {
          if (!personExists(state.persons, id)) return state;

          return patchActiveShow(state, {
            persons: state.persons.map((person) =>
              person.id === id ? { ...person, name: sanitized } : person,
            ),
          });
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
            return patchActiveShow(state, {
              persons: state.persons.filter((person) => person.id !== id),
              scenes: clearPersonFromScenes(state.scenes, id),
            });
          }

          return patchActiveShow(state, {
            persons: state.persons.map((person) =>
              person.id === id ? { ...person, isDeleted: true } : person,
            ),
          });
        });
      },

      togglePersonAbsence: (id) => {
        if (!isValidEntityId(id)) return;

        set((state) => {
          if (!personExists(state.persons, id)) return state;

          return patchActiveShow(state, {
            persons: state.persons.map((person) =>
              person.id === id
                ? { ...person, isAbsent: !person.isAbsent }
                : person,
            ),
          });
        });
      },

      addScene: (name) => {
        const sanitized = sanitizeSceneName(name);
        if (!sanitized) return;

        set((state) => {
          if (!canAddScene(state.scenes.length)) return state;

          return patchActiveShow(state, {
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
          });
        });
      },

      renameScene: (id, name) => {
        if (!isValidEntityId(id)) return;

        const sanitized = sanitizeSceneName(name);
        if (!sanitized) return;

        set((state) => {
          if (!sceneExists(state.scenes, id)) return state;

          return patchActiveShow(state, {
            scenes: state.scenes.map((scene) =>
              scene.id === id ? { ...scene, name: sanitized } : scene,
            ),
          });
        });
      },

      duplicateScene: (id) => {
        if (!isValidEntityId(id)) return;

        set((state) => {
          if (!canAddScene(state.scenes.length)) return state;

          const index = state.scenes.findIndex((scene) => scene.id === id);
          if (index === -1) return state;

          const scenes = [...state.scenes];
          scenes.splice(index + 1, 0, cloneScene(scenes[index]!));

          return patchActiveShow(state, { scenes });
        });
      },

      removeScene: (id) => {
        if (!isValidEntityId(id)) return;

        set((state) => {
          if (!sceneExists(state.scenes, id)) return state;
          const scenes = state.scenes.filter((scene) => scene.id !== id);

          return patchActiveShow(state, {
            scenes,
            persons: purgeUnassignedSoftDeletedPersons(state.persons, scenes),
          });
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

          return patchActiveShow(state, { scenes });
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

          return patchActiveShow(state, { scenes });
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

          return patchActiveShow(state, {
            scenes: updateScene(state.scenes, sceneId, (scene) => ({
              ...scene,
              hostId: personId,
            })),
          });
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

          return patchActiveShow(state, {
            scenes,
            persons: purgeUnassignedSoftDeletedPersons(state.persons, scenes),
          });
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

          return patchActiveShow(state, {
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
          });
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

          return patchActiveShow(state, {
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
          });
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

          return patchActiveShow(state, {
            scenes,
            persons: purgeUnassignedSoftDeletedPersons(state.persons, scenes),
          });
        });
      },

      setAllPlay: (sceneId, isAllPlay) => {
        if (!isValidEntityId(sceneId)) return;

        set((state) => {
          if (!sceneExists(state.scenes, sceneId)) return state;

          return patchActiveShow(state, {
            scenes: updateScene(state.scenes, sceneId, (scene) => ({
              ...scene,
              isAllPlay,
              playerIds: isAllPlay ? [] : scene.playerIds,
            })),
          });
        });
      },

      setShowDetails: ({ showName, showDate, showVenue, showTime }) => {
        if (!isIsoDateString(showDate)) return;

        set((state) =>
          patchActiveShow(state, {
            showName: sanitizeShowName(showName),
            showDate,
            showVenue: sanitizeShowVenue(showVenue),
            showTime: sanitizeShowTime(showTime),
          }),
        );
      },

      createShow: () => {
        set((state) => {
          if (state.shows.length === 0) {
            const newShow = createEmptyShow();
            const sanitized = sanitizePersistedState(newShow);

            return {
              activeShowId: newShow.id,
              shows: [{ ...newShow, ...sanitized }],
              ...sanitized,
            };
          }

          if (!canAddShow(state.shows.length)) return state;

          const flushed = patchActiveShow(state, {});
          const newShow = createEmptyShow();

          return {
            ...flushed,
            shows: [...flushed.shows, newShow],
            activeShowId: newShow.id,
            persons: newShow.persons,
            scenes: newShow.scenes,
            showName: newShow.showName,
            showDate: newShow.showDate,
            showVenue: newShow.showVenue,
            showTime: newShow.showTime,
          };
        });
      },

      duplicateShow: (id) => {
        if (!isValidEntityId(id)) return;

        set((state) => {
          if (!canAddShow(state.shows.length)) return state;

          const flushed =
            state.shows.length > 0 ? patchActiveShow(state, {}) : state;
          const source = flushed.shows.find((show) => show.id === id);
          if (!source) return state;

          const clonedBase = cloneShowRecord(source);
          const sanitized = sanitizePersistedState(clonedBase);
          const cloned: typeof clonedBase = { ...clonedBase, ...sanitized };

          return {
            ...flushed,
            shows: [...flushed.shows, cloned],
            activeShowId: cloned.id,
            persons: cloned.persons,
            scenes: cloned.scenes,
            showName: cloned.showName,
            showDate: cloned.showDate,
            showVenue: cloned.showVenue,
            showTime: cloned.showTime,
          };
        });
      },

      switchShow: (id) => {
        if (!isValidEntityId(id)) return;

        set((state) => {
          if (id === state.activeShowId) return state;

          const flushed = patchActiveShow(state, {});
          const target = flushed.shows.find((show) => show.id === id);
          if (!target) return state;

          const sanitized = sanitizePersistedState(target);

          return {
            ...flushed,
            activeShowId: id,
            ...sanitized,
            shows: flushed.shows.map((show) =>
              show.id === id ? { ...show, ...sanitized } : show,
            ),
          };
        });
      },

      deleteShow: (id) => {
        if (!isValidEntityId(id)) return;

        set((state) => {
          const flushed =
            state.shows.length > 0 ? patchActiveShow(state, {}) : state;
          const remaining = flushed.shows.filter((show) => show.id !== id);
          if (remaining.length === flushed.shows.length) return state;

          if (remaining.length === 0) {
            return createEmptyWorkspaceSlice();
          }

          if (flushed.activeShowId !== id) {
            return { ...flushed, shows: remaining };
          }

          const next = pickMostRecentlyUpdatedShow(remaining);
          const sanitized = sanitizePersistedState(next);

          return {
            ...flushed,
            activeShowId: next.id,
            shows: remaining.map((show) =>
              show.id === next.id ? { ...show, ...sanitized } : show,
            ),
            ...sanitized,
          };
        });
      },

      importSharedShow: (payload, shareKey) => {
        let outcome: 'imported' | 'existing' | 'full' = 'full';

        set((state) => {
          const flushed = patchActiveShow(state, {});
          const existing = flushed.shows.find(
            (show) => show.shareKey === shareKey,
          );

          if (existing) {
            outcome = 'existing';

            if (existing.id === flushed.activeShowId) {
              return flushed;
            }

            const sanitized = sanitizePersistedState(existing);

            return {
              ...flushed,
              activeShowId: existing.id,
              ...sanitized,
            };
          }

          if (!canAddShow(flushed.shows.length)) {
            return flushed;
          }

          const sanitized = sanitizePersistedState(payload);
          const newShow = {
            id: createShowId(),
            ...sanitized,
            shareKey,
            updatedAt: new Date().toISOString(),
          };

          outcome = 'imported';

          return {
            ...flushed,
            activeShowId: newShow.id,
            shows: [...flushed.shows, newShow],
            ...sanitized,
          };
        });

        return outcome;
      },
    }),
    {
      name: STORAGE_KEY,
      version: PERSIST_VERSION,
      migrate: migratePersistedState,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeShowId: state.activeShowId,
        shows: state.shows.map(
          ({
            id,
            persons,
            scenes,
            showName,
            showDate,
            showVenue,
            showTime,
            updatedAt,
            shareKey,
          }) => ({
            id,
            persons,
            scenes,
            showName,
            showDate,
            showVenue,
            showTime,
            updatedAt,
            ...(shareKey ? { shareKey } : {}),
          }),
        ),
      }),
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;

        return {
          ...currentState,
          ...hydrateWorkspaceState(parsePersistedWorkspace(persistedState)),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const hydrated = hydrateWorkspaceState({
          activeShowId: state.activeShowId,
          shows: state.shows,
        });

        Object.assign(state, hydrated);
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
