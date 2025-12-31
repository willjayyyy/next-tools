<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { isValidCron } from 'cron-validator';
import cronstrue from 'cronstrue/i18n';

import { AlarmClockCheck, Clock, Copy, Info } from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useCopy } from '@/composable/copy';
import { useToolI18n } from '@/composable/useToolI18n';

function isCronValid(v: string) {
  return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true })
}

const CRONTAB = {
  EVERY_SECOND: '* * * * * *',
  EVERY_MINUTE: '0 * * * * *',
  EVERY_HOUR: '0 0 * * * *',
  EVERY_DAY: '0 0 0 * * *',
  EVERY_DAY_ZERO_FIFTEEN: '0 15 0 * * *',
  EVERY_DAY_ONE_FIFTEEN: '0 15 1 * * *',
  EVERY_PER_5_SECOND: '*/5 * * * * *',
  EVERY_PER_10_SECOND: '*/10 * * * * *',
  EVERY_PER_30_SECOND: '*/30 * * * * *',
  EVERY_PER_5_MINUTE: '0 */5 * * * *',
  EVERY_PER_10_MINUTE: '0 */10 * * * *',
  EVERY_PER_30_MINUTE: '0 */30 * * * *',
  EVERY_MONDAY_8: '0 0 8 * * 1',
  EVERY_WEEKDAY_9: '0 0 9 * * 1-5',
  FIRST_DAY_MONTH_MIDNIGHT: '0 0 0 1 * *',
  EVERY_SUNDAY_MIDNIGHT: '0 0 0 * * 0',
} as const

const cron = ref(CRONTAB.EVERY_SECOND)
// Persisted cronstrue options
const cronstrueVerbose = useStorage('crontab:cronstrue:verbose', true)
const cronstrueDayOfWeekStartIndexZero = useStorage('crontab:cronstrue:day-start-index-zero', true)
const cronstrueUse24HourTimeFormat = useStorage('crontab:cronstrue:use-24-hour-format', true)
const cronstrueThrowExceptionOnParseError = useStorage('crontab:cronstrue:throw-exception-on-parse-error', true)

const cronstrueConfig = computed(() => ({
  verbose: cronstrueVerbose.value,
  dayOfWeekStartIndexZero: cronstrueDayOfWeekStartIndexZero.value,
  use24HourTimeFormat: cronstrueUse24HourTimeFormat.value,
  throwExceptionOnParseError: cronstrueThrowExceptionOnParseError.value,
}))

const { t, locale } = useToolI18n()
const cronstrueLocale = computed(() => {
  const lang = locale.value?.split('-')[0] || 'en'
  return lang === 'zh' ? 'zh_CN' : locale.value || 'en'
});

const cronValid = computed(() => isCronValid(cron.value))

const cronString = computed(() => {
  if (cronValid.value) {
    try {
      return cronstrue.toString(cron.value, { ...cronstrueConfig.value, locale: cronstrueLocale.value })
    }
    catch {
      return ''
    }
  }
  return ''
});

const { copy: copyCron } = useCopy({
  source: cron,
})

const cronPresetOpen = ref(false)

const helpers = computed(() => [
  { symbol: '*', meaning: t('tools.crontab-generator.anyValue'), example: '* * * *', equivalent: t('tools.crontab-generator.everyMinute') },
  { symbol: '-', meaning: t('tools.crontab-generator.rangeOfValues'), example: '1-10 * * *', equivalent: t('tools.crontab-generator.minutes1Through10') },
  { symbol: ',', meaning: t('tools.crontab-generator.listOfValues'), example: '1,10 * * *', equivalent: t('tools.crontab-generator.atMinutes1And10') },
  { symbol: '/', meaning: t('tools.crontab-generator.stepValues'), example: '*/10 * * *', equivalent: t('tools.crontab-generator.every10Minutes') },
])

const cronPresets = computed(() => [
  {
    value: CRONTAB.EVERY_SECOND,
    label: t('tools.crontab-generator.presetEverySecond', 'Every second'),
  },
  {
    value: CRONTAB.EVERY_PER_5_SECOND,
    label: t('tools.crontab-generator.presetEvery5Seconds', 'Every 5 seconds'),
  },
  {
    value: CRONTAB.EVERY_PER_10_SECOND,
    label: t('tools.crontab-generator.presetEvery10Seconds', 'Every 10 seconds'),
  },
  {
    value: CRONTAB.EVERY_PER_30_SECOND,
    label: t('tools.crontab-generator.presetEvery30Seconds', 'Every 30 seconds'),
  },
  {
    value: CRONTAB.EVERY_MINUTE,
    label: t('tools.crontab-generator.presetEveryMinute', 'Every minute (at second 0)'),
  },
  {
    value: CRONTAB.EVERY_PER_5_MINUTE,
    label: t('tools.crontab-generator.presetEvery5Minutes', 'Every 5 minutes'),
  },
  {
    value: CRONTAB.EVERY_PER_10_MINUTE,
    label: t('tools.crontab-generator.presetEvery10Minutes', 'Every 10 minutes'),
  },
  {
    value: CRONTAB.EVERY_PER_30_MINUTE,
    label: t('tools.crontab-generator.presetEvery30Minutes', 'Every 30 minutes'),
  },
  {
    value: CRONTAB.EVERY_HOUR,
    label: t('tools.crontab-generator.presetEveryHour', 'Every hour at :00'),
  },
  {
    value: CRONTAB.EVERY_DAY,
    label: t('tools.crontab-generator.presetEveryDayMidnight', 'Every day at 00:00'),
  },
  {
    value: CRONTAB.EVERY_DAY_ZERO_FIFTEEN,
    label: t('tools.crontab-generator.presetEveryDay0015', 'Every day at 00:15'),
  },
  {
    value: CRONTAB.EVERY_DAY_ONE_FIFTEEN,
    label: t('tools.crontab-generator.presetEveryDay0115', 'Every day at 01:15'),
  },
  {
    value: CRONTAB.EVERY_WEEKDAY_9,
    label: t('tools.crontab-generator.presetEveryWeekday9', 'Every weekday at 09:00'),
  },
  {
    value: CRONTAB.EVERY_MONDAY_8,
    label: t('tools.crontab-generator.presetEveryMonday8', 'Every Monday at 08:00'),
  },
  {
    value: CRONTAB.FIRST_DAY_MONTH_MIDNIGHT,
    label: t('tools.crontab-generator.presetFirstOfMonthMidnight', 'First day of each month at midnight'),
  },
  {
    value: CRONTAB.EVERY_SUNDAY_MIDNIGHT,
    label: t('tools.crontab-generator.presetEverySundayMidnight', 'Every Sunday at midnight'),
  },
])
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <AlarmClockCheck class="h-5 w-5 text-primary" />
            {{ t('tools.crontab-generator.cardTitle', 'Crontab generator') }}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        <div class="grid gap-6 lg:grid-cols-2">
          <div class="space-y-4">
            <FieldSet class="space-y-3">
              <div class="flex items-center justify-between">
                <FieldLabel class="text-sm font-medium">
                  {{ t('tools.crontab-generator.inputLabel', 'Cron expression') }}
                </FieldLabel>
                <div class="flex items-center gap-1">
                  <Button variant="outline" size="icon-sm" @click="copyCron()">
                    <Copy class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Field>
                <FieldContent class="flex flex-row items-center gap-2">
                  <Input
                    v-model="cron"
                    :placeholder="t('tools.crontab-generator.inputPlaceholder', '* * * * *')"
                    class="text-center text-lg font-mono flex-1"
                  />
                  <Popover v-model:open="cronPresetOpen">
                    <PopoverTrigger as-child>
                      <Button variant="outline" class="size-9">
                        <Clock class="size-4.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-80 p-0" align="end">
                      <Command>
                        <CommandInput
                          :placeholder="t('tools.crontab-generator.presetSearchPlaceholder', 'Search schedules...')"
                        />
                        <CommandList>
                          <CommandEmpty>{{ t('common.noResults', 'No results found') }}</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              v-for="preset in cronPresets"
                              :key="preset.value"
                              :value="`${preset.value} ${preset.label}`"
                              @select="() => { cron = preset.value as typeof cron; cronPresetOpen = false; }"
                            >
                              <div class="flex flex-col gap-0.5">
                                <span class="font-mono text-xs text-foreground">{{ preset.value }}</span>
                                <span class="text-xs text-muted-foreground">{{ preset.label }}</span>
                              </div>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FieldContent>
              </Field>
              <div class="text-xs text-muted-foreground">
                {{ t('tools.crontab-generator.inputHint', 'Supports seconds and aliases like @daily, @hourly, @reboot.') }}
              </div>
              <div v-if="!cronValid" class="text-sm text-destructive">
                {{ t('tools.crontab-generator.invalidCron') }}
              </div>
            </FieldSet>

            <Separator />

            <FieldSet class="space-y-3">
              <div class="flex items-center gap-2 text-sm font-medium">
                <Info class="h-4 w-4 text-muted-foreground" />
                {{ t('tools.crontab-generator.optionsTitle', 'Options') }}
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <div class="text-sm">
                    {{ t('tools.crontab-generator.verbose') }}
                  </div>
                  <Switch v-model="cronstrueVerbose" />
                </div>
                <div class="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <div class="text-sm">
                    {{ t('tools.crontab-generator.use24HourTimeFormat') }}
                  </div>
                  <Switch v-model="cronstrueUse24HourTimeFormat" />
                </div>
                <div class="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <div class="text-sm">
                    {{ t('tools.crontab-generator.daysStartAt0') }}
                  </div>
                  <Switch v-model="cronstrueDayOfWeekStartIndexZero" />
                </div>
              </div>
            </FieldSet>
          </div>

          <div class="space-y-3 overflow-hidden">
            <div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <List class="h-4 w-4" />
              {{ t('tools.crontab-generator.humanReadableTitle', 'Human readable') }}
            </div>
            <Alert v-if="!cronValid" variant="destructive" class="border-destructive/40 bg-destructive/10">
              <AlertTitle class="text-destructive text-sm">
                {{ t('tools.crontab-generator.invalidCron') }}
              </AlertTitle>
              <AlertDescription class="text-destructive/80 text-sm">
                {{ t('tools.crontab-generator.invalidHint', 'Please enter a valid cron to see the description.') }}
              </AlertDescription>
            </Alert>
            <div v-else class="rounded-lg border bg-muted/30 p-4 max-h-30.5">
              <p class="text-base font-medium leading-relaxed text-foreground">
                {{ cronString }}
              </p>
            </div>

            <div class="rounded-lg border bg-muted/20 p-4 text-sm font-mono leading-6">
              <div class="w-full overflow-auto">
                <pre class="inline-block min-w-max whitespace-pre text-foreground">
┌──────────── [{{ t('tools.crontab-generator.legendOptional') }}] {{ t('tools.crontab-generator.legendSeconds') }}
| ┌────────── {{ t('tools.crontab-generator.legendMinutes') }}
| | ┌──────── {{ t('tools.crontab-generator.legendHours') }}
| | | ┌────── {{ t('tools.crontab-generator.legendDayOfMonth') }}
| | | | ┌──── {{ t('tools.crontab-generator.legendMonth') }}
| | | | | ┌── {{ t('tools.crontab-generator.legendDayOfWeek') }}
| | | | | |
* * * * * * {{ t('tools.crontab-generator.legendCommand') }}
    </pre>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="flex items-center gap-2 text-base">
          <Info class="h-4 w-4 text-primary" />
          {{ t('tools.crontab-generator.helpersTitle', 'Common symbols') }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="{ symbol, meaning, example, equivalent } in helpers"
            :key="symbol"
            class="rounded-lg border bg-muted/20 p-4 space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold">{{ t('tools.crontab-generator.symbol') }}</span>
              <span class="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                {{ symbol || '—' }}
              </span>
            </div>
            <div class="text-sm">
              <span class="font-semibold">{{ t('tools.crontab-generator.meaning') }}: </span>{{ meaning }}
            </div>
            <div class="text-sm">
              <span class="font-semibold">{{ t('tools.crontab-generator.example') }}: </span>
              <code class="rounded bg-muted px-1 py-0.5 text-xs font-mono">{{ example || '—' }}</code>
            </div>
            <div class="text-sm">
              <span class="font-semibold">{{ t('tools.crontab-generator.equivalent') }}: </span>
              <code class="rounded bg-muted px-1 py-0.5 text-xs font-mono">{{ equivalent || '—' }}</code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
