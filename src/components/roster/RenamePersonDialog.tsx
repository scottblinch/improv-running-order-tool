import { RenameDialog } from '@/components/shared/RenameDialog';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';

type RenamePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

export function RenamePersonDialog(props: RenamePersonDialogProps) {
  const { t } = useTranslation();

  return (
    <RenameDialog
      {...props}
      announceMessageKey="a11y.renamedPerformer"
      title={t('roster.renameTitle')}
      description={t('roster.renameDescription')}
      inputLabel={t('roster.performerName')}
      fieldName="performerName"
      maxLength={INPUT_LIMITS.maxPersonNameLength}
      validationMessage={t('roster.performerNameRequired')}
    />
  );
}
