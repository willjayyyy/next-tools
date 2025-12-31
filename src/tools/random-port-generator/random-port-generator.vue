<script setup lang="ts">
import { Copy, RefreshCw } from 'lucide-vue-next';

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { computedRefreshable } from '@/composable/computedRefreshable'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'
import { generatePort } from './random-port-generator.model'

const [port, refreshPort] = computedRefreshable(() => String(generatePort()));

const { t } = useToolI18n();
const { copy } = useCopy({ source: port });

const portNumber = computed(() => Number(port.value));
const portCategory = computed<'registered' | 'dynamic'>(() =>
  portNumber.value >= 49152 ? 'dynamic' : 'registered',
);
</script>

<template>
  <Card>
    <CardContent class="flex flex-col items-center gap-4 pb-6 pt-2">
      <div class="flex flex-col items-center gap-2">
        <div class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {{ t('tools.random-port-generator.currentPortLabel', 'Current port') }}
        </div>
        <div class="rounded-xl border bg-card px-6 py-3 text-4xl font-semibold tabular-nums">
          {{ port }}
        </div>
        <Badge
          :variant="portCategory === 'registered' ? 'secondary' : 'default'"
          class="mt-1 text-[11px] font-medium"
        >
          {{
            t(
              portCategory === 'registered'
                ? 'tools.random-port-generator.categoryRegistered'
                : 'tools.random-port-generator.categoryDynamic',
              portCategory === 'registered'
                ? 'Registered port (1024–49151)'
                : 'Dynamic / private port (49152–65535)',
            )
          }}
        </Badge>
      </div>

      <p class="mt-1 max-w-md text-center text-xs text-muted-foreground">
        {{
          t(
            'tools.random-port-generator.rangeHint',
            'Ports below 1024 are usually reserved for system services. This tool only generates ports between 1024 and 65535.',
          )
        }}
      </p>

      <div class="mt-2 flex justify-center gap-3">
        <Button variant="default" class="gap-2" @click="copy()">
          <Copy class="h-4 w-4" />
          {{ t('tools.random-port-generator.copy') }}
        </Button>
        <Button variant="outline" class="gap-2" @click="refreshPort">
          <RefreshCw class="h-4 w-4" />
          {{ t('tools.random-port-generator.refresh') }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
