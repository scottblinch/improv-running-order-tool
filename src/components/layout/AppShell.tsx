import { AppHeader } from '@/components/layout/AppHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { LINEUP_HEADING_ID, ROSTER_HEADING_ID } from '@/lib/a11y-ids';
import { RosterPanel } from '@/components/roster/RosterPanel';
import { RunningOrderPanel } from '@/components/running-order/RunningOrderPanel';
import { AppDndProvider } from '@/components/dnd/AppDndProvider';
import { A11yLiveRegion } from '@/components/a11y/A11yLiveRegion';
import { cn } from '@/lib/utils';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function AppShell() {
  const printPreview = usePrintPreviewStore((state) => state.enabled);

  return (
    <div
      className={cn(
        'flex h-dvh flex-col overflow-hidden bg-background print:block print:h-auto print:min-h-0 print:overflow-visible print:bg-white',
        printPreview && 'bg-white',
      )}
    >
      <SkipLink />
      <A11yLiveRegion />
      <AppHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden print:block print:h-auto print:min-h-0">
        <AppDndProvider>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row print:block print:h-auto print:min-h-0">
            <aside
              aria-labelledby={ROSTER_HEADING_ID}
              className={cn(
                'flex min-h-0 shrink-0 flex-col overflow-hidden border-b max-md:max-h-[45vh] md:w-80 md:border-r md:border-b-0 print:hidden',
                printPreview && 'hidden',
              )}
            >
              <RosterPanel />
            </aside>

            <main
              aria-labelledby={LINEUP_HEADING_ID}
              className={cn(
                'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden print:block print:h-auto print:min-h-0 print:w-full print:max-w-none print:overflow-visible',
                printPreview && 'overflow-y-auto bg-white',
              )}
            >
              <RunningOrderPanel />
            </main>
          </div>
        </AppDndProvider>
      </div>
    </div>
  );
}
