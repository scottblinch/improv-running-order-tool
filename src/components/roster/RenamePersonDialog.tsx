import { type FormEvent, useState } from 'react';

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
  const [name, setName] = useState(currentName);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    onConfirm(trimmed);
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>Rename performer</AlertDialogTitle>
        <AlertDialogDescription>
          Update how this person appears in the roster and scene slots.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-label="Performer name"
          autoComplete="off"
          autoFocus
        />
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
        <Button type="submit" disabled={!name.trim()}>
          Save
        </Button>
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
