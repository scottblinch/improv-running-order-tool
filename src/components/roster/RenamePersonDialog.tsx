import { RenameDialog } from '@/components/shared/RenameDialog';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';
import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';

type RenamePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

export function RenamePersonDialog({
  onConfirm,
  ...props
}: RenamePersonDialogProps) {
  const { t } = useTranslation();
  const announce = useA11yAnnounceStore((state) => state.announce);

  return (
    <RenameDialog
      {...props}
      onConfirm={(name) => {
        onConfirm(name);
        announce(t('a11y.renamedPerformer', { name }));
      }}
      title={t('roster.renameTitle')}
      description={t('roster.renameDescription')}
      inputLabel={t('roster.performerName')}
      fieldName="performerName"
      maxLength={INPUT_LIMITS.maxPersonNameLength}
      validationMessage={t('roster.performerNameRequired')}
    />
  );
}
