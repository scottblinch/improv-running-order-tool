import {
  CalendarIcon,
  Check,
  Clock,
  MapPin,
  Settings2,
  Tag,
  Trash2,
} from 'lucide-react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

import { DeleteShowDialog } from '@/components/layout/DeleteShowDialog';
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
import { FieldLabel } from '@/components/shared/FieldLabel';
import { TitleWithIcon } from '@/components/shared/TitleWithIcon';
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
  showLabel: string;
  isLastShow: boolean;
  onConfirm: (details: ShowDetails) => void;
  onDelete: () => void;
};

type ShowDetailsFormProps = Omit<
  ShowDetailsDialogProps,
  'open' | 'onDelete' | 'showLabel' | 'isLastShow'
> & {
  onRequestDelete: () => void;
};

function ShowDetailsForm({
  details,
  onConfirm,
  onOpenChange,
  onRequestDelete,
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
        <AlertDialogHeader className="pr-10 pb-4">
          <AlertDialogTitle>
            <TitleWithIcon icon={Settings2}>
              {t('show.detailsTitle')}
            </TitleWithIcon>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('show.detailsDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <FieldLabel icon={Tag} htmlFor={nameId}>
              {t('show.showName')}
            </FieldLabel>
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
            <FieldLabel icon={MapPin} htmlFor={venueId}>
              {t('show.showVenue')}
            </FieldLabel>
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
            <FieldLabel icon={CalendarIcon} as="span" id={dateLabelId}>
              {t('show.showDate')}
            </FieldLabel>
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
            <FieldLabel icon={Clock} htmlFor={timeId}>
              {t('show.showTime')}
            </FieldLabel>
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

      <AlertDialogFooter className="mx-0 mb-0 shrink-0 flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="destructive"
          className="w-full sm:mr-auto sm:w-auto"
          onClick={onRequestDelete}
        >
          <Trash2 aria-hidden className="size-4" />
          {t('workspace.deleteShow')}
        </Button>
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
          <AlertDialogCancel type="button" className="mt-0">
            {t('common.cancel')}
          </AlertDialogCancel>
          <Button type="submit">
            <Check aria-hidden className="size-4" />
            {t('common.save')}
          </Button>
        </div>
      </AlertDialogFooter>
    </form>
  );
}

export function ShowDetailsDialog({
  open,
  onOpenChange,
  details,
  showLabel,
  isLastShow,
  onConfirm,
  onDelete,
}: ShowDetailsDialogProps) {
  const { t } = useTranslation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const formKey = `${details.showName}|${details.showDate}|${details.showVenue}|${details.showTime}`;

  const handleDetailsOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) setDeleteOpen(false);
  };

  return (
    <>
      <AlertDialog
        open={open && !deleteOpen}
        onOpenChange={handleDetailsOpenChange}
      >
        <AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          {open && !deleteOpen ? (
            <ShowDetailsForm
              key={formKey}
              details={details}
              onConfirm={onConfirm}
              onOpenChange={handleDetailsOpenChange}
              onRequestDelete={() => setDeleteOpen(true)}
            />
          ) : null}
        </AlertDialogContent>
      </AlertDialog>

      <DeleteShowDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        label={showLabel}
        description={
          isLastShow
            ? t('workspace.deleteLastDescription')
            : t('workspace.deleteDescription')
        }
        onConfirm={() => {
          onDelete();
          setDeleteOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
