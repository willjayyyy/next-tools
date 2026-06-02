import type { IScannerControls } from '@zxing/browser'
import type { BarcodeFormat } from '@zxing/library'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { DecodeHintType, NotFoundException } from '@zxing/library'
import { onBeforeUnmount } from 'vue'
import { SUPPORTED_FORMATS } from './barcode-scanner.service'

export interface ScanResult {
  text: string
  format: BarcodeFormat
}

export type DecodeOutcome =
  | { ok: true, result: ScanResult }
  | { ok: false, errorKey: string }

/**
 * Encapsulates the ZXing reader lifecycle for both decode paths:
 * still-image decoding and continuous camera scanning.
 *
 * The reader is created lazily (and only once) so the heavy ZXing module
 * stays out of the way until the user actually scans something. Camera
 * scanning uses "scan-then-stop": the stream is released as soon as the
 * first code is found.
 */
export function useBarcodeScanner() {
  let reader: BrowserMultiFormatReader | null = null
  let controls: IScannerControls | null = null

  function getReader(): BrowserMultiFormatReader {
    if (!reader) {
      // Restrict decoding to the supported formats and try harder on
      // low-quality frames (rotated / partially occluded codes).
      const hints = new Map<DecodeHintType, unknown>()
      hints.set(DecodeHintType.POSSIBLE_FORMATS, SUPPORTED_FORMATS)
      hints.set(DecodeHintType.TRY_HARDER, true)
      reader = new BrowserMultiFormatReader(hints)
    }
    return reader
  }

  /**
   * Decode a single still image (uploaded or dropped file).
   *
   * @param file - Image file to scan
   * @returns Decode outcome with the result or an i18n error key
   */
  async function decodeImage(file: File): Promise<DecodeOutcome> {
    const url = URL.createObjectURL(file)
    try {
      const result = await getReader().decodeFromImageUrl(url)
      return { ok: true, result: { text: result.getText(), format: result.getBarcodeFormat() } }
    }
    catch (error) {
      // No code in the image is an expected outcome, not a failure to log.
      if (error instanceof NotFoundException) {
        return { ok: false, errorKey: 'errorNoCodeFound' }
      }
      console.error('Unexpected error while decoding image:', error)
      return { ok: false, errorKey: 'errorDecodeFailed' }
    }
    finally {
      URL.revokeObjectURL(url)
    }
  }

  /**
   * Start continuous scanning from a camera, stopping on the first hit.
   *
   * @param deviceId - Camera device id, or undefined for the default camera
   * @param video - Video element used as the live preview
   * @param onResult - Called once with the first decoded code
   */
  async function startCameraScan(
    deviceId: string | undefined,
    video: HTMLVideoElement,
    onResult: (result: ScanResult) => void,
  ): Promise<void> {
    stopCameraScan()
    controls = await getReader().decodeFromVideoDevice(deviceId, video, (result, _error, scannerControls) => {
      if (!result) {
        // NotFoundException on empty frames is normal during continuous scanning.
        return
      }
      scannerControls.stop()
      controls = null
      onResult({ text: result.getText(), format: result.getBarcodeFormat() })
    })
  }

  /**
   * Stop the camera stream and the scan loop, if running.
   */
  function stopCameraScan(): void {
    controls?.stop()
    controls = null
  }

  onBeforeUnmount(stopCameraScan)

  return {
    decodeImage,
    startCameraScan,
    stopCameraScan,
  }
}
