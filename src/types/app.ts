export type PersonId = string;
export type SceneId = string;

export interface Person {
  id: PersonId;
  name: string;
  isAbsent: boolean;
  isDeleted: boolean;
}

export interface Scene {
  id: SceneId;
  name: string;
  hostId: PersonId | null;
  playerIds: PersonId[];
  isAllPlay: boolean;
}

export type DeletePersonMode = 'clearScenes' | 'keepAssignments';

export interface PersistedState {
  persons: Person[];
  scenes: Scene[];
}
