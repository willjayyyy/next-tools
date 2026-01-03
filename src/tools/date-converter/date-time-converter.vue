<script setup lang="ts">
import type { DateFormat, ToDateMapper } from './date-time-converter.types';
import { useNow } from '@vueuse/core';
import {
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
  getTime,
  getUnixTime,
  isDate,
  isValid,
  parseISO,
} from 'date-fns';
import InputCopyable from '@/components/InputCopyable.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldTitle } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToolI18n } from '@/composable/useToolI18n';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import {
  dateToExcelFormat,
  excelFormatToDate,
  isExcelFormat,
  isISO8601DateTimeString,
  isISO9075DateString,
  isMongoObjectId,
  isRFC3339DateString,
  isRFC7231DateString,
  isTimestamp,
  isUnixTimestamp,
  isUTCDateString,
} from './date-time-converter.models'

const inputDate = ref('')

const toDate: ToDateMapper = date => new Date(date)

const { t } = useToolI18n()

const formatConfigs = computed(() => [
  {
    key: 'iso9075',
    name: t('tools.date-converter.iso9075'),
    description: t('tools.date-converter.iso9075Description'),
    fromDate: (date: Date) => formatISO9075(date),
    toDate: (value: string) => parseISO(value),
    formatMatcher: (date: string) => isISO9075DateString(date),
  },
  {
    key: 'iso8601',
    name: t('tools.date-converter.iso8601'),
    description: t('tools.date-converter.iso8601Description'),
    fromDate: (date: Date) => formatISO(date),
    toDate: (value: string) => parseISO(value),
    formatMatcher: (date: string) => isISO8601DateTimeString(date),
  },
  {
    key: 'rfc3339',
    name: t('tools.date-converter.rfc3339'),
    description: t('tools.date-converter.rfc3339Description'),
    fromDate: (date: Date) => formatRFC3339(date),
    toDate,
    formatMatcher: (date: string) => isRFC3339DateString(date),
  },
  {
    key: 'rfc7231',
    name: t('tools.date-converter.rfc7231'),
    description: t('tools.date-converter.rfc7231Description'),
    fromDate: (date: Date) => formatRFC7231(date),
    toDate,
    formatMatcher: (date: string) => isRFC7231DateString(date),
  },
  {
    key: 'utcFormat',
    name: t('tools.date-converter.utcFormat'),
    description: t('tools.date-converter.utcFormatDescription'),
    fromDate: (date: Date) => date.toUTCString(),
    toDate,
    formatMatcher: (date: string) => isUTCDateString(date) && !isRFC7231DateString(date),
  },
  {
    key: 'timestamp',
    name: t('tools.date-converter.timestamp'),
    description: t('tools.date-converter.timestampDescription'),
    fromDate: (date: Date) => String(getTime(date)),
    toDate: (ms: string | number) => new Date(Number(ms)),
    formatMatcher: (date: string) => isTimestamp(date),
  },
  {
    key: 'unixTimestamp',
    name: t('tools.date-converter.unixTimestamp'),
    description: t('tools.date-converter.unixTimestampDescription'),
    fromDate: (date: Date) => String(getUnixTime(date)),
    toDate: (sec: string) => fromUnixTime(+sec),
    formatMatcher: (date: string) => isUnixTimestamp(date),
  },
  {
    key: 'mongoObjectId',
    name: t('tools.date-converter.mongoObjectId'),
    description: t('tools.date-converter.mongoObjectIdDescription'),
    fromDate: (date: Date) => `${Math.floor(date.getTime() / 1000).toString(16)}0000000000000000`,
    toDate: (objectId: string) => new Date(Number.parseInt(objectId.substring(0, 8), 16) * 1000),
    formatMatcher: (date: string) => isMongoObjectId(date),
  },
  {
    key: 'excelDateTime',
    name: t('tools.date-converter.excelDateTime'),
    description: t('tools.date-converter.excelDateTimeDescription'),
    fromDate: (date: Date) => dateToExcelFormat(date),
    toDate: excelFormatToDate,
    formatMatcher: (date: string) => isExcelFormat(date),
  },
  {
    key: 'jsLocaleDateString',
    name: t('tools.date-converter.jsLocaleDateString'),
    description: t('tools.date-converter.jsLocaleDateStringDescription'),
    fromDate: (date: Date) => date.toString(),
    toDate,
    formatMatcher: (date: string) => {
      if (!date) { return false }
      if (
        isISO8601DateTimeString(date)
        || isISO9075DateString(date)
        || isRFC3339DateString(date)
        || isRFC7231DateString(date)
        || isUTCDateString(date)
        || isUnixTimestamp(date)
        || isTimestamp(date)
        || isMongoObjectId(date)
        || isExcelFormat(date)
      ) {
        return false
      }
      const parsed = new Date(date)
      return !Number.isNaN(parsed.getTime()) && parsed.toString() === date
    },
  },
])

const formats = computed<DateFormat[]>(() => formatConfigs.value.map(({ name, fromDate, toDate, formatMatcher }) => ({
  name,
  fromDate,
  toDate,
  formatMatcher,
})))

const formatIndex = ref(6)
const now = useNow()

const normalizedDate = computed(() => {
  if (!inputDate.value) {
    return now.value
  }

  const { toDate } = formatConfigs.value[formatIndex.value] as DateFormat

  try {
    return toDate(inputDate.value)
  }
  catch {
    return undefined
  }
})

function isValidDateValue(date: unknown) {
  return isDate(date) && isValid(date as Date)
}

function detectFormatIndex(dateString: string) {
  for (const [index, format] of formatConfigs.value.entries()) {
    if (!format.formatMatcher(dateString)) { continue }
    const parsed = withDefaultOnError(() => format.toDate(dateString), undefined as unknown as Date | undefined)
    if (isValidDateValue(parsed)) { return index }
  }
  return -1
}

function onDateInputChanged(value: string | number) {
  const strVal = String(value)
  const matchingIndex = detectFormatIndex(strVal)
  if (matchingIndex !== -1) {
    formatIndex.value = matchingIndex
  }
}

const validation = useValidation({
  source: inputDate,
  watch: [formatIndex],
  rules: computed(() => [
    {
      message: t('tools.date-converter.invalidDate', 'Invalid date'),
      validator: (value: string) =>
        withDefaultOnError(() => {
          if (value === '') {
            return true
          }

          const maybeDate = (formats.value[formatIndex.value] as DateFormat).toDate(value)
          return isDate(maybeDate) && isValid(maybeDate)
        }, false),
    },
  ]),
})

function formatDateUsingFormatter(formatter: (date: Date) => string, date?: Date) {
  if (!date || !validation.isValid) {
    return ''
  }

  return withDefaultOnError(() => formatter(date), '')
}

const formatIndexModel = computed({
  get: () => formatIndex.value.toString(),
  set: (val: string) => {
    const num = Number(val)
    if (!Number.isNaN(num)) { formatIndex.value = num }
  },
})

const formatOptions = computed(() =>
  formatConfigs.value.map((format, index) => ({
    value: index.toString(),
    label: format.name,
    description: format.description,
  })),
)


function setNow() {
  inputDate.value = formatConfigs.value[formatIndex.value]?.fromDate(now.value) ?? ''
}

function clearInput() {
  inputDate.value = ''
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <Card class="h-full gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle>{{ t('tools.date-converter.cardInputTitle', 'Date input & format') }}</CardTitle>
          <CardDescription>
            {{ t('tools.date-converter.cardInputDescription', 'Paste or type a date string, we will auto-detect the format for you.') }}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        <Field orientation="vertical" class="gap-3">
          <FieldLabel class="text-sm text-muted-foreground">
            {{ t('tools.date-converter.inputLabel', 'Date input') }}
          </FieldLabel>
          <Input
            v-model="inputDate"
            autofocus
            :placeholder="t('tools.date-converter.inputPlaceholder')"
            :aria-invalid="validation.status === 'error'"
            data-test-id="date-time-converter-input"
            @update:model-value="onDateInputChanged"
          />
          <p v-if="validation.status === 'error'" class="text-xs text-destructive">
            {{ validation.message }}
          </p>
          <div class="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" @click="setNow">
              {{ t('tools.date-converter.actionUseNow', 'Use current time') }}
            </Button>
            <Button size="sm" variant="ghost" @click="clearInput">
              {{ t('tools.date-converter.actionClear', 'Clear input') }}
            </Button>
          </div>
        </Field>

        <Separator />

        <FieldSet class="space-y-2">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <FieldTitle>{{ t('tools.date-converter.formatTitle', 'Format') }}</FieldTitle>
              <FieldDescription>
                {{ t('tools.date-converter.formatDescription', 'Auto-detected based on your input, or pick one manually.') }}
              </FieldDescription>
            </div>
          </div>
          <RadioGroup
            v-model="formatIndexModel"
            class="grid grid-cols-1 gap-3 sm:grid-cols-2"
            data-test-id="date-time-converter-format-select"
          >
            <Label
              v-for="option in formatOptions"
              :key="option.value"
              class="flex h-full cursor-pointer items-start gap-3 rounded-lg border bg-card/60 p-3 transition-colors hover:bg-accent/50"
            >
              <RadioGroupItem :value="option.value" class="mt-1" />
              <div class="space-y-1">
                <div class="text-sm font-medium leading-none">
                  {{ option.label }}
                </div>
                <p class="text-xs text-muted-foreground">
                  {{ option.description }}
                </p>
              </div>
            </Label>
          </RadioGroup>
        </FieldSet>
      </CardContent>
    </Card>

    <Card class="flex h-full flex-col gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle>{{ t('tools.date-converter.cardOutputTitle', 'Converted results') }}</CardTitle>
          <CardDescription>
            {{ t('tools.date-converter.cardOutputDescription', 'Copy any format instantly. All outputs stay in sync.') }}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent class="flex-1 space-y-5">
        <Alert v-if="validation.status === 'error'" variant="destructive">
          <AlertTitle>{{ t('tools.date-converter.invalidDate', 'This date is invalid for this format') }}</AlertTitle>
          <AlertDescription>
            {{ t('tools.date-converter.invalidDatePlaceholder', 'Invalid date...') }}
          </AlertDescription>
        </Alert>
        <Alert v-else>
          <AlertTitle>{{ t('tools.date-converter.validDateTitle', 'Date looks valid') }}</AlertTitle>
          <AlertDescription class="text-sm text-muted-foreground">
            {{ t('tools.date-converter.validDateDescription', 'All formats below are synced with your input.') }}
          </AlertDescription>
        </Alert>

        <Separator />

        <FieldGroup>
          <InputCopyable
            v-for="{ name, fromDate } in formats"
            :key="name"
            :label="name"
            :value="formatDateUsingFormatter(fromDate, normalizedDate)"
            :placeholder="t('tools.date-converter.invalidDatePlaceholder')"
            :test-id="name"
            :field-props="{
              orientation: 'vertical',
            }"
            readonly
          />
        </FieldGroup>
      </CardContent>
    </Card>
  </div>
</template>
