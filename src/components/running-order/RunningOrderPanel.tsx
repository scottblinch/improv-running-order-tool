import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

export function RunningOrderPanel() {
  const scenes = useAppStore((state) => state.scenes);

  return (
    <Card className="flex h-full min-h-0 flex-col rounded-none border-0 bg-transparent py-0 ring-0">
      <CardHeader className="border-b">
        <CardTitle>Running order</CardTitle>
        <CardDescription>Scenes and cast assignments for the show</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto">
        {scenes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No scenes yet. You will build the show lineup here in the next
            step.
          </p>
        ) : (
          <ul className="space-y-3">
            {scenes.map((scene, index) => (
              <li
                key={scene.id}
                className="rounded-xl border bg-card px-4 py-3 ring-1 ring-foreground/10"
              >
                <p className="text-xs font-medium text-muted-foreground">
                  Scene {index + 1}
                </p>
                <p className="font-medium">{scene.name}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
