import { Clapperboard } from 'lucide-react';

import { AppFooter } from '@/components/layout/AppFooter';
import { MobileCollapsiblePanel } from '@/components/layout/MobileCollapsiblePanel';
import { RunningOrderPrintView } from '@/components/running-order/RunningOrderPrintView';
import { SceneList } from '@/components/running-order/SceneList';
import { SceneQuickAdd } from '@/components/running-order/SceneQuickAdd';
import { EmptyState } from '@/components/shared/EmptyState';
import { useConcealedUntilPrint } from '@/hooks/useConcealedUntilPrint';
import { useTranslation } from '@/i18n';
import { SCENE_REORDER_HELP_ID, LINEUP_HEADING_ID } from '@/lib/a11y-ids';
import { useAppStore } from '@/store/useAppStore';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function RunningOrderPanel() {
  const { t } = useTranslation();
  const scenes = useAppStore((state) => state.scenes);
  const printPreview = usePrintPreviewStore((state) => state.enabled);
  const printCloneRef = useConcealedUntilPrint<HTMLDivElement>();

  if (printPreview) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-10 print:p-0">
        <h2 id={LINEUP_HEADING_ID} tabIndex={-1} className="sr-only">
          {t('lineup.heading')}
        </h2>
        <RunningOrderPrintView scenes={scenes} fitToPage />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:min-h-0 md:flex-1 md:overflow-hidden print:hidden">
        <MobileCollapsiblePanel
          headingId={LINEUP_HEADING_ID}
          title={t('lineup.heading')}
          icon={Clapperboard}
          srOnlyHelpId={SCENE_REORDER_HELP_ID}
          srOnlyHelp={t('lineup.reorderHelp')}
          fillHeight
        >
          <SceneQuickAdd />
          {scenes.length === 0 ? (
            <EmptyState
              icon={<Clapperboard aria-hidden className="size-4" />}
              title={t('lineup.emptyTitle')}
              description={t('lineup.emptyDescription')}
            />
          ) : (
            <SceneList scenes={scenes} />
          )}
          <div className="mt-auto hidden shrink-0 pt-4 md:block">
            <AppFooter />
          </div>
        </MobileCollapsiblePanel>
        <div className="shrink-0 px-4 pb-4 md:hidden">
          <AppFooter />
        </div>
      </div>

      <div
        ref={printCloneRef}
        className="fixed top-0 -left-[9999rem] w-[7.5in] print:static print:left-auto"
      >
        <RunningOrderPrintView scenes={scenes} fitToPage fitTarget="page" />
      </div>
    </>
  );
}
