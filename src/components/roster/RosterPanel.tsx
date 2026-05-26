import { Users } from 'lucide-react';

import { MobileCollapsiblePanel } from '@/components/layout/MobileCollapsiblePanel';
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
    <MobileCollapsiblePanel
      headingId={ROSTER_HEADING_ID}
      title={t('roster.heading')}
      icon={Users}
      srOnlyHelpId={ROSTER_CASTING_HELP_ID}
      srOnlyHelp={t('roster.castingHelp')}
    >
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
    </MobileCollapsiblePanel>
  );
}
