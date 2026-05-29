import { useMemo, useState } from 'react';

import {
  clampPrintFontSizePx,
  FONT_SIZE_ADJUST_STEP,
  getPrintFontSizePx,
} from '@/lib/print-fit';
import { useAppStore } from '@/store/useAppStore';
import type { Person, Scene } from '@/types/app';

export function usePrintPreviewFontSize(
  enabled: boolean,
  persons: Person[],
  scenes: Scene[],
) {
  const showName = useAppStore((state) => state.showName);
  const showVenue = useAppStore((state) => state.showVenue);
  const estimate = useMemo(
    () => getPrintFontSizePx(persons, scenes, showName, showVenue),
    [persons, scenes, showName, showVenue],
  );
  const [override, setOverride] = useState<number | null>(null);
  const [prevEnabled, setPrevEnabled] = useState(enabled);

  if (prevEnabled !== enabled) {
    setPrevEnabled(enabled);
    setOverride(null);
  }

  const fontSizePx = enabled && override !== null ? override : estimate;

  return {
    fontSizePx,
    increaseFontSize: () =>
      setOverride((current) =>
        clampPrintFontSizePx((current ?? estimate) + FONT_SIZE_ADJUST_STEP),
      ),
    decreaseFontSize: () =>
      setOverride((current) =>
        clampPrintFontSizePx((current ?? estimate) - FONT_SIZE_ADJUST_STEP),
      ),
  };
}
