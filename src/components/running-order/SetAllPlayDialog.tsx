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
          <AlertDialogTitle>{t('runningOrder.allPlayTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('runningOrder.allPlayDescription', {
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
            {t('runningOrder.switchToAllPlay')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
