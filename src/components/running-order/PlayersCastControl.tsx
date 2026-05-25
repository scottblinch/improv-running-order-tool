import { X } from 'lucide-react';

import { AllPlaySlot } from '@/components/shared/AllPlaySlot';
import { CastDropZone } from '@/components/running-order/CastDropZone';
import { PersonAssignSelect } from '@/components/running-order/PersonAssignSelect';
import { PersonSlotSelect } from '@/components/running-order/PersonSlotSelect';
import { CastSlot } from '@/components/shared/CastSlot';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { Button } from '@/components/ui/button';
import { ROSTER_CASTING_HELP_ID } from '@/lib/a11y-ids';
import {
  getPersonById,
  resolveSlotDisplay,
  selectCastablePersons,
  selectPersonsForSlot,
  selectScenePlayerIds,
} from '@/store/selectors';
import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/i18n';
import type { PersonId, Scene } from '@/types/app';

type PlayersCastControlProps = {
  scene: Scene;
};

export function PlayersCastControl({ scene }: PlayersCastControlProps) {
  const { t } = useTranslation();
  const announce = useA11yAnnounceStore((state) => state.announce);
  const persons = useAppStore((state) => state.persons);
  const addPlayer = useAppStore((state) => state.addPlayer);
  const replacePlayer = useAppStore((state) => state.replacePlayer);
  const removePlayer = useAppStore((state) => state.removePlayer);
  const setAllPlay = useAppStore((state) => state.setAllPlay);

  const castablePersons = selectCastablePersons(persons);
  const sortedPlayerIds = selectScenePlayerIds(persons, scene.playerIds);

  const announcePlayerAdded = (personId: PersonId) => {
    const person = getPersonById(persons, personId);
    announce(
      t('a11y.addedPlayer', {
        name: person?.name ?? t('fallback.performer'),
        scene: scene.name,
      }),
    );
  };

  const handleAddPlayer = (personId: PersonId) => {
    addPlayer(scene.id, personId);
    announcePlayerAdded(personId);
  };

  const handleReplacePlayer = (playerId: PersonId, newPersonId: PersonId) => {
    replacePlayer(scene.id, playerId, newPersonId);
    const person = getPersonById(persons, newPersonId);
    announce(
      t('a11y.replacedPlayer', {
        name: person?.name ?? t('fallback.performer'),
        scene: scene.name,
      }),
    );
  };

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
            castRole="player"
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
        label={t('lineup.addPlayer')}
        persons={castablePersons}
        excludedPersonIds={scene.playerIds}
        describedBy={ROSTER_CASTING_HELP_ID}
        onAssign={handleAddPlayer}
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
                    label={t('lineup.playerInScene', { scene: scene.name })}
                    value={playerId}
                    persons={selectPersonsForSlot(persons, playerId)}
                    describedBy={ROSTER_CASTING_HELP_ID}
                    onValueChange={(newPersonId) =>
                      handleReplacePlayer(playerId, newPersonId)
                    }
                    className="min-w-0 flex-1"
                  />
                  <IconButtonTooltip
                    label={t('lineup.removePlayer', { name: slot.name })}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0"
                      aria-label={t('lineup.removePlayer', {
                        name: slot.name,
                      })}
                      onClick={() => removePlayer(scene.id, playerId)}
                    >
                      <X aria-hidden className="size-4" />
                    </Button>
                  </IconButtonTooltip>
                </div>
              );
            })}
            <PersonAssignSelect
              label={t('lineup.addPlayer')}
              persons={castablePersons}
              excludedPersonIds={scene.playerIds}
              describedBy={ROSTER_CASTING_HELP_ID}
              onAssign={handleAddPlayer}
            />
          </>
        )}
      </div>

      <CastDropZone
        sceneId={scene.id}
        zone="players"
        ariaLabel={t('lineup.dropPlayersZone', { name: scene.name })}
        className="hidden min-w-0 flex-1 flex-wrap items-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-2 md:flex"
      >
        {playerControls}
      </CastDropZone>
    </>
  );
}
