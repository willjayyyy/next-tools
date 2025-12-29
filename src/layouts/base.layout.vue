<script lang="ts" setup>
import type { ToolCategory } from '@/tools/tools.types'
import { Home, Star, Wrench } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { RouterLink, useRoute } from 'vue-router'
import NavbarButtons from '@/components/NavbarButtons.vue'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { config } from '@/config'
import { useStyleStore } from '@/stores/style.store'
import { useToolStore } from '@/tools/tools.store'

const styleStore = useStyleStore();
const version = config.app.version;

const { t } = useI18n();
const route = useRoute();

const toolStore = useToolStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);

const tools = computed<ToolCategory[]>(() => [
  ...(favoriteTools.value.length > 0
    ? [{ name: t('tools.categories.favorite-tools'), components: favoriteTools.value }]
    : []),
  ...toolsByCategory.value,
]);
</script>

<template>
  <SidebarProvider
    :open="!styleStore.isMenuCollapsed"
    class="bg-background text-foreground"
    @update:open="(val) => (styleStore.isMenuCollapsed = !val)"
  >
    <Sidebar collapsible="icon" class="border-r bg-sidebar text-sidebar-foreground">
      <SidebarHeader class="px-4 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2">
        <RouterLink
          to="/"
          class="group-data-[collapsible=icon]:bg-primary/10 transition-all duration-200 block rounded-xl border bg-background px-6 py-5 text-center shadow-sm hover:border-primary/60 group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-1.5 overflow-hidden"
        >
          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:bg-transparent"
          >
            <Wrench class="h-6 w-6 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
          </div>
          <div class="mt-3 text-lg font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            Next - Tools
          </div>
          <div
            class="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground group-data-[collapsible=icon]:hidden"
          >
            {{ $t('home.subtitle') }}
          </div>
        </RouterLink>
      </SidebarHeader>

      <SidebarContent class="space-y-4 px-4 pb-4 group-data-[collapsible=icon]:px-2">
        <ScrollArea
          class="flex-1 rounded-2xl border bg-background p-2.5 shadow-sm group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:rounded-lg overflow-hidden"
        >
          <SidebarMenu class="gap-3 group-data-[collapsible=icon]:gap-1">
            <SidebarGroup
              v-for="category in tools"
              :key="category.name"
              class="p-0 rounded-xl group-data-[collapsible=icon]:bg-transparent"
            >
              <SidebarGroupLabel
                class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                <!-- <Wrench class="h-4 w-4 text-primary" /> -->
                <span class="truncate">{{ category.name }}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent
                class="mt-1.5 px-1 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:px-0"
              >
                <SidebarMenu class="gap-1.5 group-data-[collapsible=icon]:gap-0">
                  <SidebarMenuItem v-for="tool in category.components" :key="tool.path">
                    <RouterLink v-slot="{ navigate, isActive }" :to="tool.path" custom>
                      <SidebarMenuButton
                        :tooltip="tool.name"
                        :is-active="isActive || route.path === tool.path"
                        variant="default"
                        class="w-full justify-start rounded-lg px-3 py-2.5 text-sm transition-colors border-0 text-foreground/85 hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary focus-visible:ring-2 focus-visible:ring-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:h-9! group-data-[collapsible=icon]:w-9!"
                        @click="navigate"
                      >
                        <component
                          :is="tool.icon"
                          class="h-5 w-5 text-muted-foreground transition-colors data-[active=true]:text-accent-foreground"
                        />
                        <span
                          class="truncate font-medium text-foreground/90 transition-colors data-[active=true]:text-accent-foreground group-data-[collapsible=icon]:hidden"
                        >{{ tool.name }}</span>
                        <Star
                          v-if="favoriteTools.some((f) => f.path === tool.path)"
                          class="ml-auto h-4 w-4 text-amber-500 group-data-[collapsible=icon]:hidden"
                        />
                      </SidebarMenuButton>
                    </RouterLink>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter
        class="px-3 py-4 pt-0 text-center text-xs text-muted-foreground group-data-[collapsible=icon]:hidden"
      >
        <div class="space-x-1">
          <span>NEXT-Tools</span>
          <Button
            as="a"
            variant="link"
            class="p-0 h-auto text-xs"
            target="_blank"
            rel="noopener"
            :href="`https://github.com/willjayyyy/next-tools/tree/v${version}`"
          >
            v{{ version }}
          </Button>
        </div>
        <div class="mt-0.5">
          © {{ new Date().getFullYear() }}
          <Button
            as="a"
            variant="link"
            class="p-0 text-xs h-auto"
            target="_blank"
            rel="noopener"
            href="https://github.com/willjayyyy"
          >
            Will Jay
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>

    <SidebarInset class="h-screen flex flex-col">
      <header class="border-b shrink-0">
        <div class="flex h-14 items-center gap-3 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" class="mx-1 hidden h-6 md:block" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <RouterLink to="/">
                  <Button variant="ghost" size="icon" aria-label="home" class="border border-transparent">
                    <Home class="h-5 w-5" />
                  </Button>
                </RouterLink>
              </TooltipTrigger>
              <TooltipContent>{{ $t('home.home') }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <command-palette />

          <div class="ml-auto flex items-center gap-2">
            <locale-selector v-if="!styleStore.isSmallScreen" />
            <NavbarButtons v-if="!styleStore.isSmallScreen" />

            <!-- <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    as="a"
            href="https://www.buymeacoffee.com/willjayyy"
            rel="noopener"
            target="_blank"
                    variant="outline"
                    class="gap-2 border-border/80 bg-primary/5 text-primary hover:bg-primary/10"
            @click="() => tracker.trackEvent({ eventName: 'Support button clicked' })"
          >
            {{ $t('home.buyMeACoffee') }}
                    <Heart v-if="!styleStore.isSmallScreen" class="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ $t('home.support') }}</TooltipContent>
              </Tooltip>
            </TooltipProvider> -->
          </div>
        </div>
      </header>

      <main class="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea class="h-full">
          <slot />
        </ScrollArea>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
