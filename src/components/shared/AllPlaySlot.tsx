import { Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import {
  castRoleLabelClasses,
  castRoleSurfaceClasses,
} from '@/lib/cast-role-styles';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n';
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
  const { t } = useTranslation();
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
        'items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors select-none',
        castRoleSurfaceClasses('player'),
        inline ? 'inline-flex max-w-full shrink-0' : 'flex w-full',
        isHighlighted &&
          'ring-2 ring-primary/40 ring-offset-1 ring-offset-background',
      )}
    >
      <Users
        aria-hidden
        className={cn('size-3.5 shrink-0', castRoleLabelClasses('player'))}
      />
      <span
        className={cn('text-sm font-medium', castRoleLabelClasses('player'))}
      >
        {t('common.allPlay')}
      </span>
      {onRemove ? (
        <IconButtonTooltip label={t('lineup.removeAllPlay')}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-label={t('lineup.removeAllPlay')}
            onClick={onRemove}
          >
            <X aria-hidden className="size-4" />
          </Button>
        </IconButtonTooltip>
      ) : null}
    </div>
  );
}
