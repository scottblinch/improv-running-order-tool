import { useCallback } from 'react';

import { useTranslation } from '@/i18n';
import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';

type A11yParams = Record<string, string | number>;

export function useA11yAnnounce() {
  const { t } = useTranslation();
  const announce = useA11yAnnounceStore((state) => state.announce);

  return useCallback(
    (key: string, params?: A11yParams) => {
      announce(t(key, params));
    },
    [announce, t],
  );
}
