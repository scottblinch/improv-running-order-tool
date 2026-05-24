import { resolveSlotDisplay } from '@/store/selectors';
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

export function formatRunningOrderCastSuffix(
  persons: Person[],
  scene: Scene,
): string | null {
  const { hostId, playerIds, isAllPlay } = scene;

  if (!hostId && !isAllPlay && playerIds.length === 0) return null;

  if (hostId && !isAllPlay && playerIds.length === 0) {
    return formatPersonNameForPrint(persons, hostId);
  }

  const segments: string[] = [];

  if (hostId) {
    segments.push(`${formatPersonNameForPrint(persons, hostId)} HOST`);
  }

  if (isAllPlay) {
    segments.push('+ ALL PLAY');
  } else if (playerIds.length > 0) {
    const names = playerIds
      .map((playerId) => formatPersonNameForPrint(persons, playerId))
      .join(', ');
    segments.push(`+ ${names} PLAY`);
  }

  return segments.join(' ');
}

export function formatRunningOrderSceneName(sceneName: string): string {
  return sceneName.toUpperCase();
}
