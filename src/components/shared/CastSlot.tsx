import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CastSlotProps = {
  name: string;
  isWarning: boolean;
  warningLabel?: 'Absent' | 'Removed';
  onRemove?: () => void;
};

export function CastSlot({
  name,
  isWarning,
  warningLabel,
  onRemove,
}: CastSlotProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-2 py-1.5',
        isWarning
          ? 'border-destructive/50 bg-destructive/5'
          : 'border-border bg-muted/50',
      )}
    >
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-sm font-medium',
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
