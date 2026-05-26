import { Trash2 } from 'lucide-react';

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

type RemoveSceneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sceneName: string;
  onConfirm: () => void;
};

export function RemoveSceneDialog({
  open,
  onOpenChange,
  sceneName,
  onConfirm,
}: RemoveSceneDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TitleWithIcon icon={Trash2}>
              {t('lineup.removeTitle', { name: sceneName })}
            </TitleWithIcon>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('lineup.removeDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {t('lineup.removeScene')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
