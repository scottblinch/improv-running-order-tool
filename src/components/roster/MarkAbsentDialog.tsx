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

type MarkAbsentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personName: string;
  onConfirm: () => void;
};

export function MarkAbsentDialog({
  open,
  onOpenChange,
  personName,
  onConfirm,
}: MarkAbsentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark {personName} absent?</AlertDialogTitle>
          <AlertDialogDescription>
            They will stay in assigned scene slots with a warning style, but
            cannot be dragged into new slots until cleared.
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
            Mark absent
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
