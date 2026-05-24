import i18n from '@/i18n';
import { formatWarningLabel } from '@/lib/i18n-labels';
import { resolveSlotDisplay, selectScenePlayerIds } from '@/store/selectors';
import type { Person, PersonId, Scene } from '@/types/app';

function formatPersonNameForPrint(
  persons: Person[],
  personId: PersonId,
): string {
  const slot = resolveSlotDisplay(persons, personId);
  let name = slot.name.toUpperCase();

  if (slot.isWarning && slot.warningLabel) {
    name = i18n.t('print.warningSuffix', {
      name,
      warning: formatWarningLabel(slot.warningLabel).toUpperCase(),
    });
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
    segments.push(
      i18n.t('print.hostSuffix', {
        name: formatPersonNameForPrint(persons, hostId),
      }),
    );
  }

  if (isAllPlay) {
    segments.push(i18n.t('print.allPlaySuffix'));
  } else if (playerIds.length > 0) {
    const names = selectScenePlayerIds(persons, playerIds)
      .map((playerId) => formatPersonNameForPrint(persons, playerId))
      .join(', ');
    segments.push(i18n.t('print.playersSuffix', { names }));
  }

  return segments.join(' ');
}

export function formatRunningOrderSceneName(sceneName: string): string {
  return sceneName.toUpperCase();
}
