import { AppHeader } from '@/components/layout/AppHeader';
import { RosterPanel } from '@/components/roster/RosterPanel';
import { RunningOrderPanel } from '@/components/running-order/RunningOrderPanel';
import { AppDndProvider } from '@/components/dnd/AppDndProvider';

export function AppShell() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background print:h-auto print:min-h-0 print:overflow-visible print:bg-white">
      <AppHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AppDndProvider>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
            <aside
              aria-labelledby="roster-heading"
              className="flex min-h-0 shrink-0 flex-col overflow-hidden border-b max-md:max-h-[45vh] md:w-80 md:border-r md:border-b-0 print:hidden"
            >
              <RosterPanel />
            </aside>

            <main
              aria-labelledby="running-order-heading"
              className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden print:block print:w-full print:max-w-none print:overflow-visible"
            >
              <RunningOrderPanel />
            </main>
          </div>
        </AppDndProvider>
      </div>
    </div>
  );
}
