import { Clapperboard } from 'lucide-react';

import { PanelShell } from '@/components/layout/PanelShell';
import { SceneList } from '@/components/running-order/SceneList';
import { SceneQuickAdd } from '@/components/running-order/SceneQuickAdd';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/useAppStore';

export function RunningOrderPanel() {
  const scenes = useAppStore((state) => state.scenes);

  return (
    <PanelShell
      headingId="running-order-heading"
      title="Running order"
      description="Scenes and cast assignments for the show"
    >
      <div className="flex flex-col gap-4">
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
  );
}
