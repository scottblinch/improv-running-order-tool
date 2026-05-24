import { useState } from 'react';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  TriangleAlert,
  UserCheck,
  UserX,
} from 'lucide-react';

import { DeletePersonDialog } from '@/components/roster/DeletePersonDialog';
import { MarkAbsentDialog } from '@/components/roster/MarkAbsentDialog';
import { RenamePersonDialog } from '@/components/roster/RenamePersonDialog';
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
import {
  countPersonSceneRoles,
  personHasSceneAssignments,
} from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { useHoverStore } from '@/store/useHoverStore';
import type { Person } from '@/types/app';

function formatRoleCountLabel(role: 'Host' | 'Player', count: number): string {
  const noun = count === 1 ? 'scene' : 'scenes';
  return `${role} in ${count} ${noun}`;
}

function formatRowLabel(
  name: string,
  isAbsent: boolean,
  hostCount: number,
  playerCount: number,
): string {
  const parts = [
    isAbsent ? 'absent' : null,
    formatRoleCountLabel('Host', hostCount),
    formatRoleCountLabel('Player', playerCount),
  ].filter(Boolean);

  return `${name}, ${parts.join(', ')}`;
}

type PersonRowProps = {
  person: Person;
};

export function PersonRow({ person }: PersonRowProps) {
  const scenes = useAppStore((state) => state.scenes);
  const renamePerson = useAppStore((state) => state.renamePerson);
  const deletePerson = useAppStore((state) => state.deletePerson);
  const togglePersonAbsence = useAppStore((state) => state.togglePersonAbsence);
  const setHoveredPersonId = useHoverStore((state) => state.setHoveredPersonId);

  const hasSceneAssignments = personHasSceneAssignments(scenes, person.id);
  const { hostCount, playerCount } = countPersonSceneRoles(scenes, person.id);

  const rowLabel = formatRowLabel(
    person.name,
    person.isAbsent,
    hostCount,
    playerCount,
  );

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [absentOpen, setAbsentOpen] = useState(false);

  const handleAbsent = () => {
    if (person.isAbsent) {
      togglePersonAbsence(person.id);
      return;
    }

    setAbsentOpen(true);
  };

  return (
    <>
      <li
        aria-label={rowLabel}
        className={cn(
          'flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2',
          person.isAbsent && 'border-destructive/50 bg-destructive/5',
          hasSceneAssignments && 'hover:border-primary/40',
        )}
        data-draggable={person.isAbsent ? 'false' : 'true'}
        data-person-id={person.id}
        onMouseEnter={() => setHoveredPersonId(person.id)}
        onMouseLeave={() => setHoveredPersonId(null)}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span
            className={cn(
              'truncate text-sm font-medium',
              person.isAbsent && 'text-muted-foreground line-through',
            )}
          >
            {person.name}
          </span>
          <Badge
            variant="secondary"
            className="shrink-0"
            aria-label={formatRoleCountLabel('Host', hostCount)}
          >
            Host {hostCount}
          </Badge>
          <Badge
            variant="outline"
            className="shrink-0"
            aria-label={formatRoleCountLabel('Player', playerCount)}
          >
            {playerCount === 0 ? (
              <TriangleAlert aria-hidden className="size-3" />
            ) : null}
            Player {playerCount}
          </Badge>
          {person.isAbsent ? (
            <Badge variant="destructive" className="shrink-0">
              Absent
            </Badge>
          ) : null}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              aria-label={`Actions for ${person.name}`}
            >
              <MoreHorizontal aria-hidden className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
              <Pencil aria-hidden className="size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleAbsent}>
              {person.isAbsent ? (
                <>
                  <UserCheck aria-hidden className="size-4" />
                  Clear absent
                </>
              ) : (
                <>
                  <UserX aria-hidden className="size-4" />
                  Mark absent
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDeleteOpen(true)}
            >
              <Trash2 aria-hidden className="size-4" />
              Delete
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
        onConfirm={() => togglePersonAbsence(person.id)}
      />

      <DeletePersonDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        personName={person.name}
        hasSceneAssignments={hasSceneAssignments}
        onHardDelete={() => deletePerson(person.id, 'clearScenes')}
        onDeleteWithMode={(mode) => deletePerson(person.id, mode)}
      />
    </>
  );
}
