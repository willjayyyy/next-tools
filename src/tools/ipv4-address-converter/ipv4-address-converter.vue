<script setup lang="ts">
import { Network, X } from 'lucide-vue-next'
import CopyableCell from '@/components/CopyableCell.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldGroup } from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToolI18n } from '@/composable/useToolI18n'
import { useValidation } from '@/composable/validation'
import { cn } from '@/lib/utils'
import { tableCellClasses, tableContainerClasses, tableHeadClasses, tableHeaderClasses } from '@/utils/table'
import { convertBase } from '../base-converter/integer-base-converter.model'
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from './ipv4-address-converter.service'

const rawIpAddress = ref('192.168.1.1');

const { t } = useToolI18n();

const ipValidation = useValidation({
  source: rawIpAddress,
  rules: computed(() => [
    {
      message: t('tools.ipv4-address-converter.invalidIpv4', 'Invalid ipv4 address'),
      validator: (ip: string) => !ip.trim() || isValidIpv4({ ip }),
    },
  ]),
});

const convertedSections = computed(() => {
  if (ipValidation.status === 'error' || !rawIpAddress.value.trim()) {
    return [];
  }

  const ipInDecimal = ipv4ToInt({ ip: rawIpAddress.value });

  return [
    {
      label: t('tools.ipv4-address-converter.decimal', 'Decimal:'),
      value: String(ipInDecimal),
    },
    {
      label: t('tools.ipv4-address-converter.hexadecimal', 'Hexadecimal:'),
      value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
    },
    {
      label: t('tools.ipv4-address-converter.binary', 'Binary:'),
      value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
    },
    {
      label: t('tools.ipv4-address-converter.ipv6', 'Ipv6:'),
      value: ipv4ToIpv6({ ip: rawIpAddress.value }),
    },
    {
      label: t('tools.ipv4-address-converter.ipv6Short', 'Ipv6 (short):'),
      value: ipv4ToIpv6({ ip: rawIpAddress.value, prefix: '::ffff:' }),
    },
  ];
})

function clearInput() {
  rawIpAddress.value = '';
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Network class="h-5 w-5 text-primary" />
            {{ t('tools.ipv4-address-converter.cardInputTitle', 'IPv4 address') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.ipv4-address-converter.cardInputDescription',
                'Enter an IPv4 address to convert it to different formats (decimal, hexadecimal, binary, IPv6).',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldContent class="space-y-2">
              <Input
                id="ipv4-input"
                v-model="rawIpAddress"
                :placeholder="t('tools.ipv4-address-converter.inputPlaceholder', 'The ipv4 address...')"
                class="font-mono"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />
              <div class="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" :disabled="rawIpAddress.length === 0" @click="clearInput">
                  <X class="mr-2 h-4 w-4" />
                  {{ t('common.clear', 'Clear') }}
                </Button>
              </div>
              <Alert
                v-if="ipValidation.status === 'error'"
                variant="destructive"
                class="border-destructive/40 bg-destructive/10"
              >
                <AlertTitle class="text-sm">
                  {{ t('tools.ipv4-address-converter.invalidAddressTitle', 'Invalid address') }}
                </AlertTitle>
                <AlertDescription class="text-xs">
                  {{ ipValidation.message }}
                </AlertDescription>
              </Alert>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>

    <Card v-if="convertedSections.length > 0" class="gap-2">
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <Network class="h-5 w-5 text-primary" />
            {{ t('tools.ipv4-address-converter.cardResultsTitle', 'Converted formats') }}
          </CardTitle>
          <CardDescription>
            {{
              t(
                'tools.ipv4-address-converter.cardResultsDescription',
                'View the IPv4 address in different number systems and IPv6 formats.',
              )
            }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <Table :container-class="tableContainerClasses">
            <TableHeader :class="tableHeaderClasses">
              <TableRow>
                <TableHead :class="cn(tableHeadClasses)">
                  {{ t('tools.ipv4-address-converter.format', 'Format') }}
                </TableHead>
                <TableHead :class="tableHeadClasses">
                  {{ t('tools.ipv4-address-converter.value', 'Value') }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="{ label, value } in convertedSections" :key="label">
                <TableCell :class="cn(tableCellClasses, 'font-medium')">
                  {{ label }}
                </TableCell>
                <TableCell :class="tableCellClasses">
                  <CopyableCell :value="value" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
