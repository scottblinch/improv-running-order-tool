import { toast } from 'sonner';

export type ShareError = 'too_large' | 'encode_failed' | 'copy_failed';

export function showShareError(
  error: ShareError,
  t: (key: string) => string,
): void {
  if (error === 'too_large') {
    toast.error(t('share.tooLargeTitle'), {
      description: t('share.tooLargeDescription'),
    });
    return;
  }

  if (error === 'copy_failed') {
    toast.error(t('share.copyFailedTitle'), {
      description: t('share.copyFailedDescription'),
    });
    return;
  }

  toast.error(t('share.encodeFailedTitle'), {
    description: t('share.encodeFailedDescription'),
  });
}

export function showShareSuccess(
  outcome: 'shared' | 'copied',
  t: (key: string) => string,
): void {
  toast.success(outcome === 'shared' ? t('share.shared') : t('share.copied'));
}

export function showShareImportSuccess(
  outcome: 'imported' | 'existing',
  t: (key: string) => string,
): void {
  toast.success(
    outcome === 'imported' ? t('share.imported') : t('share.openedExisting'),
  );
}
