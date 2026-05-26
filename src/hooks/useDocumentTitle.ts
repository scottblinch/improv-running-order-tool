import { useEffect } from 'react';

import { getDocumentTitle } from '@/lib/document-title';
import { useTranslation } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

export function useDocumentTitle() {
  const { i18n } = useTranslation();
  const showName = useAppStore((state) => state.showName);
  const showDate = useAppStore((state) => state.showDate);
  const showVenue = useAppStore((state) => state.showVenue);
  const showTime = useAppStore((state) => state.showTime);

  useEffect(() => {
    document.title = getDocumentTitle(showName, showDate, showVenue, showTime);
  }, [showName, showDate, showVenue, showTime, i18n.language]);
}
