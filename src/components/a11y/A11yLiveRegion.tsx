import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';

export function A11yLiveRegion() {
  const message = useA11yAnnounceStore((state) => state.message);

  return (
    <p aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  );
}
