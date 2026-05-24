import { type FormEvent, useEffect, useId, useRef } from 'react';

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

type RenameShowDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

type RenameShowDialogFormProps = {
  currentName: string;
  onConfirm: (name: string) => void;
  onOpenChange: (open: boolean) => void;
};

function RenameShowDialogForm({
  currentName,
  onConfirm,
  onOpenChange,
}: RenameShowDialogFormProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('showName');
    if (typeof name !== 'string') return;

    onConfirm(name.trim());
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('show.renameTitle')}</AlertDialogTitle>
        <AlertDialogDescription>
          {t('show.renameDescription')}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-2">
        <label htmlFor={inputId} className="sr-only">
          {t('show.showName')}
        </label>
        <Input
          ref={inputRef}
          id={inputId}
          name="showName"
          defaultValue={currentName}
          autoComplete="off"
          autoFocus
          maxLength={INPUT_LIMITS.maxShowNameLength}
          placeholder={t('app.defaultShowName')}
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

export function RenameShowDialog({
  open,
  onOpenChange,
  currentName,
  onConfirm,
}: RenameShowDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        {open ? (
          <RenameShowDialogForm
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
