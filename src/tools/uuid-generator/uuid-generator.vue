<script setup lang="ts">
import { Copy, RefreshCw } from 'lucide-vue-next';
import { v1 as generateUuidV1, v3 as generateUuidV3, v4 as generateUuidV4, v5 as generateUuidV5, NIL as nilUuid } from 'uuid';
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
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useToolI18n } from '@/composable/useToolI18n';
import { withDefaultOnError } from '@/utils/defaults'

const version = useStorage<'NIL' | 'v1' | 'v3' | 'v4' | 'v5'>('uuid-generator:version', 'v4')
const count = useStorage('uuid-generator:quantity', 1)
const v35Args = ref({ namespace: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: '' })

const { t } = useToolI18n()
const validUuidRules = [
  {
    message: t('tools.uuid-generator.invalidUuid'),
    validator: (value: string) => {
      if (value === nilUuid) {
        return true
      }

      return Boolean(value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/))
    },
  },
]

const generators = {
  NIL: () => nilUuid,
  v1: (index: number) => generateUuidV1({
    clockseq: index,
    msecs: Date.now(),
    nsecs: Math.floor(Math.random() * 10000),
    node: new Uint8Array(Array.from({ length: 6 }, () => Math.floor(Math.random() * 256))),
  }),
  v3: () => generateUuidV3(v35Args.value.name, v35Args.value.namespace),
  v4: () => generateUuidV4(),
  v5: () => generateUuidV5(v35Args.value.name, v35Args.value.namespace),
}

const [uuids, refreshUUIDs] = computedRefreshable(() => withDefaultOnError(() =>
  Array.from({ length: count.value }, (_ignored, index) => {
    const generator = generators[version.value] ?? generators.NIL
    return generator(index)
  }).join('\n'), ''))

const { copy } = useCopy({ source: uuids })

const namespacePresets = [
  { label: 'DNS', value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
  { label: 'URL', value: '6ba7b811-9dad-11d1-80b4-00c04fd430c8' },
  { label: 'OID', value: '6ba7b812-9dad-11d1-80b4-00c04fd430c8' },
  { label: 'X500', value: '6ba7b814-9dad-11d1-80b4-00c04fd430c8' },
]

const selectedNamespacePreset = computed(() => {
  const currentNamespace = v35Args.value.namespace
  const preset = namespacePresets.find(p => p.value === currentNamespace)
  return preset ? preset.value : 'custom'
});

function onNamespacePresetChange(value: string) {
  if (value === 'custom') {
    // Keep current namespace value for custom
    return
  }
  const preset = namespacePresets.find(p => p.value === value)
  if (preset) {
    v35Args.value.namespace = preset.value
  }
}

const namespaceError = computed(() => {
  if (version.value !== 'v3' && version.value !== 'v5') { return '' }
  const failed = validUuidRules.find(rule => !rule.validator(v35Args.value.namespace))
  return failed?.message ?? ''
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('tools.uuid-generator.cardConfigTitle') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6 px-6">
      <FieldGroup>
        <FieldSet>
          <FieldLabel for="uuid-version-nil">
            {{ t('tools.uuid-generator.uuidVersion') }}
          </FieldLabel>
          <FieldDescription>
            {{ t('tools.uuid-generator.uuidVersionDescription') }}
          </FieldDescription>
          <RadioGroup v-model="version" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <FieldLabel for="uuid-version-nil" class="cursor-pointer hover:bg-accent/50">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{{ t('tools.uuid-generator.versionNIL') }}</FieldTitle>
                  <FieldDescription>
                    {{ t('tools.uuid-generator.versionNILDescription') }}
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem id="uuid-version-nil" value="NIL" />
              </Field>
            </FieldLabel>
            <FieldLabel for="uuid-version-v1" class="cursor-pointer hover:bg-accent/50">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{{ t('tools.uuid-generator.versionV1') }}</FieldTitle>
                  <FieldDescription>
                    {{ t('tools.uuid-generator.versionV1Description') }}
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem id="uuid-version-v1" value="v1" />
              </Field>
            </FieldLabel>
            <FieldLabel for="uuid-version-v3" class="cursor-pointer hover:bg-accent/50">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{{ t('tools.uuid-generator.versionV3') }}</FieldTitle>
                  <FieldDescription>
                    {{ t('tools.uuid-generator.versionV3Description') }}
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem id="uuid-version-v3" value="v3" />
              </Field>
            </FieldLabel>
            <FieldLabel for="uuid-version-v4" class="cursor-pointer hover:bg-accent/50">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{{ t('tools.uuid-generator.versionV4') }}</FieldTitle>
                  <FieldDescription>
                    {{ t('tools.uuid-generator.versionV4Description') }}
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem id="uuid-version-v4" value="v4" />
              </Field>
            </FieldLabel>
            <FieldLabel for="uuid-version-v5" class="cursor-pointer hover:bg-accent/50">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{{ t('tools.uuid-generator.versionV5') }}</FieldTitle>
                  <FieldDescription>
                    {{ t('tools.uuid-generator.versionV5Description') }}
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem id="uuid-version-v5" value="v5" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>

        <Field orientation="responsive">
          <FieldLabel class="w-28 text-right sm:text-right">
            {{ t('tools.uuid-generator.quantity') }}
          </FieldLabel>
          <FieldContent>
            <Input v-model.number="count" type="number" min="1" max="50" :placeholder="t('tools.uuid-generator.uuidQuantity')" />
          </FieldContent>
        </Field>

        <template v-if="version === 'v3' || version === 'v5'">
          <FieldSet>
            <FieldLabel for="namespace-dns">
              {{ t('tools.uuid-generator.namespace') }}
            </FieldLabel>
            <FieldDescription>
              {{ t('tools.uuid-generator.namespaceDescription') }}
            </FieldDescription>
            <RadioGroup :model-value="selectedNamespacePreset" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" @update:model-value="onNamespacePresetChange">
              <FieldLabel for="namespace-dns" class="cursor-pointer hover:bg-accent/50">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{{ t('tools.uuid-generator.namespaceDNS') }}</FieldTitle>
                    <FieldDescription>
                      {{ t('tools.uuid-generator.namespaceDNSDescription') }}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id="namespace-dns" value="6ba7b810-9dad-11d1-80b4-00c04fd430c8" />
                </Field>
              </FieldLabel>
              <FieldLabel for="namespace-url" class="cursor-pointer hover:bg-accent/50">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{{ t('tools.uuid-generator.namespaceURL') }}</FieldTitle>
                    <FieldDescription>
                      {{ t('tools.uuid-generator.namespaceURLDescription') }}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id="namespace-url" value="6ba7b811-9dad-11d1-80b4-00c04fd430c8" />
                </Field>
              </FieldLabel>
              <FieldLabel for="namespace-oid" class="cursor-pointer hover:bg-accent/50">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{{ t('tools.uuid-generator.namespaceOID') }}</FieldTitle>
                    <FieldDescription>
                      {{ t('tools.uuid-generator.namespaceOIDDescription') }}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id="namespace-oid" value="6ba7b812-9dad-11d1-80b4-00c04fd430c8" />
                </Field>
              </FieldLabel>
              <FieldLabel for="namespace-x500" class="cursor-pointer hover:bg-accent/50">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{{ t('tools.uuid-generator.namespaceX500') }}</FieldTitle>
                    <FieldDescription>
                      {{ t('tools.uuid-generator.namespaceX500Description') }}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id="namespace-x500" value="6ba7b814-9dad-11d1-80b4-00c04fd430c8" />
                </Field>
              </FieldLabel>
              <FieldLabel for="namespace-custom" class="cursor-pointer hover:bg-accent/50">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{{ t('tools.uuid-generator.namespaceCustom') }}</FieldTitle>
                    <FieldDescription>
                      {{ t('tools.uuid-generator.namespaceCustomDescription') }}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id="namespace-custom" value="custom" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>

          <Field orientation="vertical">
            <FieldLabel for="uuid-namespace-input">
              {{ t('tools.uuid-generator.namespace') }}
            </FieldLabel>
            <FieldContent class="space-y-1">
              <Input
                id="uuid-namespace-input"
                v-model="v35Args.namespace"
                :placeholder="t('tools.uuid-generator.namespace')"
                :aria-invalid="Boolean(namespaceError)"
              />
              <p v-if="namespaceError" class="text-xs text-destructive">
                {{ namespaceError }}
              </p>
            </FieldContent>
          </Field>

          <Field orientation="vertical">
            <FieldLabel for="uuid-name-input">
              {{ t('tools.uuid-generator.name') }}
            </FieldLabel>
            <FieldContent>
              <Input
                id="uuid-name-input"
                v-model="v35Args.name"
                :placeholder="t('tools.uuid-generator.name')"
              />
            </FieldContent>
          </Field>
        </template>
      </FieldGroup>

      <Separator />

      <Field>
        <FieldLabel for="uuid-output">
          {{ t('tools.uuid-generator.yourUuids') }}
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="uuid-output"
            :value="uuids"
            readonly
            :placeholder="t('tools.uuid-generator.yourUuids')"
            rows="4"
            class="font-mono text-center"
          />
        </FieldContent>
      </Field>

      <div class="flex justify-center gap-3">
        <Button variant="default" class="gap-2" @click="copy()">
          <Copy class="h-4 w-4" />
          {{ t('tools.uuid-generator.copy') }}
        </Button>
        <Button variant="outline" class="gap-2" @click="refreshUUIDs">
          <RefreshCw class="h-4 w-4" />
          {{ t('tools.uuid-generator.refresh') }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
