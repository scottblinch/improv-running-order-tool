import { type FormEvent, useId } from 'react';

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

type RenameSceneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => void;
};

type RenameSceneDialogFormProps = {
  currentName: string;
  onConfirm: (name: string) => void;
  onOpenChange: (open: boolean) => void;
};

function RenameSceneDialogForm({
  currentName,
  onConfirm,
  onOpenChange,
}: RenameSceneDialogFormProps) {
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('sceneName');
    if (typeof name !== 'string') return;

    const trimmed = name.trim();
    if (!trimmed) return;

    onConfirm(trimmed);
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>Rename scene</AlertDialogTitle>
        <AlertDialogDescription>
          Update how this scene appears on the running order.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-2">
        <label htmlFor={inputId} className="sr-only">
          Scene name
        </label>
        <Input
          id={inputId}
          name="sceneName"
          defaultValue={currentName}
          autoComplete="off"
          autoFocus
          required
          pattern=".*\S.*"
          title="Enter a scene name."
        />
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
        <Button type="submit">Save</Button>
      </AlertDialogFooter>
    </form>
  );
}

export function RenameSceneDialog({
  open,
  onOpenChange,
  currentName,
  onConfirm,
}: RenameSceneDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        {open ? (
          <RenameSceneDialogForm
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
