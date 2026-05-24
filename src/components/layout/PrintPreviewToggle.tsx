import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function PrintPreviewToggle() {
  const { t } = useTranslation();
  const enabled = usePrintPreviewStore((state) => state.enabled);
  const toggle = usePrintPreviewStore((state) => state.toggle);

  return (
    <Button
      type="button"
      variant={enabled ? 'default' : 'outline'}
      size="icon"
      className="shrink-0"
      aria-label={enabled ? t('print.exitView') : t('print.view')}
      aria-pressed={enabled}
      onClick={toggle}
    >
      <Printer aria-hidden className="size-4" />
    </Button>
  );
}
