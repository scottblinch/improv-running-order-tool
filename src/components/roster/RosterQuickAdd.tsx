import { type FormEvent, useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';
import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';
import { useAppStore } from '@/store/useAppStore';

export function RosterQuickAdd() {
  const { t } = useTranslation();
  const announce = useA11yAnnounceStore((state) => state.announce);
  const addPerson = useAppStore((state) => state.addPerson);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();
  const [error, setError] = useState<string | null>(null);
  const requiredMessage = t('roster.performerNameRequired');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = inputRef.current;
    if (!input) return;

    const name = new FormData(event.currentTarget).get('performerName');
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError(requiredMessage);
      input.focus();
      return;
    }

    setError(null);
    addPerson(trimmed);
    announce(t('a11y.addedPerformer', { name: trimmed }));
    event.currentTarget.reset();
    input.focus();
  };

  return (
    <form className="flex flex-col gap-1" noValidate onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          {t('roster.performerName')}
        </label>
        <Input
          ref={inputRef}
          id={inputId}
          name="performerName"
          autoComplete="off"
          aria-required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder={t('roster.performerName')}
          maxLength={INPUT_LIMITS.maxPersonNameLength}
          className="min-w-0 flex-1"
          onInput={() => setError(null)}
        />
        <Button type="submit" className="shrink-0">
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
