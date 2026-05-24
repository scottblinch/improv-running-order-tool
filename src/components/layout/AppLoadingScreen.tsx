import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/i18n';

export function AppLoadingScreen() {
  const { t } = useTranslation();

  return (
    <div
      aria-busy
      className="flex min-h-svh items-center justify-center bg-background"
    >
      <Spinner aria-hidden className="size-5 text-muted-foreground" />
      <p className="sr-only" role="status">
        {t('app.loading')}
      </p>
    </div>
  );
}
