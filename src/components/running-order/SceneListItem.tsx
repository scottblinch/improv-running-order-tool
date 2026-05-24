import type { Scene } from '@/types/app';

type SceneListItemProps = {
  scene: Scene;
  index: number;
};

export function SceneListItem({ scene, index }: SceneListItemProps) {
  return (
    <li className="rounded-xl border bg-card px-4 py-3 ring-1 ring-foreground/10">
      <p className="text-xs font-medium text-muted-foreground">
        Scene {index + 1}
      </p>
      <p className="font-medium">{scene.name}</p>
    </li>
  );
}
