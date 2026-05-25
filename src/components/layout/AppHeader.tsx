import { Pencil } from 'lucide-react';
import { useState } from 'react';

import { PrintPreviewToggle } from '@/components/layout/PrintPreviewToggle';
import { RenameShowDialog } from '@/components/layout/RenameShowDialog';
import { ShareShowButton } from '@/components/layout/ShareShowButton';
import { ShowSwitcher } from '@/components/layout/ShowSwitcher';
import { ShowDatePicker } from '@/components/layout/ShowDatePicker';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatShowDisplayName } from '@/lib/show-date';
import { useTranslation } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function AppHeader() {
  const { t } = useTranslation();
  const printPreview = usePrintPreviewStore((state) => state.enabled);
  const showName = useAppStore((state) => state.showName);
  const setShowName = useAppStore((state) => state.setShowName);
  const [renameOpen, setRenameOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'flex shrink-0 items-center justify-between gap-4 px-6 py-4 print:hidden',
          !printPreview && 'border-b',
        )}
      >
        {!printPreview ? (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h1 className="sr-only">{formatShowDisplayName(showName)}</h1>
            <ShowSwitcher />
            <IconButtonTooltip label={t('header.renameShow')}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label={t('header.renameShow')}
                onClick={() => setRenameOpen(true)}
              >
                <Pencil aria-hidden className="size-4" />
              </Button>
            </IconButtonTooltip>
            <ShowDatePicker />
            <ShareShowButton />
          </div>
        ) : null}
        <div
          className={cn('flex items-center gap-2', printPreview && 'ml-auto')}
        >
          {!printPreview && <ThemeToggle />}
          <PrintPreviewToggle />
        </div>
      </header>

      <RenameShowDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={showName}
        onConfirm={setShowName}
      />
    </>
  );
}
