import {
  formatRunningOrderCastSuffix,
  formatRunningOrderSceneName,
} from '@/lib/format-running-order-print';
import type { Person, Scene } from '@/types/app';

/** Printable page height in CSS px (US Letter, 1.2cm @page margins). */
export function getPrintableHeightPx(): number {
  const pageHeightMm = 279;
  const verticalMarginsMm = 24;
  return Math.round(((pageHeightMm - verticalMarginsMm) / 25.4) * 96);
}

/** Leave room for browser print headers/footers and rounding. */
export function getPrintFitHeightPx(): number {
  return Math.round(getPrintableHeightPx() * 0.9);
}

const BASE_FONT_PX = 16;
const MIN_SCALE = 0.6;
const MAX_SCALE = 2.5;
const CHARS_PER_LINE = 72;

export type PrintFitTarget = 'panel' | 'page';

export function estimatePrintLineCount(
  persons: Person[],
  scenes: Scene[],
): number {
  let lines = 3;

  for (const scene of scenes) {
    const sceneName = formatRunningOrderSceneName(scene.name);
    const castSuffix = formatRunningOrderCastSuffix(persons, scene);
    const line = castSuffix ? `${sceneName} - ${castSuffix}` : sceneName;
    lines += Math.max(1, Math.ceil(line.length / CHARS_PER_LINE));
  }

  return lines;
}

export function estimatePrintFitScale(
  persons: Person[],
  scenes: Scene[],
): number {
  const lineHeightEm = 1.65;
  const printable = getPrintFitHeightPx();
  const lineCount = estimatePrintLineCount(persons, scenes);
  const targetFontPx = printable / (lineCount * lineHeightEm);
  const scale = targetFontPx / BASE_FONT_PX;

  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function getPrintFitAvailableHeight(container: HTMLElement): number {
  const containerHeight = container.clientHeight;
  return containerHeight > 0 ? containerHeight : getPrintFitHeightPx();
}

function finalizeScale(best: number): number {
  return best * 0.98;
}

export function measurePrintFitScale(
  availableHeight: number,
  content: HTMLElement,
  persons: Person[],
  scenes: Scene[],
): number {
  if (availableHeight <= 0) {
    return estimatePrintFitScale(persons, scenes);
  }

  let low = MIN_SCALE;
  let high = MAX_SCALE;
  let best = estimatePrintFitScale(persons, scenes);

  for (let attempt = 0; attempt < 14; attempt += 1) {
    const mid = (low + high) / 2;
    content.style.fontSize = `${BASE_FONT_PX * mid}px`;
    const needed = content.scrollHeight;

    if (needed <= 0) break;

    if (needed <= availableHeight) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  const finalScale = finalizeScale(best);
  content.style.fontSize = `${BASE_FONT_PX * finalScale}px`;
  return finalScale;
}

export function clearPrintFitScale(content: HTMLElement): void {
  content.style.fontSize = '';
}

export function getPrintFontSizePx(persons: Person[], scenes: Scene[]): number {
  return BASE_FONT_PX * estimatePrintFitScale(persons, scenes);
}

export { BASE_FONT_PX };
