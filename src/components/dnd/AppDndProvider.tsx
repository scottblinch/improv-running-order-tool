import { type ReactNode, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { DragPreviewChip } from '@/components/dnd/DragPreviewChip';
import { DesktopDndProvider } from '@/components/dnd/desktop-dnd-context';
import { useIsDesktopDnd } from '@/hooks/useIsDesktopDnd';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';
import { useTranslation } from '@/i18n';
import {
  announceCastNamedPersonInScene,
  resolvePerformerName,
} from '@/lib/cast-a11y';
import {
  parseSceneDragId,
  sceneDragId,
  type DndDragData,
  type DndDropData,
} from '@/lib/dnd-ids';
import { getPersonById } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import type { PersonId, SceneId } from '@/types/app';

type ActiveDrag =
  | { type: 'roster-person'; personId: PersonId; label: string }
  | { type: 'scene'; sceneId: SceneId; label: string };

type AppDndProviderProps = {
  children: ReactNode;
};

function rosterPersonCollisionDetection(
  args: Parameters<CollisionDetection>[0],
) {
  const droppableCollisions = pointerWithin(args).filter((collision) => {
    const type = collision.data?.droppableContainer?.data.current?.type;
    return type === 'host-zone' || type === 'player-zone';
  });

  return droppableCollisions.length > 0
    ? droppableCollisions
    : pointerWithin(args);
}

function sceneCollisionDetection(args: Parameters<CollisionDetection>[0]) {
  return closestCenter({
    ...args,
    droppableContainers: args.droppableContainers.filter((container) => {
      return container.data.current?.type === 'scene';
    }),
  });
}

function resolveCollisionDetection(
  activeType: DndDragData['type'] | undefined,
) {
  if (activeType === 'roster-person') return rosterPersonCollisionDetection;
  if (activeType === 'scene') return sceneCollisionDetection;
  return closestCenter;
}

export function AppDndProvider({ children }: AppDndProviderProps) {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const isDesktopDnd = useIsDesktopDnd();
  const persons = useAppStore((state) => state.persons);
  const scenes = useAppStore((state) => state.scenes);
  const assignHost = useAppStore((state) => state.assignHost);
  const addPlayer = useAppStore((state) => state.addPlayer);
  const reorderScenes = useAppStore((state) => state.reorderScenes);

  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [activeDragType, setActiveDragType] = useState<
    DndDragData['type'] | undefined
  >(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DndDragData | undefined;
    if (!data) return;

    setActiveDragType(data.type);

    if (data.type === 'roster-person') {
      const label = resolvePerformerName(persons, data.personId, t);
      setActiveDrag({
        type: 'roster-person',
        personId: data.personId,
        label,
      });
      announceA11y('a11y.draggingPerformer', { name: label });
      return;
    }

    if (data.type === 'scene') {
      const scene = scenes.find((item) => item.id === data.sceneId);
      const label = scene?.name ?? t('fallback.scene');
      setActiveDrag({
        type: 'scene',
        sceneId: data.sceneId,
        label,
      });
      announceA11y('a11y.draggingScene', { name: label });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);
    setActiveDragType(undefined);

    if (!over) {
      announceA11y('a11y.dragCancelled');
      return;
    }

    const activeData = active.data.current as DndDragData | undefined;
    const overData = over.data.current as DndDropData | undefined;

    if (activeData?.type === 'roster-person') {
      const person = getPersonById(persons, activeData.personId);
      if (!person || person.isAbsent || person.isDeleted) {
        announceA11y('a11y.dropFailed');
        return;
      }

      const scene = overData
        ? scenes.find((item) => item.id === overData.sceneId)
        : undefined;
      const sceneName = scene?.name ?? t('fallback.scene');

      if (overData?.type === 'host-zone') {
        assignHost(overData.sceneId, activeData.personId);
        announceCastNamedPersonInScene(
          announceA11y,
          person.name,
          sceneName,
          'a11y.assignedHost',
        );
        return;
      }

      if (overData?.type === 'player-zone') {
        addPlayer(overData.sceneId, activeData.personId);
        announceCastNamedPersonInScene(
          announceA11y,
          person.name,
          sceneName,
          'a11y.addedPlayer',
        );
        return;
      }

      announceA11y('a11y.dropFailed');
      return;
    }

    if (activeData?.type === 'scene') {
      const overSceneId =
        overData?.type === 'scene'
          ? overData.sceneId
          : parseSceneDragId(String(over.id));

      if (overSceneId && overSceneId !== activeData.sceneId) {
        reorderScenes(activeData.sceneId, overSceneId);
        const scene = scenes.find((item) => item.id === activeData.sceneId);
        announceA11y('a11y.movedScene', {
          name: scene?.name ?? t('fallback.scene'),
        });
      } else {
        announceA11y('a11y.sceneOrderUnchanged');
      }
    }
  };

  const handleDragCancel = () => {
    setActiveDrag(null);
    setActiveDragType(undefined);
    announceA11y('a11y.dragCancelled');
  };

  if (!isDesktopDnd) {
    return <DesktopDndProvider value={false}>{children}</DesktopDndProvider>;
  }

  const sceneSortableIds = scenes.map((scene) => sceneDragId(scene.id));

  return (
    <DesktopDndProvider value={true}>
      <DndContext
        sensors={sensors}
        collisionDetection={(args) =>
          resolveCollisionDetection(activeDragType)(args)
        }
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={sceneSortableIds}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
        <DragOverlay aria-hidden className="print:hidden" dropAnimation={null}>
          {activeDrag ? (
            activeDrag.type === 'scene' ? (
              <DragPreviewChip
                label={activeDrag.label}
                className="min-w-48 justify-center px-4 py-2"
              />
            ) : (
              <DragPreviewChip label={activeDrag.label} />
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </DesktopDndProvider>
  );
}
