<script setup lang="ts">
import { useTimestamp } from '@vueuse/core';
import { Info, Link, QrCode, RefreshCw, Shield } from 'lucide-vue-next';

import InputCopyable from '@/components/InputCopyable.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { computedRefreshable } from '@/composable/computedRefreshable'
import { useToolI18n } from '@/composable/useToolI18n'
import { useStyleStore } from '@/stores/style.store'
import { useQRCode } from '../qrcode-generator/useQRCode'
import { base32toHex, buildKeyUri, generateSecret, generateTOTP, getCounterFromTime } from './otp.service'
import TokenDisplay from './token-display.vue'

const now = useTimestamp();
const interval = computed(() => (now.value / 1000) % 30);
const styleStore = useStyleStore();
const { t } = useToolI18n();

const secret = ref(generateSecret());
const secretModel = computed({
  get: () => secret.value,
  set: (val: string) => {
    secret.value = (val ?? '').toUpperCase();
  },
});

function refreshSecret() {
  secret.value = generateSecret();
}

const [tokens] = computedRefreshable(
  () => ({
    previous: generateTOTP({ key: secret.value, now: now.value - 30000 }),
    current: generateTOTP({ key: secret.value, now: now.value }),
    next: generateTOTP({ key: secret.value, now: now.value + 30000 }),
  }),
  { throttle: 400 },
);

const keyUri = computed(() => buildKeyUri({ secret: secret.value }));

const { qrcode } = useQRCode({
  text: keyUri,
  color: {
    background: computed(() => (styleStore.isDarkTheme ? '#ffffff' : '#00000000')),
    foreground: '#000000',
  },
  options: { width: 440, margin: 0 },
});

const secretErrors = computed(() => {
  const errors: string[] = [];
  if (!secret.value) {
    errors.push(t('tools.otp-generator.secretRequired'));
  }
  if (secret.value && !/^[A-Z2-7]+$/.test(secret.value)) {
    errors.push(t('tools.otp-generator.secretBase32'));
  }
  return errors;
})

const percent = computed(() => Math.min(100, Math.max(0, (interval.value / 30) * 100)));
const secondsLeft = computed(() => Math.max(0, Math.floor(30 - (now.value / 1000) % 30)));
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
    <Card class="flex flex-col border-primary/30 bg-primary/5">
      <CardHeader class="pb-2">
        <CardTitle class="flex items-center gap-2 text-primary">
          <Shield class="h-5 w-5" />
          {{ t('tools.otp-generator.cardLiveCodes', 'Live OTP codes') }}
        </CardTitle>
        <p class="text-sm text-muted-foreground">
          {{ t('tools.otp-generator.liveCodesDescription', 'Monitor the last, current, and next TOTP and copy with one click.') }}
        </p>
      </CardHeader>
      <CardContent class="flex flex-1 flex-col gap-4">
        <TokenDisplay :tokens="tokens" />

        <div class="space-y-2 rounded-lg border bg-card/60 p-4 shadow-sm">
          <div class="flex items-center justify-between text-sm text-muted-foreground">
            <span class="flex items-center gap-2">
              <Info class="h-4 w-4" />
              {{ t('tools.otp-generator.nextIn', { seconds: String(secondsLeft).padStart(2, '0') }) }}
            </span>
          </div>
          <div class="relative h-2 overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full bg-primary transition-[width] duration-150"
              :style="{ width: `${percent}%` }"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" @click="refreshSecret">
            <RefreshCw class="mr-2 h-4 w-4" />
            {{ t('tools.otp-generator.regenerate', 'Regenerate secret') }}
          </Button>
          <Button variant="outline" size="sm" as-child>
            <a :href="keyUri" target="_blank" rel="noopener noreferrer" class="inline-flex items-center">
              <Link class="mr-2 h-4 w-4" />
              {{ t('tools.otp-generator.openKeyUri') }}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>

    <div class="flex flex-col gap-6">
      <Card class="flex flex-col">
        <CardHeader class="pb-3">
          <CardTitle class="flex items-center gap-2">
            <QrCode class="h-5 w-5 text-primary" />
            {{ t('tools.otp-generator.cardSecret', 'Secret & QR') }}
          </CardTitle>
          <p class="text-sm text-muted-foreground">
            {{ t('tools.otp-generator.secretHint', 'Use a Base32 secret (A-Z, 2-7). Regenerate or paste your own.') }}
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <FieldGroup class="space-y-3">
            <Field orientation="vertical">
              <FieldLabel for="otp-secret">
                {{ t('tools.otp-generator.secret') }}
              </FieldLabel>
              <FieldContent class="flex items-center flex-row gap-2">
                <Input
                  id="otp-secret"
                  v-model="secretModel"
                  :placeholder="t('tools.otp-generator.secretPlaceholder')"
                  class="font-mono flex-1"
                />
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="outline" size="icon" class="shrink-0" @click="refreshSecret">
                      <RefreshCw class="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{{ t('tools.otp-generator.generateTooltip') }}</TooltipContent>
                </Tooltip>
              </FieldContent>
              <FieldDescription v-if="secretErrors.length" class="text-destructive">
                {{ secretErrors[0] }}
              </FieldDescription>
            </Field>
          </FieldGroup>

          <Separator />

          <div class="flex flex-col items-center gap-3">
            <img
              :src="qrcode"
              alt="OTP QR"
              class="h-52 w-52 rounded-lg border bg-card object-contain p-3 shadow-sm"
            >
            <div class="text-center text-sm text-muted-foreground">
              {{ t('tools.otp-generator.qrCodeLabel', 'Scan this QR code with your authenticator app') }}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="flex items-center gap-2">
            <Info class="h-5 w-5 text-primary" />
            {{ t('tools.otp-generator.cardDetails', 'Technical details') }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <InputCopyable
            :label="t('tools.otp-generator.secretHex')"
            :value="base32toHex(secret)"
            readonly
            :placeholder="t('tools.otp-generator.secretHexPlaceholder')"
          />

          <InputCopyable
            :label="t('tools.otp-generator.epoch')"
            :value="Math.floor(now / 1000).toString()"
            readonly
            :placeholder="t('tools.otp-generator.epochPlaceholder')"
          />

          <InputCopyable
            :value="String(getCounterFromTime({ now, timeStep: 30 }))"
            readonly
            :label="t('tools.otp-generator.count')"
            label-position="left"
            label-width="120px"
            label-align="right"
            :placeholder="t('tools.otp-generator.countPlaceholder')"
          />

          <InputCopyable
            :value="getCounterFromTime({ now, timeStep: 30 }).toString(16).padStart(16, '0')"
            readonly
            :placeholder="t('tools.otp-generator.countHexPlaceholder')"
            label-position="left"
            label-width="120px"
            label-align="right"
            :label="t('tools.otp-generator.countHexLabel')"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
