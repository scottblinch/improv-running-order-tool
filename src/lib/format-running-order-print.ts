import { resolveSlotDisplay, selectCastablePersons } from '@/store/selectors';
import type { Person, PersonId, Scene } from '@/types/app';

function formatPersonNameForPrint(
  persons: Person[],
  personId: PersonId,
): string {
  const slot = resolveSlotDisplay(persons, personId);
  let name = slot.name.toUpperCase();

  if (slot.isWarning && slot.warningLabel) {
    name = `${name} (${slot.warningLabel.toUpperCase()})`;
  }

  return name;
}

function isAllPlay(
  persons: Person[],
  hostId: PersonId | null,
  playerIds: PersonId[],
): boolean {
  const castable = selectCastablePersons(persons);
  if (castable.length === 0 || playerIds.length === 0) return false;

  return castable.every(
    (person) => person.id === hostId || playerIds.includes(person.id),
  );
}

export function formatPrintDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatRunningOrderCastSuffix(
  persons: Person[],
  scene: Scene,
): string | null {
  const { hostId, playerIds } = scene;

  if (!hostId && playerIds.length === 0) return null;

  const allPlay = isAllPlay(persons, hostId, playerIds);

  if (hostId && playerIds.length === 0) {
    return formatPersonNameForPrint(persons, hostId);
  }

  const segments: string[] = [];

  if (hostId) {
    segments.push(`${formatPersonNameForPrint(persons, hostId)} HOST`);
  }

  if (playerIds.length > 0) {
    if (allPlay) {
      segments.push('+ ALL PLAY');
    } else {
      const names = playerIds
        .map((playerId) => formatPersonNameForPrint(persons, playerId))
        .join(', ');
      segments.push(`+ ${names} PLAY`);
    }
  }

  return segments.join(' ');
}

export function formatRunningOrderSceneName(sceneName: string): string {
  return sceneName.toUpperCase();
}
