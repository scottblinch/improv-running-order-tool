// @vitest-environment jsdom

import '@/i18n';
import '@/index.css';

import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as axeMatchers from 'vitest-axe/matchers';
import { describe, expect, it } from 'vitest';

import { RosterQuickAdd } from '@/components/roster/RosterQuickAdd';
import { SceneQuickAdd } from '@/components/running-order/SceneQuickAdd';
import { SkipLink } from '@/components/layout/SkipLink';

expect.extend(axeMatchers);

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
});
