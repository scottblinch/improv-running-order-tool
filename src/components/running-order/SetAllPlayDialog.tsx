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

type SetAllPlayDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sceneName: string;
  playerCount: number;
  onConfirm: () => void;
};

export function SetAllPlayDialog({
  open,
  onOpenChange,
  sceneName,
  playerCount,
  onConfirm,
}: SetAllPlayDialogProps) {
  const playerNoun = playerCount === 1 ? 'player' : 'players';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Switch to all play?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes {playerCount} assigned {playerNoun} from {sceneName}{' '}
            and marks the scene as all play.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Switch to all play
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
