import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

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

export type RenameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
  title: string;
  description: string;
  inputLabel: string;
  fieldName: string;
  maxLength: number;
  placeholder?: string;
  validationMessage?: string;
  /** When true (default), trimmed empty values are rejected on submit. */
  rejectEmpty?: boolean;
};

type RenameDialogFormProps = Omit<RenameDialogProps, 'open'>;

function RenameDialogForm({
  currentName,
  onConfirm,
  onOpenChange,
  title,
  description,
  inputLabel,
  fieldName,
  maxLength,
  placeholder,
  validationMessage: validationMessageProp,
  rejectEmpty = true,
}: RenameDialogFormProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const validationMessage =
    validationMessageProp ?? t('common.fieldRequired', { label: inputLabel });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = inputRef.current;
    if (!input) return;

    const name = new FormData(event.currentTarget).get(fieldName);
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (rejectEmpty && !trimmed) {
      setError(validationMessage);
      input.focus();
      return;
    }

    setError(null);
    onConfirm(trimmed);
    onOpenChange(false);
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-2">
        <label htmlFor={inputId} className="sr-only">
          {inputLabel}
        </label>
        <Input
          ref={inputRef}
          id={inputId}
          name={fieldName}
          defaultValue={currentName}
          autoComplete="off"
          autoFocus
          maxLength={maxLength}
          placeholder={placeholder}
          aria-required={rejectEmpty ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onInput={() => setError(null)}
        />
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}
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

export function RenameDialog({
  open,
  onOpenChange,
  currentName,
  ...formProps
}: RenameDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        {open ? (
          <RenameDialogForm
            key={currentName}
            currentName={currentName}
            onOpenChange={onOpenChange}
            {...formProps}
          />
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
}
