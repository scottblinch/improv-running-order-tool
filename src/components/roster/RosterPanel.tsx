import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { selectActivePersons } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';

export function RosterPanel() {
  const persons = useAppStore((state) => state.persons);
  const activePersons = selectActivePersons(persons);

  return (
    <Card className="flex h-full min-h-0 flex-col rounded-none border-0 bg-transparent py-0 ring-0">
      <CardHeader className="border-b">
        <CardTitle>Roster</CardTitle>
        <CardDescription>Performers available for casting</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto">
        {activePersons.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No performers yet. You will add people here in the next step.
          </p>
        ) : (
          <ul className="space-y-2">
            {activePersons.map((person) => (
              <li
                key={person.id}
                className="rounded-lg border bg-card px-3 py-2 text-sm"
              >
                {person.name}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
