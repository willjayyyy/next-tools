<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { Copy, KeyRound, RefreshCw } from 'lucide-vue-next'
import { computed } from 'vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { computedRefreshableAsync } from '@/composable/computedRefreshable'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'
import { useValidation } from '@/composable/validation'
import { withDefaultOnErrorAsync } from '@/utils/defaults'
import { generateKeyPair } from './rsa-key-pair-generator.service'

const bits = useStorage('rsa-key-pair-generator:bits', 2048);
const emptyCerts = { publicKeyPem: '', privateKeyPem: '' };
const { t } = useToolI18n();

const { attrs: bitsValidationAttrs } = useValidation({
  source: bits,
  rules: computed(() => [
    {
      message: t('tools.rsa-key-pair-generator.bitsRule', 'Invalid bits'),
      validator: (value: number) => value >= 256 && value <= 16384 && value % 8 === 0,
    },
  ]),
});

const [certsRef, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair({ bits: bits.value }), emptyCerts),
  emptyCerts,
);

const certs = computed(() => certsRef.value ?? emptyCerts);

const bitsArray = computed({
  get: () => [bits.value],
  set: (value: number[]) => {
    bits.value = value[0] ?? 2048;
  },
});

const publicKey = computed(() => certs.value.publicKeyPem);
const privateKey = computed(() => certs.value.privateKeyPem);

const { copy: copyPublic } = useCopy({ source: publicKey });
const { copy: copyPrivate } = useCopy({ source: privateKey });

const publicLength = computed(() => publicKey.value.length);
const privateLength = computed(() => privateKey.value.length);
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Configuration -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <KeyRound class="h-5 w-5 text-primary" />
          {{ t('tools.rsa-key-pair-generator.configuration', 'RSA key options') }}
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <FieldGroup>
          <Field orientation="vertical">
            <FieldLabel for="rsa-bits" class="w-32 text-right sm:text-right">
              {{ t('tools.rsa-key-pair-generator.bits') }}
            </FieldLabel>
            <FieldContent class="space-y-3">
              <div class="flex items-center justify-between text-sm text-muted-foreground">
                <span>{{ t('tools.rsa-key-pair-generator.bits') }}</span>
                <span class="text-lg font-semibold">{{ bits }}</span>
              </div>
              <Slider
                id="rsa-bits"
                v-model="bitsArray"
                :min="256"
                :max="16384"
                :step="8"
                class="w-full"
              />
              <div class="flex justify-between text-xs text-muted-foreground">
                <span>256</span>
                <span>16384</span>
              </div>
              <FieldDescription v-bind="bitsValidationAttrs">
                {{ bitsValidationAttrs?.feedback }}
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>

        <Separator />

        <div class="flex gap-3">
          <Button variant="outline" class="flex-1 gap-2" @click="refreshCerts()">
            <RefreshCw class="h-4 w-4" />
            {{ t('tools.rsa-key-pair-generator.refresh') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Output -->
    <Card class="flex flex-col">
      <CardHeader class="pb-2">
        <CardTitle>{{ t('tools.rsa-key-pair-generator.generatedKeys', 'Generated keys') }}</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-1 flex-col gap-4 overflow-hidden">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {{ t('tools.rsa-key-pair-generator.bits') }}: {{ bits }}
          </span>
          <span class="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {{ t('tools.rsa-key-pair-generator.public') }}: {{ publicLength }}
          </span>
          <span class="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {{ t('tools.rsa-key-pair-generator.private') }}: {{ privateLength }}
          </span>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div class="flex flex-col gap-3 rounded-lg border p-3">
            <div class="flex items-center justify-between">
              <FieldTitle>{{ t('tools.rsa-key-pair-generator.public') }}</FieldTitle>
              <Button variant="outline" size="sm" class="gap-2" :disabled="!publicKey" @click="copyPublic()">
                <Copy class="h-4 w-4" />
                {{ t('common.copyToClipboard', 'Copy') }}
              </Button>
            </div>
            <ScrollArea class="h-64 rounded-md border p-3">
              <Textarea
                :value="publicKey"
                readonly
                rows="8"
                class="min-h-40 resize-none border-0 bg-transparent p-0 font-mono text-xs leading-relaxed shadow-none"
              />
            </ScrollArea>
          </div>

          <div class="flex flex-col gap-3 rounded-lg border p-3">
            <div class="flex items-center justify-between">
              <FieldTitle>{{ t('tools.rsa-key-pair-generator.private') }}</FieldTitle>
              <Button variant="outline" size="sm" class="gap-2" :disabled="!privateKey" @click="copyPrivate()">
                <Copy class="h-4 w-4" />
                {{ t('common.copyToClipboard', 'Copy') }}
              </Button>
            </div>
            <ScrollArea class="h-64 rounded-md border p-3">
              <Textarea
                :value="privateKey"
                readonly
                rows="8"
                class="min-h-40 resize-none border-0 bg-transparent p-0 font-mono text-xs leading-relaxed shadow-none"
              />
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
