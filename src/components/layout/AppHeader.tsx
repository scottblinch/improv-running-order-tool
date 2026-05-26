import { Settings2 } from 'lucide-react';
import { useState } from 'react';

import { PrintPreviewToggle } from '@/components/layout/PrintPreviewToggle';
import { ShareShowButton } from '@/components/layout/ShareShowButton';
import { ShowDetailsDialog } from '@/components/layout/ShowDetailsDialog';
import { ShowSwitcher } from '@/components/layout/ShowSwitcher';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { Button } from '@/components/ui/button';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';
import { cn } from '@/lib/utils';
import { formatShowMenuLabel, hasSavedShows } from '@/lib/show-workspace';
import { useTranslation } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function AppHeader() {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const printPreview = usePrintPreviewStore((state) => state.enabled);
  const shows = useAppStore((state) => state.shows);
  const activeShowId = useAppStore((state) => state.activeShowId);
  const showName = useAppStore((state) => state.showName);
  const showDate = useAppStore((state) => state.showDate);
  const showVenue = useAppStore((state) => state.showVenue);
  const showTime = useAppStore((state) => state.showTime);
  const setShowDetails = useAppStore((state) => state.setShowDetails);
  const deleteShow = useAppStore((state) => state.deleteShow);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const hasShows = hasSavedShows({ shows });
  const showLabel = formatShowMenuLabel(
    showName,
    showDate,
    showVenue,
    showTime,
  );

  return (
    <>
      <header
        className={cn(
          'flex shrink-0 items-center justify-between gap-4 px-6 py-4 print:hidden',
          !printPreview && 'border-b',
        )}
      >
        {!printPreview && hasShows ? (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h1 className="sr-only">{showLabel}</h1>
            <ShowSwitcher />
            <IconButtonTooltip label={t('header.editShowDetails')}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label={t('header.editShowDetails')}
                onClick={() => setDetailsOpen(true)}
              >
                <Settings2 aria-hidden className="size-4" />
              </Button>
            </IconButtonTooltip>
            <ShareShowButton />
          </div>
        ) : null}
        {!printPreview && !hasShows ? (
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-lg font-semibold tracking-tight">
              {t('app.documentTitle')}
            </h1>
          </div>
        ) : null}
        <div
          className={cn('flex items-center gap-2', printPreview && 'ml-auto')}
        >
          {!printPreview && <ThemeToggle />}
          {hasShows || printPreview ? <PrintPreviewToggle /> : null}
        </div>
      </header>

      {hasShows ? (
        <ShowDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          details={{ showName, showDate, showVenue, showTime }}
          showLabel={showLabel}
          isLastShow={shows.length === 1}
          onConfirm={setShowDetails}
          onDelete={() => {
            deleteShow(activeShowId);
            announceA11y('a11y.deletedShow', { label: showLabel });
          }}
        />
      ) : null}
    </>
  );
}
