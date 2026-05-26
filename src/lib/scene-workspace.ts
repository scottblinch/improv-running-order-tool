import i18n from '@/i18n';
import { INPUT_LIMITS, sanitizeSceneName } from '@/lib/input-security';
import type { Scene } from '@/types/app';

export function formatDuplicateSceneName(sceneName: string): string {
  const suffix = i18n.t('workspace.duplicateNameSuffix');
  const base = sceneName.trim();
  const maxLength = INPUT_LIMITS.maxSceneNameLength;

  if (base.length + suffix.length <= maxLength) {
    return sanitizeSceneName(`${base}${suffix}`);
  }

  return sanitizeSceneName(
    `${base.slice(0, maxLength - suffix.length)}${suffix}`,
  );
}

export function cloneScene(source: Scene): Scene {
  return {
    id: crypto.randomUUID(),
    name: formatDuplicateSceneName(source.name),
    hostId: source.hostId,
    playerIds: [...source.playerIds],
    isAllPlay: source.isAllPlay,
  };
}
