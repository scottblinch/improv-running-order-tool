import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { useDesktopDndEnabled } from '@/components/dnd/desktop-dnd-context';
import { HostCastControl } from '@/components/running-order/HostCastControl';
import { PlayersCastControl } from '@/components/running-order/PlayersCastControl';
import { RemoveSceneDialog } from '@/components/running-order/RemoveSceneDialog';
import { RenameSceneDialog } from '@/components/running-order/RenameSceneDialog';
import { SceneReorderButtons } from '@/components/running-order/SceneReorderButtons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sceneDragId } from '@/lib/dnd-ids';
import { SCENE_REORDER_HELP_ID } from '@/lib/a11y-ids';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { Scene } from '@/types/app';

type SceneCardProps = {
  scene: Scene;
  index: number;
  sceneCount: number;
};

export function SceneCard({ scene, index, sceneCount }: SceneCardProps) {
  const renameScene = useAppStore((state) => state.renameScene);
  const removeScene = useAppStore((state) => state.removeScene);

  const [renameOpen, setRenameOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const desktopDndEnabled = useDesktopDndEnabled();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sceneDragId(scene.id),
    data: { type: 'scene', sceneId: scene.id },
    disabled: !desktopDndEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        aria-label={`Scene ${index + 1}: ${scene.name}`}
        className={cn(
          'rounded-xl border bg-card px-4 py-3 ring-1 ring-foreground/10',
          isDragging && 'opacity-50',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="mt-0.5 hidden shrink-0 cursor-grab touch-none active:cursor-grabbing md:inline-flex print:hidden"
              aria-label={`Reorder ${scene.name}`}
              disabled={!desktopDndEnabled}
              {...listeners}
              {...attributes}
              aria-describedby={SCENE_REORDER_HELP_ID}
            >
              <GripVertical aria-hidden className="size-4" />
            </Button>
            <SceneReorderButtons
              sceneId={scene.id}
              index={index}
              sceneCount={sceneCount}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                Scene {index + 1}
              </p>
              <p className="truncate font-medium">{scene.name}</p>
            </div>
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

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-start md:gap-3">
          <section
            aria-labelledby={`${scene.id}-host-label`}
            className="flex w-full min-w-0 flex-col gap-2 md:w-auto"
          >
            <h3
              id={`${scene.id}-host-label`}
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              Host
            </h3>
            <HostCastControl scene={scene} />
          </section>

          <section
            aria-labelledby={`${scene.id}-players-label`}
            className="flex w-full min-w-0 flex-1 flex-col gap-2"
          >
            <h3
              id={`${scene.id}-players-label`}
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              Players
            </h3>
            <PlayersCastControl scene={scene} />
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
