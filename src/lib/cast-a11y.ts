import type { TFunction } from 'i18next';

import { getPersonById } from '@/store/selectors';
import type { Person, PersonId } from '@/types/app';

type AnnounceA11y = (
  key: string,
  params?: Record<string, string | number>,
) => void;

type CastPersonSceneMessageKey =
  | 'a11y.assignedHost'
  | 'a11y.addedPlayer'
  | 'a11y.replacedPlayer'
  | 'a11y.removedHost'
  | 'a11y.removedPlayer';

export function resolvePerformerName(
  persons: Person[],
  personId: PersonId | null | undefined,
  t: TFunction,
): string {
  if (!personId) return t('fallback.performer');

  return getPersonById(persons, personId)?.name ?? t('fallback.performer');
}

export function announceCastPersonInScene(
  announceA11y: AnnounceA11y,
  persons: Person[],
  personId: PersonId | null | undefined,
  sceneName: string,
  messageKey: CastPersonSceneMessageKey,
  t: TFunction,
) {
  announceA11y(messageKey, {
    name: resolvePerformerName(persons, personId, t),
    scene: sceneName,
  });
}

export function announceCastNamedPersonInScene(
  announceA11y: AnnounceA11y,
  personName: string,
  sceneName: string,
  messageKey: 'a11y.assignedHost' | 'a11y.addedPlayer',
) {
  announceA11y(messageKey, { name: personName, scene: sceneName });
}
