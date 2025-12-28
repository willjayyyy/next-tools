<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { RouterView, useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';

import { Toaster } from '@/components/ui/sonner';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';

const route = useRoute();
const layout = computed(() => route?.meta?.layout ?? layouts.base);
const styleStore = useStyleStore();

const customPrimaryHsl = useStorage<string | null>('custom-primary-hsl', null);
const themeClass = computed(() => (styleStore.isDarkTheme ? 'dark' : ''));
const themeVars = computed(() =>
  customPrimaryHsl.value
    ? {
        '--primary': customPrimaryHsl.value,
        '--sidebar-primary': customPrimaryHsl.value,
        '--sidebar-ring': customPrimaryHsl.value,
        '--ring': customPrimaryHsl.value,
      }
    : {},
);

const { locale } = useI18n();
const { language } = useNavigatorLanguage();

const origin = computed(() => {
  if (window) {
    return new URL('/', window.location.href).origin;
  }

  return '';
});

useHead(() => ({
  meta: [
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: `${origin.value}/android-chrome-512x512.png`,
    },
    {
      property: 'og:image:width',
      content: '512',
    },
    {
      property: 'og:image:height',
      content: '512',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: '@willjayyy',
    },
    {
      name: 'twitter:creator',
      content: '@willjayyy',
    },
    {
      name: 'twitter:image',
      content: `${origin.value}/android-chrome-512x512.png`,
    },
  ],
}));

syncRef(useStorage('locale', language.value?.split?.('-')?.[0] ?? 'en'), locale, {
  transform: {
    ltr: (value: string) => value,
    rtl: (value: string) => value,
  },
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground" :class="[themeClass]" :style="themeVars">
    <component :is="layout">
      <RouterView />
    </component>

    <Toaster />
  </div>
</template>
