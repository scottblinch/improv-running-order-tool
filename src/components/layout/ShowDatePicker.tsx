import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslation } from '@/i18n';
import {
  formatPrintDate,
  isoDateToDate,
  toIsoDateString,
} from '@/lib/show-date';
import { useAppStore } from '@/store/useAppStore';

export function ShowDatePicker() {
  const { t } = useTranslation();
  const showDate = useAppStore((state) => state.showDate);
  const setShowDate = useAppStore((state) => state.setShowDate);
  const [open, setOpen] = useState(false);
  const selectedDate = isoDateToDate(showDate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 font-normal"
          aria-label={t('header.showDateNamed', {
            date: formatPrintDate(showDate),
          })}
        >
          <CalendarIcon aria-hidden className="size-4" />
          {formatPrintDate(showDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          labels={{
            labelPrevious: () => t('calendar.previousMonth'),
            labelNext: () => t('calendar.nextMonth'),
          }}
          onSelect={(date) => {
            if (!date) return;

            setShowDate(toIsoDateString(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
