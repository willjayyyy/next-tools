// @vitest-environment jsdom

import { createApp, nextTick, reactive } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const configure = vi.fn();
const addGtag = vi.fn();
const consent = vi.fn();

let consentStore: {
  consentState: {
    analytics?: boolean;
    marketing?: boolean;
  };
};
let app: ReturnType<typeof createApp> | undefined;

const mount = async () => {
  const { default: GoogleAnalytics } = await import('./GoogleAnalytics.vue');
  app = createApp(GoogleAnalytics);
  app.mount(document.createElement('div'));
};

describe('google analytics consent', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    consentStore = reactive({ consentState: {} });
    vi.doMock('@/config', () => ({
      config: { googleAnalytics: { id: 'G-TEST' } },
    }));
    vi.doMock('@/stores/consent.store', () => ({
      useConsentStore: () => consentStore,
    }));
    vi.doMock('vue-gtag', () => ({ configure, addGtag, consent }));
  });

  afterEach(() => app?.unmount());

  it('loads once after analytics is allowed and keeps consent mapping current', async () => {
    await mount();
    expect(addGtag).not.toHaveBeenCalled();

    consentStore.consentState = { analytics: true, marketing: false };
    await nextTick();

    expect(configure).toHaveBeenCalledWith({
      tagId: 'G-TEST',
      initMode: 'manual',
    });
    expect(consent).toHaveBeenNthCalledWith(1, 'default', {
      ad_storage: 'denied',
      analytics_storage: 'granted',
    });
    expect(addGtag).toHaveBeenCalledOnce();

    consentStore.consentState = { analytics: false, marketing: false };
    await nextTick();

    expect(consent).toHaveBeenNthCalledWith(2, 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
    expect(addGtag).toHaveBeenCalledOnce();
  });

  it('does not load when analytics is denied', async () => {
    consentStore.consentState = { analytics: false, marketing: false };
    await mount();

    expect(configure).not.toHaveBeenCalled();
    expect(consent).not.toHaveBeenCalled();
    expect(addGtag).not.toHaveBeenCalled();
  });
});
