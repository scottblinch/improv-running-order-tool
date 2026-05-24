import { SceneCard } from '@/components/running-order/SceneCard';
import type { Scene } from '@/types/app';

type SceneListProps = {
  scenes: Scene[];
};

export function SceneList({ scenes }: SceneListProps) {
  return (
    <ol aria-label="Scenes in running order" className="space-y-2">
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
