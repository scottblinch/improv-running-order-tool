import { useEffect, useState } from 'react';

import { MD_MIN_WIDTH_QUERY } from '@/lib/breakpoints';

export function useIsDesktopDnd(): boolean {
  const [isDesktopDnd, setIsDesktopDnd] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MD_MIN_WIDTH_QUERY).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(MD_MIN_WIDTH_QUERY);
    const handleChange = () => setIsDesktopDnd(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDesktopDnd;
}
