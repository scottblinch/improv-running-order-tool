import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type PanelShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function PanelShell({ title, description, children }: PanelShellProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col rounded-none border-0 bg-transparent py-0 ring-0">
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
}
