export type PersonId = string;
export type SceneId = string;
export type ShowId = string;

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
  showName: string;
  showDate: string;
}

export interface ShowRecord extends PersistedState {
  id: ShowId;
  updatedAt: string;
  /** Fingerprint of a shared import — prevents duplicate imports from the same link. */
  shareKey?: string;
}

export interface WorkspacePersistedState {
  activeShowId: ShowId;
  shows: ShowRecord[];
}
