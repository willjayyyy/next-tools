// @vitest-environment jsdom

import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const loadStore = async (consentEnabled: boolean) => {
  vi.doMock('@/config', () => ({
    config: {
      vercelAnalytics: { enabled: false },
      vercelSpeedInsights: { enabled: false },
      googleAnalytics: { id: 'G-TEST' },
      umamiAnalytics: { websiteId: '' },
      consent: { enabled: consentEnabled, strict: false },
    },
  }));

  const { useConsentStore } = await import('./consent.store');
  setActivePinia(createPinia());
  return useConsentStore();
};

describe('analytics consent region gate', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
  });

  it('blocks stale consent until region detection completes', async () => {
    localStorage.setItem('consent-state', JSON.stringify({
      essential: true,
      analytics: true,
      timestamp: Date.now(),
      version: 1,
      expiresAt: Date.now() + 86_400_000,
    }));

    const store = await loadStore(true);

    expect(store.consentState.analytics).toBeUndefined();
  });

  it('treats disabled consent management as not requiring consent', async () => {
    const store = await loadStore(false);

    expect(store.consentState.analytics).toBe(true);
  });
});
