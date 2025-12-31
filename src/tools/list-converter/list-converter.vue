<script setup lang="ts">
import type { ConvertOptions } from './list-converter.types';
import { useStorage } from '@vueuse/core';
import { ArrowRight, Copy, Settings, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopy } from '@/composable/copy';
import { useToolI18n } from '@/composable/useToolI18n';
import { convert } from './list-converter.models';

const { t } = useToolI18n()
const sortOrderOptions = computed(() => [
  {
    label: t('tools.list-converter.sortAscending'),
    value: 'asc',
    disabled: false,
  },
  {
    label: t('tools.list-converter.sortDescending'),
    value: 'desc',
    disabled: false,
  },
])

const conversionConfig = useStorage<ConvertOptions>('list-converter:conversionConfig', {
  lowerCase: false,
  trimItems: true,
  removeDuplicates: true,
  keepLineBreaks: false,
  itemPrefix: '',
  itemSuffix: '',
  listPrefix: '',
  listSuffix: '',
  reverseList: false,
  sortList: null,
  separator: ', ',
})

const input = ref('')
const output = computed(() => {
  if (!input.value.trim()) { return '' }
  return convert(input.value, conversionConfig.value)
});

const { copy, isJustCopied } = useCopy({
  source: computed(() => output.value),
})
const tooltipText = computed(() =>
  isJustCopied.value
    ? t('common.copied', 'Copied!')
    : t('common.copyToClipboard', 'Copy to clipboard'),
)

function clearInput() {
  input.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <Card class="min-w-0">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Settings class="h-5 w-5 text-primary" />
            {{ t('tools.list-converter.configTitle', 'Configuration') }}
          </CardTitle>
          <CardDescription>
            {{ t('tools.list-converter.configDescription', 'Configure conversion options like trimming, sorting, formatting, and separators.') }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="space-y-6 min-w-0">
        <!-- Switch Options (Top Section) -->
        <FieldGroup class="min-w-0">
          <Field orientation="vertical" class="min-w-0">
            <FieldLabel class="text-sm font-medium">
              {{ t('tools.list-converter.characterTypes', 'Options') }}
            </FieldLabel>
            <FieldContent>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium">{{ t('tools.list-converter.trimListItems') }}</span>
                    <span v-if="t('tools.list-converter.trimListItemsHelp')" class="text-xs text-muted-foreground">
                      {{ t('tools.list-converter.trimListItemsHelp') }}
                    </span>
                  </div>
                  <Switch v-model="conversionConfig.trimItems" />
                </div>

                <div class="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium">{{ t('tools.list-converter.removeDuplicates') }}</span>
                    <span v-if="t('tools.list-converter.removeDuplicatesHelp')" class="text-xs text-muted-foreground">
                      {{ t('tools.list-converter.removeDuplicatesHelp') }}
                    </span>
                  </div>
                  <Switch v-model="conversionConfig.removeDuplicates" data-test-id="removeDuplicates" />
                </div>

                <div class="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium">{{ t('tools.list-converter.convertToLowercase') }}</span>
                  </div>
                  <Switch v-model="conversionConfig.lowerCase" />
                </div>

                <div class="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium">{{ t('tools.list-converter.keepLineBreaks') }}</span>
                  </div>
                  <Switch v-model="conversionConfig.keepLineBreaks" />
                </div>
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>

        <Separator />

        <!-- Other Options (Bottom Section) -->
        <FieldGroup class="min-w-0">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field orientation="vertical" class="min-w-0">
              <FieldLabel class="text-sm font-medium">
                {{ t('tools.list-converter.sortList') }}
              </FieldLabel>
              <FieldContent class="mt-2">
                <Select
                  :model-value="conversionConfig.sortList"
                  :disabled="conversionConfig.reverseList"
                  @update:model-value="value => conversionConfig.sortList = (value as 'asc' | 'desc' | null)"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue :placeholder="t('tools.list-converter.sortAlphabetically')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="opt in sortOrderOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field orientation="vertical" class="min-w-0">
              <FieldLabel class="text-sm font-medium" for="separator">
                {{ t('tools.list-converter.separator') }}
              </FieldLabel>
              <FieldContent class="mt-2">
                <Input
                  id="separator"
                  v-model="conversionConfig.separator"
                  placeholder=","
                  class="w-full"
                />
              </FieldContent>
            </Field>

            <Field orientation="vertical" class="min-w-0">
              <FieldLabel class="text-sm font-medium">
                {{ t('tools.list-converter.wrapItem') }}
              </FieldLabel>
              <FieldContent class="mt-2">
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    v-model="conversionConfig.itemPrefix"
                    :placeholder="t('tools.list-converter.itemPrefix')"
                    data-test-id="itemPrefix"
                    class="w-full"
                  />
                  <Input
                    v-model="conversionConfig.itemSuffix"
                    :placeholder="t('tools.list-converter.itemSuffix')"
                    data-test-id="itemSuffix"
                    class="w-full"
                  />
                </div>
              </FieldContent>
            </Field>

            <Field orientation="vertical" class="min-w-0">
              <FieldLabel class="text-sm font-medium">
                {{ t('tools.list-converter.wrapList') }}
              </FieldLabel>
              <FieldContent class="mt-2">
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    v-model="conversionConfig.listPrefix"
                    :placeholder="t('tools.list-converter.listPrefix')"
                    data-test-id="listPrefix"
                    class="w-full"
                  />
                  <Input
                    v-model="conversionConfig.listSuffix"
                    :placeholder="t('tools.list-converter.listSuffix')"
                    data-test-id="listSuffix"
                    class="w-full"
                  />
                </div>
              </FieldContent>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>

    <Card class="min-w-0">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <ArrowRight class="h-5 w-5 text-primary" />
            {{ t('tools.list-converter.converterTitle', 'Converter') }}
          </CardTitle>
          <CardDescription>
            {{ t('tools.list-converter.converterDescription', 'Paste your list data and see the transformed output based on the configuration above.') }}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent class="space-y-5 min-w-0">
        <FieldSet class="min-w-0">
          <Field orientation="vertical" class="gap-3 min-w-0">
            <FieldLabel class="text-sm font-medium">
              {{ t('tools.list-converter.inputLabel') }}
            </FieldLabel>
            <Textarea
              v-model="input"
              :placeholder="t('tools.list-converter.inputPlaceholder')"
              rows="8"
              class="w-full min-w-0 max-h-96 resize-y overflow-y-auto font-mono"
            />
            <div class="flex flex-wrap gap-2">
              <Button size="sm" variant="ghost" @click="clearInput">
                <X class="mr-2 h-4 w-4" />
                {{ t('common.clear', 'Clear') }}
              </Button>
            </div>
          </Field>
        </FieldSet>

        <Separator />

        <FieldSet class="min-w-0">
          <Field orientation="vertical" class="gap-3 min-w-0">
            <FieldLabel class="text-sm font-medium">
              {{ t('tools.list-converter.outputLabel') }}
            </FieldLabel>
            <div class="relative min-w-0 w-full">
              <Textarea
                :value="output"
                :placeholder="t('tools.list-converter.outputPlaceholder', 'Transformed output will appear here...')"
                rows="8"
                class="w-full min-w-0 max-h-96 resize-y overflow-y-auto font-mono pr-10"
                readonly
              />
              <Tooltip v-if="output">
                <TooltipTrigger as-child>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    class="absolute right-2 top-2"
                    aria-label="copy to clipboard"
                    @click="copy"
                  >
                    <Copy class="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ tooltipText }}</TooltipContent>
              </Tooltip>
            </div>
          </Field>
        </FieldSet>
      </CardContent>
    </Card>
  </div>
</template>
