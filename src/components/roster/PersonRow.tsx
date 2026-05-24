import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';

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
import { useAppStore } from '@/store/useAppStore';
import type { Person } from '@/types/app';

type PersonRowProps = {
  person: Person;
};

export function PersonRow({ person }: PersonRowProps) {
  const renamePerson = useAppStore((state) => state.renamePerson);
  const deletePerson = useAppStore((state) => state.deletePerson);
  const togglePersonAbsence = useAppStore((state) => state.togglePersonAbsence);

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
        className={cn(
          'flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2',
          person.isAbsent && 'border-destructive/50 bg-destructive/5',
        )}
        data-draggable={person.isAbsent ? 'false' : 'true'}
        aria-disabled={person.isAbsent}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
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
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
              <Pencil className="size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleAbsent}>
              {person.isAbsent ? (
                <>
                  <UserCheck className="size-4" />
                  Clear absent
                </>
              ) : (
                <>
                  <UserX className="size-4" />
                  Mark absent
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
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
        onConfirm={(mode) => deletePerson(person.id, mode)}
      />
    </>
  );
}
