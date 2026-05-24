import { type FormEvent, useId } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';

type RenameSceneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

type RenameSceneDialogFormProps = {
  currentName: string;
  onConfirm: (name: string) => void;
  onOpenChange: (open: boolean) => void;
};

function RenameSceneDialogForm({
  currentName,
  onConfirm,
  onOpenChange,
}: RenameSceneDialogFormProps) {
  const { t } = useTranslation();
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('sceneName');
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (!trimmed) return;

    onConfirm(trimmed);
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('runningOrder.renameTitle')}</AlertDialogTitle>
        <AlertDialogDescription>
          {t('runningOrder.renameDescription')}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-2">
        <label htmlFor={inputId} className="sr-only">
          {t('runningOrder.sceneName')}
        </label>
        <Input
          id={inputId}
          name="sceneName"
          defaultValue={currentName}
          autoComplete="off"
          autoFocus
          maxLength={INPUT_LIMITS.maxSceneNameLength}
          required
          pattern=".*\S.*"
          title={t('runningOrder.sceneNameRequired')}
        />
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel type="button">
          {t('common.cancel')}
        </AlertDialogCancel>
        <Button type="submit">{t('common.save')}</Button>
      </AlertDialogFooter>
    </form>
  );
}

export function RenameSceneDialog({
  open,
  onOpenChange,
  currentName,
  onConfirm,
}: RenameSceneDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        {open ? (
          <RenameSceneDialogForm
            key={currentName}
            currentName={currentName}
            onConfirm={onConfirm}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
}
