import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { PersonAssignSelect } from '@/components/running-order/PersonAssignSelect';
import { RemoveSceneDialog } from '@/components/running-order/RemoveSceneDialog';
import { RenameSceneDialog } from '@/components/running-order/RenameSceneDialog';
import { CastSlot } from '@/components/shared/CastSlot';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { resolveSlotDisplay, selectCastablePersons } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import type { Scene } from '@/types/app';

type SceneCardProps = {
  scene: Scene;
  index: number;
};

export function SceneCard({ scene, index }: SceneCardProps) {
  const persons = useAppStore((state) => state.persons);
  const renameScene = useAppStore((state) => state.renameScene);
  const removeScene = useAppStore((state) => state.removeScene);
  const assignHost = useAppStore((state) => state.assignHost);
  const removeHost = useAppStore((state) => state.removeHost);
  const addPlayer = useAppStore((state) => state.addPlayer);
  const removePlayer = useAppStore((state) => state.removePlayer);

  const [renameOpen, setRenameOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const castablePersons = selectCastablePersons(persons);
  const hostSlot = scene.hostId
    ? resolveSlotDisplay(persons, scene.hostId)
    : null;

  return (
    <>
      <li
        aria-label={`Scene ${index + 1}: ${scene.name}`}
        className="rounded-xl border bg-card px-4 py-3 ring-1 ring-foreground/10"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              Scene {index + 1}
            </p>
            <p className="truncate font-medium">{scene.name}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                aria-label={`Actions for ${scene.name}`}
              >
                <MoreHorizontal aria-hidden className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
                <Pencil aria-hidden className="size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setRemoveOpen(true)}
              >
                <Trash2 aria-hidden className="size-4" />
                Remove scene
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 space-y-4">
          <section aria-labelledby={`${scene.id}-host-label`}>
            <h3
              id={`${scene.id}-host-label`}
              className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              Host
            </h3>
            <div
              className={cn(
                'rounded-lg border border-dashed p-3',
                hostSlot
                  ? 'border-border bg-transparent'
                  : 'border-muted-foreground/25 bg-muted/30',
              )}
              data-drop-zone="host"
            >
              {hostSlot ? (
                <CastSlot
                  personId={hostSlot.personId}
                  name={hostSlot.name}
                  isWarning={hostSlot.isWarning}
                  warningLabel={hostSlot.warningLabel}
                  onRemove={() => removeHost(scene.id)}
                />
              ) : (
                <PersonAssignSelect
                  label="Assign host"
                  persons={castablePersons}
                  onAssign={(personId) => assignHost(scene.id, personId)}
                />
              )}
            </div>
          </section>

          <section aria-labelledby={`${scene.id}-players-label`}>
            <h3
              id={`${scene.id}-players-label`}
              className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              Players
            </h3>
            <div
              className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-3"
              data-drop-zone="players"
            >
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
            </div>
          </section>
        </div>
      </li>

      <RenameSceneDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={scene.name}
        onConfirm={(name) => renameScene(scene.id, name)}
      />

      <RemoveSceneDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        sceneName={scene.name}
        onConfirm={() => removeScene(scene.id)}
      />
    </>
  );
}
