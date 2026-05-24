import type { ReactNode } from 'react';

type EmptyStateProps = {
  children: ReactNode;
};

export function EmptyState({ children }: EmptyStateProps) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
