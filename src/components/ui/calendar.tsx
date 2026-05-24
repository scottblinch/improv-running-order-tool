import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';

import 'react-day-picker/style.css';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col gap-2',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          'absolute left-1 inline-flex size-7 items-center justify-center rounded-md border border-border bg-background p-0 opacity-80 hover:bg-muted hover:opacity-100',
        ),
        button_next: cn(
          'absolute right-1 inline-flex size-7 items-center justify-center rounded-md border border-border bg-background p-0 opacity-80 hover:bg-muted hover:opacity-100',
        ),
        month_grid: 'mt-4 w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none',
        week: 'mt-2 flex w-full',
        day: 'relative aspect-square h-9 w-full p-0 text-center text-sm select-none',
        day_button: cn(
          'inline-flex size-9 items-center justify-center rounded-md p-0 font-normal hover:bg-muted aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
        ),
        selected:
          'rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'rounded-md bg-muted text-foreground',
        outside: 'text-muted-foreground opacity-50 aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
