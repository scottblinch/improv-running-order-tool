import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { DeletePersonMode } from '@/types/app';

type DeletePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personName: string;
  hasSceneAssignments: boolean;
  onHardDelete: () => void;
  onDeleteWithMode: (mode: DeletePersonMode) => void;
};

export function DeletePersonDialog({
  open,
  onOpenChange,
  personName,
  hasSceneAssignments,
  onHardDelete,
  onDeleteWithMode,
}: DeletePersonDialogProps) {
  const handleConfirm = (mode: DeletePersonMode) => {
    onDeleteWithMode(mode);
    onOpenChange(false);
  };

  const handleHardDelete = () => {
    onHardDelete();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {personName}?</AlertDialogTitle>
          <AlertDialogDescription>
            {hasSceneAssignments
              ? 'Choose whether to remove their scene assignments or keep them as warning slots on the running order.'
              : 'They will be permanently removed from the roster.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter
          className={
            hasSceneAssignments
              ? 'flex-col gap-2 sm:flex-col sm:items-stretch'
              : undefined
          }
        >
          <AlertDialogCancel
            className={hasSceneAssignments ? 'w-full sm:w-auto' : undefined}
          >
            Cancel
          </AlertDialogCancel>
          {hasSceneAssignments ? (
            <>
              <AlertDialogAction
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => handleConfirm('keepAssignments')}
              >
                Remove from roster, keep scene slots
              </AlertDialogAction>
              <AlertDialogAction
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => handleConfirm('clearScenes')}
              >
                Remove from roster and all scenes
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction variant="destructive" onClick={handleHardDelete}>
              Delete
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
