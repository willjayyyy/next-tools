import type { MaybeRef, Ref } from 'vue';
import type { Tool, ToolCategory, ToolWithCategory } from './tools.types';
import { get, useStorage } from '@vueuse/core';
import { chain, uniq } from 'lodash';
import { defineStore } from 'pinia';
import { toolsWithCategory } from './index'

export const useToolStore = defineStore('tools', () => {
  const favoriteToolsName = useStorage('favorite-tools-name', []) as Ref<string[]>
  const recentToolsKeys = useStorage('recent-tools-keys', []) as Ref<string[]>
  const { t } = useI18n()

  const tools = computed<ToolWithCategory[]>(() => toolsWithCategory.map((tool) => {
    return ({
      ...tool,
      path: tool.path,
      name: toValue(tool.name),
      description: toValue(tool.description),
      category: t(`tools.categories.${tool.category.toLowerCase()}`, tool.category),
    })
  }))

  const toolsByCategory = computed<ToolCategory[]>(() => {
    return chain(tools.value)
      .groupBy('category')
      .map((components, name, path) => ({
        name,
        path,
        components,
      }))
      .value()
  });

  const favoriteTools = computed(() => {
    return favoriteToolsName.value
      .map(favoriteName => tools.value.find(({ key, path }) => key === favoriteName || path === favoriteName))
      .filter(Boolean) as ToolWithCategory[] // cast because .filter(Boolean) does not remove undefined from type
  });

  const recentTools = computed(() => {
    return recentToolsKeys.value
      .map(recentKey => tools.value.find(tool => tool.key === recentKey))
      .filter(Boolean) as ToolWithCategory[]
  });

  return {
    tools,
    favoriteTools,
    recentTools,
    toolsByCategory,

    addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      const toolPath = get(tool).path
      if (toolPath) {
        favoriteToolsName.value.push(toolPath)
      }
    },

    removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      favoriteToolsName.value = favoriteToolsName.value.filter(name => get(tool).name !== name && get(tool).path !== name)
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      return favoriteToolsName.value.includes(toValue(tool).key)
        || favoriteToolsName.value.includes(get(tool).path)
    },

    updateFavoriteTools(newOrder: ToolWithCategory[]) {
      favoriteToolsName.value = newOrder.map(tool => tool.path)
    },

    recordToolVisit(toolKey: string) {
      const maxRecentTools = 10
      // remove existing record and limit the number of recent tools
      recentToolsKeys.value = uniq([toolKey, ...recentToolsKeys.value]).slice(0, maxRecentTools)
    },
  }
});
