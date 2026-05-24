import type { PersonId, SceneId } from '@/types/app';

export type RosterPersonDragData = {
  type: 'roster-person';
  personId: PersonId;
};

export type SceneDragData = {
  type: 'scene';
  sceneId: SceneId;
};

export type HostZoneDropData = {
  type: 'host-zone';
  sceneId: SceneId;
};

export type PlayerZoneDropData = {
  type: 'player-zone';
  sceneId: SceneId;
};

export type DndDragData = RosterPersonDragData | SceneDragData;

export type DndDropData = HostZoneDropData | PlayerZoneDropData | SceneDragData;

export function rosterPersonDragId(personId: PersonId): string {
  return `roster-person:${personId}`;
}

export function sceneDragId(sceneId: SceneId): string {
  return `scene:${sceneId}`;
}

export function hostZoneDropId(sceneId: SceneId): string {
  return `host-zone:${sceneId}`;
}

export function playerZoneDropId(sceneId: SceneId): string {
  return `player-zone:${sceneId}`;
}

export function parseRosterPersonDragId(id: string): PersonId | null {
  if (!id.startsWith('roster-person:')) return null;
  return id.slice('roster-person:'.length);
}

export function parseSceneDragId(id: string): SceneId | null {
  if (!id.startsWith('scene:')) return null;
  return id.slice('scene:'.length);
}
