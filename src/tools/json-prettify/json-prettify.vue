<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import JSON5 from 'json5';
import { Code2, Settings, Trash2 } from 'lucide-vue-next';
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
import { formatJson } from './json.models';

const inputElement = ref<HTMLElement>()

const { t } = useToolI18n()
const rawJson = ref('{"hello": "world", "foo": "bar"}')
const indentSize = useStorage('json-prettify:indent-size', 3)
const sortKeys = useStorage('json-prettify:sort-keys', true)
const cleanJson = computed(() => withDefaultOnError(() => formatJson({ rawJson, indentSize, sortKeys }), ''))

const rawJsonValidation = useValidation({
  source: rawJson,
  rules: computed(() => [
    {
      validator: (v: string) => v === '' || JSON5.parse(v),
      message: t('tools.json-prettify.invalidJson', 'Invalid JSON'),
    },
  ]),
})

function clearInput() {
  rawJson.value = ''
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
            {{ t('tools.json-prettify.cardOptionsTitle', 'Formatting options') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.json-prettify.cardOptionsDescription',
                'Tune indentation and key sorting behavior to match your preferred JSON style.',
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
                {{ t('tools.json-prettify.sortKeys', 'Sort keys') }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{
                  t(
                    'tools.json-prettify.sortKeysHelp',
                    'Sort object keys alphabetically for a more stable and readable output.',
                  )
                }}
              </p>
            </div>
            <Switch id="json-sort-keys" v-model="sortKeys" />
          </div>

          <div class="flex items-center justify-between rounded-lg border p-3">
            <div class="space-y-0.5">
              <p class="text-sm font-medium">
                {{ t('tools.json-prettify.indentSize', 'Indent size') }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{
                  t(
                    'tools.json-prettify.indentHint',
                    'Number of spaces to use for indentation (0–10).',
                  )
                }}
              </p>
            </div>
            <Input
              id="json-indent"
              v-model.number="indentSize"
              type="number"
              min="0"
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
            <Code2 class="h-5 w-5 text-primary" />
            {{ t('tools.json-prettify.cardInputTitle', 'JSON input') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.json-prettify.cardInputDescription',
                'Paste your JSON below. We will validate it (JSON5 compatible) and generate a formatted version.',
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
                v-model="rawJson"
                :placeholder="t('tools.json-prettify.pasteYourRawJson', 'Paste your raw JSON here...')"
                rows="16"
                class="max-h-96 resize-y overflow-y-auto font-mono"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />
              <div class="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" :disabled="rawJson.length === 0" @click="clearInput">
                  <Trash2 class="mr-2 h-4 w-4" />
                  {{ t('common.clear', 'Clear') }}
                </Button>
              </div>
              <Alert
                v-if="rawJsonValidation.status === 'error'"
                variant="destructive"
                class="border-destructive/40 bg-destructive/10"
              >
                <AlertTitle class="text-sm">
                  {{ t('tools.json-prettify.invalidJsonTitle', 'Invalid JSON') || t('tools.json-prettify.invalidJson', 'Invalid JSON') }}
                </AlertTitle>
                <AlertDescription class="text-xs">
                  {{ rawJsonValidation.message }}
                </AlertDescription>
              </Alert>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>

    <!-- Output card -->
    <Card v-if="rawJsonValidation.status !== 'error'" class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Code2 class="h-5 w-5 text-primary" />
            {{ t('tools.json-prettify.cardOutputTitle', 'Formatted JSON') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.json-prettify.cardOutputDescription',
                'Review and copy the formatted JSON output.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent>
              <TextareaCopyable :value="cleanJson" language="json" class="min-h-20" />
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  </div>
</template>
