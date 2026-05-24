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

type MarkAbsentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personName: string;
  onConfirm: () => void;
};

export function MarkAbsentDialog({
  open,
  onOpenChange,
  personName,
  onConfirm,
}: MarkAbsentDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('roster.markAbsentTitle', { name: personName })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('roster.markAbsentDescription')}
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
            {t('roster.markAbsent')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
