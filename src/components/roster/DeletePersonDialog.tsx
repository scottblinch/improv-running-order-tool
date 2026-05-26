import { Trash2, UserMinus } from 'lucide-react';

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
import type { DeletePersonMode } from '@/types/app';

type DeletePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personName: string;
  hasSceneAssignments: boolean;
  onHardDelete: () => void;
  onDeleteWithMode: (mode: DeletePersonMode) => void;
};

export function DeletePersonDialog({
  open,
  onOpenChange,
  personName,
  hasSceneAssignments,
  onHardDelete,
  onDeleteWithMode,
}: DeletePersonDialogProps) {
  const { t } = useTranslation();

  const handleConfirm = (mode: DeletePersonMode) => {
    onDeleteWithMode(mode);
    onOpenChange(false);
  };

  const handleHardDelete = () => {
    onHardDelete();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TitleWithIcon icon={UserMinus}>
              {t('roster.deleteTitle', { name: personName })}
            </TitleWithIcon>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasSceneAssignments
              ? t('roster.deleteDescriptionWithAssignments')
              : t('roster.deleteDescriptionNoAssignments')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter
          className={
            hasSceneAssignments
              ? 'flex-col gap-2 sm:flex-col sm:items-stretch'
              : undefined
          }
        >
          <AlertDialogCancel
            className={hasSceneAssignments ? 'w-full sm:w-auto' : undefined}
          >
            {t('common.cancel')}
          </AlertDialogCancel>
          {hasSceneAssignments ? (
            <>
              <AlertDialogAction
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => handleConfirm('keepAssignments')}
              >
                {t('roster.deleteKeepSlots')}
              </AlertDialogAction>
              <AlertDialogAction
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => handleConfirm('clearScenes')}
              >
                <Trash2 aria-hidden className="size-4" />
                {t('roster.deleteClearScenes')}
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction variant="destructive" onClick={handleHardDelete}>
              <Trash2 aria-hidden className="size-4" />
              {t('common.delete')}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
