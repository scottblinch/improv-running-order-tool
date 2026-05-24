import { type FormEvent, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';

export function RosterQuickAdd() {
  const addPerson = useAppStore((state) => state.addPerson);
  const [name, setName] = useState('');
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addPerson(name.trim());
    setName('');
  };

  return (
    <form className="flex items-end gap-2" onSubmit={handleSubmit}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium">
          Performer name
        </label>
        <Input
          id={inputId}
          name="performerName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
          required
          pattern=".*\S.*"
          title="Enter a performer name."
        />
      </div>
      <Button type="submit">Add</Button>
    </form>
  );
}
