import { useTranslation } from '@/i18n';
import { LINEUP_HEADING_ID, ROSTER_HEADING_ID } from '@/lib/a11y-ids';
import { usePrintPreviewStore } from '@/store/usePrintPreviewStore';

export function SkipLink() {
  const { t } = useTranslation();
  const printPreview = usePrintPreviewStore((state) => state.enabled);

  return (
    <nav className="skip-links" aria-label={t('a11y.skipLinksNav')}>
      {!printPreview ? (
        <a href={`#${ROSTER_HEADING_ID}`} className="skip-link">
          {t('a11y.skipToRoster')}
        </a>
      ) : null}
      <a href={`#${LINEUP_HEADING_ID}`} className="skip-link">
        {t('a11y.skipToLineup')}
      </a>
    </nav>
  );
}
