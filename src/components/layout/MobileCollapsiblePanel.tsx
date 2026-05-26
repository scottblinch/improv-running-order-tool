import { ChevronDown, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { TitleWithIcon } from '@/components/shared/TitleWithIcon';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useIsDesktopDnd } from '@/hooks/useIsDesktopDnd';
import { cn } from '@/lib/utils';

type MobileCollapsiblePanelProps = {
  headingId: string;
  title: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  srOnlyHelpId?: string;
  srOnlyHelp?: string;
  contentClassName?: string;
  fillHeight?: boolean;
  children: ReactNode;
};

export function MobileCollapsiblePanel({
  headingId,
  title,
  icon,
  defaultOpen = true,
  srOnlyHelpId,
  srOnlyHelp,
  contentClassName,
  fillHeight = false,
  children,
}: MobileCollapsiblePanelProps) {
  const isDesktop = useIsDesktopDnd();
  const [mobileOpen, setMobileOpen] = useState(defaultOpen);
  const open = isDesktop || mobileOpen;

  return (
    <Collapsible
      open={open}
      onOpenChange={(next) => {
        if (!isDesktop) {
          setMobileOpen(next);
        }
      }}
      className="flex flex-col md:min-h-0 md:flex-1 md:overflow-hidden"
    >
      <div className="flex shrink-0 bg-background max-md:sticky max-md:top-0 max-md:z-10 md:px-4 md:py-4">
        <h2
          id={headingId}
          tabIndex={-1}
          className="min-w-0 flex-1 text-sm font-semibold tracking-tight text-muted-foreground"
        >
          <CollapsibleTrigger
            className={cn(
              'flex w-full items-center gap-2 text-left outline-none',
              'max-md:px-4 max-md:py-4 max-md:active:bg-muted/80',
              'focus-visible:ring-3 focus-visible:ring-ring/50',
              'md:pointer-events-none md:cursor-default',
            )}
            tabIndex={isDesktop ? -1 : undefined}
          >
            <TitleWithIcon icon={icon} iconClassName="size-4">
              {title}
            </TitleWithIcon>
            <ChevronDown
              aria-hidden
              className={cn(
                'ml-auto size-4 shrink-0 transition-transform md:hidden',
                open && 'rotate-180',
              )}
            />
          </CollapsibleTrigger>
        </h2>
        {srOnlyHelpId && srOnlyHelp ? (
          <p id={srOnlyHelpId} className="sr-only">
            {srOnlyHelp}
          </p>
        ) : null}
      </div>
      <CollapsibleContent
        className={cn(
          'px-4 pb-4 md:min-h-0 md:flex-1 md:overflow-y-auto',
          contentClassName,
        )}
      >
        <div className={cn('flex flex-col gap-2', fillHeight && 'min-h-full')}>
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
