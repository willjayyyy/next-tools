<script setup lang="ts">
import {
  chineseSimplifiedWordList,
  chineseTraditionalWordList,
  czechWordList,
  englishWordList,
  entropyToMnemonic,
  frenchWordList,
  generateEntropy,
  italianWordList,
  japaneseWordList,
  koreanWordList,
  mnemonicToEntropy,
  portugueseWordList,
  spanishWordList,
} from '@it-tools/bip39'
import { Copy, RefreshCw } from 'lucide-vue-next'

import InputCopyable from '@/components/InputCopyable.vue';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopy } from '@/composable/copy';
import { useToolI18n } from '@/composable/useToolI18n';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t, locale } = useToolI18n()

const languages = {
  'Chinese simplified': chineseSimplifiedWordList,
  'Chinese traditional': chineseTraditionalWordList,
  'English': englishWordList,
  'Czech': czechWordList,
  'French': frenchWordList,
  'Italian': italianWordList,
  'Japanese': japaneseWordList,
  'Korean': koreanWordList,
  'Portuguese': portugueseWordList,
  'Spanish': spanishWordList,
}

// Map locale codes to BIP39 language names
const localeToLanguageMap: Record<string, keyof typeof languages> = {
  en: 'English',
  zh: 'Chinese simplified',
  fr: 'French',
  es: 'Spanish',
  pt: 'Portuguese',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  cs: 'Czech',
}

// Get default language based on current locale
function getDefaultLanguage(): keyof typeof languages {
  const currentLocale = locale.value;
  return localeToLanguageMap[currentLocale] || 'English';
}

const entropy = ref(generateEntropy())
const passphraseInput = ref('')

const language = ref<keyof typeof languages>(getDefaultLanguage())
const passphrase = computed({
  get() {
    return withDefaultOnError(() => entropyToMnemonic(entropy.value, languages[language.value]), passphraseInput.value)
  },
  set(value: string) {
    passphraseInput.value = value
    entropy.value = withDefaultOnError(() => mnemonicToEntropy(value, languages[language.value]), '')
  },
})

const entropyValidation = useValidation({
  source: entropy,
  rules: computed(() => [
    {
      validator: (value: string) => value === '' || (value.length <= 32 && value.length >= 16 && value.length % 4 === 0),
      message: t('tools.bip39-generator.entropyLength', 'Entropy length must be between 16 and 32 and a multiple of 4'),
    },
    {
      validator: (value: string) => /^[a-f0-9]*$/i.test(value),
      message: t('tools.bip39-generator.entropyHex', 'Entropy must be a hexadecimal string'),
    },
  ]),
})

const mnemonicValidation = useValidation({
  source: passphrase,
  rules: computed(() => [
    {
      validator: (value: string) => isNotThrowing(() => mnemonicToEntropy(value, languages[language.value])),
      message: t('tools.bip39-generator.invalidMnemonic', 'Invalid mnemonic'),
    },
  ]),
})

function refreshEntropy() {
  entropy.value = generateEntropy()
}

const { copy: copyPassphrase } = useCopy({
  source: passphrase,
})

const languageOptions = computed(() => Object.keys(languages).map(key => ({
  value: key,
  label: t(`tools.bip39-generator.languages.${key.replace(/\s+/g, '-').toLowerCase()}`),
})))

const getLanguageKey = (lang: string) => lang.replace(/\s+/g, '-').toLowerCase()
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <CardTitle>{{ t('tools.bip39-generator.cardLanguageTitle') }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6 px-6">
        <FieldSet>
          <FieldLabel for="language-english">
            {{ t('tools.bip39-generator.languageLabel') }}
          </FieldLabel>
          <FieldDescription>
            {{ t('tools.bip39-generator.languageDescription') }}
          </FieldDescription>
          <RadioGroup v-model="language" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <FieldLabel
              v-for="option in languageOptions"
              :id="`language-${getLanguageKey(option.value)}`"
              :key="option.value"
              class="cursor-pointer hover:bg-accent/50"
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{{ option.label }}</FieldTitle>
                </FieldContent>
                <RadioGroupItem :id="`language-${getLanguageKey(option.value)}`" :value="option.value" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Entropy Section -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('tools.bip39-generator.cardEntropyTitle') }}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <FieldGroup>
            <Field orientation="responsive">
              <FieldLabel for="entropy-input" class="w-32 text-right sm:text-right">
                {{ t('tools.bip39-generator.entropyLabel') }}
              </FieldLabel>
              <FieldContent class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <InputCopyable
                      id="entropy-input"
                      :value="entropy"
                      :placeholder="t('tools.bip39-generator.entropyPlaceholder')"
                      :field-props="{
                        orientation: 'horizontal',
                      }"
                      @update:value="(value: string) => (entropy = value)"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button variant="outline" size="icon-sm" @click="refreshEntropy()">
                        <RefreshCw class="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{{ t('tools.bip39-generator.generateNewEntropy', 'Generate new entropy') }}</TooltipContent>
                  </Tooltip>
                </div>
                <Alert v-if="entropyValidation.status === 'error'" variant="destructive">
                  <AlertTitle>{{ entropyValidation.message }}</AlertTitle>
                </Alert>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <!-- Passphrase Section -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('tools.bip39-generator.cardPassphraseTitle') }}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <FieldGroup>
            <Field orientation="responsive">
              <FieldLabel for="passphrase-input" class="w-32 text-right sm:text-right">
                {{ t('tools.bip39-generator.passphraseLabel') }}
              </FieldLabel>
              <FieldContent class="space-y-2">
                <Textarea
                  id="passphrase-input"
                  v-model="passphrase"
                  :placeholder="t('tools.bip39-generator.passphrasePlaceholder')"
                  rows="4"
                  class="min-h-24 font-mono"
                />
                <div class="flex justify-end">
                  <Button variant="outline" class="gap-2" @click="copyPassphrase()">
                    <Copy class="h-4 w-4" />
                    {{ t('common.copyToClipboard', 'Copy') }}
                  </Button>
                </div>
                <Alert v-if="mnemonicValidation.status === 'error'" variant="destructive">
                  <AlertTitle>{{ mnemonicValidation.message }}</AlertTitle>
                </Alert>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
