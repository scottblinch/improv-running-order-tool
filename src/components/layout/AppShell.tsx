import { AppHeader } from '@/components/layout/AppHeader';
import { RosterPanel } from '@/components/roster/RosterPanel';
import { RunningOrderPanel } from '@/components/running-order/RunningOrderPanel';
import { AppDndProvider } from '@/components/dnd/AppDndProvider';

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col bg-background print:min-h-0 print:bg-white">
      <AppHeader />

      <AppDndProvider>
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <aside
            aria-labelledby="roster-heading"
            className="flex min-h-64 w-full shrink-0 flex-col border-b md:min-h-0 md:w-80 md:border-r md:border-b-0 print:hidden"
          >
            <RosterPanel />
          </aside>

          <main
            aria-labelledby="running-order-heading"
            className="flex min-h-0 min-w-0 flex-1 flex-col print:block print:w-full print:max-w-none print:overflow-visible"
          >
            <RunningOrderPanel />
          </main>
        </div>
      </AppDndProvider>
    </div>
  );
}
