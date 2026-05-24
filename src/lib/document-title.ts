import i18n from '@/i18n';
import { formatPrintDate, formatShowDisplayName } from '@/lib/show-date';

export function isDefaultShowName(showName: string): boolean {
  return formatShowDisplayName(showName) === i18n.t('app.defaultShowName');
}

/**
 * Default: app.documentTitle.
 * Named current show: "{name} - {date} - {appTitle}".
 * Multiple saved shows with an untitled current show keeps the default title.
 */
export function getDocumentTitle(showName: string, showDate: string): string {
  const appTitle = i18n.t('app.documentTitle');

  if (isDefaultShowName(showName)) {
    return appTitle;
  }

  return `${formatShowDisplayName(showName)} - ${formatPrintDate(showDate)} - ${appTitle}`;
}
