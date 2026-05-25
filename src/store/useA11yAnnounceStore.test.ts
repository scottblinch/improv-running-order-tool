import { describe, expect, it } from 'vitest';

import { useA11yAnnounceStore } from '@/store/useA11yAnnounceStore';

async function flushAnnounce() {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
}

describe('useA11yAnnounceStore', () => {
  it('clears then sets the message so identical text re-announces', async () => {
    useA11yAnnounceStore.setState({ message: '' });

    useA11yAnnounceStore.getState().announce('Moved scene');
    expect(useA11yAnnounceStore.getState().message).toBe('');

    await flushAnnounce();
    expect(useA11yAnnounceStore.getState().message).toBe('Moved scene');

    useA11yAnnounceStore.getState().announce('Moved scene');
    expect(useA11yAnnounceStore.getState().message).toBe('');

    await flushAnnounce();
    expect(useA11yAnnounceStore.getState().message).toBe('Moved scene');
  });
});
