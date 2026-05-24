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

type RemoveSceneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sceneName: string;
  onConfirm: () => void;
};

export function RemoveSceneDialog({
  open,
  onOpenChange,
  sceneName,
  onConfirm,
}: RemoveSceneDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {sceneName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the scene and all host and player assignments for it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Remove scene
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
