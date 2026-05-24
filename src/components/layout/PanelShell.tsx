import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PanelShellProps = {
  title: string;
  description: string;
  headingId: string;
  children: ReactNode;
};

export function PanelShell({
  title,
  description,
  headingId,
  children,
}: PanelShellProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col rounded-none border-0 bg-transparent py-0 ring-0">
      <CardHeader className="border-b">
        <h2
          id={headingId}
          className={cn(
            'font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
          )}
        >
          {title}
        </h2>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
}
