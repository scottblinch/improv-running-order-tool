import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function PrintPreviewToggle() {
  const enabled = usePrintPreviewStore((state) => state.enabled);
  const toggle = usePrintPreviewStore((state) => state.toggle);

  return (
    <Button
      type="button"
      variant={enabled ? 'default' : 'outline'}
      size="icon"
      className="shrink-0"
      aria-label={enabled ? 'Exit print view' : 'Print view'}
      aria-pressed={enabled}
      onClick={toggle}
    >
      <Printer aria-hidden className="size-4" />
    </Button>
  );
}
