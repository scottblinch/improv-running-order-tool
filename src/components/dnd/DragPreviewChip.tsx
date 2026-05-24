import { cn } from '@/lib/utils';

type DragPreviewChipProps = {
  label: string;
  className?: string;
};

export function DragPreviewChip({ label, className }: DragPreviewChipProps) {
  return (
    <div
      className={cn(
        'inline-flex max-w-xs items-center rounded-lg border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium shadow-md ring-2 ring-primary/40',
        className,
      )}
    >
      <span className="truncate">{label}</span>
    </div>
  );
}
