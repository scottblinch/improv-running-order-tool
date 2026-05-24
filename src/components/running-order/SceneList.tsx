import { SceneListItem } from '@/components/running-order/SceneListItem';
import type { Scene } from '@/types/app';

type SceneListProps = {
  scenes: Scene[];
};

export function SceneList({ scenes }: SceneListProps) {
  return (
    <ul className="space-y-3">
      {scenes.map((scene, index) => (
        <SceneListItem key={scene.id} scene={scene} index={index} />
      ))}
    </ul>
  );
}
