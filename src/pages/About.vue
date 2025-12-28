<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import {
  Code,
  Coffee,
  ExternalLink,
  Github,
  Heart,
  Link,
  Star,
  Users,
  Wrench,
} from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Markdown from '../components/Markdown.vue';

const { t } = useI18n()

useHead({
  title: t('about.title'),
  meta: [
    {
      name: 'description',
      content: t('about.description'),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-5" />
      <div class="container mx-auto px-4 pt-20 pb-10 relative">
        <div class="text-center max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-6">
            <Wrench class="h-8 w-8 text-primary" />
            <h1 class="text-4xl md:text-6xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {{ $t('about.title') }}
            </h1>
          </div>

          <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ $t('home.description', 'Handy online tools for developers and designers') }}
          </p>

          <div class="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" class="px-3 py-1">
              <Code class="h-3 w-3 mr-1" />
              {{ $t('about.badges.openSource') }}
            </Badge>
            <Badge variant="secondary" class="px-3 py-1">
              <Users class="h-3 w-3 mr-1" />
              {{ $t('about.badges.developerFriendly') }}
            </Badge>
            <Badge variant="secondary" class="px-3 py-1">
              <Star class="h-3 w-3 mr-1" />
              {{ $t('about.badges.freeForever') }}
            </Badge>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 pb-16">
      <div class="max-w-4xl mx-auto space-y-12">
        <!-- About Content Card -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Heart class="h-5 w-5 text-red-500" />
              {{ $t('about.sections.aboutProject') }}
            </CardTitle>
          </CardHeader>
          <CardContent class="prose prose-gray dark:prose-invert max-w-none">
            <Markdown :markdown="$t('about.content')" />
          </CardContent>
        </Card>

        <!-- Support Section -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Coffee class="h-5 w-5 text-amber-600" />
              {{ $t('about.sections.supportProject') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground mb-6">
              {{ $t('about.support.description') }}
            </p>
            <div class="flex flex-wrap gap-4">
              <Button as-child variant="outline">
                <a href="https://github.com/willjayyyy/next-tools" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2">
                  <Github class="h-4 w-4" />
                  {{ $t('about.support.github') }}
                  <ExternalLink class="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Links -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Link class="h-5 w-5 text-blue-500" />
              {{ $t('about.sections.quickLinks') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button as-child variant="ghost" class="justify-start h-auto p-4">
                <router-link to="/" class="flex items-center gap-3 w-full">
                  <Wrench class="h-5 w-5 text-primary" />
                  <div class="text-left">
                    <div class="font-medium">
                      {{ $t('about.links.allTools.title') }}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {{ $t('about.links.allTools.description') }}
                    </div>
                  </div>
                </router-link>
              </Button>

              <Button as-child variant="ghost" class="justify-start h-auto p-4">
                <a href="https://github.com/willjayyyy/next-tools/issues" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 w-full">
                  <Star class="h-5 w-5 text-yellow-500" />
                  <div class="text-left">
                    <div class="font-medium">{{ $t('about.links.featureRequests.title') }}</div>
                    <div class="text-sm text-muted-foreground">{{ $t('about.links.featureRequests.description') }}</div>
                  </div>
                  <ExternalLink class="h-3 w-3 text-muted-foreground" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
