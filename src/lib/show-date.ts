import i18n from '@/i18n';

export function toIsoDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isIsoDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function formatPrintDate(isoDate: string): string {
  const date = isoDateToDate(isoDate) ?? new Date();

  return new Intl.DateTimeFormat(i18n.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatShowPrintTitle(showName: string): string {
  return (showName.trim() || i18n.t('app.defaultShowName')).toUpperCase();
}

export function formatShowDisplayName(showName: string): string {
  return showName.trim() || i18n.t('app.defaultShowName');
}

export function isoDateToDate(isoDate: string): Date | undefined {
  if (!isIsoDateString(isoDate)) return undefined;

  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}
