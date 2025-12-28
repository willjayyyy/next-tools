import { chain, take } from 'lodash'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Bug, Github, Info, Sun, Moon } from 'lucide-vue-next'
import { useFuzzySearch } from '@/composable/fuzzySearch'
import { useStyleStore } from '@/stores/style.store'
import { useToolStore } from '@/tools/tools.store'

export const useCommandPaletteStore = defineStore('command-palette', () => {
  const { t } = useI18n();
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const searchPrompt = ref('');

  // Action options that are always shown
  const actionOptions = computed(() => [
    {
      name: t('commandPalette.actions.toggleDarkMode'),
      description: t('commandPalette.actions.toggleDarkModeDescription'),
      action: () => styleStore.toggleDark(),
      icon: styleStore.isDarkTheme ? Sun : Moon,
      category: t('commandPalette.categories.actions'),
      keywords: t('commandPalette.keywords.toggleDarkMode'),
    },
    {
      name: t('commandPalette.external.githubRepository'),
      href: 'https://github.com/willjayyyy/next-tools',
      category: t('commandPalette.categories.external'),
      description: t('commandPalette.external.githubRepositoryDescription'),
      keywords: t('commandPalette.keywords.githubRepository'),
      icon: Github,
    },
    {
      name: t('commandPalette.actions.reportBug'),
      description: t('commandPalette.actions.reportBugDescription'),
      href: 'https://github.com/willjayyyy/next-tools/issues/new/choose',
      category: t('commandPalette.categories.actions'),
      keywords: t('commandPalette.keywords.reportBug'),
      icon: Bug,
    },
    {
      name: t('commandPalette.pages.about'),
      description: t('commandPalette.pages.aboutDescription'),
      to: '/about',
      category: t('commandPalette.categories.pages'),
      keywords: t('commandPalette.keywords.about'),
      icon: Info,
    },
  ])

  const allToolsOptions = computed(() =>
    toolStore.tools.map(tool => ({
      ...tool,
      keywords: toValue(tool.keywords),
      name: toValue(tool.name),
      description: toValue(tool.description),
      to: tool.path,
      toolCategory: tool.category,
      category: t('commandPalette.categories.tools'),
    }))
  )

  const searchOptions = computed(() => {
    const isSearchEmpty = !searchPrompt.value.trim()

    if (isSearchEmpty) {
      // 搜索为空时：优先显示最近工具，如果没有则显示所有工具
      if (toolStore.recentTools.length > 0) {
        // 有最近工具时：只显示最近工具 + actions
        const recentToolsOptions = toolStore.recentTools.map(tool => ({
          ...tool,
          keywords: toValue(tool.keywords),
          name: toValue(tool.name),
          description: toValue(tool.description),
          to: tool.path,
          toolCategory: tool.category,
          category: t('commandPalette.categories.recentTools', 'Recent Tools'),
        }))

        return [...recentToolsOptions, ...actionOptions.value]
      } else {
        // 没有最近工具时：显示所有工具（按分类分组）+ actions
        return [...allToolsOptions.value, ...actionOptions.value]
      }
    } else {
      // 有搜索内容时：只显示所有工具（按分类分组）+ actions
      return [...allToolsOptions.value, ...actionOptions.value]
    }
  })

  const { searchResult } = useFuzzySearch({
    search: searchPrompt,
    data: searchOptions,
    options: {
      keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
      threshold: 0.3,
      filterEmpty: false,
    },
  });

  const filteredSearchResult = computed(() =>
    chain(searchResult.value).groupBy('category').mapValues(categoryOptions => take(categoryOptions, 5)).value());

  return {
    filteredSearchResult,
    searchOptions,
    searchPrompt,
  };
})
