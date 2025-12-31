<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue';
import { useConsent } from '@/composable/useConsent';

const ConsentBanner = defineAsyncComponent(() => import('./ConsentBanner.vue'));

const { needsConsent, hasConsentEnabled } = useConsent();

const showConsentModal = ref(false);

watch(
  needsConsent,
  (needs) => {
    showConsentModal.value = needs;
  },
  { immediate: true },
);
</script>

<template>
  <ConsentBanner v-if="hasConsentEnabled" v-model:open="showConsentModal" />
</template>
