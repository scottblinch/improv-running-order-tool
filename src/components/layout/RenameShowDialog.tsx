import { RenameDialog } from '@/components/shared/RenameDialog';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';

type RenameShowDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

export function RenameShowDialog(props: RenameShowDialogProps) {
  const { t } = useTranslation();

  return (
    <RenameDialog
      {...props}
      title={t('show.renameTitle')}
      description={t('show.renameDescription')}
      inputLabel={t('show.showName')}
      fieldName="showName"
      maxLength={INPUT_LIMITS.maxShowNameLength}
      placeholder={t('app.defaultShowName')}
      rejectEmpty={false}
    />
  );
}
