import type { Person } from '@/types/app';

type RosterListItemProps = {
  person: Person;
};

export function RosterListItem({ person }: RosterListItemProps) {
  return (
    <li className="rounded-lg border bg-card px-3 py-2 text-sm">{person.name}</li>
  );
}
