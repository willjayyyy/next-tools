<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { CodeXml, Settings, Trash2 } from 'lucide-vue-next';
import yaml from 'yaml';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToolI18n } from '@/composable/useToolI18n';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import { formatYaml } from './yaml-models';

const inputElement = ref<HTMLElement>()
const { t } = useToolI18n()

const rawYaml = useStorage('yaml-prettify:raw-yaml', '')
const indentSize = useStorage('yaml-prettify:indent-size', 2)
const sortKeys = useStorage('yaml-prettify:sort-keys', false)

const cleanYaml = computed(() => withDefaultOnError(() => formatYaml({ rawYaml, indentSize, sortKeys }), ''))

const rawYamlValidation = useValidation({
  source: rawYaml,
  rules: computed(() => [
    {
      validator: (v: string) => v === '' || yaml.parse(v),
      message: t('tools.yaml-viewer.invalid', 'Invalid YAML'),
    },
  ]),
})

function clearInput() {
  rawYaml.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Options card -->
    <Card class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Settings class="h-5 w-5 text-primary" />
            {{ t('tools.yaml-viewer.cardOptionsTitle', 'Formatting options') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.yaml-viewer.cardOptionsDescription',
                'Tune indentation and key sorting behavior to match your preferred YAML style.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex items-center justify-between rounded-lg border p-3">
            <div class="space-y-0.5">
              <p class="text-sm font-medium">
                {{ t('tools.yaml-viewer.sortKeys', 'Sort keys') }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{
                  t(
                    'tools.yaml-viewer.sortKeysHelp',
                    'Sort object keys alphabetically for a more stable and readable output.',
                  )
                }}
              </p>
            </div>
            <Switch id="yaml-sort-keys" v-model="sortKeys" />
          </div>

          <div class="flex items-center justify-between rounded-lg border p-3">
            <div class="space-y-0.5">
              <p class="text-sm font-medium">
                {{ t('tools.yaml-viewer.indent', 'Indent size') }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{
                  t(
                    'tools.yaml-viewer.indentHint',
                    'Number of spaces to use for indentation (1–10).',
                  )
                }}
              </p>
            </div>
            <Input
              id="yaml-indent"
              v-model.number="indentSize"
              type="number"
              min="1"
              max="10"
              class="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Input card -->
    <Card class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <CodeXml class="h-5 w-5 text-primary" />
            {{ t('tools.yaml-viewer.cardInputTitle', 'YAML input') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.yaml-viewer.cardInputDescription',
                'Paste your YAML below. We will validate it and generate a formatted version.',
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
                id="yaml-input"
                ref="inputElement"
                v-model="rawYaml"
                :placeholder="t('tools.yaml-viewer.inputPlaceholder', 'Paste your YAML here...')"
                rows="16"
                class="max-h-96 resize-y overflow-y-auto font-mono"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />
              <div class="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" :disabled="rawYaml.length === 0" @click="clearInput">
                  <Trash2 class="mr-2 h-4 w-4" />
                  {{ t('common.clear', 'Clear') }}
                </Button>
              </div>
              <Alert
                v-if="rawYamlValidation.status === 'error'"
                variant="destructive"
                class="border-destructive/40 bg-destructive/10"
              >
                <AlertTitle class="text-sm">
                  {{ t('tools.yaml-viewer.invalidYamlTitle', 'Invalid YAML') || t('tools.yaml-viewer.invalid', 'Invalid YAML') }}
                </AlertTitle>
                <AlertDescription class="text-xs">
                  {{ rawYamlValidation.message }}
                </AlertDescription>
              </Alert>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>

    <!-- Output card -->
    <Card v-if="rawYamlValidation.status !== 'error'" class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <CodeXml class="h-5 w-5 text-primary" />
            {{ t('tools.yaml-viewer.cardOutputTitle', 'Formatted YAML') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.yaml-viewer.cardOutputDescription',
                'Review and copy the formatted YAML output.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent>
              <TextareaCopyable :value="cleanYaml" language="yaml" class="min-h-20" />
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  </div>
</template>
