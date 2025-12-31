<script setup lang="ts">
import { BarChart, Copy, FileText, Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'
import { formatBytes } from '@/utils/convert'
import { getStringSizeInBytes } from './text-statistics.service'

const { t } = useToolI18n();
const text = ref('');

const { copy } = useCopy({ source: text });

const charCount = computed(() => text.value.length);
const wordCount = computed(() => (text.value.trim() === '' ? 0 : text.value.trim().split(/\s+/).length));
const lineCount = computed(() => (text.value === '' ? 0 : text.value.split(/\r\n|\r|\n/).length));
const byteSize = computed(() => formatBytes(getStringSizeInBytes(text.value)));

function clearText() {
  text.value = '';
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <FileText class="h-5 w-5 text-primary" />
            {{ t('tools.text-statistics.cardInputTitle') }}
          </CardTitle>
          <CardDescription>{{ t('tools.text-statistics.cardInputDescription') }}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldContent>
            <div class="flex flex-col gap-3">
              <Textarea
                v-model="text"
                :placeholder="t('tools.text-statistics.placeholder')"
                rows="8"
                class="min-h-28 overflow-y-auto max-h-96"
              />

              <div class="flex justify-end gap-2">
                <Button variant="outline" class="gap-2" @click="clearText()">
                  <Trash2 class="h-4 w-4" />
                  {{ t('common.clear', 'Clear') }}
                </Button>
                <Button class="gap-2" @click="copy()">
                  <Copy class="h-4 w-4" />
                  {{ t('common.copyToClipboard', 'Copy') }}
                </Button>
              </div>
            </div>
          </FieldContent>
        </Field>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <BarChart class="h-5 w-5 text-primary" />
            {{ t('tools.text-statistics.cardResultsTitle') }}
          </CardTitle>
          <CardDescription>{{ t('tools.text-statistics.cardResultsDescription') }}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
          <div class="rounded-lg border bg-card px-3 py-4">
            <div class="text-sm text-muted-foreground">
              {{ t('tools.text-statistics.characterCount') }}
            </div>
            <div class="text-2xl font-semibold">
              {{ charCount }}
            </div>
          </div>
          <div class="rounded-lg border bg-card px-3 py-4">
            <div class="text-sm text-muted-foreground">
              {{ t('tools.text-statistics.wordCount') }}
            </div>
            <div class="text-2xl font-semibold">
              {{ wordCount }}
            </div>
          </div>
          <div class="rounded-lg border bg-card px-3 py-4">
            <div class="text-sm text-muted-foreground">
              {{ t('tools.text-statistics.lineCount') }}
            </div>
            <div class="text-2xl font-semibold">
              {{ lineCount }}
            </div>
          </div>
          <div class="rounded-lg border bg-card px-3 py-4">
            <div class="text-sm text-muted-foreground">
              {{ t('tools.text-statistics.byteSize') }}
            </div>
            <div class="text-2xl font-semibold">
              {{ byteSize }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
