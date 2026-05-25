import { Share2 } from 'lucide-react';
import { useId, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { formatShowDisplayName } from '@/lib/show-date';
import {
  hasSkippedSharePrivacy,
  setSkippedSharePrivacy,
  shareShowUrl,
} from '@/lib/share-show-action';
import { encodeShowShareParam } from '@/lib/show-share';
import { useAppStore } from '@/store/useAppStore';

type ShareError = 'too_large' | 'encode_failed' | 'copy_failed';

function showShareError(error: ShareError, t: (key: string) => string): void {
  if (error === 'too_large') {
    toast.error(t('share.tooLargeTitle'), {
      description: t('share.tooLargeDescription'),
    });
    return;
  }

  if (error === 'copy_failed') {
    toast.error(t('share.copyFailedTitle'), {
      description: t('share.copyFailedDescription'),
    });
    return;
  }

  toast.error(t('share.encodeFailedTitle'), {
    description: t('share.encodeFailedDescription'),
  });
}

export function ShareShowButton() {
  const { t } = useTranslation();
  const showName = useAppStore((state) => state.showName);
  const showDate = useAppStore((state) => state.showDate);
  const persons = useAppStore((state) => state.persons);
  const scenes = useAppStore((state) => state.scenes);
  const skipCheckboxId = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [skipNextTime, setSkipNextTime] = useState(false);

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

    toast.success(outcome === 'shared' ? t('share.shared') : t('share.copied'));
  };

  const handleShareClick = () => {
    if (hasSkippedSharePrivacy()) {
      void performShare();
      return;
    }

    setSkipNextTime(false);
    setConfirmOpen(true);
  };

  const handleConfirmShare = () => {
    if (skipNextTime) {
      setSkippedSharePrivacy();
    }

    setConfirmOpen(false);
    void performShare();
  };

  return (
    <>
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

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setSkipNextTime(false);
        }}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('share.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('share.confirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-start gap-2">
            <input
              id={skipCheckboxId}
              type="checkbox"
              checked={skipNextTime}
              onChange={(event) => setSkipNextTime(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <label
              htmlFor={skipCheckboxId}
              className="text-sm text-muted-foreground"
            >
              {t('share.confirmSkip')}
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmShare}>
              {t('share.confirmAction')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
