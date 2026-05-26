import { CalendarIcon } from 'lucide-react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';
import {
  formatShowDateTime,
  formatShowDisplayName,
  formatPrintDate,
  isoDateToDate,
  toIsoDateString,
} from '@/lib/show-date';
import type { ShowDetails } from '@/types/app';

export type ShowDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details: ShowDetails;
  onConfirm: (details: ShowDetails) => void;
};

type ShowDetailsFormProps = Omit<ShowDetailsDialogProps, 'open'>;

function ShowDetailsForm({
  details,
  onConfirm,
  onOpenChange,
}: ShowDetailsFormProps) {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const nameId = useId();
  const venueId = useId();
  const timeId = useId();
  const dateLabelId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [showName, setShowName] = useState(details.showName);
  const [showVenue, setShowVenue] = useState(details.showVenue);
  const [showTime, setShowTime] = useState(details.showTime);
  const [showDate, setShowDate] = useState(details.showDate);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const selectedDate = isoDateToDate(showDate);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      nameRef.current?.focus();
      nameRef.current?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onConfirm({
      showName,
      showVenue,
      showTime,
      showDate,
    });
    announceA11y('a11y.updatedShowDetails', {
      name: formatShowDisplayName(showName),
      date: formatShowDateTime(showDate, showTime),
      venue: showVenue.trim() || t('show.noVenue'),
    });
    onOpenChange(false);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col">
      <div className="max-h-[calc(90dvh-4.5rem)] overflow-y-auto px-4 pt-4 pb-3">
        <AlertDialogHeader className="pb-4">
          <AlertDialogTitle>{t('show.detailsTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('show.detailsDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor={nameId} className="text-sm font-medium">
              {t('show.showName')}
            </label>
            <Input
              ref={nameRef}
              id={nameId}
              name="showName"
              value={showName}
              autoComplete="off"
              maxLength={INPUT_LIMITS.maxShowNameLength}
              placeholder={t('app.defaultShowName')}
              onChange={(event) => setShowName(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor={venueId} className="text-sm font-medium">
              {t('show.showVenue')}
            </label>
            <Input
              id={venueId}
              name="showVenue"
              value={showVenue}
              autoComplete="off"
              maxLength={INPUT_LIMITS.maxShowVenueLength}
              placeholder={t('show.showVenuePlaceholder')}
              onChange={(event) => setShowVenue(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <span id={dateLabelId} className="text-sm font-medium">
              {t('show.showDate')}
            </span>
            <Popover
              open={datePickerOpen}
              onOpenChange={setDatePickerOpen}
              modal={false}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start font-normal"
                  aria-labelledby={dateLabelId}
                >
                  <CalendarIcon aria-hidden className="size-4" />
                  {formatPrintDate(showDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="z-[100] w-auto p-0"
                align="start"
                onOpenAutoFocus={(event) => event.preventDefault()}
              >
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
                    setDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label htmlFor={timeId} className="text-sm font-medium">
              {t('show.showTime')}
            </label>
            <Input
              id={timeId}
              name="showTime"
              type="time"
              value={showTime}
              onChange={(event) => setShowTime(event.target.value)}
            />
          </div>
        </div>
      </div>

      <AlertDialogFooter className="mx-0 mb-0 shrink-0 gap-2 px-4 py-3">
        <AlertDialogCancel type="button">
          {t('common.cancel')}
        </AlertDialogCancel>
        <Button type="submit">{t('common.save')}</Button>
      </AlertDialogFooter>
    </form>
  );
}

export function ShowDetailsDialog({
  open,
  onOpenChange,
  details,
  onConfirm,
}: ShowDetailsDialogProps) {
  const formKey = `${details.showName}|${details.showDate}|${details.showVenue}|${details.showTime}`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        {open ? (
          <ShowDetailsForm
            key={formKey}
            details={details}
            onConfirm={onConfirm}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
}
