import { PersonRow } from '@/components/roster/PersonRow';
import { useTranslation } from '@/i18n';
import type { Person } from '@/types/app';

type RosterListProps = {
  persons: Person[];
};

export function RosterList({ persons }: RosterListProps) {
  const { t } = useTranslation();

  return (
    <ul aria-label={t('roster.listLabel')} className="space-y-2">
      {persons.map((person) => (
        <PersonRow key={person.id} person={person} />
      ))}
    </ul>
  );
}
