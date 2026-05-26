import { AppLoadingScreen } from '@/components/layout/AppLoadingScreen';
import { AppShell } from '@/components/layout/AppShell';
import { ImportSharedShowDialog } from '@/components/layout/ImportSharedShowDialog';
import { PrivacyDialog } from '@/components/layout/PrivacyDialog';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useTranslation } from '@/i18n';
import { useAppHydration } from '@/store/useAppHydration';
import { usePrivacyDialogStore } from '@/store/usePrivacyDialogStore';

function App() {
  const { t } = useTranslation();
  const hydrated = useAppHydration();
  const privacyOpen = usePrivacyDialogStore((state) => state.open);
  const setPrivacyOpen = usePrivacyDialogStore((state) => state.setOpen);
  useDocumentTitle();

  if (!hydrated) {
    return <AppLoadingScreen />;
  }

  return (
    <TooltipProvider>
      <p className="sr-only" role="status">
        {t('app.ready')}
      </p>
      <Toaster position="bottom-center" closeButton />
      <ImportSharedShowDialog />
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <AppShell />
    </TooltipProvider>
  );
}

export default App;
