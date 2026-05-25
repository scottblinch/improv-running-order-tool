import { RenameDialog } from '@/components/shared/RenameDialog';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';
import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';

type RenameShowDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

export function RenameShowDialog({
  onConfirm,
  ...props
}: RenameShowDialogProps) {
  const { t } = useTranslation();
  const announce = useA11yAnnounceStore((state) => state.announce);

  return (
    <RenameDialog
      {...props}
      onConfirm={(name) => {
        onConfirm(name);
        announce(
          t('a11y.renamedShow', { name: name || t('app.defaultShowName') }),
        );
      }}
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
