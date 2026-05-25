import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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

type ShareImportResult =
  | { kind: 'none' }
  | { kind: 'error'; error: ImportSharedShowError }
  | { kind: 'success'; outcome: 'imported' | 'existing' };

function processShareImport(): ShareImportResult {
  const param = readShareParamFromLocation();
  if (!param) return { kind: 'none' };

  clearShareParamFromLocation();

  const payload = decodeShowShareParam(param);
  if (!payload) {
    return { kind: 'error', error: 'invalid' };
  }

  const outcome = useAppStore
    .getState()
    .importSharedShow(payload, computeShareKey(payload));

  if (outcome === 'full') {
    return { kind: 'error', error: 'full' };
  }

  return { kind: 'success', outcome };
}

export function ImportSharedShowDialog() {
  const { t } = useTranslation();
  const [importResult] = useState(processShareImport);
  const [errorOpen, setErrorOpen] = useState(
    () => importResult.kind === 'error',
  );

  useEffect(() => {
    if (importResult.kind !== 'success') return;

    toast.success(
      importResult.outcome === 'imported'
        ? t('share.imported')
        : t('share.openedExisting'),
    );
  }, [importResult, t]);

  if (importResult.kind !== 'error') {
    return null;
  }

  const { error } = importResult;

  return (
    <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
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
