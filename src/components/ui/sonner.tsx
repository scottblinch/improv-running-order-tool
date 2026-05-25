import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useTheme } from '@/components/theme/useTheme';
import { useTranslation } from '@/i18n';

export function Toaster(props: ToasterProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Sonner
      theme={theme === 'system' ? 'system' : theme}
      className="toaster group print:hidden"
      containerAriaLabel={t('a11y.notifications')}
      icons={{
        success: <CircleCheckIcon className="size-4" aria-hidden />,
        info: <InfoIcon className="size-4" aria-hidden />,
        warning: <TriangleAlertIcon className="size-4" aria-hidden />,
        error: <OctagonXIcon className="size-4" aria-hidden />,
        loading: <Loader2Icon className="size-4 animate-spin" aria-hidden />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
        closeButtonAriaLabel: t('a11y.closeToast'),
      }}
      {...props}
    />
  );
}
