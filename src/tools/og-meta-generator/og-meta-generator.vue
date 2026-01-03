<script setup lang="ts">
import type { OGSchemaType, OGSchemaTypeElementSelect } from './OGSchemaType.type';
import { generateMeta } from '@it-tools/oggen';
import { chain, pickBy } from 'lodash';
import { Plus, X } from 'lucide-vue-next';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToolI18n } from '@/composable/useToolI18n';
import { image, ogSchemas, twitter, website } from './og-schemas';

const { t } = useToolI18n()

const metadata = ref<{ type: string, [k: string]: any }>({
  'type': 'website',
  'twitter:card': 'summary_large_image',
})

watch(
  () => metadata.value.type,
  (newType, oldType) => {
    const section = ogSchemas[oldType]
    if (!section) { return }
    section.elements.forEach(({ key }) => {
      metadata.value[key] = ''
    });
  },
)

const sections = computed(() => {
  const secs: OGSchemaType[] = [website, image, twitter]
  const additionalSchema = ogSchemas[metadata.value.type]
  if (additionalSchema) {
    secs.push(additionalSchema)
  }
  return secs
});

// Keep spaces and case, strip only special characters for i18n key lookup
const normalizeKey = (value: string) => value.replace(/[^a-z0-9 ]+/gi, '').trim()

function translateOptions(options: any[]): any[] {
  return options.map((opt) => {
    const label
      = typeof opt.label === 'string'
        ? t(`tools.og-meta-generator.labels.${normalizeKey(opt.label)}`)
        : opt.label;

    if (opt.type === 'group' && Array.isArray(opt.children)) {
      return {
        ...opt,
        label,
        children: translateOptions(opt.children),
      };
    }

    return {
      ...opt,
      label,
    };
  })
}

// Get translated label for a select value
function getSelectLabel(value: string, options: any[]): string {
  const translatedOptions = translateOptions(options)
  for (const opt of translatedOptions) {
    if (opt.type === 'group' && Array.isArray(opt.children)) {
      const found = opt.children.find((child: any) => child.value === value)
      if (found) { return found.label }
    }
    else if (opt.value === value) {
      return opt.label
    }
  }
  return value
}

const metaTags = computed(() => {
  const twitterMeta = chain(metadata.value)
    .pickBy((_value, k) => k.startsWith('twitter:'))
    .mapKeys((_value, k) => k.replace(/^twitter:/, ''))
    .value()

  const otherMeta = pickBy(metadata.value, (_value, k) => !k.startsWith('twitter:'))

  return generateMeta({ ...otherMeta, twitter: twitterMeta }, { generateTwitterCompatibleMeta: true })
});

function ensureArray(key: string) {
  if (!Array.isArray(metadata.value[key])) {
    metadata.value[key] = metadata.value[key] ? [metadata.value[key]] : ['']
  }
}

function addMultipleInput(key: string) {
  ensureArray(key)
  metadata.value[key].push('')
}

function removeMultipleInput(key: string, index: number) {
  ensureArray(key)
  metadata.value[key].splice(index, 1)
  if (metadata.value[key].length === 0) {
    metadata.value[key] = ['']
  }
}

function clearAll() {
  Object.keys(metadata.value).forEach((key) => {
    if (key !== 'type') {
      delete metadata.value[key]
    }
  })
  metadata.value['twitter:card'] = 'summary_large_image'
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <div class="space-y-1">
          <CardTitle>{{ t('tools.og-meta-generator.cardTitle', 'Meta Tag Generator') }}</CardTitle>
          <CardDescription>
            {{ t('tools.og-meta-generator.cardDescription', 'Generate Open Graph and Twitter meta tags for your website. Fill in the information below to create your meta tags.') }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <template v-for="(section, sectionIndex) in sections" :key="section.name">
          <div class="space-y-4">
            <div class="space-y-1">
              <h3 class="text-base font-semibold">
                {{ t(`tools.og-meta-generator.sections.${normalizeKey(section.name)}`) }}
              </h3>
            </div>

            <FieldSet class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                v-for="{ key, type, label, placeholder, ...element } in section.elements"
                :key="key"
                orientation="vertical"
                class="gap-3"
              >
                <FieldLabel class="text-sm font-medium">
                  {{ t(`tools.og-meta-generator.labels.${normalizeKey(label)}`) }}
                </FieldLabel>
                <FieldContent>
                  <!-- Input -->
                  <Input
                    v-if="type === 'input'"
                    v-model="metadata[key]"
                    :placeholder="t(`tools.og-meta-generator.placeholders.${normalizeKey(placeholder)}`)"
                    class="w-full"
                  />

                  <!-- Select -->
                  <Select
                    v-else-if="type === 'select'"
                    v-model="metadata[key]"
                  >
                    <SelectTrigger class="w-full">
                      <SelectValue>
                        <template v-if="metadata[key]">
                          {{ getSelectLabel(metadata[key], (element as OGSchemaTypeElementSelect).options) }}
                        </template>
                        <template v-else>
                          {{ t(`tools.og-meta-generator.placeholders.${normalizeKey(placeholder)}`) }}
                        </template>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <template v-for="(option, idx) in translateOptions((element as OGSchemaTypeElementSelect).options)" :key="idx">
                        <SelectGroup v-if="option.type === 'group'">
                          <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {{ option.label }}
                          </div>
                          <SelectItem
                            v-for="child in option.children"
                            :key="child.value"
                            :value="child.value"
                          >
                            {{ child.label }}
                          </SelectItem>
                        </SelectGroup>
                        <SelectItem
                          v-else
                          :value="option.value"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>

                  <!-- Input Multiple -->
                  <div v-else-if="type === 'input-multiple'" class="space-y-2">
                    <div
                      v-for="(value, index) in (Array.isArray(metadata[key]) ? metadata[key] : metadata[key] ? [metadata[key]] : [''])"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <Input
                        :model-value="value"
                        :placeholder="t(`tools.og-meta-generator.placeholders.${normalizeKey(placeholder)}`)"
                        class="flex-1"
                        @update:model-value="(val) => {
                          ensureArray(key);
                          metadata[key][index] = val;
                        }"
                      />
                      <Tooltip v-if="(Array.isArray(metadata[key]) ? metadata[key] : []).length > 1">
                        <TooltipTrigger as-child>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            @click="removeMultipleInput(key, index)"
                          >
                            <X class="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{{ t('tools.og-meta-generator.removeItem', 'Remove') }}</TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      class="w-full"
                      @click="addMultipleInput(key)"
                    >
                      <Plus class="h-4 w-4" />
                      <span class="ml-2">{{ t('tools.og-meta-generator.addItem', 'Add Item') }}</span>
                    </Button>
                  </div>
                </FieldContent>
              </Field>
            </FieldSet>

            <Separator v-if="sectionIndex < sections.length - 1" />
          </div>
        </template>

        <div class="flex flex-wrap gap-2 pt-2">
          <Button size="sm" variant="ghost" @click="clearAll">
            <X class="h-4 w-4" />
            <span class="ml-2">{{ t('common.clear', 'Clear All') }}</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div class="space-y-1">
          <CardTitle>{{ t('tools.og-meta-generator.outputTitle', 'Generated Meta Tags') }}</CardTitle>
          <CardDescription>
            {{ t('tools.og-meta-generator.outputDescription', 'Copy the generated meta tags and paste them into the <head> section of your HTML.') }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <TextareaCopyable :value="metaTags" language="html" class="min-h-20" />
      </CardContent>
    </Card>
  </div>
</template>
