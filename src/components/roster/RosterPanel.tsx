import { Users } from 'lucide-react';

import { RosterList } from '@/components/roster/RosterList';
import { RosterQuickAdd } from '@/components/roster/RosterQuickAdd';
import { EmptyState } from '@/components/shared/EmptyState';
import { useTranslation } from '@/i18n';
import { ROSTER_CASTING_HELP_ID, ROSTER_HEADING_ID } from '@/lib/a11y-ids';
import { selectActivePersons } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';

export function RosterPanel() {
  const { t } = useTranslation();
  const persons = useAppStore((state) => state.persons);
  const activePersons = selectActivePersons(persons);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-2">
        <h2 id={ROSTER_HEADING_ID} tabIndex={-1} className="sr-only">
          {t('roster.heading')}
        </h2>
        <p id={ROSTER_CASTING_HELP_ID} className="sr-only">
          {t('roster.castingHelp')}
        </p>
        <RosterQuickAdd />
        {activePersons.length === 0 ? (
          <EmptyState
            icon={<Users aria-hidden className="size-4" />}
            title={t('roster.emptyTitle')}
            description={t('roster.emptyDescription')}
          />
        ) : (
          <RosterList persons={activePersons} />
        )}
      </div>
    </div>
  );
}
