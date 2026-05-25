import { Share2 } from 'lucide-react';
import { useState } from 'react';

import { ShareConfirmDialog } from '@/components/layout/ShareConfirmDialog';
import { Button } from '@/components/ui/button';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { useTranslation } from '@/i18n';
import { formatShowDisplayName } from '@/lib/show-date';
import { showShareError, showShareSuccess } from '@/lib/show-share-feedback';
import { hasSkippedSharePrivacy, shareShowUrl } from '@/lib/share-show-action';
import { encodeShowShareParam } from '@/lib/show-share';
import { useAppStore } from '@/store/useAppStore';

export function ShareShowButton() {
  const { t } = useTranslation();
  const showName = useAppStore((state) => state.showName);
  const showDate = useAppStore((state) => state.showDate);
  const persons = useAppStore((state) => state.persons);
  const scenes = useAppStore((state) => state.scenes);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const shareLabel = formatShowDisplayName(showName);

  const performShare = async () => {
    const result = encodeShowShareParam({
      showName,
      showDate,
      persons,
      scenes,
    });

    if ('error' in result) {
      showShareError(result.error, t);
      return;
    }

    const outcome = await shareShowUrl({
      url: result.url,
      title: shareLabel,
      text: t('share.nativeText', { showName: shareLabel }),
    });

    if (outcome === 'cancelled') {
      return;
    }

    if (outcome === 'failed') {
      showShareError('copy_failed', t);
      return;
    }

    showShareSuccess(outcome, t);
  };

  const handleShareClick = () => {
    if (hasSkippedSharePrivacy()) {
      void performShare();
      return;
    }

    setConfirmOpen(true);
  };

  return (
    <>
      <IconButtonTooltip label={t('share.copyLink')}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          aria-label={t('share.copyLink')}
          onClick={handleShareClick}
        >
          <Share2 aria-hidden className="size-4" />
        </Button>
      </IconButtonTooltip>

      <ShareConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => void performShare()}
      />
    </>
  );
}
