import { useState } from 'react';

import type { Person, PersonId } from '@/types/app';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PersonAssignSelectProps = {
  label: string;
  persons: Person[];
  excludedPersonIds?: PersonId[];
  onAssign: (personId: PersonId) => void;
  inline?: boolean;
};

export function PersonAssignSelect({
  label,
  persons,
  excludedPersonIds = [],
  onAssign,
  inline = false,
}: PersonAssignSelectProps) {
  const [selectKey, setSelectKey] = useState(0);
  const available = persons.filter(
    (person) => !excludedPersonIds.includes(person.id),
  );

  if (available.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No performers available to assign.
      </p>
    );
  }

  return (
    <Select
      key={selectKey}
      onValueChange={(personId) => {
        onAssign(personId);
        setSelectKey((key) => key + 1);
      }}
    >
      <SelectTrigger
        className={inline ? 'w-auto min-w-36' : 'w-full'}
        aria-label={label}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {available.map((person) => (
          <SelectItem key={person.id} value={person.id}>
            {person.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
