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
