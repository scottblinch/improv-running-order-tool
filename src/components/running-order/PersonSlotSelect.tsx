import { useId } from 'react';
import { TriangleAlert } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n';
import type { Person, PersonId } from '@/types/app';

const CLEAR_VALUE = '__clear__';

type PersonSlotSelectProps = {
  label: string;
  value: PersonId | null;
  persons: Person[];
  onValueChange: (personId: PersonId) => void;
  onClear?: () => void;
  describedBy?: string;
  className?: string;
};

export function PersonSlotSelect({
  label,
  value,
  persons,
  onValueChange,
  onClear,
  describedBy,
  className,
}: PersonSlotSelectProps) {
  const { t } = useTranslation();
  const triggerId = useId();
  const assignedPerson = value
    ? persons.find((person) => person.id === value)
    : undefined;
  const triggerLabel = assignedPerson
    ? t('lineup.slotAssigned', { label, name: assignedPerson.name })
    : label;

  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={triggerId} className="sr-only">
        {triggerLabel}
      </label>
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
        <SelectTrigger
          id={triggerId}
          className="w-full"
          aria-describedby={describedBy}
        >
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {onClear && value ? (
            <SelectItem value={CLEAR_VALUE}>
              {t('lineup.unassigned')}
            </SelectItem>
          ) : null}
          {persons.map((person) => {
            const isWarning = person.isAbsent || person.isDeleted;

            return (
              <SelectItem key={person.id} value={person.id}>
                {isWarning ? (
                  <span className="flex items-center gap-1.5">
                    <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
                    {person.name}
                    {person.isAbsent
                      ? ` (${t('roster.absent')})`
                      : ` (${t('fallback.removed')})`}
                  </span>
                ) : (
                  person.name
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
