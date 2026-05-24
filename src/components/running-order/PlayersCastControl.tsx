import { Users, X } from 'lucide-react';

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
} from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import type { Scene } from '@/types/app';

type PlayersCastControlProps = {
  scene: Scene;
};

export function PlayersCastControl({ scene }: PlayersCastControlProps) {
  const persons = useAppStore((state) => state.persons);
  const addPlayer = useAppStore((state) => state.addPlayer);
  const replacePlayer = useAppStore((state) => state.replacePlayer);
  const removePlayer = useAppStore((state) => state.removePlayer);
  const setAllPlay = useAppStore((state) => state.setAllPlay);

  const castablePersons = selectCastablePersons(persons);

  const allPlayControls = scene.isAllPlay ? (
    <AllPlaySlot inline onRemove={() => setAllPlay(scene.id, false)} />
  ) : (
    <>
      {scene.playerIds.map((playerId) => {
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
        label="Add player"
        persons={castablePersons}
        excludedPersonIds={scene.playerIds}
        onAssign={(personId) => addPlayer(scene.id, personId)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={() => setAllPlay(scene.id, true)}
      >
        <Users aria-hidden className="size-3.5" />
        All play
      </Button>
    </>
  );

  return (
    <>
      <div className="space-y-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-3 md:hidden">
        {scene.isAllPlay ? (
          <AllPlaySlot onRemove={() => setAllPlay(scene.id, false)} />
        ) : (
          <>
            {scene.playerIds.map((playerId) => {
              const slot = resolveSlotDisplay(persons, playerId);

              return (
                <div key={playerId} className="flex items-center gap-2">
                  <PersonSlotSelect
                    label="Player"
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
                    aria-label={`Remove ${slot.name}`}
                    onClick={() => removePlayer(scene.id, playerId)}
                  >
                    <X aria-hidden className="size-4" />
                  </Button>
                </div>
              );
            })}
            <PersonAssignSelect
              label="Add player"
              persons={castablePersons}
              excludedPersonIds={scene.playerIds}
              onAssign={(personId) => addPlayer(scene.id, personId)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setAllPlay(scene.id, true)}
            >
              <Users aria-hidden className="size-3.5" />
              All play
            </Button>
          </>
        )}
      </div>

      <CastDropZone
        sceneId={scene.id}
        zone="players"
        className="hidden flex-wrap items-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-3 md:flex"
      >
        {allPlayControls}
      </CastDropZone>
    </>
  );
}
