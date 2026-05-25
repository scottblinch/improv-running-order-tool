import { toast } from 'sonner';
import { registerSW } from 'virtual:pwa-register';

import i18n from '@/i18n';

export function registerServiceWorker() {
  if (!import.meta.env.PROD) return;

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      toast(i18n.t('pwa.updateTitle'), {
        description: i18n.t('pwa.updateDescription'),
        duration: Infinity,
        action: {
          label: i18n.t('pwa.updateAction'),
          onClick: () => {
            void updateSW(true);
          },
        },
      });
    },
  });
}
