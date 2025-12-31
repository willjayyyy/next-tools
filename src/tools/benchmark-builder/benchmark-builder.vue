<script setup lang="ts">
import { isNumber } from 'lodash';
import { Activity, Plus, Server, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCopy } from '@/composable/copy';
import { useToolI18n } from '@/composable/useToolI18n';

import { cn } from '@/lib/utils';
import { tableCellClasses, tableContainerClasses, tableHeadClasses, tableHeaderClasses } from '@/utils/table';
import { arrayToMarkdownTable, computeAverage, computeVariance } from './benchmark-builder.models';
import DynamicValues from './dynamic-values.vue';

const { t } = useToolI18n()

const defaultSuites = [
  { title: '', data: [null] },
  { title: '', data: [null] },
];

const suites = ref<{ title?: string, data: (number | null)[] }[]>(defaultSuites)

const unit = ref('')

const round = (v: number) => Math.round(v * 1000) / 1000

const results = computed(() => {
  return suites.value
    .map(({ data: dirtyData, title }, originalIndex) => {
      const data = dirtyData.filter(isNumber)

      return {
        title,
        size: data.length,
        mean: computeAverage({ data }),
        variance: computeVariance({ data }),
        originalIndex,
      }
    })
    .sort((a, b) => a.mean - b.mean)
    .map(({ mean, variance, size, title, originalIndex }, index, suites) => {
      const cleanUnit = unit.value.trim()
      const bestMean: number = suites[0]?.mean ?? 0
      const deltaWithBestMean = mean - bestMean
      const ratioWithBestMean = bestMean === 0 ? '∞' : round(mean / bestMean)

      const comparisonValues: string
        = index !== 0 && bestMean !== mean ? ` (+${round(deltaWithBestMean)}${cleanUnit} ; x${ratioWithBestMean})` : ''

      return {
        position: index + 1,
        title,
        mean: `${round(mean)}${cleanUnit}${comparisonValues}`,
        variance: `${round(variance)}${cleanUnit}${cleanUnit ? '²' : ''}`,
        size,
        originalIndex,
      }
    });
})

const { copy } = useCopy()

const header = computed(() => ({
  position: t('tools.benchmark-builder.header.position'),
  title: t('tools.benchmark-builder.header.title'),
  size: t('tools.benchmark-builder.header.size'),
  mean: t('tools.benchmark-builder.header.mean'),
  variance: t('tools.benchmark-builder.header.variance'),
}))

function copyAsMarkdown() {
  copy(arrayToMarkdownTable({ data: results.value, headerMap: header.value }))
}

function copyAsBulletList() {
  const bulletList = results.value
    .flatMap(({ title, ...sections }) => {
      return [
        ` - ${title}`,
        ...Object.entries(sections).map(
          ([key, value]) => `    - ${header.value[key as keyof typeof header.value] ?? key}: ${value}`,
        ),
      ]
    })
    .join('\n')

  copy(bulletList)
}
</script>

<template>
  <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
    <Card class="lg:flex-2 gap-0">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Server class="h-5 w-5 text-primary" />
            {{ t('tools.benchmark-builder.suitesTitle') }}
          </CardTitle>
          <CardDescription>
            {{ t('tools.benchmark-builder.suitesDescription') }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-4 lg:h-112 overflow-y-auto py-1">
          <template v-for="(suite, index) of suites" :key="index">
            <Card>
              <CardContent class="space-y-4">
                <div class="flex items-center justify-between gap-3">
                  <Input :model-value="suite.title || t('tools.benchmark-builder.suiteName', { index: index + 1 })" :placeholder="t('tools.benchmark-builder.suitePlaceholder')" class="flex-1" @update:model-value="(val) => (suite.title = val as string)" />
                  <Button
                    v-if="suites.length > 1"
                    variant="ghost"
                    size="sm"
                    title="Delete"
                    class="text-destructive active:text-destructive hover:text-destructive"
                    @click="suites.splice(index, 1)"
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div class="space-y-2">
                  <div v-if="suite.data.length" class="text-sm text-muted-foreground">
                    {{ t('tools.benchmark-builder.suiteValues') }}
                  </div>
                  <DynamicValues v-model:values="suite.data" />
                </div>
              </CardContent>
            </Card>
          </template>
        </div>
        <Button
          variant="default"
          size="sm"
          class="w-full"
          @click="
            suites.push({ data: [null], title: '' })
          "
        >
          <Plus class="mr-2 h-4 w-4" />
          {{ t('tools.benchmark-builder.addSuite') }}
        </Button>
      </CardContent>
    </Card>

    <Card class="lg:flex-3 gap-0">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Activity class="h-5 w-5 text-primary" />
            {{ t('tools.benchmark-builder.resultsTitle') }}
          </CardTitle>
          <CardDescription>
            {{ t('tools.benchmark-builder.resultsDescription') }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <!-- unit and reset on their own row -->
        <div class="flex items-center justify-end gap-3">
          <Input v-model="unit" :placeholder="t('tools.benchmark-builder.unitPlaceholder')" class="max-w-xs" />
          <Button
            variant="outline"
            size="sm"
            @click="
              suites = defaultSuites
            "
          >
            {{ t('tools.benchmark-builder.resetSuites') }}
          </Button>
        </div>

        <Table :container-class="cn(tableContainerClasses, 'lg:h-98 overflow-y-auto')">
          <TableHeader :class="tableHeaderClasses">
            <TableRow>
              <TableHead :class="tableHeadClasses">
                {{ header.position }}
              </TableHead>
              <TableHead :class="tableHeadClasses">
                {{ header.title }}
              </TableHead>
              <TableHead :class="tableHeadClasses">
                {{ header.size }}
              </TableHead>
              <TableHead :class="tableHeadClasses">
                {{ header.mean }}
              </TableHead>
              <TableHead :class="tableHeadClasses">
                {{ header.variance }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(row) in results" :key="row.title ?? row.originalIndex">
              <TableCell :class="cn(tableCellClasses, 'font-mono')">
                {{ row.position }}
              </TableCell>
              <TableCell :class="cn(tableCellClasses, 'font-mono')">
                {{ row.title || t('tools.benchmark-builder.suiteName', { index: (row.originalIndex ?? 0) + 1 }) }}
              </TableCell>
              <TableCell :class="cn(tableCellClasses, 'font-mono')">
                {{ row.size }}
              </TableCell>
              <TableCell :class="cn(tableCellClasses, 'font-mono')">
                {{ row.mean }}
              </TableCell>
              <TableCell :class="cn(tableCellClasses, 'font-mono')">
                {{ row.variance }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div class="flex gap-3 self-end">
          <Button @click="copyAsMarkdown()">
            {{ t('tools.benchmark-builder.copyMarkdown') }}
          </Button>
          <Button @click="copyAsBulletList()">
            {{ t('tools.benchmark-builder.copyBullet') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
