import { Drama, Plus, Sparkles } from 'lucide-react';

import { AppFooter } from '@/components/layout/AppFooter';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <Empty className="border-border bg-muted/30">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Sparkles aria-hidden className="size-4" />
              </EmptyMedia>
              <EmptyTitle>{t('workspace.emptyTitle')}</EmptyTitle>
              <EmptyDescription>
                {t('workspace.emptyDescription')}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type="button" onClick={handleCreateShow}>
                <Plus aria-hidden className="size-4" />
                {t('workspace.newShow')}
              </Button>
            </EmptyContent>
          </Empty>
          <div className="flex flex-col items-center gap-3">
            <Drama aria-hidden className="size-6 shrink-0 text-foreground" />
            <p className="text-center text-sm/relaxed text-muted-foreground">
              {t('workspace.emptyBlurb')}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-auto shrink-0 px-6 pb-4">
        <AppFooter />
      </div>
    </div>
  );
}
