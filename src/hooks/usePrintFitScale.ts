import { useLayoutEffect, useState, type RefObject } from 'react';

import {
  clearPrintFitScale,
  estimatePrintFitScale,
  getPrintFitAvailableHeight,
  getPrintFitHeightPx,
  measurePrintFitScale,
  type PrintFitTarget,
} from '@/lib/print-fit';
import type { Person, Scene } from '@/types/app';

export function usePrintFitScale(
  contentRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  fitTarget: PrintFitTarget,
  persons: Person[],
  scenes: Scene[],
): number {
  const [scale, setScale] = useState(() =>
    active ? estimatePrintFitScale(persons, scenes) : 1,
  );

  useLayoutEffect(() => {
    if (!active) return;

    const content = contentRef.current;
    if (!content) return;

    const measure = (forPrint = false) => {
      const available = forPrint
        ? getPrintFitHeightPx()
        : fitTarget === 'page'
          ? getPrintFitHeightPx()
          : getPrintFitAvailableHeight(containerRef.current!);

      setScale(measurePrintFitScale(available, content, persons, scenes));
    };

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(content);
    if (fitTarget === 'panel' && containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleBeforePrint = () => measure(true);

    window.addEventListener('beforeprint', handleBeforePrint);

    return () => {
      clearPrintFitScale(content);
      observer.disconnect();
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, [active, contentRef, containerRef, fitTarget, persons, scenes]);

  return active ? scale : 1;
}
