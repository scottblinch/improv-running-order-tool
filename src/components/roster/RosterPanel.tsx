import { Users } from 'lucide-react';

import { PanelShell } from '@/components/layout/PanelShell';
import { RosterList } from '@/components/roster/RosterList';
import { RosterQuickAdd } from '@/components/roster/RosterQuickAdd';
import { EmptyState } from '@/components/shared/EmptyState';
import { ROSTER_CASTING_HELP_ID } from '@/lib/a11y-ids';
import { selectActivePersons } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';

export function RosterPanel() {
  const persons = useAppStore((state) => state.persons);
  const activePersons = selectActivePersons(persons);

  return (
    <PanelShell>
      <div className="flex flex-col gap-4">
        <h2
          id="roster-heading"
          className="font-heading text-base leading-snug font-medium"
        >
          Roster
        </h2>
        <p id={ROSTER_CASTING_HELP_ID} className="sr-only">
          On desktop, drag performers into scene slots. On mobile, assign cast
          using the dropdown menus in each scene.
        </p>
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
