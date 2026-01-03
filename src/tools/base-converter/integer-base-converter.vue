<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { useToolI18n } from '@/composable/useToolI18n'
import { getErrorMessageIfThrows } from '@/utils/error'
import InputCopyable from '../../components/InputCopyable.vue'
import { convertBase } from './integer-base-converter.model'

const input = ref('42');
const inputBase = ref(10);
const customBase = ref(16);

const { t } = useToolI18n();

function clampBase(value: number) {
  return Math.min(64, Math.max(2, Number.isNaN(value) ? 2 : value));
}

function errorlessConvert(args: Parameters<typeof convertBase>[0]) {
  try {
    return convertBase(args);
  }
  catch {
    return '';
  }
}

const error = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBase({ value: input.value, fromBase: inputBase.value, toBase: customBase.value }),
  ),
);

const sliderInputBase = computed({
  get: () => [inputBase.value],
  set: (val: number[] | number) => {
    const value = Array.isArray(val) ? val[0] ?? 2 : (val ?? 2);
    inputBase.value = clampBase(value);
  },
});

const sliderCustomBase = computed({
  get: () => [customBase.value],
  set: (val: number[] | number) => {
    const value = Array.isArray(val) ? val[0] ?? 2 : (val ?? 2);
    customBase.value = clampBase(value);
  },
});

const presetOutputs = computed(() => [
  { key: 'binary', base: 2, label: t('tools.base-converter.binary') },
  { key: 'octal', base: 8, label: t('tools.base-converter.octal') },
  { key: 'decimal', base: 10, label: t('tools.base-converter.decimal') },
  { key: 'hexadecimal', base: 16, label: t('tools.base-converter.hexadecimal') },
  { key: 'base64', base: 64, label: t('tools.base-converter.base64') },
]);


function clearAll() {
  input.value = '';
}

</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <Card class="h-full gap-2">
      <CardHeader class="pb-3">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <CardTitle>{{ t('tools.base-converter.cardInputTitle', 'Number & bases') }}</CardTitle>
            <CardDescription>
              {{ t('tools.base-converter.cardInputDescription', 'Enter a value, pick input and output bases.') }}
            </CardDescription>
          </div>
          <Badge variant="secondary" class="text-xs">
            {{ t('tools.base-converter.inputBase') }}: {{ inputBase }}
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="space-y-5">
        <FieldSet>
          <Field orientation="vertical" class="gap-3">
            <FieldLabel class="text-sm text-muted-foreground">
              {{ t('tools.base-converter.inputNumber') }}
            </FieldLabel>
            <Input
              v-model="input"
              :placeholder="t('tools.base-converter.inputPlaceholder')"
              class="font-mono"
            />
            <div class="flex flex-wrap gap-2">
              <Button size="sm" variant="ghost" @click="clearAll">
                {{ t('common.clear', 'Clear') }}
              </Button>
            </div>
          </Field>

          <Separator />

          <Field orientation="vertical" class="gap-3">
            <div class="flex items-center justify-between">
              <FieldLabel class="text-sm font-medium">
                {{ t('tools.base-converter.inputBase') }}
              </FieldLabel>
              <Badge variant="outline" class="text-xs">
                2-64
              </Badge>
            </div>
            <FieldDescription>
              {{ t('tools.base-converter.inputBasePlaceholder') }}
            </FieldDescription>
            <Slider
              v-model="sliderInputBase"
              :min="2"
              :max="64"
              :step="1"
              class="pt-2"
            />
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>2</span>
              <span class="font-medium text-primary">{{ inputBase }}</span>
              <span>64</span>
            </div>
          </Field>

          <Alert :variant="error ? 'destructive' : 'default'" class="mt-2">
            <AlertTitle>
              {{ error ? t('tools.base-converter.errorTitle', 'Conversion error') : t('tools.base-converter.validTitle', 'Ready to copy') }}
            </AlertTitle>
            <AlertDescription class="text-muted-foreground">
              {{ error || t('tools.base-converter.validHint', 'All outputs stay in sync with your input.') }}
            </AlertDescription>
          </Alert>
        </FieldSet>
      </CardContent>
    </Card>

    <Card class="flex h-full flex-col gap-2">
      <CardHeader class="pb-3">
        <div class="space-y-1">
          <CardTitle>{{ t('tools.base-converter.cardOutputTitle', 'Converted values') }}</CardTitle>
          <CardDescription>
            {{ t('tools.base-converter.cardOutputDescription', 'Copy any base instantly.') }}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent class="flex-1 space-y-5">
        <FieldGroup>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <InputCopyable
              v-for="preset in presetOutputs"
              :key="preset.key"
              :label="preset.label"
              :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: preset.base })"
              :placeholder="t(`tools.base-converter.${preset.key}Placeholder`)"
              :field-props="{ orientation: 'vertical' }"
              readonly
            />
          </div>
        </FieldGroup>
        <Separator />
        <FieldGroup>
          <Field orientation="vertical" class="gap-3">
            <div class="flex items-center justify-between">
              <FieldLabel class="text-sm font-medium">
                {{ t('tools.base-converter.customBaseLabel', 'Custom base') }}
              </FieldLabel>
              <Badge variant="outline" class="text-xs">
                2-64
              </Badge>
            </div>
            <FieldDescription>
              {{ t('tools.base-converter.customPlaceholder', { base: customBase }) }}
            </FieldDescription>
            <Slider
              v-model="sliderCustomBase"
              :min="2"
              :max="64"
              :step="1"
              class="pt-2"
            />
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>2</span>
              <span class="font-medium text-primary">{{ customBase }}</span>
              <span>64</span>
            </div>
          </Field>

          <InputCopyable
            :label="t('tools.base-converter.customOutputTitle', 'Custom base')"
            :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: customBase })"
            :placeholder="t('tools.base-converter.customPlaceholder', { base: customBase })"
            :field-props="{ orientation: 'vertical' }"
            readonly
          />
        </FieldGroup>
      </CardContent>
    </Card>
  </div>
</template>
