import {
  formatRunningOrderCastSuffix,
  formatRunningOrderSceneName,
} from '@/lib/format-running-order-print';
import { formatShowPrintTitle } from '@/lib/show-date';
import type { Person, Scene } from '@/types/app';

/** US Letter page size and @page margins (see index.css). */
export const PRINT_PAGE_WIDTH = '8.5in';
export const PRINT_PAGE_HEIGHT = '11in';
export const PRINT_PAGE_MARGIN = '1.2cm';

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
const LINE_HEIGHT_EM = 1.65;
const CHARS_PER_LINE = 72;
/** Conservative title wrap for large 1.125em uppercase headings. */
const TITLE_CHARS_PER_LINE = 12;
/** Headroom for wrapping, em margins, and browser print variance. */
const ESTIMATE_SAFETY_FACTOR = 0.9;

export const FONT_SIZE_ADJUST_STEP = 4;
export const MIN_FONT_PX = Math.round(BASE_FONT_PX * MIN_SCALE);
export const MAX_ESTIMATE_FONT_PX = 100;

function emToLines(em: number): number {
  return em / LINE_HEIGHT_EM;
}

function estimateHeaderLines(
  showName: string,
  showVenue: string,
  scenes: Scene[],
): number {
  const title = formatShowPrintTitle(showName);
  const titleLines =
    Math.max(1, Math.ceil(title.length / TITLE_CHARS_PER_LINE)) * 1.125;
  let em = titleLines + 0.5 + 1 + 2.5;

  if (showVenue.trim()) {
    em += 0.35 + 0.95;
  }

  if (scenes.length === 0) {
    em += 0.875;
  }

  return emToLines(em);
}

export function estimatePrintLineCount(
  persons: Person[],
  scenes: Scene[],
  showName: string,
  showVenue: string,
): number {
  let lines = estimateHeaderLines(showName, showVenue, scenes);

  for (const [index, scene] of scenes.entries()) {
    const sceneName = formatRunningOrderSceneName(scene.name);
    const castSuffix = formatRunningOrderCastSuffix(persons, scene);
    const line = castSuffix ? `${sceneName} - ${castSuffix}` : sceneName;
    lines += Math.max(1, Math.ceil(line.length / CHARS_PER_LINE));

    if (index > 0) {
      lines += emToLines(1.5);
    }
  }

  return lines;
}

export function estimatePrintFitScale(
  persons: Person[],
  scenes: Scene[],
  showName: string,
  showVenue: string,
): number {
  const printable = getPrintFitHeightPx();
  const lineCount = estimatePrintLineCount(
    persons,
    scenes,
    showName,
    showVenue,
  );
  const targetFontPx = printable / (lineCount * LINE_HEIGHT_EM);
  const scale = targetFontPx / BASE_FONT_PX;

  return Math.max(MIN_SCALE, scale);
}

export function clampPrintFontSizePx(px: number): number {
  return Math.max(MIN_FONT_PX, Math.round(px));
}

export function getPrintFontSizePx(
  persons: Person[],
  scenes: Scene[],
  showName: string,
  showVenue: string,
): number {
  const estimated =
    BASE_FONT_PX * estimatePrintFitScale(persons, scenes, showName, showVenue);

  return clampPrintFontSizePx(
    Math.min(
      MAX_ESTIMATE_FONT_PX,
      Math.round(estimated * ESTIMATE_SAFETY_FACTOR),
    ),
  );
}

export { BASE_FONT_PX };
