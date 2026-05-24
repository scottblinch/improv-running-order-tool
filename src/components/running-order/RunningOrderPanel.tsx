import { PanelShell } from '@/components/layout/PanelShell';
import { SceneList } from '@/components/running-order/SceneList';
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
      {scenes.length === 0 ? (
        <EmptyState>
          No scenes yet. You will build the show lineup here in the next step.
        </EmptyState>
      ) : (
        <SceneList scenes={scenes} />
      )}
    </PanelShell>
  );
}
