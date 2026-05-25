import { useId, useState } from 'react';

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
import { setSkippedSharePrivacy } from '@/lib/share-show-action';
import { useTranslation } from '@/i18n';

type ShareConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ShareConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: ShareConfirmDialogProps) {
  const { t } = useTranslation();
  const skipCheckboxId = useId();
  const [skipNextTime, setSkipNextTime] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) setSkipNextTime(false);
  };

  const handleConfirm = () => {
    if (skipNextTime) {
      setSkippedSharePrivacy();
    }

    onConfirm();
    handleOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
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
          <AlertDialogAction onClick={handleConfirm}>
            {t('share.confirmAction')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
