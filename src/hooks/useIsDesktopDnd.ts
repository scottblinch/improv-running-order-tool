import { useEffect, useState } from 'react';

const DESKTOP_DND_QUERY = '(min-width: 768px)';

export function useIsDesktopDnd(): boolean {
  const [isDesktopDnd, setIsDesktopDnd] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(DESKTOP_DND_QUERY).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_DND_QUERY);
    const handleChange = () => setIsDesktopDnd(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDesktopDnd;
}
