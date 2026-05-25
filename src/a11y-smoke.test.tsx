// @vitest-environment jsdom

import '@/i18n';
import '@/index.css';

import { render } from '@testing-library/react';
import { Clapperboard } from 'lucide-react';
import type React from 'react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { DeletePersonDialog } from '@/components/roster/DeletePersonDialog';
import { DeleteShowDialog } from '@/components/layout/DeleteShowDialog';
import { ShareConfirmDialog } from '@/components/layout/ShareConfirmDialog';
import { SkipLink } from '@/components/layout/SkipLink';
import { DesktopDndProvider } from '@/components/dnd/desktop-dnd-context';
import { DragPreviewChip } from '@/components/dnd/DragPreviewChip';
import { PersonRow } from '@/components/roster/PersonRow';
import { RosterQuickAdd } from '@/components/roster/RosterQuickAdd';
import { PersonAssignSelect } from '@/components/running-order/PersonAssignSelect';
import { SceneQuickAdd } from '@/components/running-order/SceneQuickAdd';
import { CastSlot } from '@/components/shared/CastSlot';
import { EmptyState } from '@/components/shared/EmptyState';
import { RenameDialog } from '@/components/shared/RenameDialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/store/useAppStore';
import type { Person } from '@/types/app';

const testPerson: Person = {
  id: 'person-test',
  name: 'Alex',
  isAbsent: false,
  isDeleted: false,
};

function renderWithUiProviders(ui: React.ReactNode) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

function renderPersonRow(person: Person = testPerson) {
  useAppStore.setState({ persons: [person], scenes: [] });

  return renderWithUiProviders(
    <DesktopDndProvider value={false}>
      <ul>
        <PersonRow person={person} />
      </ul>
    </DesktopDndProvider>,
  );
}

describe('accessibility smoke tests', () => {
  it('RosterQuickAdd has no axe violations', async () => {
    const { container } = render(<RosterQuickAdd />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('SceneQuickAdd has no axe violations', async () => {
    const { container } = render(<SceneQuickAdd />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('SkipLink has no axe violations', async () => {
    const { container } = render(<SkipLink />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('EmptyState has no axe violations', async () => {
    const { container } = render(
      <EmptyState
        icon={<Clapperboard aria-hidden className="size-4" />}
        title="No scenes yet"
        description="Add a scene to build your lineup."
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('RenameDialog has no axe violations when open', async () => {
    const { container } = render(
      <RenameDialog
        open
        onOpenChange={() => undefined}
        currentName="Opening Game"
        onConfirm={() => undefined}
        title="Rename scene"
        description="Enter a new name for this scene."
        inputLabel="Scene name"
        fieldName="sceneName"
        maxLength={80}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('DeleteShowDialog has no axe violations when open', async () => {
    const { container } = render(
      <DeleteShowDialog
        open
        onOpenChange={() => undefined}
        label="Friday Show"
        onConfirm={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('DeletePersonDialog has no axe violations when open', async () => {
    const { container } = render(
      <DeletePersonDialog
        open
        onOpenChange={() => undefined}
        personName="Alex"
        hasSceneAssignments
        onHardDelete={() => undefined}
        onDeleteWithMode={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ShareConfirmDialog has no axe violations when open', async () => {
    const { container } = render(
      <ShareConfirmDialog
        open
        onOpenChange={() => undefined}
        onConfirm={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('PersonAssignSelect has no axe violations', async () => {
    const { container } = renderWithUiProviders(
      <PersonAssignSelect
        label="Assign host"
        persons={[testPerson]}
        onAssign={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('PersonRow has no axe violations', async () => {
    const { container } = renderPersonRow();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('DragPreviewChip has no axe violations', async () => {
    const { container } = render(<DragPreviewChip label="Alex" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('CastSlot has no axe violations in light and dark themes', async () => {
    for (const castRole of ['host', 'player'] as const) {
      const slot = (
        <CastSlot
          personId="person-1"
          name="Alex"
          castRole={castRole}
          isWarning={false}
          inline
          onRemove={() => undefined}
        />
      );

      const { container: lightContainer } = renderWithUiProviders(slot);
      expect(await axe(lightContainer)).toHaveNoViolations();

      const { container: darkContainer } = renderWithUiProviders(
        <div className="dark">{slot}</div>,
      );
      expect(await axe(darkContainer)).toHaveNoViolations();
    }
  });
});
