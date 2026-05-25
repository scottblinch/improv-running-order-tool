import { useTranslation } from '@/i18n';
import { LINEUP_HEADING_ID, ROSTER_HEADING_ID } from '@/lib/a11y-ids';

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <nav className="skip-links" aria-label={t('a11y.skipLinksNav')}>
      <a href={`#${ROSTER_HEADING_ID}`} className="skip-link">
        {t('a11y.skipToRoster')}
      </a>
      <a href={`#${LINEUP_HEADING_ID}`} className="skip-link">
        {t('a11y.skipToLineup')}
      </a>
    </nav>
  );
}
