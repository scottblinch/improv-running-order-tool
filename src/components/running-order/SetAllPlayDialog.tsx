import { Users } from 'lucide-react';

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
import { TitleWithIcon } from '@/components/shared/TitleWithIcon';
import { useTranslation } from '@/i18n';

type SetAllPlayDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sceneName: string;
  playerCount: number;
  onConfirm: () => void;
};

export function SetAllPlayDialog({
  open,
  onOpenChange,
  sceneName,
  playerCount,
  onConfirm,
}: SetAllPlayDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TitleWithIcon icon={Users}>
              {t('lineup.allPlayTitle')}
            </TitleWithIcon>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('lineup.allPlayDescription', {
              count: playerCount,
              sceneName,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {t('lineup.switchToAllPlay')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
