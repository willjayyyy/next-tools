<script lang="ts" setup>
import { config } from '@/config';
import { addGtag, configure,  consent } from 'vue-gtag';
import { useConsent } from '@/composable/useConsent';
import { watch } from 'vue';
import { isUndefined } from 'lodash';

const { consentState } = useConsent();
const id = config.googleAnalytics.id;

if (id) {
  const hasConsent = computed(() => {
    return !isUndefined(consentState.value.analytics) || !isUndefined(consentState.value.marketing);
  });

  const { stop } = whenever(hasConsent, () => {
    configure({
      tagId: id,
      config: {
        ad_storage: consentState.value.analytics ? 'granted' : 'denied',
        analytics_storage: consentState.value.marketing ? 'granted' : 'denied',
      },
    });
    stop();
    addGtag();
    watch(
      () => ({
        analytics: consentState.value.analytics,
        marketing: consentState.value.marketing,
      }),
      ({ analytics, marketing }) => {
        consent('update', {
          ad_storage: marketing ? 'granted' : 'denied',
          analytics_storage: analytics ? 'granted' : 'denied',
        });
      },
    );
  });
}
</script>
