import { Clapperboard } from 'lucide-react';

import { AppFooter } from '@/components/layout/AppFooter';
import { PanelShell } from '@/components/layout/PanelShell';
import { RunningOrderPrintView } from '@/components/running-order/RunningOrderPrintView';
import { SceneList } from '@/components/running-order/SceneList';
import { SceneQuickAdd } from '@/components/running-order/SceneQuickAdd';
import { EmptyState } from '@/components/shared/EmptyState';
import { useTranslation } from '@/i18n';
import { SCENE_REORDER_HELP_ID } from '@/lib/a11y-ids';
import { useAppStore } from '@/store/useAppStore';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function RunningOrderPanel() {
  const { t } = useTranslation();
  const scenes = useAppStore((state) => state.scenes);
  const printPreview = usePrintPreviewStore((state) => state.enabled);

  if (printPreview) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-10 print:p-0">
        <RunningOrderPrintView scenes={scenes} fitToPage />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden print:hidden">
        <PanelShell>
          <div className="flex min-h-full flex-col gap-2">
            <h2 id="lineup-heading" className="sr-only">
              {t('lineup.heading')}
            </h2>
            <p id={SCENE_REORDER_HELP_ID} className="sr-only">
              {t('lineup.reorderHelp')}
            </p>
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
            <div className="mt-auto shrink-0 pt-4">
              <AppFooter />
            </div>
          </div>
        </PanelShell>
      </div>

      <div
        aria-hidden
        className="fixed top-0 -left-[9999rem] w-[7.5in] print:static print:left-auto"
      >
        <RunningOrderPrintView scenes={scenes} fitToPage fitTarget="page" />
      </div>
    </>
  );
}
