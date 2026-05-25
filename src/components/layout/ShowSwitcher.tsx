import { useState, useId } from 'react';
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react';

import { DeleteShowDialog } from '@/components/layout/DeleteShowDialog';
import { IconButtonTooltip } from '@/components/shared/IconButtonTooltip';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';
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
  const deleteLabel = t('workspace.deleteShowItemTitle', { label });

  return (
    <DropdownMenuGroup className="flex items-center">
      <DropdownMenuItem
        className="min-w-0 flex-1"
        title={t('workspace.switchShowItemTitle', { label })}
        aria-current={isActive ? 'true' : undefined}
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
      </DropdownMenuItem>
      {canDelete ? (
        <IconButtonTooltip label={deleteLabel}>
          <DropdownMenuItem
            variant="destructive"
            className="shrink-0 px-2"
            aria-label={deleteLabel}
            onSelect={(event) => {
              event.preventDefault();
              onDelete({ id: show.id, label });
            }}
          >
            <Trash2 aria-hidden className="size-3.5" />
          </DropdownMenuItem>
        </IconButtonTooltip>
      ) : null}
    </DropdownMenuGroup>
  );
}

export function ShowSwitcher() {
  const { t } = useTranslation();
  const announce = useA11yAnnounceStore((state) => state.announce);
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

  const maxShowsHintId = useId();
  const currentLabel = formatShowDisplayName(showName);
  const { currentAndUpcoming, past } = partitionShowsByShowDate(shows);
  const canCreate = canAddShow(shows.length);
  const canDelete = shows.length > 1;
  const hasPastSection = past.length > 0;
  const upcomingLabel = hasPastSection
    ? t('workspace.upcomingShows')
    : t('workspace.savedShows');

  const handleSwitchShow = (id: ShowId) => {
    const show = shows.find((item) => item.id === id);
    switchShow(id);
    if (show) {
      announce(
        t('a11y.switchedShow', {
          label: formatShowMenuLabel(show.showName, show.showDate),
        }),
      );
    }
  };

  const handleCreateShow = () => {
    createShow();
    const { showName: nextName, showDate: nextDate } = useAppStore.getState();
    announce(
      t('a11y.createdShow', {
        label: formatShowMenuLabel(nextName, nextDate),
      }),
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="max-w-56 min-w-0 shrink justify-between gap-2 font-heading font-semibold tracking-tight"
            aria-label={t('header.switchShowNamed', { label: currentLabel })}
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
                  onSwitch={handleSwitchShow}
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
                  onSwitch={handleSwitchShow}
                  onDelete={setDeleteTarget}
                />
              ))}
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!canCreate}
            title={t('workspace.newShowItemTitle')}
            aria-describedby={!canCreate ? maxShowsHintId : undefined}
            onSelect={handleCreateShow}
          >
            <Plus aria-hidden className="size-4" />
            {t('workspace.newShow')}
            {!canCreate ? (
              <>
                {` (${INPUT_LIMITS.maxShows})`}
                <span id={maxShowsHintId} className="sr-only">
                  {t('workspace.newShowMaxShows', {
                    max: INPUT_LIMITS.maxShows,
                  })}
                </span>
              </>
            ) : null}
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

          const { label } = deleteTarget;
          deleteShow(deleteTarget.id);
          announce(t('a11y.deletedShow', { label }));
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
