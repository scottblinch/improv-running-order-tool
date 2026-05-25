import { useRef } from 'react';
import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';
import { useTranslation } from '@/i18n';
import { LINEUP_HEADING_ID } from '@/lib/a11y-ids';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function PrintPreviewToggle() {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const enabled = usePrintPreviewStore((state) => state.enabled);
  const toggle = usePrintPreviewStore((state) => state.toggle);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const label = enabled ? t('print.exitView') : t('print.view');

  const handleToggle = () => {
    const entering = !enabled;
    toggle();
    announceA11y(entering ? 'a11y.printPreviewOn' : 'a11y.printPreviewOff');

    requestAnimationFrame(() => {
      if (entering) {
        document.getElementById(LINEUP_HEADING_ID)?.focus();
        return;
      }

      buttonRef.current?.focus();
    });
  };

  return (
    <IconButtonTooltip label={label}>
      <Button
        ref={buttonRef}
        type="button"
        variant={enabled ? 'default' : 'outline'}
        size="icon"
        className="shrink-0"
        aria-label={label}
        aria-pressed={enabled}
        onClick={handleToggle}
      >
        <Printer aria-hidden className="size-4" />
      </Button>
    </IconButtonTooltip>
  );
}
