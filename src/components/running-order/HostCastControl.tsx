import { CastDropZone } from '@/components/running-order/CastDropZone';
import { PersonAssignSelect } from '@/components/running-order/PersonAssignSelect';
import { PersonSlotSelect } from '@/components/running-order/PersonSlotSelect';
import { CastSlot } from '@/components/shared/CastSlot';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';
import { ROSTER_CASTING_HELP_ID } from '@/lib/a11y-ids';
import { announceCastPersonInScene } from '@/lib/cast-a11y';
import { castDropSurfaceClasses } from '@/lib/cast-role-styles';
import { cn } from '@/lib/utils';
import {
  resolveSlotDisplay,
  selectCastablePersons,
  selectPersonsForSlot,
} from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/i18n';
import type { PersonId, Scene } from '@/types/app';

type HostCastControlProps = {
  scene: Scene;
};

export function HostCastControl({ scene }: HostCastControlProps) {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const persons = useAppStore((state) => state.persons);
  const assignHost = useAppStore((state) => state.assignHost);
  const removeHost = useAppStore((state) => state.removeHost);

  const castablePersons = selectCastablePersons(persons);
  const hostSlot = scene.hostId
    ? resolveSlotDisplay(persons, scene.hostId)
    : null;
  const slotPersons = selectPersonsForSlot(persons, scene.hostId);

  const handleAssignHost = (personId: PersonId) => {
    assignHost(scene.id, personId);
    announceCastPersonInScene(
      announceA11y,
      persons,
      personId,
      scene.name,
      'a11y.assignedHost',
      t,
    );
  };

  const handleRemoveHost = () => {
    announceCastPersonInScene(
      announceA11y,
      persons,
      scene.hostId,
      scene.name,
      'a11y.removedHost',
      t,
    );
    removeHost(scene.id);
  };

  return (
    <>
      <div className={cn(castDropSurfaceClasses, 'min-w-0 flex-1 md:hidden')}>
        <PersonSlotSelect
          label={t('lineup.assignHost')}
          value={scene.hostId}
          persons={slotPersons}
          describedBy={ROSTER_CASTING_HELP_ID}
          onValueChange={handleAssignHost}
          onClear={handleRemoveHost}
        />
      </div>

      <CastDropZone
        sceneId={scene.id}
        zone="host"
        ariaLabel={t('lineup.dropHostZone', { name: scene.name })}
        className={cn(
          castDropSurfaceClasses,
          'hidden min-w-0 flex-1 flex-wrap items-center gap-2 md:flex',
        )}
      >
        {hostSlot ? (
          <CastSlot
            inline
            castRole="host"
            personId={hostSlot.personId}
            name={hostSlot.name}
            isWarning={hostSlot.isWarning}
            warningLabel={hostSlot.warningLabel}
            onRemove={handleRemoveHost}
          />
        ) : (
          <PersonAssignSelect
            inline
            label={t('lineup.assignHost')}
            persons={castablePersons}
            describedBy={ROSTER_CASTING_HELP_ID}
            onAssign={handleAssignHost}
          />
        )}
      </CastDropZone>
    </>
  );
}
