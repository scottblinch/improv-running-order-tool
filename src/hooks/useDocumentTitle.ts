import { useEffect } from 'react';

import { getDocumentTitle } from '@/lib/document-title';
import { useTranslation } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

export function useDocumentTitle() {
  const { i18n } = useTranslation();
  const showName = useAppStore((state) => state.showName);
  const showDate = useAppStore((state) => state.showDate);

  useEffect(() => {
    document.title = getDocumentTitle(showName, showDate);
  }, [showName, showDate, i18n.language]);
}
