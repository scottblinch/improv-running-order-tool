import { Spinner } from '@/components/ui/spinner';

export function AppLoadingScreen() {
  return (
    <div
      aria-busy
      className="flex min-h-svh items-center justify-center bg-background"
    >
      <Spinner aria-hidden className="size-5 text-muted-foreground" />
      <p className="sr-only" role="status">
        Loading application
      </p>
    </div>
  );
}
