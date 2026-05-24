import { X } from 'lucide-react';

import { AllPlaySlot } from '@/components/shared/AllPlaySlot';
import { CastDropZone } from '@/components/running-order/CastDropZone';
import { PersonAssignSelect } from '@/components/running-order/PersonAssignSelect';
import { PersonSlotSelect } from '@/components/running-order/PersonSlotSelect';
import { CastSlot } from '@/components/shared/CastSlot';
import { Button } from '@/components/ui/button';
import {
  resolveSlotDisplay,
  selectCastablePersons,
  selectPersonsForSlot,
  selectScenePlayerIds,
} from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/i18n';
import type { Scene } from '@/types/app';

type PlayersCastControlProps = {
  scene: Scene;
};

export function PlayersCastControl({ scene }: PlayersCastControlProps) {
  const { t } = useTranslation();
  const persons = useAppStore((state) => state.persons);
  const addPlayer = useAppStore((state) => state.addPlayer);
  const replacePlayer = useAppStore((state) => state.replacePlayer);
  const removePlayer = useAppStore((state) => state.removePlayer);
  const setAllPlay = useAppStore((state) => state.setAllPlay);

  const castablePersons = selectCastablePersons(persons);
  const sortedPlayerIds = selectScenePlayerIds(persons, scene.playerIds);

  const playerControls = scene.isAllPlay ? (
    <AllPlaySlot
      sceneId={scene.id}
      inline
      onRemove={() => setAllPlay(scene.id, false)}
    />
  ) : (
    <>
      {sortedPlayerIds.map((playerId) => {
        const slot = resolveSlotDisplay(persons, playerId);

        return (
          <CastSlot
            key={playerId}
            inline
            personId={slot.personId}
            name={slot.name}
            isWarning={slot.isWarning}
            warningLabel={slot.warningLabel}
            onRemove={() => removePlayer(scene.id, playerId)}
          />
        );
      })}
      <PersonAssignSelect
        inline
        label={t('runningOrder.addPlayer')}
        persons={castablePersons}
        excludedPersonIds={scene.playerIds}
        onAssign={(personId) => addPlayer(scene.id, personId)}
      />
    </>
  );

  return (
    <>
      <div className="min-w-0 flex-1 space-y-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-2 md:hidden">
        {scene.isAllPlay ? (
          <AllPlaySlot
            sceneId={scene.id}
            onRemove={() => setAllPlay(scene.id, false)}
          />
        ) : (
          <>
            {sortedPlayerIds.map((playerId) => {
              const slot = resolveSlotDisplay(persons, playerId);

              return (
                <div key={playerId} className="flex items-center gap-2">
                  <PersonSlotSelect
                    label={t('common.player')}
                    value={playerId}
                    persons={selectPersonsForSlot(persons, playerId)}
                    onValueChange={(newPersonId) =>
                      replacePlayer(scene.id, playerId, newPersonId)
                    }
                    className="min-w-0 flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    aria-label={t('runningOrder.removePlayer', {
                      name: slot.name,
                    })}
                    onClick={() => removePlayer(scene.id, playerId)}
                  >
                    <X aria-hidden className="size-4" />
                  </Button>
                </div>
              );
            })}
            <PersonAssignSelect
              label={t('runningOrder.addPlayer')}
              persons={castablePersons}
              excludedPersonIds={scene.playerIds}
              onAssign={(personId) => addPlayer(scene.id, personId)}
            />
          </>
        )}
      </div>

      <CastDropZone
        sceneId={scene.id}
        zone="players"
        className="hidden min-w-0 flex-1 flex-wrap items-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-2 md:flex"
      >
        {playerControls}
      </CastDropZone>
    </>
  );
}
