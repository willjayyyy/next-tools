<script setup lang="ts">
import { Grid3X3, Type, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldGroup } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useToolI18n } from '@/composable/useToolI18n'
import InputCopyable from '../../components/InputCopyable.vue'
import { CASE_FORMATS } from './case-converter.service'

const { t } = useToolI18n();
const inputElement = ref<HTMLElement>();

const input = ref('lorem ipsum dolor sit amet');

const inputLength = computed(() => input.value.length);

// Convert the raw input into every supported format. The service operates on
// the unmodified string so digits, separators, and punctuation are preserved
// where the format allows it (see issue #2).
const formats = computed(() =>
  CASE_FORMATS.map((format) => ({
    label: t(`tools.case-converter.${format.key}`),
    value: format.convert(input.value),
    category: format.category,
  })),
);

function clearInput() {
  input.value = '';
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="gap-2">
      <CardHeader>
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Type class="h-5 w-5 text-primary" />
            {{ t('tools.case-converter.cardInputTitle', 'Text input') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.case-converter.cardInputDescription',
                'Enter your string below. We will generate common casing formats for programming and text.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <Badge v-if="inputLength > 0" variant="outline" class="text-xs">
                  {{ t('tools.case-converter.inputLength', 'Length') }}: {{ inputLength }}
                </Badge>
              </div>
              <Textarea
                id="case-input"
                ref="inputElement"
                v-model="input"
                :placeholder="t('tools.case-converter.yourStringPlaceholder', 'Enter your text here...')"
                rows="6"
                class="max-h-96 resize-y overflow-y-auto break-all font-mono"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />
              <div class="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" @click="clearInput">
                  <X class="mr-2 h-4 w-4" />
                  {{ t('common.clear', 'Clear') }}
                </Button>
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>

    <Card class="gap-2">
      <CardHeader>
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Grid3X3 class="h-5 w-5 text-primary" />
            {{ t('tools.case-converter.cardOutputTitle', 'All formats') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.case-converter.cardOutputDescription',
                'Pick the format you need and copy it. Values update instantly as you type.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent>
              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InputCopyable
                  v-for="format in formats"
                  :key="format.label"
                  :value="format.value"
                  :label="format.label"
                  :field-props="{ orientation: 'vertical' }"
                />
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  </div>
</template>
