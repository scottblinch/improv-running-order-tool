import { Clapperboard } from 'lucide-react';

import { AppFooter } from '@/components/layout/AppFooter';
import { MobileCollapsiblePanel } from '@/components/layout/MobileCollapsiblePanel';
import { PrintFontSizeControls } from '@/components/running-order/PrintFontSizeControls';
import {
  RunningOrderPrintPortal,
  RunningOrderPrintView,
} from '@/components/running-order/RunningOrderPrintView';
import { SceneList } from '@/components/running-order/SceneList';
import { SceneQuickAdd } from '@/components/running-order/SceneQuickAdd';
import { EmptyState } from '@/components/shared/EmptyState';
import { useConcealedUntilPrint } from '@/hooks/useConcealedUntilPrint';
import { usePrintPreviewFontSize } from '@/hooks/usePrintPreviewFontSize';
import { useTranslation } from '@/i18n';
import { SCENE_REORDER_HELP_ID, LINEUP_HEADING_ID } from '@/lib/a11y-ids';
import { useAppStore } from '@/store/useAppStore';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function RunningOrderPanel() {
  const { t } = useTranslation();
  const scenes = useAppStore((state) => state.scenes);
  const persons = useAppStore((state) => state.persons);
  const printPreview = usePrintPreviewStore((state) => state.enabled);
  const printRootRef = useConcealedUntilPrint<HTMLDivElement>();
  const { fontSizePx, increaseFontSize, decreaseFontSize } =
    usePrintPreviewFontSize(printPreview, persons, scenes);

  return (
    <>
      {printPreview ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-neutral-300 print:hidden">
          <h2 id={LINEUP_HEADING_ID} tabIndex={-1} className="sr-only">
            {t('lineup.heading')}
          </h2>
          <PrintFontSizeControls
            fontSizePx={fontSizePx}
            onDecrease={decreaseFontSize}
            onIncrease={increaseFontSize}
          />
          <RunningOrderPrintView
            scenes={scenes}
            fontSizePx={fontSizePx}
            preview
          />
        </div>
      ) : (
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
      )}

      <RunningOrderPrintPortal
        scenes={scenes}
        fontSizePx={fontSizePx}
        printRootRef={printRootRef}
      />
    </>
  );
}
