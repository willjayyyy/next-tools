<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'

const props = defineProps<{ tokens: { previous: string, current: string, next: string } }>()
const { tokens } = toRefs(props)
const { t } = useToolI18n()

const { copy: copyPrevious, isJustCopied: previousCopied } = useCopy()
const { copy: copyCurrent, isJustCopied: currentCopied } = useCopy()
const { copy: copyNext, isJustCopied: nextCopied } = useCopy()
</script>

<template>
  <div class="space-y-2">
    <div class="grid grid-cols-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      <span class="text-left">{{ t('tools.otp-generator.previous') }}</span>
      <span class="text-center">{{ t('tools.otp-generator.current') }}</span>
      <span class="text-right">{{ t('tools.otp-generator.next') }}</span>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            data-test-id="previous-otp"
            variant="outline"
            class="h-12 font-mono"
            @click.prevent="copyPrevious(tokens.previous)"
          >
            {{ tokens.previous }}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {{ previousCopied ? t('common.copied') : t('tools.otp-generator.copyPrevious') }}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            data-test-id="current-otp"
            class="h-12 font-mono text-lg shadow-sm"
            @click.prevent="copyCurrent(tokens.current)"
          >
            {{ tokens.current }}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {{ currentCopied ? t('common.copied') : t('tools.otp-generator.copyCurrent') }}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            data-test-id="next-otp"
            variant="outline"
            class="h-12 font-mono"
            @click.prevent="copyNext(tokens.next)"
          >
            {{ tokens.next }}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {{ nextCopied ? t('common.copied') : t('tools.otp-generator.copyNext') }}
        </TooltipContent>
      </Tooltip>
    </div>
  </div>
</template>
