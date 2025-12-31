<script setup lang="ts">
import { Copy, Info, Key, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'
import { useValidation } from '@/composable/validation'
import { cn } from '@/lib/utils'
import { isNotThrowing } from '@/utils/boolean'
import { withDefaultOnError } from '@/utils/defaults'
import { tableCellClasses, tableContainerClasses, tableHeadClasses, tableHeaderClasses } from '@/utils/table'
import { decodeJwt } from './jwt-parser.service'

const { t } = useToolI18n();
const rawJwt = ref(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
);

const decodedJWT = computed(() =>
  withDefaultOnError(() => decodeJwt({ jwt: rawJwt.value, t }), { header: [], payload: [] }),
);

const sections = computed(() => ([
  { key: 'header', title: t('tools.jwt-parser.header'), icon: Key },
  { key: 'payload', title: t('tools.jwt-parser.payload'), icon: Info },
] as const));

const validation = useValidation({
  source: rawJwt,
  rules: computed(() => [
    {
      validator: (value: string) => value.length > 0 && isNotThrowing(() => decodeJwt({ jwt: rawJwt.value })),
      message: t('tools.jwt-parser.invalid', 'Invalid JWT'),
    },
  ]),
});

const { copy } = useCopy();

function clearInput() {
  rawJwt.value = '';
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <div class="space-y-1">
          <CardTitle>{{ t('tools.jwt-parser.cardTitle', 'JWT Parser') }}</CardTitle>
          <CardDescription>
            {{ t('tools.jwt-parser.cardDescription', 'Decode and inspect JWT tokens to view header and payload information.') }}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <FieldSet>
          <Field orientation="vertical" class="gap-3">
            <div class="flex items-center justify-between">
              <FieldLabel class="text-sm font-medium">
                {{ t('tools.jwt-parser.label') }}
              </FieldLabel>
              <div class="flex gap-2">
                <Button size="sm" variant="ghost" @click="copy(rawJwt)">
                  <Copy class="h-4 w-4" />
                  {{ t('common.copyToClipboard', 'Copy') }}
                </Button>
                <Button size="sm" variant="ghost" @click="clearInput">
                  <X class="h-4 w-4" />
                  {{ t('common.clear', 'Clear') }}
                </Button>
              </div>
            </div>
            <FieldContent>
              <Textarea
                v-model="rawJwt"
                :placeholder="t('tools.jwt-parser.placeholder')"
                class="max-h-96 resize-y overflow-y-auto font-mono text-sm break-all"
                rows="4"
                autofocus
              />
            </FieldContent>
            <FieldDescription v-if="validation.status === 'error'" class="text-destructive">
              {{ validation.message }}
            </FieldDescription>
          </Field>
        </FieldSet>
      </CardContent>
    </Card>

    <template v-if="validation.isValid && decodedJWT">
      <Card v-for="section of sections" :key="section.key" class="flex flex-col">
        <CardHeader class="pb-3">
          <CardTitle class="flex items-center gap-2">
            <component :is="section.icon" class="h-5 w-5 text-primary" />
            {{ section.title }}
          </CardTitle>
          <CardDescription>
            {{ t(`tools.jwt-parser.${section.key}Description`, section.key === 'header' ? 'JWT header contains metadata about the token.' : 'JWT payload contains the claims and data.') }}
          </CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
          <div v-if="decodedJWT[section.key] && decodedJWT[section.key].length > 0">
            <Table :container-class="cn(tableContainerClasses, 'max-h-100 overflow-y-auto')">
              <TableHeader :class="tableHeaderClasses">
                <TableRow>
                  <TableHead :class="cn(tableHeadClasses, 'w-1/3')">
                    {{ t('tools.jwt-parser.claim', 'Claim') }}
                  </TableHead>
                  <TableHead :class="tableHeadClasses">
                    {{ t('tools.jwt-parser.value', 'Value') }}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="{ claim, claimDescription, friendlyValue, value } in decodedJWT[section.key]"
                  :key="claim"
                >
                  <TableCell :class="tableCellClasses">
                    <div class="flex flex-col gap-1">
                      <div class="flex items-center gap-2">
                        <span class="font-semibold">{{ claim }}</span>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          class="h-6 w-6"
                          @click="copy(value)"
                        >
                          <Copy class="h-3 w-3" />
                        </Button>
                      </div>
                      <Badge v-if="claimDescription" variant="secondary" class="w-fit text-xs">
                        {{ claimDescription }}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="space-y-1">
                      <div class="break-all font-mono text-sm">
                        {{ value }}
                      </div>
                      <div v-if="friendlyValue" class="text-xs text-muted-foreground">
                        {{ friendlyValue }}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div v-else class="rounded-lg border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
            {{ t('tools.jwt-parser.noClaims', 'No claims found in this section.') }}
          </div>
        </CardContent>
      </Card>
    </template>

    <Card v-else-if="rawJwt.trim() && !validation.isValid">
      <CardContent class="py-8 text-center text-sm text-muted-foreground">
        {{ t('tools.jwt-parser.enterValidJwt', 'Please enter a valid JWT token to decode.') }}
      </CardContent>
    </Card>
  </div>
</template>
