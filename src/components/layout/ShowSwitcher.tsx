import { useState } from 'react';
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react';

import { DeleteShowDialog } from '@/components/layout/DeleteShowDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n';
import { canAddShow, INPUT_LIMITS } from '@/lib/input-security';
import {
  formatShowMenuLabel,
  partitionShowsByShowDate,
} from '@/lib/show-workspace';
import { formatShowDisplayName } from '@/lib/show-date';
import { useAppStore } from '@/store/useAppStore';
import type { ShowId, ShowRecord } from '@/types/app';

type ShowMenuItemProps = {
  show: ShowRecord;
  isActive: boolean;
  canDelete: boolean;
  onSwitch: (id: ShowId) => void;
  onDelete: (target: { id: ShowId; label: string }) => void;
};

function ShowMenuItem({
  show,
  isActive,
  canDelete,
  onSwitch,
  onDelete,
}: ShowMenuItemProps) {
  const { t } = useTranslation();
  const label = formatShowMenuLabel(show.showName, show.showDate);

  return (
    <DropdownMenuItem
      className="flex items-center gap-2"
      onSelect={() => {
        if (!isActive) {
          onSwitch(show.id);
        }
      }}
    >
      <Check
        aria-hidden
        className={`size-4 shrink-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {canDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 shrink-0"
          aria-label={t('workspace.deleteShow')}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDelete({ id: show.id, label });
          }}
        >
          <Trash2 aria-hidden className="size-3.5" />
        </Button>
      ) : null}
    </DropdownMenuItem>
  );
}

export function ShowSwitcher() {
  const { t } = useTranslation();
  const activeShowId = useAppStore((state) => state.activeShowId);
  const shows = useAppStore((state) => state.shows);
  const showName = useAppStore((state) => state.showName);
  const createShow = useAppStore((state) => state.createShow);
  const switchShow = useAppStore((state) => state.switchShow);
  const deleteShow = useAppStore((state) => state.deleteShow);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: ShowId;
    label: string;
  } | null>(null);

  const currentLabel = formatShowDisplayName(showName);
  const { currentAndUpcoming, past } = partitionShowsByShowDate(shows);
  const canCreate = canAddShow(shows.length);
  const canDelete = shows.length > 1;
  const hasPastSection = past.length > 0;
  const upcomingLabel = hasPastSection
    ? t('workspace.upcomingShows')
    : t('workspace.savedShows');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="max-w-56 min-w-0 shrink justify-between gap-2 font-heading font-semibold tracking-tight"
            aria-label={t('header.switchShow')}
          >
            <span className="truncate">{currentLabel}</span>
            <ChevronDown aria-hidden className="size-4 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          {currentAndUpcoming.length > 0 ? (
            <>
              <DropdownMenuLabel>{upcomingLabel}</DropdownMenuLabel>
              {currentAndUpcoming.map((show) => (
                <ShowMenuItem
                  key={show.id}
                  show={show}
                  isActive={show.id === activeShowId}
                  canDelete={canDelete}
                  onSwitch={switchShow}
                  onDelete={setDeleteTarget}
                />
              ))}
            </>
          ) : null}
          {hasPastSection ? (
            <>
              {currentAndUpcoming.length > 0 ? <DropdownMenuSeparator /> : null}
              <DropdownMenuLabel>{t('workspace.pastShows')}</DropdownMenuLabel>
              {past.map((show) => (
                <ShowMenuItem
                  key={show.id}
                  show={show}
                  isActive={show.id === activeShowId}
                  canDelete={canDelete}
                  onSwitch={switchShow}
                  onDelete={setDeleteTarget}
                />
              ))}
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={!canCreate} onSelect={() => createShow()}>
            <Plus aria-hidden className="size-4" />
            {t('workspace.newShow')}
            {!canCreate ? ` (${INPUT_LIMITS.maxShows})` : null}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteShowDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        label={deleteTarget?.label ?? ''}
        onConfirm={() => {
          if (!deleteTarget) return;

          deleteShow(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
