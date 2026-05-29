import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';

type PrintFontSizeControlsProps = {
  fontSizePx: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const controlButtonClassName =
  'border-neutral-400 bg-white text-neutral-950 hover:bg-neutral-100 hover:text-neutral-950 dark:border-neutral-400 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 [&_svg]:text-neutral-950';

export function PrintFontSizeControls({
  fontSizePx,
  onDecrease,
  onIncrease,
}: PrintFontSizeControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex shrink-0 items-center justify-center gap-2 px-6 pt-6 pb-3">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className={controlButtonClassName}
        onClick={onDecrease}
        aria-label={t('print.decreaseFontSize')}
      >
        <Minus aria-hidden />
      </Button>
      <span
        className="min-w-14 text-center text-sm font-medium text-neutral-950 tabular-nums"
        aria-live="polite"
      >
        {t('print.fontSizeValue', { size: fontSizePx })}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className={controlButtonClassName}
        onClick={onIncrease}
        aria-label={t('print.increaseFontSize')}
      >
        <Plus aria-hidden />
      </Button>
    </div>
  );
}
