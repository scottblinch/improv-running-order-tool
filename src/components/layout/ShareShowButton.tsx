import { Share2 } from 'lucide-react';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { encodeShowShareParam } from '@/lib/show-share';
import { useAppStore } from '@/store/useAppStore';

type ShareError = 'too_large' | 'encode_failed' | 'copy_failed';

export function ShareShowButton() {
  const { t } = useTranslation();
  const showName = useAppStore((state) => state.showName);
  const showDate = useAppStore((state) => state.showDate);
  const persons = useAppStore((state) => state.persons);
  const scenes = useAppStore((state) => state.scenes);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<ShareError | null>(null);

  const handleShare = async () => {
    const result = encodeShowShareParam({
      showName,
      showDate,
      persons,
      scenes,
    });

    if ('error' in result) {
      setError(result.error);
      return;
    }

    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('copy_failed');
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        aria-label={copied ? t('share.copied') : t('share.copyLink')}
        onClick={() => void handleShare()}
      >
        <Share2 aria-hidden className="size-4" />
      </Button>

      <AlertDialog
        open={error !== null}
        onOpenChange={(open) => {
          if (!open) setError(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {error === 'too_large'
                ? t('share.tooLargeTitle')
                : error === 'copy_failed'
                  ? t('share.copyFailedTitle')
                  : t('share.encodeFailedTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error === 'too_large'
                ? t('share.tooLargeDescription')
                : error === 'copy_failed'
                  ? t('share.copyFailedDescription')
                  : t('share.encodeFailedDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>{t('share.importOk')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
