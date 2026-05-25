import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { cn } from '@/lib/utils';
import { castRoleSurfaceClasses } from '@/lib/cast-role-styles';
import type { CastSlotRole } from '@/lib/cast-role-styles';
import { formatWarningLabel } from '@/lib/i18n-labels';
import { useHoverStore } from '@/store/useHoverStore';
import { useTranslation } from '@/i18n';
import type { PersonId } from '@/types/app';

export type { CastSlotRole };

type CastSlotProps = {
  personId: PersonId;
  name: string;
  role: CastSlotRole;
  isWarning: boolean;
  warningLabel?: 'Absent' | 'Removed';
  inline?: boolean;
  onRemove?: () => void;
};

export function CastSlot({
  personId,
  name,
  role,
  isWarning,
  warningLabel,
  inline = false,
  onRemove,
}: CastSlotProps) {
  const { t } = useTranslation();
  const isHighlighted = useHoverStore(
    (state) => state.hoveredPersonId === personId,
  );

  const removeLabel =
    role === 'host'
      ? t('lineup.removeHost', { name })
      : t('lineup.removePlayer', { name });

  return (
    <div
      data-person-id={personId}
      className={cn(
        'items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors select-none',
        inline ? 'inline-flex max-w-full shrink-0' : 'flex w-full',
        isWarning
          ? 'border-destructive/50 bg-destructive/5'
          : castRoleSurfaceClasses(role),
        isHighlighted &&
          'ring-2 ring-primary/40 ring-offset-1 ring-offset-background',
      )}
    >
      <span
        className={cn(
          'truncate text-sm font-medium',
          inline ? 'max-w-40' : 'min-w-0 flex-1',
          isWarning && 'text-muted-foreground line-through',
        )}
      >
        {name}
      </span>
      {isWarning && warningLabel ? (
        <Badge variant="destructive" className="shrink-0">
          {formatWarningLabel(warningLabel)}
        </Badge>
      ) : null}
      {onRemove ? (
        <IconButtonTooltip label={removeLabel}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            aria-label={removeLabel}
            onClick={onRemove}
          >
            <X aria-hidden className="size-4" />
          </Button>
        </IconButtonTooltip>
      ) : null}
    </div>
  );
}
