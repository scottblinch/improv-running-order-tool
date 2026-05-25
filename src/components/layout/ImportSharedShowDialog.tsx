import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { processShareImportFromLocation } from '@/lib/import-shared-show';
import { showShareImportSuccess } from '@/lib/show-share-feedback';
import { useTranslation } from '@/i18n';

export function ImportSharedShowDialog() {
  const { t } = useTranslation();
  const [importResult] = useState(processShareImportFromLocation);
  const [errorOpen, setErrorOpen] = useState(
    () => importResult.kind === 'error',
  );

  useEffect(() => {
    if (importResult.kind !== 'success') return;

    showShareImportSuccess(importResult.outcome, t);
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
