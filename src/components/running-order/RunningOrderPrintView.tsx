import {
  formatPrintDate,
  formatRunningOrderCastSuffix,
  formatRunningOrderSceneName,
} from '@/lib/format-running-order-print';
import { useAppStore } from '@/store/useAppStore';
import type { Scene } from '@/types/app';

type RunningOrderPrintViewProps = {
  scenes: Scene[];
};

export function RunningOrderPrintView({ scenes }: RunningOrderPrintViewProps) {
  const persons = useAppStore((state) => state.persons);

  if (scenes.length === 0) {
    return (
      <p className="text-sm text-neutral-600">No scenes in running order.</p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl text-left text-black">
      <header className="mb-10 text-center">
        <h1 className="text-lg font-bold tracking-wide uppercase underline">
          Running Order
        </h1>
        <p className="mt-2 text-base">{formatPrintDate()}</p>
      </header>

      <ol aria-label="Running order" className="space-y-6">
        {scenes.map((scene) => {
          const castSuffix = formatRunningOrderCastSuffix(persons, scene);
          const sceneName = formatRunningOrderSceneName(scene.name);

          return (
            <li
              key={scene.id}
              className="break-inside-avoid text-base uppercase"
            >
              <span className="font-bold">{sceneName}</span>
              {castSuffix ? (
                <>
                  <span aria-hidden> - </span>
                  <span className="font-normal">{castSuffix}</span>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
