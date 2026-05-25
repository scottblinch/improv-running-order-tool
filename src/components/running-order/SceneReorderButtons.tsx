import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { useTranslation } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import type { SceneId } from '@/types/app';

type SceneReorderButtonsProps = {
  sceneId: SceneId;
  sceneName: string;
  index: number;
  sceneCount: number;
};

export function SceneReorderButtons({
  sceneId,
  sceneName,
  index,
  sceneCount,
}: SceneReorderButtonsProps) {
  const { t } = useTranslation();
  const moveScene = useAppStore((state) => state.moveScene);
  const moveUpLabel = t('lineup.moveSceneUp', { name: sceneName });
  const moveDownLabel = t('lineup.moveSceneDown', { name: sceneName });

  return (
    <div className="flex shrink-0 flex-col gap-0.5 md:hidden">
      <IconButtonTooltip label={moveUpLabel}>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-7"
          aria-label={moveUpLabel}
          disabled={index === 0}
          onClick={() => moveScene(sceneId, 'up')}
        >
          <ChevronUp aria-hidden className="size-4" />
        </Button>
      </IconButtonTooltip>
      <IconButtonTooltip label={moveDownLabel}>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-7"
          aria-label={moveDownLabel}
          disabled={index >= sceneCount - 1}
          onClick={() => moveScene(sceneId, 'down')}
        >
          <ChevronDown aria-hidden className="size-4" />
        </Button>
      </IconButtonTooltip>
    </div>
  );
}
