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

type RenamePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

type RenamePersonDialogFormProps = {
  currentName: string;
  onConfirm: (name: string) => void;
  onOpenChange: (open: boolean) => void;
};

function RenamePersonDialogForm({
  currentName,
  onConfirm,
  onOpenChange,
}: RenamePersonDialogFormProps) {
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
    const name = formData.get('performerName');
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (!trimmed) return;

    onConfirm(trimmed);
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('roster.renameTitle')}</AlertDialogTitle>
        <AlertDialogDescription>
          {t('roster.renameDescription')}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-2">
        <label htmlFor={inputId} className="sr-only">
          {t('roster.performerName')}
        </label>
        <Input
          ref={inputRef}
          id={inputId}
          name="performerName"
          defaultValue={currentName}
          autoComplete="off"
          autoFocus
          maxLength={INPUT_LIMITS.maxPersonNameLength}
          required
          pattern=".*\S.*"
          title={t('roster.performerNameRequired')}
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

export function RenamePersonDialog({
  open,
  onOpenChange,
  currentName,
  onConfirm,
}: RenamePersonDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        {open ? (
          <RenamePersonDialogForm
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
