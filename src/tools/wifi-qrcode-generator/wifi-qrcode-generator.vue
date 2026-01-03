<script setup lang="ts">
import type { ColorObject } from '@/components/color-picker/utils/types';
import { useStorage } from '@vueuse/core';
import { Download, Eye, EyeOff, Lock, Palette, Settings2, User, Wifi } from 'lucide-vue-next';

import ColorPickerWithTabs from '@/components/ColorPickerWithTabs.vue';
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
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useToolI18n } from '@/composable/useToolI18n';
import { hexToColorObject } from '@/utils/color';
import {
  EAPMethods,
  EAPPhase2Methods,
  useWifiQRCode,
} from './useQRCode';

const foreground = useStorage('wifi-qrcode:foreground', '#000000ff')
const background = useStorage('wifi-qrcode:background', '#ffffffff')

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

const ssid = ref('')
const password = ref('')
type EapMethodType = (typeof EAPMethods)[number]
type EapPhase2Type = (typeof EAPPhase2Methods)[number]
const eapMethod = ref<EapMethodType>(EAPMethods[0])
const isHiddenSSID = ref(false)
const eapAnonymous = ref(false)
const eapIdentity = ref('')
const eapPhase2Method = ref<EapPhase2Type>(EAPPhase2Methods[0])
const showPassword = ref(false)

const { t } = useToolI18n()

const { qrcode, encryption } = useWifiQRCode({
  ssid,
  password,
  eapMethod,
  isHiddenSSID,
  eapAnonymous,
  eapIdentity,
  eapPhase2Method,
  color: {
    background,
    foreground,
  },
  options: { width: 1024, margin: 2.5 },
})
const encryptionOptions = computed(() => [
  { value: 'nopass', label: t('tools.wifi-qrcode-generator.noPassword') },
  { value: 'WPA', label: t('tools.wifi-qrcode-generator.wpaWpa2') },
  { value: 'WEP', label: t('tools.wifi-qrcode-generator.wep') },
  { value: 'WPA2-EAP', label: t('tools.wifi-qrcode-generator.wpa2Eap') },
])

const selectedEncryptionLabel = computed(() => {
  const opt = encryptionOptions.value.find(o => o.value === encryption.value)
  return opt?.label || t('tools.wifi-qrcode-generator.encryptionMethod')
});

const selectedEapMethodLabel = computed(() => {
  return eapMethod.value ? eapMethod.value : t('tools.wifi-qrcode-generator.selectEapMethod', 'Select EAP method')
});

const selectedPhase2Label = computed(() => {
  return eapPhase2Method.value ? eapPhase2Method.value : t('tools.wifi-qrcode-generator.selectPhase2', 'Select Phase 2 method')
});



const { download } = useDownloadFileFromBase64({ source: qrcode, filename: 'wifi-qr-code.png' })

function resetColors() {
  foreground.value = '#000000ff'
  background.value = '#ffffffff'
}

const canGenerate = computed(() => {
  if (!ssid.value) { return false }
  if (encryption.value !== 'nopass' && !password.value) { return false }
  return true
});
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardContent class="space-y-6">
        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Left: Input and Settings -->
          <div class="space-y-2 lg:col-span-2">
            <!-- Network Settings -->
            <FieldSet class="gap-2">
              <div class="flex items-center gap-2 mb-3 text-sm font-medium">
                <Wifi class="h-4 w-4 text-muted-foreground" />
                {{ t('tools.wifi-qrcode-generator.networkSettings', 'Network Settings') }}
              </div>

              <!-- Encryption Method -->
              <Field orientation="vertical" class="gap-2 mb-4">
                <FieldLabel class="text-sm">
                  {{ t('tools.wifi-qrcode-generator.encryptionMethod') }}
                </FieldLabel>
                <FieldContent>
                  <Select v-model="encryption">
                    <SelectTrigger class="w-full sm:w-64">
                      <SelectValue>
                        {{ selectedEncryptionLabel }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="option in encryptionOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <!-- SSID -->
              <Field orientation="vertical" class="gap-2 mb-4">
                <div class="flex items-center justify-between">
                  <FieldLabel class="text-sm">
                    {{ t('tools.wifi-qrcode-generator.ssidLabel', 'Network Name (SSID)') }}
                  </FieldLabel>
                  <div class="flex items-center gap-2">
                    <Switch
                      id="hidden-ssid"
                      v-model="isHiddenSSID"
                      class="scale-90"
                    />
                    <label for="hidden-ssid" class="text-xs text-muted-foreground cursor-pointer">
                      {{ t('tools.wifi-qrcode-generator.hiddenSsid') }}
                    </label>
                  </div>
                </div>
                <FieldContent>
                  <Input
                    v-model="ssid"
                    :placeholder="t('tools.wifi-qrcode-generator.ssidPlaceholder')"
                    class="font-mono"
                  />
                </FieldContent>
              </Field>

              <!-- Password -->
              <Field v-if="encryption !== 'nopass'" orientation="vertical" class="gap-2 mb-4">
                <FieldLabel class="text-sm flex items-center gap-2">
                  <Lock class="h-3.5 w-3.5 text-muted-foreground" />
                  {{ t('tools.wifi-qrcode-generator.passwordLabel', 'Password') }}
                </FieldLabel>
                <FieldContent>
                  <div class="relative">
                    <Input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      :placeholder="t('tools.wifi-qrcode-generator.passwordPlaceholder')"
                      class="font-mono pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="absolute right-1 top-1/2 -translate-y-1/2"
                      @click="showPassword = !showPassword"
                    >
                      <Eye v-if="!showPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                    </Button>
                  </div>
                </FieldContent>
              </Field>

              <!-- EAP Settings -->
              <template v-if="encryption === 'WPA2-EAP'">
                <Separator class="my-4" />
                <div class="flex items-center gap-2 mb-3 text-sm font-medium">
                  <Settings2 class="h-4 w-4 text-muted-foreground" />
                  {{ t('tools.wifi-qrcode-generator.eapSettings', 'EAP Settings') }}
                </div>

                <Field orientation="vertical" class="gap-2 mb-4">
                  <FieldLabel class="text-sm">
                    {{ t('tools.wifi-qrcode-generator.eapMethod') }}
                  </FieldLabel>
                  <FieldContent>
                    <Select v-model="eapMethod">
                      <SelectTrigger class="w-full sm:w-64">
                        <SelectValue>
                          {{ selectedEapMethodLabel }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            v-for="method in EAPMethods"
                            :key="method"
                            :value="method"
                          >
                            {{ method }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field orientation="vertical" class="gap-2 mb-4">
                  <div class="flex items-center justify-between">
                    <FieldLabel class="text-sm flex items-center gap-2">
                      <User class="h-3.5 w-3.5 text-muted-foreground" />
                      {{ t('tools.wifi-qrcode-generator.identityLabel', 'Identity') }}
                    </FieldLabel>
                    <div class="flex items-center gap-2">
                      <Switch
                        id="anonymous"
                        v-model="eapAnonymous"
                        class="scale-90"
                      />
                      <label for="anonymous" class="text-xs text-muted-foreground cursor-pointer">
                        {{ t('tools.wifi-qrcode-generator.anonymous') }}
                      </label>
                    </div>
                  </div>
                  <FieldContent>
                    <Input
                      v-model="eapIdentity"
                      :placeholder="t('tools.wifi-qrcode-generator.identityPlaceholder')"
                      :disabled="eapAnonymous"
                      class="font-mono"
                    />
                  </FieldContent>
                </Field>

                <Field orientation="vertical" class="gap-2">
                  <FieldLabel class="text-sm">
                    {{ t('tools.wifi-qrcode-generator.eapPhase2Method') }}
                  </FieldLabel>
                  <FieldContent>
                    <Select v-model="eapPhase2Method">
                      <SelectTrigger class="w-full sm:w-64">
                        <SelectValue>
                          {{ selectedPhase2Label }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            v-for="method in EAPPhase2Methods"
                            :key="method"
                            :value="method"
                          >
                            {{ method }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </template>
            </FieldSet>

            <Separator />

            <!-- Color Settings -->
            <FieldSet class="gap-2">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2 text-sm font-medium">
                  <Palette class="h-4 w-4 text-muted-foreground" />
                  {{ t('tools.wifi-qrcode-generator.colorSettings', 'Color Settings') }}
                </div>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="ghost" size="sm" @click="resetColors">
                      {{ t('tools.wifi-qrcode-generator.resetColors', 'Reset') }}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{{ t('tools.wifi-qrcode-generator.resetColorsTooltip', 'Reset to default colors') }}</TooltipContent>
                </Tooltip>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field orientation="vertical" class="gap-2">
                  <FieldLabel class="text-sm">
                    {{ t('tools.wifi-qrcode-generator.foregroundColor') }}
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
                  <FieldLabel class="text-sm">
                    {{ t('tools.wifi-qrcode-generator.backgroundColor') }}
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
          </div>

          <!-- Right: QR Code Preview -->
          <div class="flex flex-col items-center gap-4">
            <div class="text-sm font-medium text-muted-foreground">
              {{ t('tools.wifi-qrcode-generator.preview', 'Preview') }}
            </div>
            <div class="flex h-54 w-54 items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 transition-all hover:border-primary/50">
              <img
                v-if="qrcode && canGenerate"
                :src="qrcode"
                alt="WiFi QR Code"
                class="h-full w-full object-contain rounded-lg"
              >
              <div v-else class="text-center text-sm text-muted-foreground p-4">
                <Wifi class="h-12 w-12 mx-auto mb-2 opacity-30" />
                {{ t('tools.wifi-qrcode-generator.emptyPreview', 'Enter network details to generate QR code') }}
              </div>
            </div>
            <Button
              variant="default"
              class="w-full max-w-64"
              :disabled="!qrcode || !canGenerate"
              @click="download"
            >
              <Download class="mr-2 h-4 w-4" />
              {{ t('tools.wifi-qrcode-generator.downloadQrCode') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
