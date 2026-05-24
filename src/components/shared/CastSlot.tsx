import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHoverStore } from '@/store/useHoverStore';
import type { PersonId } from '@/types/app';

type CastSlotProps = {
  personId: PersonId;
  name: string;
  isWarning: boolean;
  warningLabel?: 'Absent' | 'Removed';
  inline?: boolean;
  onRemove?: () => void;
};

export function CastSlot({
  personId,
  name,
  isWarning,
  warningLabel,
  inline = false,
  onRemove,
}: CastSlotProps) {
  const isHighlighted = useHoverStore(
    (state) => state.hoveredPersonId === personId,
  );

  return (
    <div
      data-person-id={personId}
      className={cn(
        'items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors',
        inline ? 'inline-flex max-w-full shrink-0' : 'flex w-full',
        isWarning
          ? 'border-destructive/50 bg-destructive/5'
          : 'border-border bg-muted/50',
        isHighlighted &&
          'border-primary bg-primary/10 ring-2 ring-primary/40 ring-offset-1 ring-offset-background',
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
          {warningLabel}
        </Badge>
      ) : null}
      {onRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
        >
          <X aria-hidden className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
