import { AppHeader } from '@/components/layout/AppHeader';
import { EmptyWorkspace } from '@/components/layout/EmptyWorkspace';
import { SkipLink } from '@/components/layout/SkipLink';
import { LINEUP_HEADING_ID, ROSTER_HEADING_ID } from '@/lib/a11y-ids';
import { RosterPanel } from '@/components/roster/RosterPanel';
import { RunningOrderPanel } from '@/components/running-order/RunningOrderPanel';
import { AppDndProvider } from '@/components/dnd/AppDndProvider';
import { A11yLiveRegion } from '@/components/a11y/A11yLiveRegion';
import { hasSavedShows } from '@/lib/show-workspace';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function AppShell() {
  const printPreview = usePrintPreviewStore((state) => state.enabled);
  const shows = useAppStore((state) => state.shows);
  const hasShows = hasSavedShows({ shows });

  return (
    <div
      className={cn(
        'flex h-dvh flex-col overflow-hidden bg-background print:block print:h-auto print:min-h-0 print:overflow-visible print:bg-white',
        printPreview && 'overflow-hidden',
      )}
    >
      <SkipLink />
      <A11yLiveRegion />
      <AppHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden print:block print:h-auto print:min-h-0">
        {hasShows ? (
          <AppDndProvider>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden print:block print:h-auto print:min-h-0">
              <aside
                aria-labelledby={ROSTER_HEADING_ID}
                className={cn(
                  'flex shrink-0 flex-col border-b md:min-h-0 md:w-80 md:shrink-0 md:overflow-hidden md:border-r md:border-b-0 print:hidden',
                  printPreview && 'hidden',
                )}
              >
                <RosterPanel />
              </aside>

              <main
                aria-labelledby={LINEUP_HEADING_ID}
                className={cn(
                  'flex min-w-0 flex-col md:min-h-0 md:flex-1 md:overflow-hidden print:block print:h-auto print:min-h-0 print:w-full print:max-w-none print:overflow-visible',
                  printPreview && 'overflow-hidden',
                )}
              >
                <RunningOrderPanel />
              </main>
            </div>
          </AppDndProvider>
        ) : (
          <EmptyWorkspace />
        )}
      </div>
    </div>
  );
}
