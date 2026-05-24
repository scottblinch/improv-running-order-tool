import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b px-6 py-4 print:hidden">
      <h1 className="font-heading text-lg font-semibold tracking-tight">
        Improv Running Order
      </h1>
      <ThemeToggle />
    </header>
  );
}
