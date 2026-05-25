import type { ReactElement } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type IconButtonTooltipProps = {
  label: string;
  children: ReactElement<{ disabled?: boolean }>;
};

export function IconButtonTooltip({ label, children }: IconButtonTooltipProps) {
  const trigger =
    children.props.disabled === true ? (
      <span className="inline-flex">{children}</span>
    ) : (
      children
    );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
