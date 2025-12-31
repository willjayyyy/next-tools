<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import hljs from 'highlight.js/lib/core';
import iniHljs from 'highlight.js/lib/languages/ini';
import jsonHljs from 'highlight.js/lib/languages/json';
import markdownHljs from 'highlight.js/lib/languages/markdown';
import sqlHljs from 'highlight.js/lib/languages/sql';
import xmlHljs from 'highlight.js/lib/languages/xml';
import yamlHljs from 'highlight.js/lib/languages/yaml';
import { Copy } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopy } from '@/composable/copy';
import { useToolI18n } from '@/composable/useToolI18n';

const props = withDefaults(
  defineProps<{
    value: string
    language?: string
    copyPlacement?: 'top-right' | 'bottom-right' | 'outside' | 'none'
    copyMessage?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    language: '',
    copyPlacement: 'top-right',
    copyMessage: undefined,
    class: '',
  },
);

const { t } = useToolI18n();

hljs.registerLanguage('sql', sqlHljs)
hljs.registerLanguage('json', jsonHljs)
hljs.registerLanguage('html', xmlHljs)
hljs.registerLanguage('xml', xmlHljs)
hljs.registerLanguage('yaml', yamlHljs)
hljs.registerLanguage('toml', iniHljs)
hljs.registerLanguage('markdown', markdownHljs)

const { value, language, copyPlacement, copyMessage } = toRefs(props)

const { copy } = useCopy({ source: value, text: copyMessage })
const tooltipText = computed(() =>
  t('common.copyToClipboard', 'Copy to clipboard'),
)

const highlightedCode = computed(() => {
  if (!value.value) { return '' }
  if (!language.value) { return value.value }
  try {
    return hljs.highlight(value.value, { language: language.value }).value
  }
  catch {
    return value.value
  }
})

const codeHighlightClasses = computed(() => {
  const base = '[&_code.hljs]:bg-transparent [&_code.hljs]:p-0 [&_code.hljs]:text-inherit [&_code.hljs]:block'
  const common = '[&_.hljs-keyword]:text-[hsl(var(--code-purple))] [&_.hljs-selector-tag]:text-[hsl(var(--code-purple))] [&_.hljs-literal]:text-[hsl(var(--code-purple))] [&_.hljs-string]:text-[hsl(var(--code-green))] [&_.hljs-comment]:text-[hsl(var(--code-comment))] [&_.hljs-comment]:italic [&_.hljs-meta]:text-[hsl(var(--code-comment))] [&_.hljs-meta]:italic [&_.hljs-number]:text-[hsl(var(--code-orange))] [&_.hljs-function]:text-[hsl(var(--code-blue))] [&_.hljs-title]:text-[hsl(var(--code-blue))] [&_.hljs-name]:text-[hsl(var(--code-red))] [&_.hljs-type]:text-[hsl(var(--code-amber))] [&_.hljs-class]:text-[hsl(var(--code-amber))] [&_.hljs-built_in]:text-[hsl(var(--code-amber))] [&_.hljs-attr]:text-[hsl(var(--code-orange))] [&_.hljs-attribute]:text-[hsl(var(--code-orange))] [&_.hljs-tag]:text-[hsl(var(--code-tag))] [&_.hljs-selector-class]:text-[hsl(var(--code-red))] [&_.hljs-selector-id]:text-[hsl(var(--code-red))] [&_.hljs-variable]:text-[hsl(var(--code-red))] [&_.hljs-template-variable]:text-[hsl(var(--code-red))] [&_.hljs-regexp]:text-[hsl(var(--code-cyan))] [&_.hljs-symbol]:text-[hsl(var(--code-cyan))]'
  return `${base} ${common}`
});
</script>

<template>
  <div class="relative">
    <Card class="relative bg-muted/30 p-0 overflow-auto" :class="props.class">
      <pre
        :class="codeHighlightClasses"
        class="m-0 p-4 text-sm font-mono"
        :style="{ color: 'hsl(var(--code-text))' }"
        data-test-id="area-content"
      ><code
          class="hljs block"
          v-html="highlightedCode"
      /></pre>
    </Card>
    <div
      v-if="value"
      :class="copyPlacement === 'outside' ? 'mt-4 flex justify-center' : (copyPlacement === 'top-right' ? 'absolute right-2 top-2' : 'absolute bottom-2 right-2')"
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="outline"
            :size="copyPlacement === 'outside' ? 'sm' : 'icon-sm'"
            :class="copyPlacement === 'outside' ? 'gap-2' : ''"
            @click="copy()"
          >
            <Copy class="h-4 w-4" />
            <span v-if="copyPlacement === 'outside'">{{ tooltipText }}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ tooltipText }}</TooltipContent>
      </Tooltip>
    </div>
  </div>
</template>
