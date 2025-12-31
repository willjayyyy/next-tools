<script setup lang="ts">
import { times } from 'lodash'
import { Copy, RefreshCw } from 'lucide-vue-next'
import { ulid } from 'ulid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { computedRefreshable } from '@/composable/computedRefreshable'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'

const amount = useStorage('ulid-generator-amount', 1);
const { t } = useToolI18n();

const format = useStorage<'raw' | 'json'>('ulid-generator-format', 'raw');

// Slider requires array, so we create a computed for it
const amountArray = computed({
  get: () => [amount.value],
  set: (value: number[]) => {
    amount.value = value[0] ?? 1;
  },
});

const [ulids, refreshUlids] = computedRefreshable(() => {
  const ids = times(amount.value, () => ulid());

  if (format.value === 'json') {
    return JSON.stringify(ids, null, 2);
  }

  return ids.join('\n');
})

const { copy } = useCopy({ source: ulids });
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <!-- Configuration Section -->
    <Card>
      <CardHeader>
        <CardTitle>{{ t('tools.ulid-generator.cardConfigTitle') }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <FieldGroup>
          <Field orientation="responsive">
            <FieldLabel for="ulid-quantity" class="w-32 text-right sm:text-right">
              {{ t('tools.ulid-generator.quantity') }}
            </FieldLabel>
            <FieldContent class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ t('tools.ulid-generator.quantity') }}</span>
                <span class="text-lg font-semibold">{{ amount }}</span>
              </div>
              <Slider
                id="ulid-quantity"
                v-model="amountArray"
                :min="1"
                :max="100"
                :step="1"
                class="w-full"
              />
              <div class="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>100</span>
              </div>
            </FieldContent>
          </Field>

          <Separator />

          <FieldSet>
            <FieldLabel for="format-raw">
              {{ t('tools.ulid-generator.format.label') }}
            </FieldLabel>
            <FieldDescription>
              {{ t('tools.ulid-generator.format.description') }}
            </FieldDescription>
            <RadioGroup v-model="format" class="grid grid-cols-1 gap-3">
              <FieldLabel for="format-raw" class="cursor-pointer hover:bg-accent/50">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{{ t('tools.ulid-generator.format.raw') }}</FieldTitle>
                    <FieldDescription>
                      {{ t('tools.ulid-generator.format.rawDescription') }}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id="format-raw" value="raw" />
                </Field>
              </FieldLabel>
              <FieldLabel for="format-json" class="cursor-pointer hover:bg-accent/50">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{{ t('tools.ulid-generator.format.json') }}</FieldTitle>
                    <FieldDescription>
                      {{ t('tools.ulid-generator.format.jsonDescription') }}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id="format-json" value="json" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>

    <!-- Output Section -->
    <Card data-test-id="ulids" class="flex flex-col">
      <CardHeader>
        <CardTitle>{{ t('tools.ulid-generator.cardOutputTitle') }}</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-1 flex-col gap-4">
        <Textarea :model-value="ulids" readonly rows="8" class="m-0 whitespace-pre font-mono text-sm leading-relaxed w-full max-h-90.75 resize-none pt-1" />

        <div class="flex gap-3 shrink-0">
          <Button data-test-id="refresh" variant="outline" class="flex-1 gap-2" @click="refreshUlids()">
            <RefreshCw class="h-4 w-4" />
            {{ t('tools.ulid-generator.refresh') }}
          </Button>
          <Button class="flex-1 gap-2" :disabled="!ulids" @click="copy()">
            <Copy class="h-4 w-4" />
            {{ t('tools.ulid-generator.copy') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
