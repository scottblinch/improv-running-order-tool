import { type CSSProperties, type RefObject } from 'react';
import { createPortal } from 'react-dom';

import {
  formatRunningOrderCastSuffix,
  formatRunningOrderSceneName,
} from '@/lib/format-running-order-print';
import { formatShowDateTime, formatShowPrintTitle } from '@/lib/show-date';
import { useTranslation } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import type { Person, Scene } from '@/types/app';

type RunningOrderPrintViewProps = {
  scenes: Scene[];
  fontSizePx: number;
  preview?: boolean;
};

function PrintShowHeader({
  showName,
  showDate,
  showVenue,
  showTime,
}: {
  showName: string;
  showDate: string;
  showVenue: string;
  showTime: string;
}) {
  const venue = showVenue.trim();

  return (
    <header className="mb-[2.5em] text-center">
      <h1 className="text-[1.125em] font-bold tracking-wide uppercase underline">
        {formatShowPrintTitle(showName)}
      </h1>
      <p className="mt-[0.5em] text-[1em]">
        {formatShowDateTime(showDate, showTime)}
      </p>
      {venue ? <p className="mt-[0.35em] text-[0.95em]">{venue}</p> : null}
    </header>
  );
}

function RunningOrderPrintContent({
  scenes,
  showName,
  showDate,
  showVenue,
  showTime,
  persons,
}: {
  scenes: Scene[];
  showName: string;
  showDate: string;
  showVenue: string;
  showTime: string;
  persons: Person[];
}) {
  const { t } = useTranslation();

  if (scenes.length === 0) {
    return (
      <>
        <PrintShowHeader
          showName={showName}
          showDate={showDate}
          showVenue={showVenue}
          showTime={showTime}
        />
        <p className="text-center text-[0.875em] text-neutral-600">
          {t('print.noScenes')}
        </p>
      </>
    );
  }

  return (
    <>
      <PrintShowHeader
        showName={showName}
        showDate={showDate}
        showVenue={showVenue}
        showTime={showTime}
      />

      <ol aria-label={t('print.lineupList')}>
        {scenes.map((scene) => {
          const castSuffix = formatRunningOrderCastSuffix(persons, scene);
          const sceneName = formatRunningOrderSceneName(scene.name);

          return (
            <li
              key={scene.id}
              className="break-inside-avoid text-[1em] uppercase not-first:mt-[1.5em]"
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
  fontSizePx,
  preview = false,
}: RunningOrderPrintViewProps) {
  const persons = useAppStore((state) => state.persons);
  const showName = useAppStore((state) => state.showName);
  const showDate = useAppStore((state) => state.showDate);
  const showVenue = useAppStore((state) => state.showVenue);
  const showTime = useAppStore((state) => state.showTime);

  const contentStyle = {
    fontSize: `${fontSizePx}px`,
    ['--print-page-font-size' as string]: `${fontSizePx}px`,
  } as CSSProperties;

  const content = (
    <div
      className="print-fit-content text-left text-black"
      style={contentStyle}
    >
      <RunningOrderPrintContent
        scenes={scenes}
        showName={showName}
        showDate={showDate}
        showVenue={showVenue}
        showTime={showTime}
        persons={persons}
      />
    </div>
  );

  if (!preview) {
    return content;
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
      <div className="print-preview-paper mx-auto bg-white shadow-md">
        {content}
      </div>
    </div>
  );
}

type RunningOrderPrintPortalProps = {
  scenes: Scene[];
  fontSizePx: number;
  printRootRef: RefObject<HTMLDivElement | null>;
};

export function RunningOrderPrintPortal({
  scenes,
  fontSizePx,
  printRootRef,
}: RunningOrderPrintPortalProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div id="print-root" ref={printRootRef} className="hidden print:block">
      <RunningOrderPrintView scenes={scenes} fontSizePx={fontSizePx} />
    </div>,
    document.body,
  );
}
