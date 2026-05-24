import { Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { personPlaysInScene } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { useHoverStore } from '@/store/useHoverStore';
import type { SceneId } from '@/types/app';

type AllPlaySlotProps = {
  sceneId: SceneId;
  inline?: boolean;
  onRemove?: () => void;
};

export function AllPlaySlot({
  sceneId,
  inline = false,
  onRemove,
}: AllPlaySlotProps) {
  const hoveredPersonId = useHoverStore((state) => state.hoveredPersonId);
  const persons = useAppStore((state) => state.persons);
  const scenes = useAppStore((state) => state.scenes);
  const scene = scenes.find((item) => item.id === sceneId);

  const isHighlighted =
    hoveredPersonId !== null &&
    scene !== undefined &&
    personPlaysInScene(persons, scene, hoveredPersonId);

  return (
    <div
      className={cn(
        'items-center gap-2 rounded-lg border border-border bg-muted/50 px-2 py-1.5 transition-colors',
        inline ? 'inline-flex max-w-full shrink-0' : 'flex w-full',
        isHighlighted &&
          'border-primary bg-primary/10 ring-2 ring-primary/40 ring-offset-1 ring-offset-background',
      )}
    >
      <Users aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="text-sm font-medium">All play</span>
      {onRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label="Remove all play"
          onClick={onRemove}
        >
          <X aria-hidden className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
