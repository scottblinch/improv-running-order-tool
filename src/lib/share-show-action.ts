export const SHARE_PRIVACY_SKIP_KEY = 'improv-share-privacy-skipped';

export type ShareShowOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

export function hasSkippedSharePrivacy(): boolean {
  try {
    return localStorage.getItem(SHARE_PRIVACY_SKIP_KEY) === '1';
  } catch {
    return false;
  }
}

export function setSkippedSharePrivacy(): void {
  try {
    localStorage.setItem(SHARE_PRIVACY_SKIP_KEY, '1');
  } catch {
    // Ignore storage failures; user can confirm again next time.
  }
}

type ShareShowUrlOptions = {
  url: string;
  title: string;
  text: string;
};

/** Native share is best on phones; desktop (incl. macOS) and tablets use clipboard. */
export function shouldUseNativeShare(): boolean {
  if (typeof navigator.share !== 'function') return false;

  const isTouchPrimary = window.matchMedia(
    '(hover: none) and (pointer: coarse)',
  ).matches;

  if (!isTouchPrimary || isTabletDevice()) return false;

  return isMobilePhoneUserAgent();
}

function isTabletDevice(): boolean {
  const ua = navigator.userAgent;

  if (/iPad/i.test(ua)) return true;

  // iPadOS 13+ may report as Mac with touch.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

function isMobilePhoneUserAgent(): boolean {
  const ua = navigator.userAgent;

  if (/iPhone|iPod/i.test(ua)) return true;
  if (/Android/i.test(ua) && /Mobile/i.test(ua)) return true;

  return false;
}

export async function shareShowUrl({
  url,
  title,
  text,
}: ShareShowUrlOptions): Promise<ShareShowOutcome> {
  const shareData = { url, title, text };

  if (
    shouldUseNativeShare() &&
    (typeof navigator.canShare !== 'function' || navigator.canShare(shareData))
  ) {
    try {
      await navigator.share(shareData);
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled';
      }
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
