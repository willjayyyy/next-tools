<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { GripVertical, Heart, Wrench } from 'lucide-vue-next'
import { computed } from 'vue'
import Draggable from 'vuedraggable'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToolStore } from '@/tools/tools.store'
import ToolCard from '../components/ToolCard.vue'

const toolStore = useToolStore();
const { t } = useI18n();

useHead({
  title: t('home.title'),
  meta: [
    {
      name: 'description',
      content: t('home.description'),
    },
    {
      property: 'og:title',
      content: t('home.title'),
    },
    {
      property: 'og:description',
      content: t('home.description'),
    },
    {
      name: 'twitter:title',
      content: t('home.title'),
    },
    {
      name: 'twitter:description',
      content: t('home.description'),
    },
  ],
});

const favoriteTools = computed(() => toolStore.favoriteTools);

function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}
</script>

<template>
  <div class="bg-linear-to-br from-background via-background to-muted/20">
    <div class="container mx-auto px-4 py-12">
      <!-- Tools Grid Container -->
      <div class="space-y-12">
        <!-- Favorite Tools Section -->
        <transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 transform translate-y-4"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform -translate-y-4"
        >
          <div v-if="toolStore.favoriteTools.length > 0" class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-3">
                <Heart class="h-6 w-6 text-red-500" />
                <h2 class="text-2xl font-semibold text-foreground">
                  {{ t('home.categories.favoriteTools') }}
                </h2>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <GripVertical class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  {{ t('home.categories.favoritesDndToolTip') }}
                </TooltipContent>
              </Tooltip>
            </div>

            <Draggable
              :list="favoriteTools"
              class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              ghost-class="ghost-favorites-draggable"
              item-key="name"
              @end="onUpdateFavoriteTools"
            >
              <template #item="{ element: tool }">
                <ToolCard :tool="tool" />
              </template>
            </Draggable>

            <Separator class="my-8" />
          </div>
        </transition>

        <!-- All Tools Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <Wrench class="h-6 w-6 text-primary" />
            <h2 class="text-2xl font-semibold text-foreground">
              {{ t('home.categories.allTools') }}
            </h2>
            <Badge variant="outline" class="ml-2">
              {{ toolStore.tools.length }}
            </Badge>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <template
              v-for="tool in toolStore.tools"
              :key="tool.key"
            >
              <ToolCard :tool="tool" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
