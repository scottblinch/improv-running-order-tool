import { Users } from 'lucide-react';

import { PanelShell } from '@/components/layout/PanelShell';
import { RosterList } from '@/components/roster/RosterList';
import { RosterQuickAdd } from '@/components/roster/RosterQuickAdd';
import { EmptyState } from '@/components/shared/EmptyState';
import { selectActivePersons } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';

export function RosterPanel() {
  const persons = useAppStore((state) => state.persons);
  const activePersons = selectActivePersons(persons);

  return (
    <PanelShell
      headingId="roster-heading"
      title="Roster"
      description="Performers available for casting"
    >
      <div className="flex flex-col gap-4">
        <RosterQuickAdd />
        {activePersons.length === 0 ? (
          <EmptyState
            icon={<Users aria-hidden className="size-4" />}
            title="No performers yet"
            description="Add someone above to start building your roster."
          />
        ) : (
          <RosterList persons={activePersons} />
        )}
      </div>
    </PanelShell>
  );
}
