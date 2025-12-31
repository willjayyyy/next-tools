<script setup lang="ts">
import type { UserAgentResultSection } from './user-agent-parser.types';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import { ShieldCheck } from 'lucide-vue-next';

import { UAParser } from 'ua-parser-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldGroup } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { useCopy } from '@/composable/copy';
import { useToolI18n } from '@/composable/useToolI18n';
import { withDefaultOnError } from '@/utils/defaults';
import UserAgentResultCards from './user-agent-result-cards.vue';

const { t } = useToolI18n()
const currentBrowserUa = typeof navigator !== 'undefined' ? (navigator.userAgent as string) : ''
const ua = ref(currentBrowserUa)

const { copy: copyUa } = useCopy({
  source: ua,
})

// If not input in the ua field is present return an empty object of type UAParser.IResult because otherwise
// UAParser returns the values for the current Browser. This is confusing because results are shown for an empty
// UA field value.
function getUserAgentInfo(userAgent: string) {
  return userAgent.trim().length > 0
    ? UAParser(userAgent.trim())
    : ({ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } as UAParser.IResult)
}
const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), undefined))

const sections = computed<UserAgentResultSection[]>(() => [
  {
    heading: t('tools.user-agent-parser.browser'),
    icon: Browser,
    content: [
      {
        label: t('tools.user-agent-parser.name'),
        getValue: block => block?.browser.name,
        undefinedFallback: t('tools.user-agent-parser.noBrowserName'),
      },
      {
        label: t('tools.user-agent-parser.version'),
        getValue: block => block?.browser.version,
        undefinedFallback: t('tools.user-agent-parser.noBrowserVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.engine'),
    icon: Engine,
    content: [
      {
        label: t('tools.user-agent-parser.name'),
        getValue: block => block?.engine.name,
        undefinedFallback: t('tools.user-agent-parser.noEngineName'),
      },
      {
        label: t('tools.user-agent-parser.version'),
        getValue: block => block?.engine.version,
        undefinedFallback: t('tools.user-agent-parser.noEngineVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.os'),
    icon: Adjustments,
    content: [
      {
        label: t('tools.user-agent-parser.name'),
        getValue: block => block?.os.name,
        undefinedFallback: t('tools.user-agent-parser.noOsName'),
      },
      {
        label: t('tools.user-agent-parser.version'),
        getValue: block => block?.os.version,
        undefinedFallback: t('tools.user-agent-parser.noOsVersion'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.device'),
    icon: Devices,
    content: [
      {
        label: t('tools.user-agent-parser.model'),
        getValue: block => block?.device.model,
        undefinedFallback: t('tools.user-agent-parser.noDeviceModel'),
      },
      {
        label: t('tools.user-agent-parser.type'),
        getValue: block => block?.device.type,
        undefinedFallback: t('tools.user-agent-parser.noDeviceType'),
      },
      {
        label: t('tools.user-agent-parser.vendor'),
        getValue: block => block?.device.vendor,
        undefinedFallback: t('tools.user-agent-parser.noDeviceVendor'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.cpu'),
    icon: Cpu,
    content: [
      {
        label: t('tools.user-agent-parser.architecture'),
        getValue: block => block?.cpu.architecture,
        undefinedFallback: t('tools.user-agent-parser.noCpuArch'),
      },
    ],
  },
])

function useCurrentUa() {
  ua.value = currentBrowserUa;
}

function clearUa() {
  ua.value = '';
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <ShieldCheck class="h-5 w-5 text-primary" />
            {{ t('tools.user-agent-parser.cardInputTitle', 'User agent input') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.user-agent-parser.cardInputDescription',
                'Paste or edit a user agent string to see parsed browser, device, OS and CPU details.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="space-y-3">
        <FieldGroup>
          <Field>
            <div class="flex items-center justify-between gap-2">
              <div class="flex gap-2">
                <Button variant="outline" size="sm" class="h-7 px-2 text-xs" :disabled="!ua" @click="copyUa">
                  {{ t('tools.user-agent-parser.copyUa', 'Copy UA') }}
                </Button>
                <Button variant="outline" size="sm" class="h-7 px-2 text-xs" :disabled="!ua" @click="clearUa">
                  {{ t('common.clear', 'Clear') }}
                </Button>
              </div>
            </div>
            <FieldContent class="mt-2">
              <Textarea
                v-model="ua"
                :placeholder="t('tools.user-agent-parser.inputPlaceholder')"
                rows="3"
                class="max-h-96 resize-y overflow-y-auto font-mono break-all"
              />
            </FieldContent>
          </Field>
        </FieldGroup>

        <div class="rounded-md border bg-muted/40 p-3 text-xs font-mono text-muted-foreground">
          <div class="mb-1 flex items-center justify-between gap-2">
            <span class="font-medium">
              {{ t('tools.user-agent-parser.currentUaLabel', 'Current browser UA') }}
            </span>
            <Button variant="ghost" size="sm" class="h-6 px-2 text-xs" @click="useCurrentUa">
              {{ t('tools.user-agent-parser.useCurrentUa', 'Use current UA') }}
            </Button>
          </div>
          <p class="line-clamp-4 break-all">
            {{ currentBrowserUa || '-' }}
          </p>
        </div>
      </CardContent>
    </Card>

    <Card class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <ShieldCheck class="h-5 w-5 text-primary" />
            {{ t('tools.user-agent-parser.cardOutputTitle', 'Parsed details') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.user-agent-parser.cardOutputDescription',
                'Each section shows values extracted from the user agent string.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <UserAgentResultCards :user-agent-info="userAgentInfo" :sections="sections" />
      </CardContent>
    </Card>
  </div>
</template>
