import { Users, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AllPlaySlotProps = {
  inline?: boolean;
  onRemove?: () => void;
};

export function AllPlaySlot({ inline = false, onRemove }: AllPlaySlotProps) {
  return (
    <div
      className={cn(
        'items-center gap-2 rounded-lg border border-border bg-muted/50 px-2 py-1.5',
        inline ? 'inline-flex max-w-full shrink-0' : 'flex w-full',
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
