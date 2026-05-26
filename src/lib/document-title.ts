import i18n from '@/i18n';
import {
  formatPrintDate,
  formatPrintTime,
  formatShowDisplayName,
} from '@/lib/show-date';

export function isDefaultShowName(showName: string): boolean {
  return formatShowDisplayName(showName) === i18n.t('app.defaultShowName');
}

/**
 * Default: app.documentTitle.
 * Named current show: "{name} - {date} - {appTitle}".
 * Optional segments append date/time, venue when set.
 */
export function getDocumentTitle(
  showName: string,
  showDate: string,
  showVenue: string,
  showTime: string,
): string {
  const appTitle = i18n.t('app.documentTitle');

  if (!showName.trim() || isDefaultShowName(showName)) {
    return appTitle;
  }

  const time = formatPrintTime(showTime);
  const timeSegment = time ? ` ${time}` : '';
  const venue = showVenue.trim();
  const venueSegment = venue ? ` - ${venue}` : '';

  return `${formatShowDisplayName(showName)} - ${formatPrintDate(showDate)}${timeSegment}${venueSegment} - ${appTitle}`;
}
