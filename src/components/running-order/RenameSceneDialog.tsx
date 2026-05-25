import { RenameDialog } from '@/components/shared/RenameDialog';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';
import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';

type RenameSceneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

export function RenameSceneDialog({
  onConfirm,
  ...props
}: RenameSceneDialogProps) {
  const { t } = useTranslation();
  const announce = useA11yAnnounceStore((state) => state.announce);

  return (
    <RenameDialog
      {...props}
      onConfirm={(name) => {
        onConfirm(name);
        announce(t('a11y.renamedScene', { name }));
      }}
      title={t('lineup.renameTitle')}
      description={t('lineup.renameDescription')}
      inputLabel={t('lineup.sceneName')}
      fieldName="sceneName"
      maxLength={INPUT_LIMITS.maxSceneNameLength}
      validationMessage={t('lineup.sceneNameRequired')}
    />
  );
}
