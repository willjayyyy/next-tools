<script lang="ts" setup>
import { config } from '@/config';
import { addGtag, configure, consent } from 'vue-gtag';
import { useConsentStore } from '@/stores/consent.store';
import { watch } from 'vue';
import { whenever } from '@vueuse/core';

const consentStore = useConsentStore();
const id = config.googleAnalytics.id;

if (id) {
  const getConsentParams = () => ({
    ad_storage: consentStore.consentState.marketing ? 'granted' as const : 'denied' as const,
    analytics_storage: consentStore.consentState.analytics ? 'granted' as const : 'denied' as const,
  });

  whenever(() => consentStore.consentState.analytics === true, () => {
    configure({
      tagId: id,
      initMode: 'manual',
    });
    consent('default', getConsentParams());
    void addGtag();
    watch(
      getConsentParams,
      params => consent('update', params),
    );
  }, {
    immediate: true,
    once: true
  });
}
</script>
