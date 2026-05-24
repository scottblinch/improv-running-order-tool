import { RenameDialog } from '@/components/shared/RenameDialog';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';

type RenameSceneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

export function RenameSceneDialog(props: RenameSceneDialogProps) {
  const { t } = useTranslation();

  return (
    <RenameDialog
      {...props}
      title={t('lineup.renameTitle')}
      description={t('lineup.renameDescription')}
      inputLabel={t('lineup.sceneName')}
      fieldName="sceneName"
      maxLength={INPUT_LIMITS.maxSceneNameLength}
      required
      pattern=".*\S.*"
      validationTitle={t('lineup.sceneNameRequired')}
    />
  );
}
