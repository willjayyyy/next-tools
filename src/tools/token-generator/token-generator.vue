<script setup lang="ts">
import { Copy, Key, RefreshCw } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { computedRefreshable } from '@/composable/computedRefreshable'
import { useCopy } from '@/composable/copy'
import { useQueryParam } from '@/composable/queryParams'
import { useToolI18n } from '@/composable/useToolI18n'
import { createToken } from './token-generator.service'

const length = useQueryParam({ name: 'length', defaultValue: 64 });
const withUppercase = useQueryParam({ name: 'uppercase', defaultValue: true });
const withLowercase = useQueryParam({ name: 'lowercase', defaultValue: true });
const withNumbers = useQueryParam({ name: 'numbers', defaultValue: true });
const withSymbols = useQueryParam({ name: 'symbols', defaultValue: false });
const { t } = useToolI18n();

// Slider requires array, so we create a computed for it
const lengthArray = computed({
  get: () => [length.value],
  set: (value: number[]) => {
    length.value = value[0] ?? 64;
  },
});

const [token, refreshToken] = computedRefreshable(() =>
  createToken({
    length: length.value,
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: withSymbols.value,
  }),
);

const { copy } = useCopy({
  source: token,
});

const hasValidOptions = computed(() =>
  withUppercase.value || withLowercase.value || withNumbers.value || withSymbols.value,
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <CardTitle>{{ t('tools.token-generator.cardOptionsTitle') }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6 px-6">
        <!-- Character Type Options -->
        <FieldGroup>
          <Field orientation="vertical">
            <FieldLabel>{{ t('tools.token-generator.characterTypes', 'Character types') }}</FieldLabel>
            <FieldContent>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium">{{ t('tools.token-generator.uppercase') }}</span>
                    <span class="text-xs text-muted-foreground">A-Z</span>
                  </div>
                  <Switch :id="`uppercase-${$attrs.id || ''}`" v-model="withUppercase" />
                </div>

                <div class="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium">{{ t('tools.token-generator.lowercase') }}</span>
                    <span class="text-xs text-muted-foreground">a-z</span>
                  </div>
                  <Switch :id="`lowercase-${$attrs.id || ''}`" v-model="withLowercase" />
                </div>

                <div class="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium">{{ t('tools.token-generator.numbers') }}</span>
                    <span class="text-xs text-muted-foreground">0-9</span>
                  </div>
                  <Switch :id="`numbers-${$attrs.id || ''}`" v-model="withNumbers" />
                </div>

                <div class="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium">{{ t('tools.token-generator.symbols') }}</span>
                    <span class="text-xs text-muted-foreground">!@#$%...</span>
                  </div>
                  <Switch :id="`symbols-${$attrs.id || ''}`" v-model="withSymbols" />
                </div>
              </div>
            </FieldContent>
          </Field>

          <Separator />

          <!-- Length Slider -->
          <Field orientation="vertical">
            <FieldLabel :for="`length-${$attrs.id || ''}`">
              {{ t('tools.token-generator.length') }}
            </FieldLabel>
            <FieldContent class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ t('tools.token-generator.length') }}</span>
                <span class="text-lg font-semibold">{{ length }}</span>
              </div>
              <Slider
                :id="`length-${$attrs.id || ''}`"
                v-model="lengthArray"
                :min="1"
                :max="512"
                :step="1"
                class="w-full"
              />
              <div class="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>512</span>
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>

    <!-- Token Display -->
    <Card v-if="hasValidOptions">
      <CardHeader>
        <CardTitle>{{ t('tools.token-generator.cardOutputTitle', 'Generated token') }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <Textarea
          v-model="token"
          :placeholder="t('tools.token-generator.tokenPlaceholder')"
          readonly
          :rows="4"
          class="font-mono text-sm"
        />
        <div class="flex gap-2">
          <Button class="flex-1 gap-2" @click="copy()">
            <Copy class="h-4 w-4" />
            {{ t('common.copyToClipboard', 'Copy') }}
          </Button>
          <Button variant="outline" class="flex-1 gap-2" @click="refreshToken">
            <RefreshCw class="h-4 w-4" />
            {{ t('tools.token-generator.button.refresh') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card v-else class="border-dashed">
      <CardContent class="flex flex-col items-center justify-center py-12 text-center">
        <Key class="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p class="text-sm text-muted-foreground">
          {{ t('tools.token-generator.selectCharacterTypes', 'Please select at least one character type') }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
