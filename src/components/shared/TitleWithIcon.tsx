import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type TitleWithIconProps = {
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
};

export function TitleWithIcon({
  icon: Icon,
  children,
  className,
  iconClassName,
}: TitleWithIconProps) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <Icon
        aria-hidden
        className={cn('size-5 shrink-0 text-primary/70', iconClassName)}
      />
      <span className="min-w-0">{children}</span>
    </span>
  );
}
