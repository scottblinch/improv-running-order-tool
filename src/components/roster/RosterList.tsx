import { PersonRow } from '@/components/roster/PersonRow';
import type { Person } from '@/types/app';

type RosterListProps = {
  persons: Person[];
};

export function RosterList({ persons }: RosterListProps) {
  return (
    <ul className="space-y-2">
      {persons.map((person) => (
        <PersonRow key={person.id} person={person} />
      ))}
    </ul>
  );
}
