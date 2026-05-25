import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  clearShareParamFromLocation,
  computeShareKey,
  decodeShowShareParam,
  readShareParamFromLocation,
} from '@/lib/show-share';
import { useTranslation } from '@/i18n';
import { useAppStore } from '@/store/useAppStore';

type ImportSharedShowError = 'invalid' | 'full';

function resolveImportError(): ImportSharedShowError | null {
  const param = readShareParamFromLocation();
  if (!param) return null;

  clearShareParamFromLocation();

  const payload = decodeShowShareParam(param);
  if (!payload) return 'invalid';

  const result = useAppStore
    .getState()
    .importSharedShow(payload, computeShareKey(payload));

  if (result === 'full') {
    return 'full';
  }

  return null;
}

export function ImportSharedShowDialog() {
  const { t } = useTranslation();
  const [error, setError] = useState<ImportSharedShowError | null>(
    resolveImportError,
  );

  return (
    <AlertDialog
      open={error !== null}
      onOpenChange={(open) => {
        if (!open) setError(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {error === 'full'
              ? t('share.importFullTitle')
              : t('share.importInvalidTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {error === 'full'
              ? t('share.importFullDescription')
              : t('share.importInvalidDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>{t('share.importOk')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
