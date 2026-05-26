import { Shield } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TitleWithIcon } from '@/components/shared/TitleWithIcon';
import { useTranslation } from '@/i18n';

type PrivacyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PrivacyDialog({ open, onOpenChange }: PrivacyDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TitleWithIcon icon={Shield}>{t('privacy.title')}</TitleWithIcon>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-left">
              <p>{t('privacy.localStorage')}</p>
              <p>{t('privacy.shareLinks')}</p>
              <p>{t('privacy.hosting')}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>{t('privacy.close')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
