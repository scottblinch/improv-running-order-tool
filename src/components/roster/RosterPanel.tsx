import { PanelShell } from '@/components/layout/PanelShell';
import { RosterList } from '@/components/roster/RosterList';
import { EmptyState } from '@/components/shared/EmptyState';
import { selectActivePersons } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';

export function RosterPanel() {
  const persons = useAppStore((state) => state.persons);
  const activePersons = selectActivePersons(persons);

  return (
    <PanelShell
      title="Roster"
      description="Performers available for casting"
    >
      {activePersons.length === 0 ? (
        <EmptyState>
          No performers yet. You will add people here in the next step.
        </EmptyState>
      ) : (
        <RosterList persons={activePersons} />
      )}
    </PanelShell>
  );
}
