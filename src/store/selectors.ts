import type { Person, PersonId, Scene } from '@/types/app';

function comparePersonNames(a: Person, b: Person): number {
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

function sortPersonsByName(persons: Person[]): Person[] {
  return [...persons].sort(comparePersonNames);
}

export function selectActivePersons(persons: Person[]): Person[] {
  const active = persons.filter((person) => !person.isDeleted);
  const present = sortPersonsByName(
    active.filter((person) => !person.isAbsent),
  );
  const absent = sortPersonsByName(active.filter((person) => person.isAbsent));
  return [...present, ...absent];
}

export function selectCastablePersons(persons: Person[]): Person[] {
  return sortPersonsByName(
    persons.filter((person) => !person.isDeleted && !person.isAbsent),
  );
}

export function selectScenePlayerIds(
  persons: Person[],
  playerIds: PersonId[],
): PersonId[] {
  return [...playerIds].sort((aId, bId) => {
    const aName = getPersonById(persons, aId)?.name ?? '';
    const bName = getPersonById(persons, bId)?.name ?? '';
    return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
  });
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

export function selectPersonsForSlot(
  persons: Person[],
  currentPersonId: PersonId | null,
): Person[] {
  const castablePersons = selectCastablePersons(persons);

  if (!currentPersonId) {
    return castablePersons;
  }

  if (castablePersons.some((person) => person.id === currentPersonId)) {
    return castablePersons;
  }

  const currentPerson = getPersonById(persons, currentPersonId);
  return currentPerson
    ? sortPersonsByName([...castablePersons, currentPerson])
    : castablePersons;
}

export function personPlaysInScene(
  persons: Person[],
  scene: Scene,
  personId: PersonId,
): boolean {
  if (scene.playerIds.includes(personId)) return true;
  if (!scene.isAllPlay) return false;

  const person = getPersonById(persons, personId);
  return person !== undefined && !person.isDeleted && !person.isAbsent;
}

export function personHasSceneAssignments(
  scenes: Scene[],
  personId: PersonId,
  persons: Person[] = [],
): boolean {
  return scenes.some(
    (scene) =>
      scene.hostId === personId || personPlaysInScene(persons, scene, personId),
  );
}

export type PersonSceneRoleCounts = {
  hostCount: number;
  playerCount: number;
};

export function countPersonSceneRoles(
  scenes: Scene[],
  personId: PersonId,
  persons: Person[],
): PersonSceneRoleCounts {
  let hostCount = 0;
  let playerCount = 0;

  for (const scene of scenes) {
    if (scene.hostId === personId) hostCount++;
    if (personPlaysInScene(persons, scene, personId)) playerCount++;
  }

  return { hostCount, playerCount };
}
