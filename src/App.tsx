import { AppLoadingScreen } from '@/components/layout/AppLoadingScreen';
import { AppShell } from '@/components/layout/AppShell';
import { useAppHydration } from '@/store/useAppHydration';

function App() {
  const hydrated = useAppHydration();

  if (!hydrated) {
    return <AppLoadingScreen />;
  }

  return (
    <>
      <p className="sr-only" role="status">
        Application ready
      </p>
      <AppShell />
    </>
  );
}

export default App;
