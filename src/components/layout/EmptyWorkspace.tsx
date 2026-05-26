import { Plus, Sparkles } from 'lucide-react';

import { AppFooter } from '@/components/layout/AppFooter';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';
import { useTranslation } from '@/i18n';
import { formatShowMenuLabel } from '@/lib/show-workspace';
import { useAppStore } from '@/store/useAppStore';

export function EmptyWorkspace() {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const createShow = useAppStore((state) => state.createShow);

  const handleCreateShow = () => {
    createShow();
    const {
      showName: nextName,
      showDate: nextDate,
      showVenue: nextVenue,
      showTime: nextTime,
    } = useAppStore.getState();
    announceA11y('a11y.createdShow', {
      label: formatShowMenuLabel(nextName, nextDate, nextVenue, nextTime),
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-6 py-10">
      <EmptyState
        icon={<Sparkles aria-hidden className="size-4" />}
        title={t('workspace.emptyTitle')}
        description={t('workspace.emptyDescription')}
      />
      <Button type="button" onClick={handleCreateShow}>
        <Plus aria-hidden className="size-4" />
        {t('workspace.newShow')}
      </Button>
      <AppFooter />
    </div>
  );
}
