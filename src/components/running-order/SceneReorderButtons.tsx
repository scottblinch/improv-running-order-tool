import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import type { SceneId } from '@/types/app';

type SceneReorderButtonsProps = {
  sceneId: SceneId;
  index: number;
  sceneCount: number;
};

export function SceneReorderButtons({
  sceneId,
  index,
  sceneCount,
}: SceneReorderButtonsProps) {
  const moveScene = useAppStore((state) => state.moveScene);

  return (
    <div className="flex shrink-0 flex-col gap-0.5 md:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="size-7"
        aria-label="Move scene up"
        disabled={index === 0}
        onClick={() => moveScene(sceneId, 'up')}
      >
        <ChevronUp aria-hidden className="size-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="size-7"
        aria-label="Move scene down"
        disabled={index >= sceneCount - 1}
        onClick={() => moveScene(sceneId, 'down')}
      >
        <ChevronDown aria-hidden className="size-4" />
      </Button>
    </div>
  );
}
