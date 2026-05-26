import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
  GripVertical,
  Mic2,
  MoreHorizontal,
  Pencil,
  Trash2,
  TriangleAlert,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';

import { useDesktopDndEnabled } from '@/components/dnd/desktop-dnd-context';
import { DeletePersonDialog } from '@/components/roster/DeletePersonDialog';
import { MarkAbsentDialog } from '@/components/roster/MarkAbsentDialog';
import { RenamePersonDialog } from '@/components/roster/RenamePersonDialog';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ROSTER_CASTING_HELP_ID } from '@/lib/a11y-ids';
import { rosterPersonDragId } from '@/lib/dnd-ids';
import {
  formatRoleBadgeTooltip,
  formatRoleCountLabel,
} from '@/lib/i18n-labels';
import {
  countPersonSceneRoles,
  personHasSceneAssignments,
} from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { useHoverStore } from '@/store/useHoverStore';
import { useA11yAnnounce } from '@/hooks/useA11yAnnounce';
import { useTranslation } from '@/i18n';
import type { DeletePersonMode, Person } from '@/types/app';

type PersonRowProps = {
  person: Person;
};

export function PersonRow({ person }: PersonRowProps) {
  const { t } = useTranslation();
  const announceA11y = useA11yAnnounce();
  const persons = useAppStore((state) => state.persons);
  const scenes = useAppStore((state) => state.scenes);
  const renamePerson = useAppStore((state) => state.renamePerson);
  const deletePerson = useAppStore((state) => state.deletePerson);
  const togglePersonAbsence = useAppStore((state) => state.togglePersonAbsence);
  const setHoveredPersonId = useHoverStore((state) => state.setHoveredPersonId);
  const desktopDndEnabled = useDesktopDndEnabled();
  const canDrag = desktopDndEnabled && !person.isAbsent;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: rosterPersonDragId(person.id),
    data: { type: 'roster-person', personId: person.id },
    disabled: !canDrag,
  });

  const hasSceneAssignments = personHasSceneAssignments(
    scenes,
    person.id,
    persons,
  );
  const { hostCount, playerCount } = countPersonSceneRoles(
    scenes,
    person.id,
    persons,
  );

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [absentOpen, setAbsentOpen] = useState(false);

  const handleAbsent = () => {
    if (person.isAbsent) {
      togglePersonAbsence(person.id);
      announceA11y('a11y.clearedAbsent', { name: person.name });
      return;
    }

    setAbsentOpen(true);
  };

  const handleMarkAbsent = () => {
    togglePersonAbsence(person.id);
    announceA11y('a11y.markedAbsent', { name: person.name });
  };

  const handleDeletePerson = (mode: DeletePersonMode) => {
    deletePerson(person.id, mode);
    announceA11y('a11y.deletedPerformer', { name: person.name });
  };

  return (
    <>
      <li
        ref={setNodeRef}
        className={cn(
          'flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2',
          person.isAbsent && 'border-destructive/50 bg-destructive/5',
          hasSceneAssignments && 'md:hover:border-primary/40',
          isDragging && 'opacity-50',
        )}
        data-person-id={person.id}
        onMouseEnter={() => {
          if (desktopDndEnabled) setHoveredPersonId(person.id);
        }}
        onMouseLeave={() => {
          if (desktopDndEnabled) setHoveredPersonId(null);
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {!person.isAbsent ? (
            <IconButtonTooltip
              label={t('roster.dragPerformer', { name: person.name })}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="hidden shrink-0 cursor-grab touch-none active:cursor-grabbing md:inline-flex print:hidden"
                aria-label={t('roster.dragPerformer', { name: person.name })}
                disabled={!canDrag}
                {...listeners}
                {...attributes}
                aria-describedby={ROSTER_CASTING_HELP_ID}
              >
                <GripVertical aria-hidden className="size-4" />
              </Button>
            </IconButtonTooltip>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <span
              className={cn(
                'truncate text-sm font-medium',
                person.isAbsent && 'text-muted-foreground line-through',
              )}
            >
              {person.name}
            </span>
            {person.isAbsent ? (
              <Badge variant="destructive" className="shrink-0">
                <UserX aria-hidden className="size-3" />
                {t('roster.absent')}
              </Badge>
            ) : (
              <>
                <Badge
                  variant="host"
                  className="shrink-0"
                  title={formatRoleBadgeTooltip('host', person.name, hostCount)}
                  aria-label={formatRoleCountLabel('host', hostCount)}
                >
                  <Mic2 aria-hidden className="size-3" />
                  {hostCount}
                </Badge>
                <Badge
                  variant="player"
                  className="shrink-0"
                  title={formatRoleBadgeTooltip(
                    'player',
                    person.name,
                    playerCount,
                  )}
                  aria-label={formatRoleCountLabel('player', playerCount)}
                >
                  {playerCount === 0 ? (
                    <TriangleAlert aria-hidden className="size-3" />
                  ) : (
                    <Users aria-hidden className="size-3" />
                  )}
                  {playerCount}
                </Badge>
              </>
            )}
          </div>
        </div>

        <DropdownMenu>
          <IconButtonTooltip
            label={t('roster.actionsFor', { name: person.name })}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                aria-label={t('roster.actionsFor', { name: person.name })}
              >
                <MoreHorizontal aria-hidden className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          </IconButtonTooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              title={t('roster.renameItemTitle', { name: person.name })}
              onSelect={(event) => {
                event.preventDefault();
                setRenameOpen(true);
              }}
            >
              <Pencil aria-hidden className="size-4" />
              {t('common.rename')}
            </DropdownMenuItem>
            <DropdownMenuItem
              title={
                person.isAbsent
                  ? t('roster.clearAbsentItemTitle', { name: person.name })
                  : t('roster.markAbsentItemTitle', { name: person.name })
              }
              onSelect={handleAbsent}
            >
              {person.isAbsent ? (
                <>
                  <UserCheck aria-hidden className="size-4" />
                  {t('roster.clearAbsent')}
                </>
              ) : (
                <>
                  <UserX aria-hidden className="size-4" />
                  {t('roster.markAbsent')}
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              title={t('roster.deleteItemTitle', { name: person.name })}
              onSelect={() => setDeleteOpen(true)}
            >
              <Trash2 aria-hidden className="size-4" />
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>

      <RenamePersonDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={person.name}
        onConfirm={(name) => renamePerson(person.id, name)}
      />

      <MarkAbsentDialog
        open={absentOpen}
        onOpenChange={setAbsentOpen}
        personName={person.name}
        onConfirm={handleMarkAbsent}
      />

      <DeletePersonDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        personName={person.name}
        hasSceneAssignments={hasSceneAssignments}
        onHardDelete={() => handleDeletePerson('clearScenes')}
        onDeleteWithMode={handleDeletePerson}
      />
    </>
  );
}
