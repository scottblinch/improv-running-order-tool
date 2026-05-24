import { SceneCard } from '@/components/running-order/SceneCard';
import { useTranslation } from '@/i18n';
import type { Scene } from '@/types/app';

type SceneListProps = {
  scenes: Scene[];
};

export function SceneList({ scenes }: SceneListProps) {
  const { t } = useTranslation();

  return (
    <ol aria-label={t('lineup.listLabel')} className="space-y-2">
      {scenes.map((scene, index) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          index={index}
          sceneCount={scenes.length}
        />
      ))}
    </ol>
  );
}
