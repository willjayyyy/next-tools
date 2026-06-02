<script setup lang="ts">
import type { ScanResult } from './useBarcodeScanner'
import { useDevicesList, useStorage } from '@vueuse/core'
import {
  AlertCircle,
  Camera,
  CirclePlay,
  ExternalLink,
  Image as ImageIcon,
  RotateCcw,
  ScanLine,
  ShieldAlert,
  Square,
  Upload,
  Video,
} from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InputCopyable from '@/components/InputCopyable.vue'
import { useToolI18n } from '@/composable/useToolI18n'
import { ContentType, detectContentType, formatLabel, toActionHref } from './barcode-scanner.service'
import { useBarcodeScanner } from './useBarcodeScanner'

enum Tab {
  Image = 'image',
  Camera = 'camera',
}

enum CameraStatus {
  Idle = 'idle',
  Scanning = 'scanning',
}

const { t } = useToolI18n()
const { decodeImage, startCameraScan, stopCameraScan } = useBarcodeScanner()

// Persisted preferences (not user data): which tab and which camera were last used.
const activeTab = useStorage<Tab>('barcode-scanner:active-tab', Tab.Image)
const currentCamera = useStorage('barcode-scanner:camera-device', '')

const result = ref<ScanResult | null>(null)
const errorKey = ref('')

// Image-tab state
const fileInput = ref<HTMLInputElement>()
const imagePreview = ref('')
const isDragging = ref(false)

// Camera-tab state
const video = ref<HTMLVideoElement>()
const cameraStatus = ref<CameraStatus>(CameraStatus.Idle)
const permissionCannotBePrompted = ref(false)

const {
  videoInputs: cameras,
  permissionGranted,
  isSupported,
  ensurePermissions,
} = useDevicesList({ constraints: { video: true } })

const errorMessage = computed(() => (errorKey.value ? t(errorKey.value, 'An error occurred') : ''))

const currentCameraLabel = computed(() => {
  const cam = cameras.value.find(c => c.deviceId === currentCamera.value)
  return cam?.label || t('tools.barcode-scanner.unknownCamera', 'Camera')
})

// Classify the decoded payload to offer a relevant quick action.
const contentType = computed<ContentType | null>(() =>
  result.value ? detectContentType(result.value.text) : null,
)

const actionHref = computed(() =>
  result.value && contentType.value ? toActionHref(contentType.value, result.value.text) : null,
)

const actionLabel = computed(() => {
  switch (contentType.value) {
    case ContentType.Url:
      return t('tools.barcode-scanner.openLink', 'Open link')
    case ContentType.Email:
      return t('tools.barcode-scanner.sendEmail', 'Send email')
    case ContentType.Phone:
      return t('tools.barcode-scanner.call', 'Call number')
    default:
      return ''
  }
})

const resultFormatLabel = computed(() => (result.value ? formatLabel(result.value.format) : ''))

function setResult(scan: ScanResult) {
  result.value = scan
  errorKey.value = ''
}

// --- Image tab ---

async function handleFile(file: File) {
  errorKey.value = ''

  if (!file.type.startsWith('image/')) {
    errorKey.value = 'errorInvalidFileType'
    return
  }

  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = URL.createObjectURL(file)

  const outcome = await decodeImage(file)
  if (!outcome.ok) {
    result.value = null
    errorKey.value = outcome.errorKey
    return
  }

  setResult(outcome.result)
}

function onFileInputChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    handleFile(file)
  }
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    handleFile(file)
  }
}

// --- Camera tab ---

async function startScan() {
  errorKey.value = ''
  permissionCannotBePrompted.value = false

  try {
    await ensurePermissions()
  }
  catch {
    permissionCannotBePrompted.value = true
    return
  }

  if (!video.value) {
    return
  }

  try {
    cameraStatus.value = CameraStatus.Scanning
    await startCameraScan(currentCamera.value || undefined, video.value, (scan) => {
      cameraStatus.value = CameraStatus.Idle
      setResult(scan)
    })
  }
  catch (error) {
    console.error('Failed to start camera scan:', error)
    cameraStatus.value = CameraStatus.Idle
    errorKey.value = 'errorCameraFailed'
  }
}

function stopScan() {
  stopCameraScan()
  cameraStatus.value = CameraStatus.Idle
}

function rescan() {
  result.value = null
  startScan()
}

// Restart the scan when the user switches camera mid-session.
watch(currentCamera, () => {
  if (cameraStatus.value === CameraStatus.Scanning) {
    startScan()
  }
})

// Release the camera and preview URL when leaving the tool.
onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})

// Stop scanning when the user navigates away from the camera tab.
watch(activeTab, (tab) => {
  if (tab !== Tab.Camera) {
    stopScan()
  }
})
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <ScanLine class="h-5 w-5 text-primary" />
          {{ t('tools.barcode-scanner.cardTitle', 'Barcode & QR Scanner') }}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2 sm:max-w-sm">
            <TabsTrigger :value="Tab.Image" data-testid="tab-image">
              <ImageIcon class="mr-2 h-4 w-4" />
              {{ t('tools.barcode-scanner.tabImage', 'Image') }}
            </TabsTrigger>
            <TabsTrigger :value="Tab.Camera" data-testid="tab-camera">
              <Camera class="mr-2 h-4 w-4" />
              {{ t('tools.barcode-scanner.tabCamera', 'Camera') }}
            </TabsTrigger>
          </TabsList>

          <!-- Image upload tab -->
          <TabsContent :value="Tab.Image" class="mt-6">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              data-testid="file-input"
              @change="onFileInputChange"
            >
            <button
              type="button"
              data-testid="drop-zone"
              class="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/20 px-6 py-12 text-center transition-all hover:border-primary/50"
              :class="isDragging ? 'border-primary bg-primary/5' : 'border-border'"
              @click="fileInput?.click()"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="preview"
                class="max-h-56 max-w-full rounded-lg object-contain"
              >
              <template v-else>
                <Upload class="h-10 w-10 text-muted-foreground" />
                <div class="space-y-1">
                  <p class="text-sm font-medium">
                    {{ t('tools.barcode-scanner.dropTitle', 'Drop an image or click to upload') }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ t('tools.barcode-scanner.dropHint', 'Scan a QR code or barcode from an image file') }}
                  </p>
                </div>
              </template>
            </button>
          </TabsContent>

          <!-- Camera tab -->
          <TabsContent :value="Tab.Camera" class="mt-6">
            <!-- Not supported -->
            <Alert v-if="!isSupported" variant="destructive">
              <AlertCircle class="h-4 w-4" />
              <AlertTitle>{{ t('tools.barcode-scanner.notSupportedTitle', 'Not Supported') }}</AlertTitle>
              <AlertDescription>
                {{ t('tools.barcode-scanner.notSupported', 'Your browser does not support camera access.') }}
              </AlertDescription>
            </Alert>

            <div v-else class="space-y-4">
              <!-- Permission blocked -->
              <Alert v-if="permissionCannotBePrompted" variant="destructive" data-testid="permission-blocked">
                <ShieldAlert class="h-4 w-4" />
                <AlertTitle>{{ t('tools.barcode-scanner.permissionBlockedTitle', 'Permission Blocked') }}</AlertTitle>
                <AlertDescription>
                  {{ t('tools.barcode-scanner.permissionBlocked', 'Camera permission was denied. Enable it in your browser settings (usually the lock icon in the address bar).') }}
                </AlertDescription>
              </Alert>

              <!-- Camera selection (once permission grants device labels) -->
              <Field v-if="permissionGranted && cameras.length > 1" orientation="vertical" class="gap-2">
                <FieldLabel class="flex items-center gap-2 text-sm">
                  <Video class="h-3.5 w-3.5 text-muted-foreground" />
                  {{ t('tools.barcode-scanner.camera', 'Camera') }}
                </FieldLabel>
                <FieldContent>
                  <Select v-model="currentCamera">
                    <SelectTrigger data-testid="camera-select">
                      <SelectValue :placeholder="currentCameraLabel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="cam in cameras"
                          :key="cam.deviceId"
                          :value="cam.deviceId"
                        >
                          {{ cam.label || t('tools.barcode-scanner.unknownCamera', 'Camera') }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <!-- Live preview -->
              <!--
                A fixed 16:9 box reserves stable height before the stream arrives,
                so the layout does not jump when the first frame loads.
              -->
              <div
                class="relative aspect-video max-h-120 w-full overflow-hidden rounded-lg border bg-black"
                :class="cameraStatus === CameraStatus.Scanning ? 'block' : 'hidden'"
              >
                <video ref="video" autoplay muted playsinline class="absolute inset-0 h-full w-full object-contain" />
                <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div class="h-48 w-48 rounded-lg border-2 border-primary/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                </div>
                <Badge variant="destructive" class="absolute left-3 top-3 animate-pulse">
                  {{ t('tools.barcode-scanner.scanning', 'Scanning…') }}
                </Badge>
              </div>

              <!-- Controls -->
              <div class="flex justify-center">
                <Button
                  v-if="cameraStatus === CameraStatus.Idle"
                  size="lg"
                  data-testid="start-scan-btn"
                  @click="startScan"
                >
                  <CirclePlay class="mr-2 h-5 w-5" />
                  {{ t('tools.barcode-scanner.startScan', 'Start scanning') }}
                </Button>
                <Button
                  v-else
                  size="lg"
                  variant="destructive"
                  data-testid="stop-scan-btn"
                  @click="stopScan"
                >
                  <Square class="mr-2 h-5 w-5" />
                  {{ t('tools.barcode-scanner.stopScan', 'Stop') }}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <!-- Error -->
        <Alert v-if="errorKey" variant="destructive" role="alert" class="mt-6" data-testid="error-message">
          <AlertCircle class="h-4 w-4" />
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>

    <!-- Result -->
    <Card v-if="result" data-testid="result-card">
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-base">
          <ScanLine class="h-4 w-4 text-primary" />
          {{ t('tools.barcode-scanner.resultTitle', 'Scan Result') }}
          <Badge variant="secondary" data-testid="result-format">
{{ resultFormatLabel }}
</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputCopyable
          data-testid="result-text"
          :value="result.text"
          :label="t('tools.barcode-scanner.decodedContent', 'Decoded content')"
          readonly
        />

        <div v-if="cameraStatus === CameraStatus.Idle" class="flex flex-wrap gap-2">
          <Button v-if="actionHref" as-child variant="default">
            <a :href="actionHref" target="_blank" rel="noopener noreferrer" data-testid="result-action">
              <ExternalLink class="mr-2 h-4 w-4" />
              {{ actionLabel }}
            </a>
          </Button>
          <Button
            v-if="activeTab === Tab.Camera"
            variant="outline"
            data-testid="rescan-btn"
            @click="rescan"
          >
            <RotateCcw class="mr-2 h-4 w-4" />
            {{ t('tools.barcode-scanner.scanAgain', 'Scan another') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
