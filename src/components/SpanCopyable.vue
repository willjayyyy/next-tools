<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopy } from '@/composable/copy';

const props = withDefaults(defineProps<{ value?: string }>(), { value: '' })
const { value } = toRefs(props)

const initialText = 'Copy to clipboard'

const { copy, isJustCopied } = useCopy({ source: value })
const tooltipText = computed(() => isJustCopied.value ? 'Copied!' : initialText)
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <span class="cursor-pointer font-mono hover:text-primary transition-colors" @click="copy()">{{ value }}</span>
    </TooltipTrigger>
    <TooltipContent>
      {{ tooltipText }}
    </TooltipContent>
  </Tooltip>
</template>
