<script setup lang="ts">
import JSON5 from 'json5';
import { FileCode, X } from 'lucide-vue-next';
import { stringify } from 'yaml';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldGroup } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToolI18n } from '@/composable/useToolI18n';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const inputElement = ref<HTMLElement>()

const { t } = useToolI18n()

const jsonInput = ref('')
const formatYaml = ref(true)

const yamlOutput = computed(() => {
  if (!jsonInput.value.trim()) { return '' }
  return withDefaultOnError(() => {
    const obj = JSON5.parse(jsonInput.value)
    if (formatYaml.value) {
      return stringify(obj, { indent: 2 })
    }
    return stringify(obj, { indent: 0 })
  }, '')
});

const jsonInputValidation = useValidation({
  source: jsonInput,
  rules: computed(() => [
    {
      validator: (value: string) => !value.trim() || isNotThrowing(() => JSON5.parse(value)),
      message: t('tools.json-to-yaml-converter.invalidJson', 'Invalid JSON'),
    },
  ]),
})

function clearInput() {
  jsonInput.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <FileCode class="h-5 w-5 text-primary" />
            {{ t('tools.json-to-yaml-converter.cardInputTitle', 'JSON input') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.json-to-yaml-converter.cardInputDescription',
                'Paste your JSON content below, we will validate it and convert it to YAML.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent class="space-y-2">
              <Textarea
                id="json-input"
                ref="inputElement"
                v-model="jsonInput"
                :placeholder="t('tools.json-to-yaml-converter.inputPlaceholder', 'Paste your JSON here...')"
                rows="16"
                class="max-h-96 resize-y overflow-y-auto font-mono"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />
              <div class="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" @click="clearInput">
                  <X class="mr-2 h-4 w-4" />
                  {{ t('common.clear', 'Clear') }}
                </Button>
              </div>
              <Alert
                v-if="jsonInputValidation.status === 'error'"
                variant="destructive"
                class="border-destructive/40 bg-destructive/10"
              >
                <AlertTitle class="text-sm">
                  {{ t('tools.json-to-yaml-converter.invalidJsonTitle', 'Invalid JSON') || t('tools.json-to-yaml-converter.invalidJson', 'Invalid JSON') }}
                </AlertTitle>
                <AlertDescription class="text-xs">
                  {{ jsonInputValidation.message }}
                </AlertDescription>
              </Alert>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>

    <Card v-if="jsonInputValidation.status !== 'error'" class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <FileCode class="h-5 w-5 text-primary" />
            {{ t('tools.json-to-yaml-converter.cardOutputTitle', 'YAML output') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.json-to-yaml-converter.cardOutputDescription',
                'Review and copy the converted YAML representation of your JSON.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">
                  {{ t('tools.json-to-yaml-converter.formatYaml', 'Format YAML') }}
                </span>
                <Switch v-model="formatYaml" />
              </div>
              <TextareaCopyable :value="yamlOutput" language="yaml" class="min-h-20" />
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  </div>
</template>
