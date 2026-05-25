import { AppLoadingScreen } from '@/components/layout/AppLoadingScreen';
import { AppShell } from '@/components/layout/AppShell';
import { ImportSharedShowDialog } from '@/components/layout/ImportSharedShowDialog';
import { Toaster } from '@/components/ui/sonner';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useTranslation } from '@/i18n';
import { useAppHydration } from '@/store/useAppHydration';

function App() {
  const { t } = useTranslation();
  const hydrated = useAppHydration();
  useDocumentTitle();

  if (!hydrated) {
    return <AppLoadingScreen />;
  }

  return (
    <>
      <p className="sr-only" role="status">
        {t('app.ready')}
      </p>
      <Toaster position="bottom-center" closeButton />
      <ImportSharedShowDialog />
      <AppShell />
    </>
  );
}

export default App;
