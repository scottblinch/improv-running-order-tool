import { Clapperboard } from 'lucide-react';

import { QuickAddForm } from '@/components/shared/QuickAddForm';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';
import { useAppStore } from '@/store/useAppStore';

export function SceneQuickAdd() {
  const { t } = useTranslation();
  const addScene = useAppStore((state) => state.addScene);

  return (
    <QuickAddForm
      fieldName="sceneName"
      label={t('lineup.sceneName')}
      maxLength={INPUT_LIMITS.maxSceneNameLength}
      requiredMessage={t('lineup.sceneNameRequired')}
      announceKey="a11y.addedScene"
      onAdd={addScene}
      addIcon={Clapperboard}
    />
  );
}
