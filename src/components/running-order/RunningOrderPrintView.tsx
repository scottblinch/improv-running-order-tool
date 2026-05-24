import { useRef, type CSSProperties } from 'react';

import {
  formatRunningOrderCastSuffix,
  formatRunningOrderSceneName,
} from '@/lib/format-running-order-print';
import { formatPrintDate, formatShowPrintTitle } from '@/lib/show-date';
import { BASE_FONT_PX, type PrintFitTarget } from '@/lib/print-fit';
import { usePrintFitScale } from '@/hooks/usePrintFitScale';
import { useAppStore } from '@/store/useAppStore';
import type { Person, Scene } from '@/types/app';

type RunningOrderPrintViewProps = {
  scenes: Scene[];
  fitToPage?: boolean;
  fitTarget?: PrintFitTarget;
};

function RunningOrderPrintContent({
  scenes,
  showName,
  showDate,
  persons,
}: {
  scenes: Scene[];
  showName: string;
  showDate: string;
  persons: Person[];
}) {
  return (
    <>
      <header className="mb-[2.5em] text-center print:mb-[1.25em]">
        <h1 className="text-[1.125em] font-bold tracking-wide uppercase underline">
          {formatShowPrintTitle(showName)}
        </h1>
        <p className="mt-[0.5em] text-[1em]">{formatPrintDate(showDate)}</p>
      </header>

      <ol aria-label="Running order">
        {scenes.map((scene) => {
          const castSuffix = formatRunningOrderCastSuffix(persons, scene);
          const sceneName = formatRunningOrderSceneName(scene.name);

          return (
            <li
              key={scene.id}
              className="break-inside-avoid text-[1em] uppercase not-first:mt-[1.5em] print:not-first:mt-[0.85em]"
            >
              <span className="font-bold">{sceneName}</span>
              {castSuffix ? (
                <>
                  <span aria-hidden> - </span>
                  <span className="font-normal">{castSuffix}</span>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function RunningOrderPrintView({
  scenes,
  fitToPage = false,
  fitTarget = 'panel',
}: RunningOrderPrintViewProps) {
  const persons = useAppStore((state) => state.persons);
  const showName = useAppStore((state) => state.showName);
  const showDate = useAppStore((state) => state.showDate);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldFit = fitToPage && scenes.length > 0;
  const scale = usePrintFitScale(
    contentRef,
    containerRef,
    shouldFit,
    fitTarget,
    persons,
    scenes,
  );

  if (scenes.length === 0) {
    return (
      <p className="text-sm text-neutral-600">No scenes in running order.</p>
    );
  }

  const content = (
    <RunningOrderPrintContent
      scenes={scenes}
      showName={showName}
      showDate={showDate}
      persons={persons}
    />
  );

  const fontSizePx = shouldFit ? BASE_FONT_PX * scale : undefined;

  const contentStyle = fontSizePx
    ? ({
        fontSize: `${fontSizePx}px`,
        ['--print-page-font-size' as string]: `${fontSizePx}px`,
      } as CSSProperties)
    : undefined;

  if (!shouldFit) {
    return (
      <div className="mx-auto w-full max-w-3xl text-left text-base text-black">
        {content}
      </div>
    );
  }

  const contentNode = (
    <div
      ref={contentRef}
      className="print-fit-content mx-auto w-full max-w-3xl text-left text-black print:max-w-none"
      style={contentStyle}
    >
      {content}
    </div>
  );

  if (fitTarget === 'page') {
    return contentNode;
  }

  return (
    <div ref={containerRef} className="flex min-h-0 flex-1 flex-col">
      {contentNode}
    </div>
  );
}
