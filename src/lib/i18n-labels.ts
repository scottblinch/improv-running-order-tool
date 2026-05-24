import i18n from '@/i18n';

export function formatRoleCountLabel(
  role: 'host' | 'player',
  count: number,
): string {
  const key =
    role === 'host' ? 'roster.roleCountHost' : 'roster.roleCountPlayer';
  return i18n.t(key, { count });
}

export function formatPersonRowLabel(
  name: string,
  isAbsent: boolean,
  hostCount: number,
  playerCount: number,
): string {
  const details = [
    isAbsent ? i18n.t('roster.rowLabelAbsent') : null,
    formatRoleCountLabel('host', hostCount),
    formatRoleCountLabel('player', playerCount),
  ]
    .filter(Boolean)
    .join(', ');

  return i18n.t('roster.rowLabel', { name, details });
}

export function formatWarningLabel(warningLabel: 'Absent' | 'Removed'): string {
  if (warningLabel === 'Absent') {
    return i18n.t('roster.absent');
  }

  return i18n.t('fallback.removed');
}
