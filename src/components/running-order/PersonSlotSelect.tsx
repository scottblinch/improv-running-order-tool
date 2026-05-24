import { TriangleAlert } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Person, PersonId } from '@/types/app';

const CLEAR_VALUE = '__clear__';

type PersonSlotSelectProps = {
  label: string;
  value: PersonId | null;
  persons: Person[];
  onValueChange: (personId: PersonId) => void;
  onClear?: () => void;
  className?: string;
};

export function PersonSlotSelect({
  label,
  value,
  persons,
  onValueChange,
  onClear,
  className,
}: PersonSlotSelectProps) {
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(selected) => {
        if (selected === CLEAR_VALUE) {
          onClear?.();
          return;
        }

        onValueChange(selected);
      }}
    >
      <SelectTrigger className={cn('w-full', className)} aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {onClear && value ? (
          <SelectItem value={CLEAR_VALUE}>Unassigned</SelectItem>
        ) : null}
        {persons.map((person) => {
          const isWarning = person.isAbsent || person.isDeleted;

          return (
            <SelectItem key={person.id} value={person.id}>
              {isWarning ? (
                <span className="flex items-center gap-1.5">
                  <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
                  {person.name}
                  {person.isAbsent ? ' (Absent)' : ' (Removed)'}
                </span>
              ) : (
                person.name
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
