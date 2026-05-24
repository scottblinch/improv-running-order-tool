import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  DeletePersonMode,
  PersonId,
  PersistedState,
  Scene,
  SceneId,
} from '@/types/app';

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

export interface AppActions {
  addPerson: (name: string) => void;
  renamePerson: (id: PersonId, name: string) => void;
  deletePerson: (id: PersonId, mode: DeletePersonMode) => void;
  togglePersonAbsence: (id: PersonId) => void;
  addScene: (name: string) => void;
  renameScene: (id: SceneId, name: string) => void;
  removeScene: (id: SceneId) => void;
  reorderScenes: (activeId: SceneId, overId: SceneId) => void;
  assignHost: (sceneId: SceneId, personId: PersonId) => void;
  removeHost: (sceneId: SceneId) => void;
  addPlayer: (sceneId: SceneId, personId: PersonId) => void;
  removePlayer: (sceneId: SceneId, personId: PersonId) => void;
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
        if (mode === 'clearScenes') {
          set((state) => ({
            persons: state.persons.filter((person) => person.id !== id),
            scenes: clearPersonFromScenes(state.scenes, id),
          }));
          return;
        }

        set((state) => ({
          persons: state.persons.map((person) =>
            person.id === id ? { ...person, isDeleted: true } : person,
          ),
        }));
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
        set((state) => ({
          scenes: state.scenes.filter((scene) => scene.id !== id),
        }));
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

      assignHost: (sceneId, personId) => {
        set((state) => ({
          scenes: updateScene(state.scenes, sceneId, (scene) => ({
            ...scene,
            hostId: personId,
          })),
        }));
      },

      removeHost: (sceneId) => {
        set((state) => ({
          scenes: updateScene(state.scenes, sceneId, (scene) => ({
            ...scene,
            hostId: null,
          })),
        }));
      },

      addPlayer: (sceneId, personId) => {
        set((state) => ({
          scenes: updateScene(state.scenes, sceneId, (scene) => {
            if (scene.playerIds.includes(personId)) return scene;

            return {
              ...scene,
              playerIds: [...scene.playerIds, personId],
            };
          }),
        }));
      },

      removePlayer: (sceneId, personId) => {
        set((state) => ({
          scenes: updateScene(state.scenes, sceneId, (scene) => ({
            ...scene,
            playerIds: scene.playerIds.filter((id) => id !== personId),
          })),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
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
