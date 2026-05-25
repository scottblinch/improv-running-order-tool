import { X } from 'lucide-react';

import { AllPlaySlot } from '@/components/shared/AllPlaySlot';
import { CastDropZone } from '@/components/running-order/CastDropZone';
import { PersonAssignSelect } from '@/components/running-order/PersonAssignSelect';
import { PersonSlotSelect } from '@/components/running-order/PersonSlotSelect';
import { CastSlot } from '@/components/shared/CastSlot';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { Button } from '@/components/ui/button';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';
import { ROSTER_CASTING_HELP_ID } from '@/lib/a11y-ids';
import { announceCastPersonInScene } from '@/lib/cast-a11y';
import { castDropSurfaceClasses } from '@/lib/cast-role-styles';
import { cn } from '@/lib/utils';
import {
  resolveSlotDisplay,
  selectCastablePersons,
  selectPersonsForSlot,
  selectScenePlayerIds,
} from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/i18n';
import type { PersonId, Scene } from '@/types/app';

type PlayersCastControlProps = {
  scene: Scene;
};

export function PlayersCastControl({ scene }: PlayersCastControlProps) {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const persons = useAppStore((state) => state.persons);
  const addPlayer = useAppStore((state) => state.addPlayer);
  const replacePlayer = useAppStore((state) => state.replacePlayer);
  const removePlayer = useAppStore((state) => state.removePlayer);
  const setAllPlay = useAppStore((state) => state.setAllPlay);

  const castablePersons = selectCastablePersons(persons);
  const sortedPlayerIds = selectScenePlayerIds(persons, scene.playerIds);

  const handleAddPlayer = (personId: PersonId) => {
    addPlayer(scene.id, personId);
    announceCastPersonInScene(
      announceA11y,
      persons,
      personId,
      scene.name,
      'a11y.addedPlayer',
      t,
    );
  };

  const handleReplacePlayer = (playerId: PersonId, newPersonId: PersonId) => {
    replacePlayer(scene.id, playerId, newPersonId);
    announceCastPersonInScene(
      announceA11y,
      persons,
      newPersonId,
      scene.name,
      'a11y.replacedPlayer',
      t,
    );
  };

  const handleRemovePlayer = (playerId: PersonId) => {
    const slot = resolveSlotDisplay(persons, playerId);
    removePlayer(scene.id, playerId);
    announceA11y('a11y.removedPlayer', {
      name: slot.name,
      scene: scene.name,
    });
  };

  const handleRemoveAllPlay = () => {
    setAllPlay(scene.id, false);
    announceA11y('a11y.removedAllPlay', { scene: scene.name });
  };

  const playerControls = scene.isAllPlay ? (
    <AllPlaySlot sceneId={scene.id} inline onRemove={handleRemoveAllPlay} />
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
            onRemove={() => handleRemovePlayer(playerId)}
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
      <div
        className={cn(
          castDropSurfaceClasses,
          'min-w-0 flex-1 space-y-2 md:hidden',
        )}
      >
        {scene.isAllPlay ? (
          <AllPlaySlot sceneId={scene.id} onRemove={handleRemoveAllPlay} />
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
                      onClick={() => handleRemovePlayer(playerId)}
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
        className={cn(
          castDropSurfaceClasses,
          'hidden min-w-0 flex-1 flex-wrap items-center gap-2 md:flex',
        )}
      >
        {playerControls}
      </CastDropZone>
    </>
  );
}
