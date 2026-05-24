import { type FormEvent, useId } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';

export function SceneQuickAdd() {
  const addScene = useAppStore((state) => state.addScene);
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('sceneName');
    if (typeof name !== 'string') return;

    addScene(name.trim());
    event.currentTarget.reset();
  };

  return (
    <form className="flex items-end gap-2" onSubmit={handleSubmit}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium">
          Scene name
        </label>
        <Input
          id={inputId}
          name="sceneName"
          autoComplete="off"
          required
          pattern=".*\S.*"
          title="Enter a scene name."
        />
      </div>
      <Button type="submit">Add</Button>
    </form>
  );
}
