import { RosterPanel } from '@/components/roster/RosterPanel';
import { RunningOrderPanel } from '@/components/running-order/RunningOrderPanel';
import { Spinner } from '@/components/ui/spinner';
import { useAppHydration } from '@/store/useAppHydration';

function App() {
  const hydrated = useAppHydration();

  if (!hydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b px-6 py-4 print:hidden">
        <h1 className="font-heading text-lg font-semibold tracking-tight">
          Improv Running Order
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex min-h-64 w-full shrink-0 flex-col border-b md:min-h-0 md:w-80 md:border-r md:border-b-0 print:hidden">
          <RosterPanel />
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <RunningOrderPanel />
        </main>
      </div>
    </div>
  );
}

export default App;
