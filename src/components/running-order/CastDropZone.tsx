import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

import { useDesktopDndEnabled } from '@/components/dnd/desktop-dnd-context';
import { hostZoneDropId, playerZoneDropId } from '@/lib/dnd-ids';
import { cn } from '@/lib/utils';
import type { SceneId } from '@/types/app';

type CastDropZoneProps = {
  sceneId: SceneId;
  zone: 'host' | 'players';
  ariaLabel: string;
  className?: string;
  children: ReactNode;
};

export function CastDropZone({
  sceneId,
  zone,
  ariaLabel,
  className,
  children,
}: CastDropZoneProps) {
  const desktopDndEnabled = useDesktopDndEnabled();
  const { setNodeRef, isOver } = useDroppable({
    id: zone === 'host' ? hostZoneDropId(sceneId) : playerZoneDropId(sceneId),
    data: {
      type: zone === 'host' ? 'host-zone' : 'player-zone',
      sceneId,
    },
    disabled: !desktopDndEnabled,
  });

  return (
    <div
      ref={setNodeRef}
      role="group"
      data-drop-zone={zone}
      aria-label={ariaLabel}
      className={cn(
        className,
        isOver &&
          'border-primary bg-primary/10 ring-2 ring-primary/30 ring-offset-1 ring-offset-background',
      )}
    >
      {children}
    </div>
  );
}
