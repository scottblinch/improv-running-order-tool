import { ChevronDown, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { TitleWithIcon } from '@/components/shared/TitleWithIcon';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useIsDesktopDnd } from '@/hooks/useIsDesktopDnd';
import { useTranslation } from '@/i18n';
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
  const { t } = useTranslation();
  const isDesktop = useIsDesktopDnd();
  const [mobileOpen, setMobileOpen] = useState(defaultOpen);
  const open = isDesktop || mobileOpen;
  const contentId = `${headingId}-content`;
  const toggleLabel = open
    ? t('a11y.collapsePanel', { label: title })
    : t('a11y.expandPanel', { label: title });

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
      <div className="flex shrink-0 items-center gap-2 px-4 py-4">
        <h2
          id={headingId}
          tabIndex={-1}
          className="min-w-0 flex-1 text-sm font-semibold tracking-tight text-muted-foreground"
        >
          <TitleWithIcon icon={icon} iconClassName="size-4">
            {title}
          </TitleWithIcon>
        </h2>
        {srOnlyHelpId && srOnlyHelp ? (
          <p id={srOnlyHelpId} className="sr-only">
            {srOnlyHelp}
          </p>
        ) : null}
        <CollapsibleTrigger asChild className="md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-controls={contentId}
            aria-expanded={open}
            aria-label={toggleLabel}
          >
            <ChevronDown
              aria-hidden
              className={cn(
                'size-4 transition-transform',
                open && 'rotate-180',
              )}
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        id={contentId}
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
