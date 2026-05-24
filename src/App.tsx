import { AppLoadingScreen } from '@/components/layout/AppLoadingScreen';
import { AppShell } from '@/components/layout/AppShell';
import { useAppHydration } from '@/store/useAppHydration';

function App() {
  const hydrated = useAppHydration();

  if (!hydrated) {
    return <AppLoadingScreen />;
  }

  return <AppShell />;
}

export default App;
