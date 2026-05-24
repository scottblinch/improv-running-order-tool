import { PrintPreviewToggle } from '@/components/layout/PrintPreviewToggle';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/lib/utils';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function AppHeader() {
  const printPreview = usePrintPreviewStore((state) => state.enabled);

  return (
    <header
      className={cn(
        'flex shrink-0 items-center justify-between gap-4 px-6 py-4 print:hidden',
        !printPreview && 'border-b',
      )}
    >
      {!printPreview && (
        <h1 className="font-heading text-lg font-semibold tracking-tight">
          Improv Running Order
        </h1>
      )}
      <div className={cn('flex items-center gap-2', printPreview && 'ml-auto')}>
        {!printPreview && <ThemeToggle />}
        <PrintPreviewToggle />
      </div>
    </header>
  );
}
