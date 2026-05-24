import { type FormEvent, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';

export function SceneQuickAdd() {
  const addScene = useAppStore((state) => state.addScene);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('sceneName');
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (!trimmed) return;

    addScene(trimmed);
    event.currentTarget.reset();
    inputRef.current?.focus();
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <Input
        ref={inputRef}
        name="sceneName"
        autoComplete="off"
        aria-label="Scene name"
        placeholder="Scene name"
        required
        pattern=".*\S.*"
        title="Enter a scene name."
        className="min-w-0 flex-1"
      />
      <Button type="submit" className="shrink-0">
        Add
      </Button>
    </form>
  );
}
