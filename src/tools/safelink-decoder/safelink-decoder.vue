<script setup lang="ts">
import { AlertCircle, CheckCircle, Copy, ExternalLink, ShieldCheck, X } from 'lucide-vue-next'
import TextareaCopyable from '@/components/TextareaCopyable.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldGroup } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'
import { decodeSafeLinksURL } from './safelink-decoder.service'

const { t } = useToolI18n();
const inputSafeLinkUrl = ref('');
const inputElement = ref<HTMLElement>();

const decodedResult = computed(() => {
  if (!inputSafeLinkUrl.value.trim()) {
    return { success: false, url: '', error: '' };
  }
  try {
    const url = decodeSafeLinksURL(inputSafeLinkUrl.value);
    if (!url) {
      return { success: false, url: '', error: t('tools.safelink-decoder.decodeError') };
    }
    return { success: true, url, error: '' };
  }
  catch (e: any) {
    if (e?.message === 'SAFE_LINK_INVALID') {
      return { success: false, url: '', error: t('tools.safelink-decoder.invalidUrl') };
    }
    return { success: false, url: '', error: t('tools.safelink-decoder.decodeError') };
  }
});

const { copy: copyInput } = useCopy({ source: inputSafeLinkUrl });
const { copy: copyOutput } = useCopy({ source: computed(() => decodedResult.value.url) });

function clearInput() {
  inputSafeLinkUrl.value = '';
}

function openDecodedUrl() {
  if (decodedResult.value.success && decodedResult.value.url) {
    window.open(decodedResult.value.url, '_blank', 'noopener,noreferrer');
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <ShieldCheck class="h-5 w-5 text-primary" />
            {{ t('tools.safelink-decoder.cardInputTitle', 'SafeLink input') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.safelink-decoder.cardInputDescription',
                'Paste an Outlook SafeLink URL below. We will validate it and extract the original destination URL.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent class="space-y-2">
              <Textarea
                id="safelink-input"
                ref="inputElement"
                v-model="inputSafeLinkUrl"
                :placeholder="t('tools.safelink-decoder.inputPlaceholder', 'Paste your Outlook SafeLink URL here...')"
                rows="6"
                class="max-h-96 resize-y overflow-y-auto font-mono text-sm break-all"
                autofocus
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />
              <div class="flex flex-wrap items-center gap-1">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="ghost" size="icon-sm" :disabled="!inputSafeLinkUrl" @click="copyInput()">
                      <Copy class="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{{ t('common.copyToClipboard', 'Copy') }}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="ghost" size="icon-sm" :disabled="!inputSafeLinkUrl" @click="clearInput">
                      <X class="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{{ t('common.clear', 'Clear') }}</TooltipContent>
                </Tooltip>
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>

    <Card class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <ExternalLink class="h-5 w-5 text-primary" />
            {{ t('tools.safelink-decoder.cardOutputTitle', 'Decoded URL') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.safelink-decoder.cardOutputDescription',
                'Review the extracted URL. You can copy it or open it in a new tab.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent class="space-y-3">
              <div v-if="!inputSafeLinkUrl.trim()" class="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                {{ t('tools.safelink-decoder.emptyHint', 'Paste a SafeLink URL above to decode it.') }}
              </div>

              <Alert v-else-if="decodedResult.error" variant="destructive" class="border-destructive/50 bg-destructive/10">
                <AlertCircle class="h-4 w-4" />
                <AlertTitle>{{ t('tools.safelink-decoder.errorTitle', 'Invalid URL') }}</AlertTitle>
                <AlertDescription>{{ decodedResult.error }}</AlertDescription>
              </Alert>

              <div v-else-if="decodedResult.success" class="space-y-3">
                <Alert class="border-green-500/50 bg-green-500/10">
                  <CheckCircle class="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle class="text-green-600 dark:text-green-400">
                    {{ t('tools.safelink-decoder.successTitle', 'Decoded Successfully') }}
                  </AlertTitle>
                  <AlertDescription class="text-green-700/80 dark:text-green-300/80">
                    {{ t('tools.safelink-decoder.successDescription', 'The original URL has been extracted from the SafeLink.') }}
                  </AlertDescription>
                </Alert>

                <div class="flex flex-wrap items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button variant="ghost" size="icon-sm" @click="copyOutput()">
                        <Copy class="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{{ t('common.copyToClipboard', 'Copy') }}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button variant="ghost" size="icon-sm" @click="openDecodedUrl">
                        <ExternalLink class="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{{ t('tools.safelink-decoder.openUrl', 'Open URL') }}</TooltipContent>
                  </Tooltip>
                </div>

                <TextareaCopyable
                  :value="decodedResult.url"
                  copy-placement="none"
                  class="font-mono text-sm break-all min-h-20"
                />
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  </div>
</template>
