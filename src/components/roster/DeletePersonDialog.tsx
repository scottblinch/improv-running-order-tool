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
import type { DeletePersonMode } from '@/types/app';

type DeletePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personName: string;
  onConfirm: (mode: DeletePersonMode) => void;
};

export function DeletePersonDialog({
  open,
  onOpenChange,
  personName,
  onConfirm,
}: DeletePersonDialogProps) {
  const handleConfirm = (mode: DeletePersonMode) => {
    onConfirm(mode);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {personName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Choose whether to remove their scene assignments or keep them as
            warning slots on the running order.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => handleConfirm('clearScenes')}
          >
            Remove from roster and all scenes
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => handleConfirm('keepAssignments')}
          >
            Remove from roster, keep scene slots
          </Button>
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
