<script lang="ts" setup>
import { config } from '@/config';
import Script from '@/components/Script.vue';
import { useConsent } from '@/composable/useConsent';
import { computed } from 'vue';

const { consentState } = useConsent();

const websiteId = config.umamiAnalytics.websiteId;
const scriptUrl = config.umamiAnalytics.scriptUrl;

// Only show Umami analytics when user consents
const showUmami = computed(() => {
  return websiteId && consentState.value.analytics;
});
</script>

<template>
  <Script
    v-if="showUmami"
    :async="true"
    :data="{ 'website-id': websiteId }"
    :defer="true"
    :src="scriptUrl"
  />
</template>
