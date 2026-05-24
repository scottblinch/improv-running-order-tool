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
            {t('runningOrder.removeTitle', { name: sceneName })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('runningOrder.removeDescription')}
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
            {t('runningOrder.removeScene')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
