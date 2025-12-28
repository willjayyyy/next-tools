<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { FileQuestion } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

const { t } = useI18n()

useHead({
  title: t('404.title'),
  meta: [
    {
      name: 'description',
      content: t('404.description'),
    },
    // Open Graph (Facebook, 微信等)
    {
      property: 'og:title',
      content: t('404.title'),
    },
    {
      property: 'og:description',
      content: t('404.description'),
    },
    {
      property: 'og:image',
      content: '/android-chrome-512x512.png',
    },
    // Twitter Card
    {
      name: 'twitter:title',
      content: t('404.title'),
    },
    {
      name: 'twitter:description',
      content: t('404.description'),
    },
    {
      name: 'twitter:image',
      content: '/android-chrome-512x512.png',
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
    <Empty class="max-w-md mx-auto">
      <EmptyMedia variant="icon">
        <FileQuestion />
      </EmptyMedia>

      <EmptyTitle>
        {{ $t('404.notFound') }}
      </EmptyTitle>

      <EmptyDescription>
        <p>{{ $t('404.sorry') }}</p>
        <p>{{ $t('404.maybe') }}</p>
      </EmptyDescription>

      <EmptyContent>
        <Button as-child>
          <router-link to="/">
            {{ $t('404.backHome') }}
          </router-link>
        </Button>
      </EmptyContent>
    </Empty>
  </div>
</template>
