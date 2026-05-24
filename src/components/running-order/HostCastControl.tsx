import { CastDropZone } from '@/components/running-order/CastDropZone';
import { PersonAssignSelect } from '@/components/running-order/PersonAssignSelect';
import { PersonSlotSelect } from '@/components/running-order/PersonSlotSelect';
import { CastSlot } from '@/components/shared/CastSlot';
import {
  resolveSlotDisplay,
  selectCastablePersons,
  selectPersonsForSlot,
} from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/i18n';
import type { Scene } from '@/types/app';

type HostCastControlProps = {
  scene: Scene;
};

export function HostCastControl({ scene }: HostCastControlProps) {
  const { t } = useTranslation();
  const persons = useAppStore((state) => state.persons);
  const assignHost = useAppStore((state) => state.assignHost);
  const removeHost = useAppStore((state) => state.removeHost);

  const castablePersons = selectCastablePersons(persons);
  const hostSlot = scene.hostId
    ? resolveSlotDisplay(persons, scene.hostId)
    : null;
  const slotPersons = selectPersonsForSlot(persons, scene.hostId);

  return (
    <>
      <div className="min-w-0 flex-1 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-2 md:hidden">
        <PersonSlotSelect
          label={t('lineup.assignHost')}
          value={scene.hostId}
          persons={slotPersons}
          onValueChange={(personId) => assignHost(scene.id, personId)}
          onClear={() => removeHost(scene.id)}
        />
      </div>

      <CastDropZone
        sceneId={scene.id}
        zone="host"
        className="hidden min-w-0 flex-1 flex-wrap items-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-2 md:flex"
      >
        {hostSlot ? (
          <CastSlot
            inline
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
            onAssign={(personId) => assignHost(scene.id, personId)}
          />
        )}
      </CastDropZone>
    </>
  );
}
