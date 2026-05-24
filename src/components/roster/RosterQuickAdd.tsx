import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';

export function RosterQuickAdd() {
  const addPerson = useAppStore((state) => state.addPerson);
  const [name, setName] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    addPerson(trimmed);
    setName('');
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Add performer…"
        aria-label="Performer name"
        autoComplete="off"
      />
      <Button type="submit" disabled={!name.trim()}>
        Add
      </Button>
    </form>
  );
}
