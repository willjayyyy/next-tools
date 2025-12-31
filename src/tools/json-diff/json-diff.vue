<script setup lang="ts">
import JSON5 from 'json5';

import { Braces, Copy, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel, FieldSet } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'
import { useValidation } from '@/composable/validation'
import { isNotThrowing } from '@/utils/boolean'
import { withDefaultOnError } from '@/utils/defaults'
import DiffsViewer from './diff-viewer/diff-viewer.vue'

const { t } = useToolI18n();
const rawLeftJson = ref('');
const rawRightJson = ref('');

const leftJson = computed(() => withDefaultOnError(() => JSON5.parse(rawLeftJson.value), undefined));
const rightJson = computed(() => withDefaultOnError(() => JSON5.parse(rawRightJson.value), undefined));

const leftValidation = useValidation({
  source: rawLeftJson,
  rules: computed(() => [
    {
      validator: (value: string) => value === '' || isNotThrowing(() => JSON5.parse(value)),
      message: t('tools.json-diff.invalidJson', 'Invalid JSON'),
    },
  ]),
});

const rightValidation = useValidation({
  source: rawRightJson,
  rules: computed(() => [
    {
      validator: (value: string) => value === '' || isNotThrowing(() => JSON5.parse(value)),
      message: t('tools.json-diff.invalidJson', 'Invalid JSON'),
    },
  ]),
});

const { copy: copyLeft } = useCopy({ source: rawLeftJson });
const { copy: copyRight } = useCopy({ source: rawRightJson });

function clearLeft() {
  rawLeftJson.value = '';
}

function clearRight() {
  rawRightJson.value = '';
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Braces class="h-5 w-5 text-primary" />
            {{ t('tools.json-diff.cardInputTitle', 'JSON inputs') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.json-diff.cardInputDescription',
                'Paste two JSON documents below. We will validate them and show the differences.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <div class="grid gap-4 md:grid-cols-2">
            <Field orientation="vertical" class="gap-3">
              <div class="flex items-center justify-between">
                <FieldLabel for="left-json">
                  {{ t('tools.json-diff.firstJsonLabel') }}
                </FieldLabel>
                <div class="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" :disabled="!rawLeftJson" @click="copyLeft()">
                    <Copy class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" :disabled="!rawLeftJson" @click="clearLeft">
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FieldContent>
                <Textarea
                  id="left-json"
                  v-model="rawLeftJson"
                  :placeholder="t('tools.json-diff.firstJsonPlaceholder')"
                  rows="20"
                  class="max-h-96 resize-y overflow-y-auto font-mono text-sm"
                  :class="{ 'border-destructive': !leftValidation.isValid }"
                  data-test-id="leftJson"
                />
                <FieldError v-if="!leftValidation.isValid" class="text-xs">
                  {{ leftValidation.message }}
                </FieldError>
              </FieldContent>
            </Field>

            <Field orientation="vertical" class="gap-3">
              <div class="flex items-center justify-between">
                <FieldLabel for="right-json">
                  {{ t('tools.json-diff.compareJsonLabel') }}
                </FieldLabel>
                <div class="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" :disabled="!rawRightJson" @click="copyRight()">
                    <Copy class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" :disabled="!rawRightJson" @click="clearRight">
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FieldContent>
                <Textarea
                  id="right-json"
                  v-model="rawRightJson"
                  :placeholder="t('tools.json-diff.compareJsonPlaceholder')"
                  rows="20"
                  class="max-h-96 resize-y overflow-y-auto font-mono text-sm"
                  :class="{ 'border-destructive': !rightValidation.isValid }"
                  data-test-id="rightJson"
                />
                <FieldError v-if="!rightValidation.isValid" class="text-xs">
                  {{ rightValidation.message }}
                </FieldError>
              </FieldContent>
            </Field>
          </div>
        </FieldSet>
      </CardContent>
    </Card>

    <DiffsViewer :left-json="leftJson" :right-json="rightJson" />
  </div>
</template>
