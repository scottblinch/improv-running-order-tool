import { CastDropZone } from '@/components/running-order/CastDropZone';
import { PersonAssignSelect } from '@/components/running-order/PersonAssignSelect';
import { PersonSlotSelect } from '@/components/running-order/PersonSlotSelect';
import { CastSlot } from '@/components/shared/CastSlot';
import { ROSTER_CASTING_HELP_ID } from '@/lib/a11y-ids';
import {
  getPersonById,
  resolveSlotDisplay,
  selectCastablePersons,
  selectPersonsForSlot,
} from '@/store/selectors';
import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/i18n';
import type { PersonId, Scene } from '@/types/app';

type HostCastControlProps = {
  scene: Scene;
};

export function HostCastControl({ scene }: HostCastControlProps) {
  const { t } = useTranslation();
  const announce = useA11yAnnounceStore((state) => state.announce);
  const persons = useAppStore((state) => state.persons);
  const assignHost = useAppStore((state) => state.assignHost);
  const removeHost = useAppStore((state) => state.removeHost);

  const castablePersons = selectCastablePersons(persons);
  const hostSlot = scene.hostId
    ? resolveSlotDisplay(persons, scene.hostId)
    : null;
  const slotPersons = selectPersonsForSlot(persons, scene.hostId);

  const announceHostAssigned = (personId: PersonId) => {
    const person = getPersonById(persons, personId);
    announce(
      t('a11y.assignedHost', {
        name: person?.name ?? t('fallback.performer'),
        scene: scene.name,
      }),
    );
  };

  const handleAssignHost = (personId: PersonId) => {
    assignHost(scene.id, personId);
    announceHostAssigned(personId);
  };

  return (
    <>
      <div className="min-w-0 flex-1 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-2 md:hidden">
        <PersonSlotSelect
          label={t('lineup.assignHost')}
          value={scene.hostId}
          persons={slotPersons}
          describedBy={ROSTER_CASTING_HELP_ID}
          onValueChange={handleAssignHost}
          onClear={() => removeHost(scene.id)}
        />
      </div>

      <CastDropZone
        sceneId={scene.id}
        zone="host"
        ariaLabel={t('lineup.dropHostZone', { name: scene.name })}
        className="hidden min-w-0 flex-1 flex-wrap items-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-2 md:flex"
      >
        {hostSlot ? (
          <CastSlot
            inline
            castRole="host"
            personId={hostSlot.personId}
            name={hostSlot.name}
            isWarning={hostSlot.isWarning}
            warningLabel={hostSlot.warningLabel}
            onRemove={() => removeHost(scene.id)}
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
