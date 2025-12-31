<script setup lang="ts">
import type { QRCodeErrorCorrectionLevel } from 'qrcode'
import type { ColorObject } from '@/components/color-picker/utils/types';
import { useStorage } from '@vueuse/core';
import { Copy, Download, Palette, QrCode, Settings2, X } from 'lucide-vue-next';

import ColorPickerWithTabs from '@/components/ColorPickerWithTabs.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useToolI18n } from '@/composable/useToolI18n';
import { hexToColorObject } from '@/utils/color';
import { useQRCode } from './useQRCode';

const foreground = useStorage('qrcode:foreground', '#000000ff')
const background = useStorage('qrcode:background', '#ffffffff')

const foregroundColorOpen = ref(false)
const backgroundColorOpen = ref(false)

const foregroundColor = computed({
  get: () => hexToColorObject(foreground.value),
  set: (val: ColorObject | null) => {
    if (val) { foreground.value = val.hexa }
  },
})

const backgroundColor = computed({
  get: () => hexToColorObject(background.value),
  set: (val: ColorObject | null) => {
    if (val) { background.value = val.hexa }
  },
})
const errorCorrectionLevel = useStorage<QRCodeErrorCorrectionLevel>('qrcode:errorCorrectionLevel', 'medium' as QRCodeErrorCorrectionLevel)

const { t } = useToolI18n()

const errorCorrectionLevels = computed(() => [
  { value: 'low', label: t('tools.qrcode-generator.levelLow', 'Low (~7%)') },
  { value: 'medium', label: t('tools.qrcode-generator.levelMedium', 'Medium (~15%)') },
  { value: 'quartile', label: t('tools.qrcode-generator.levelQuartile', 'Quartile (~25%)') },
  { value: 'high', label: t('tools.qrcode-generator.levelHigh', 'High (~30%)') },
])

const currentErrorCorrectionLabel = computed(() => {
  const found = errorCorrectionLevels.value.find(l => l.value === errorCorrectionLevel.value)
  return found ? found.label : t('tools.qrcode-generator.selectLevel', 'Select level')
});

const text = ref('https://next-tools.dev')
const { qrcode } = useQRCode({
  text,
  color: {
    background,
    foreground,
  },
  errorCorrectionLevel,
  options: { width: 1024, margin: 2.5 },
})

const { download } = useDownloadFileFromBase64({ source: qrcode, filename: 'qr-code.png' })
const { copy: copyText } = useCopy({ source: text })

function clearText() {
  text.value = ''
}

function resetColors() {
  foreground.value = '#000000ff'
  background.value = '#ffffffff'
}

const charCount = computed(() => text.value.length)
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardContent class="space-y-6">
        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Left: Input and Settings -->
          <div class="space-y-5 lg:col-span-2">
            <!-- Text Input -->
            <FieldSet class="gap-2">
              <Field orientation="vertical" class="gap-3">
                <div class="flex items-center justify-between">
                  <FieldLabel class="text-sm font-medium flex items-center gap-2">
                    {{ t('tools.qrcode-generator.text', 'Content') }}
                    <Badge variant="secondary" class="text-xs font-normal">
                      {{ charCount }} {{ t('tools.qrcode-generator.characters', 'chars') }}
                    </Badge>
                  </FieldLabel>
                  <div class="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          :disabled="!text"
                          @click="copyText()"
                        >
                          <Copy class="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{{ t('common.copyToClipboard', 'Copy') }}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          :disabled="!text"
                          @click="clearText"
                        >
                          <X class="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{{ t('common.clear', 'Clear') }}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <FieldContent>
                  <Textarea
                    id="qr-text"
                    v-model="text"
                    :placeholder="t('tools.qrcode-generator.yourLinkOrText', 'Enter URL or text to encode...')"
                    rows="4"
                    class="font-mono text-sm"
                  />
                </FieldContent>
              </Field>
            </FieldSet>

            <Separator />

            <!-- Color Settings -->
            <FieldSet class="gap-2">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2 text-sm font-medium">
                  <Palette class="h-4 w-4 text-muted-foreground" />
                  {{ t('tools.qrcode-generator.colorSettings', 'Color Settings') }}
                </div>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="ghost" size="sm" @click="resetColors">
                      {{ t('tools.qrcode-generator.resetColors', 'Reset') }}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{{ t('tools.qrcode-generator.resetColorsTooltip', 'Reset to default colors') }}</TooltipContent>
                </Tooltip>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field orientation="vertical" class="gap-2">
                  <FieldLabel for="qr-foreground" class="text-sm">
                    {{ t('tools.qrcode-generator.foregroundColor', 'Foreground') }}
                  </FieldLabel>
                  <FieldContent>
                    <div class="flex items-center gap-2">
                      <Popover v-model:open="foregroundColorOpen">
                        <PopoverTrigger as-child>
                          <Button
                            variant="outline"
                            class="h-8 w-14 p-1.5 shrink-0"
                          >
                            <div
                              class="h-full w-full rounded-sm"
                              :style="{ backgroundColor: foreground }"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-72 p-3" align="start">
                          <ColorPickerWithTabs v-model="foregroundColor" />
                        </PopoverContent>
                      </Popover>
                      <Input
                        v-model="foreground"
                        type="text"
                        class="flex-1 font-mono text-sm uppercase"
                        maxlength="9"
                      />
                    </div>
                  </FieldContent>
                </Field>
                <Field orientation="vertical" class="gap-2">
                  <FieldLabel for="qr-background" class="text-sm">
                    {{ t('tools.qrcode-generator.backgroundColor', 'Background') }}
                  </FieldLabel>
                  <FieldContent>
                    <div class="flex items-center gap-2">
                      <Popover v-model:open="backgroundColorOpen">
                        <PopoverTrigger as-child>
                          <Button
                            variant="outline"
                            class="h-8 w-14 p-1.5 shrink-0"
                          >
                            <div
                              class="h-full w-full rounded-sm"
                              :style="{ backgroundColor: background }"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-72 p-3" align="start">
                          <ColorPickerWithTabs v-model="backgroundColor" />
                        </PopoverContent>
                      </Popover>
                      <Input
                        v-model="background"
                        type="text"
                        class="flex-1 font-mono text-sm uppercase"
                        maxlength="9"
                      />
                    </div>
                  </FieldContent>
                </Field>
              </div>
            </FieldSet>

            <Separator />

            <!-- Error Correction -->
            <FieldSet>
              <Field orientation="vertical" class="gap-2">
                <FieldLabel for="qr-error" class="text-sm font-medium flex items-center gap-2">
                  <Settings2 class="h-4 w-4 text-muted-foreground" />
                  {{ t('tools.qrcode-generator.errorResistance', 'Error Correction Level') }}
                </FieldLabel>
                <FieldContent>
                  <Select v-model="errorCorrectionLevel">
                    <SelectTrigger id="qr-error" class="w-full sm:w-64">
                      <SelectValue>{{ currentErrorCorrectionLabel }}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="level in errorCorrectionLevels"
                          :key="level.value"
                          :value="level.value"
                        >
                          {{ level.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FieldContent>
                <p class="text-xs text-muted-foreground">
                  {{ t('tools.qrcode-generator.errorResistanceHint', 'Higher levels allow more damage tolerance but increase QR code density.') }}
                </p>
              </Field>
            </FieldSet>
          </div>

          <!-- Right: QR Code Preview -->
          <div class="flex flex-col items-center gap-4">
            <div class="text-sm font-medium text-muted-foreground">
              {{ t('tools.qrcode-generator.preview', 'Preview') }}
            </div>
            <div class="flex h-54 w-54 items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 transition-all hover:border-primary/50">
              <img
                v-if="qrcode && text"
                :src="qrcode"
                alt="QR Code"
                class="h-full w-full object-contain rounded-lg"
              >
              <div v-else class="text-center text-sm text-muted-foreground">
                <QrCode class="h-12 w-12 mx-auto mb-2 opacity-30" />
                {{ t('tools.qrcode-generator.emptyPreview', 'Enter text to generate QR code') }}
              </div>
            </div>
            <Button
              variant="default"
              class="w-full max-w-64"
              :disabled="!qrcode || !text"
              @click="download"
            >
              <Download class="mr-2 h-4 w-4" />
              {{ t('tools.qrcode-generator.downloadQrCode', 'Download PNG') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
