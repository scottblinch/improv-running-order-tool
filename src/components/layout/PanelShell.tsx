import type { ReactNode } from 'react';

type PanelShellProps = {
  children: ReactNode;
};

export function PanelShell({ children }: PanelShellProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
  );
}
