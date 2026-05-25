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

export async function shareShowUrl({
  url,
  title,
  text,
}: ShareShowUrlOptions): Promise<ShareShowOutcome> {
  const shareData = { url, title, text };

  if (
    typeof navigator.share === 'function' &&
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
