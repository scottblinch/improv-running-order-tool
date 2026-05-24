import { Clapperboard } from 'lucide-react';

import { PanelShell } from '@/components/layout/PanelShell';
import { RunningOrderPrintView } from '@/components/running-order/RunningOrderPrintView';
import { SceneList } from '@/components/running-order/SceneList';
import { SceneQuickAdd } from '@/components/running-order/SceneQuickAdd';
import { EmptyState } from '@/components/shared/EmptyState';
import { SCENE_REORDER_HELP_ID } from '@/lib/a11y-ids';
import { useAppStore } from '@/store/useAppStore';

export function RunningOrderPanel() {
  const scenes = useAppStore((state) => state.scenes);

  return (
    <>
      <div className="print:hidden">
        <PanelShell>
          <div className="flex flex-col gap-4">
            <h2
              id="running-order-heading"
              className="font-heading text-base leading-snug font-medium"
            >
              Running order
            </h2>
            <p id={SCENE_REORDER_HELP_ID} className="sr-only">
              On desktop, drag scenes to reorder. On mobile, use the up and down
              buttons on each scene card.
            </p>
            <SceneQuickAdd />
            {scenes.length === 0 ? (
              <EmptyState
                icon={<Clapperboard aria-hidden className="size-4" />}
                title="No scenes yet"
                description="Add a scene above to start building the lineup."
              />
            ) : (
              <SceneList scenes={scenes} />
            )}
          </div>
        </PanelShell>
      </div>

      <div className="hidden px-6 py-10 print:block">
        <RunningOrderPrintView scenes={scenes} />
      </div>
    </>
  );
}
