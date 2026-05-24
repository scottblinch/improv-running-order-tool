import type { Person, PersonId, Scene } from '@/types/app';

export function selectActivePersons(persons: Person[]): Person[] {
  return persons.filter((person) => !person.isDeleted);
}

export function selectCastablePersons(persons: Person[]): Person[] {
  return persons.filter((person) => !person.isDeleted && !person.isAbsent);
}

export function getPersonById(
  persons: Person[],
  id: PersonId,
): Person | undefined {
  return persons.find((person) => person.id === id);
}

export function getSceneById(
  scenes: Scene[],
  id: Scene['id'],
): Scene | undefined {
  return scenes.find((scene) => scene.id === id);
}

export type ResolvedSlot = {
  personId: PersonId;
  name: string;
  isWarning: boolean;
  warningLabel?: 'Absent' | 'Removed';
};

export function resolveSlotDisplay(
  persons: Person[],
  personId: PersonId,
): ResolvedSlot {
  const person = getPersonById(persons, personId);

  if (!person) {
    return {
      personId,
      name: 'Unknown',
      isWarning: true,
    };
  }

  if (person.isAbsent) {
    return {
      personId,
      name: person.name,
      isWarning: true,
      warningLabel: 'Absent',
    };
  }

  if (person.isDeleted) {
    return {
      personId,
      name: person.name,
      isWarning: true,
      warningLabel: 'Removed',
    };
  }

  return {
    personId,
    name: person.name,
    isWarning: false,
  };
}

export function personHasSceneAssignments(
  scenes: Scene[],
  personId: PersonId,
): boolean {
  return scenes.some(
    (scene) => scene.hostId === personId || scene.playerIds.includes(personId),
  );
}

export type PersonSceneRoleCounts = {
  hostCount: number;
  playerCount: number;
};

export function countPersonSceneRoles(
  scenes: Scene[],
  personId: PersonId,
): PersonSceneRoleCounts {
  let hostCount = 0;
  let playerCount = 0;

  for (const scene of scenes) {
    if (scene.hostId === personId) hostCount++;
    if (scene.playerIds.includes(personId)) playerCount++;
  }

  return { hostCount, playerCount };
}
