<script setup lang="ts">
import type { ExtractPropTypes } from 'vue'
import { useVModel } from '@vueuse/core'
import { Copy } from 'lucide-vue-next'

import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCopy } from '@/composable/copy'

const props = withDefaults(
  defineProps<{
    value?: string
    label?: string
    readonly?: boolean
    fieldProps?: ExtractPropTypes<typeof Field>
    labelProps?: ExtractPropTypes<typeof FieldLabel>
    disableCopy?: boolean
  }>(),
  {
    value: '',
    label: undefined,
    readonly: false,
    fieldProps: () => ({}),
    labelProps: () => ({}),
    disableCopy: false,
  },
);
const emit = defineEmits(['update:value']);

const value = useVModel(props, 'value', emit);
const { t } = useI18n();
const { copy, isJustCopied } = useCopy({
  source: value,
});
const tooltipText = computed(() =>
  isJustCopied.value
    ? t('common.copied', 'Copied!')
    : t('common.copyToClipboard', 'Copy to clipboard'),
);
</script>

<template>
  <Field v-bind="props.fieldProps">
    <FieldLabel v-if="props.label" v-bind="props.labelProps">
      {{ props.label }}
    </FieldLabel>
    <FieldContent>
      <div class="flex items-center gap-2 w-full">
        <Input v-model="value" class="flex-1" :readonly="readonly" />
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="copy to clipboard"
              :disabled="disableCopy"
              @click="copy"
            >
              <Copy class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ tooltipText }}</TooltipContent>
        </Tooltip>
      </div>
    </FieldContent>
  </Field>
</template>
