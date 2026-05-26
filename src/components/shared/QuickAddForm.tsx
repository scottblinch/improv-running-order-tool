import { Plus, type LucideIcon } from 'lucide-react';
import { type FormEvent, useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';

type QuickAddFormProps = {
  fieldName: string;
  label: string;
  maxLength: number;
  requiredMessage: string;
  announceKey: string;
  onAdd: (name: string) => void;
  addIcon?: LucideIcon;
};

export function QuickAddForm({
  fieldName,
  label,
  maxLength,
  requiredMessage,
  announceKey,
  onAdd,
  addIcon: AddIcon = Plus,
}: QuickAddFormProps) {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = inputRef.current;
    if (!input) return;

    const name = new FormData(event.currentTarget).get(fieldName);
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError(requiredMessage);
      input.focus();
      return;
    }

    setError(null);
    onAdd(trimmed);
    announceA11y(announceKey, { name: trimmed });
    event.currentTarget.reset();
    input.focus();
  };

  return (
    <form className="flex flex-col gap-1" noValidate onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <Input
          ref={inputRef}
          id={inputId}
          name={fieldName}
          autoComplete="off"
          aria-required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder={label}
          maxLength={maxLength}
          className="min-w-0 flex-1"
          onInput={() => setError(null)}
        />
        <Button type="submit" className="shrink-0">
          <AddIcon aria-hidden className="size-4" />
          {t('common.add')}
        </Button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
