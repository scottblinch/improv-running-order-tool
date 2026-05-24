import { type FormEvent, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';

export function RosterQuickAdd() {
  const addPerson = useAppStore((state) => state.addPerson);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('performerName');
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (!trimmed) return;

    addPerson(trimmed);
    event.currentTarget.reset();
    inputRef.current?.focus();
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <Input
        ref={inputRef}
        name="performerName"
        autoComplete="off"
        aria-label="Performer name"
        placeholder="Performer name"
        required
        pattern=".*\S.*"
        title="Enter a performer name."
        className="min-w-0 flex-1"
      />
      <Button type="submit" className="shrink-0">
        Add
      </Button>
    </form>
  );
}
