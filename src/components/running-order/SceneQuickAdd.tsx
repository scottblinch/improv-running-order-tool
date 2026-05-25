import { type FormEvent, useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n';
import { INPUT_LIMITS } from '@/lib/input-security';
import { useAppStore } from '@/store/useAppStore';

export function SceneQuickAdd() {
  const { t } = useTranslation();
  const addScene = useAppStore((state) => state.addScene);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const [error, setError] = useState<string | null>(null);
  const requiredMessage = t('lineup.sceneNameRequired');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = inputRef.current;
    if (!input) return;

    const name = new FormData(event.currentTarget).get('sceneName');
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError(requiredMessage);
      input.focus();
      return;
    }

    setError(null);
    addScene(trimmed);
    event.currentTarget.reset();
    input.focus();
  };

  return (
    <form className="flex flex-col gap-1" noValidate onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          name="sceneName"
          autoComplete="off"
          aria-label={t('lineup.sceneName')}
          aria-required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder={t('lineup.sceneName')}
          maxLength={INPUT_LIMITS.maxSceneNameLength}
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
