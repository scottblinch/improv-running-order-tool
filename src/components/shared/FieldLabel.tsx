import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FieldLabelProps = {
  icon: LucideIcon;
  htmlFor?: string;
  id?: string;
  children: ReactNode;
  className?: string;
  as?: 'label' | 'span';
};

export function FieldLabel({
  icon: Icon,
  htmlFor,
  id,
  children,
  className,
  as = 'label',
}: FieldLabelProps) {
  const Comp = as;

  return (
    <Comp
      htmlFor={as === 'label' ? htmlFor : undefined}
      id={id}
      className={cn('flex items-center gap-1.5 text-sm font-medium', className)}
    >
      <Icon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
      {children}
    </Comp>
  );
}
