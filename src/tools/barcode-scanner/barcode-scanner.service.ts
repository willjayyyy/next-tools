import { BarcodeFormat } from '@zxing/library'

/**
 * Detected semantic type of a decoded barcode payload.
 * Drives which quick-action (open link, send email, call) the UI offers.
 */
export enum ContentType {
  Url = 'url',
  Email = 'email',
  Phone = 'phone',
  Wifi = 'wifi',
  Geo = 'geo',
  Text = 'text',
}

/**
 * Barcode formats the scanner attempts to decode.
 * Covers 2D codes (QR, DataMatrix, PDF417, Aztec) and the most common
 * 1D retail/logistics symbologies. Used to build ZXing decode hints.
 */
export const SUPPORTED_FORMATS: BarcodeFormat[] = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.AZTEC,
  BarcodeFormat.PDF_417,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODABAR,
  BarcodeFormat.ITF,
]

/**
 * Human-readable display names for barcode formats.
 * These are technical identifiers (industry-standard symbology names),
 * so they are intentionally not internationalized.
 */
const FORMAT_LABELS: Partial<Record<BarcodeFormat, string>> = {
  [BarcodeFormat.QR_CODE]: 'QR Code',
  [BarcodeFormat.DATA_MATRIX]: 'Data Matrix',
  [BarcodeFormat.AZTEC]: 'Aztec',
  [BarcodeFormat.PDF_417]: 'PDF417',
  [BarcodeFormat.MAXICODE]: 'MaxiCode',
  [BarcodeFormat.EAN_13]: 'EAN-13',
  [BarcodeFormat.EAN_8]: 'EAN-8',
  [BarcodeFormat.UPC_A]: 'UPC-A',
  [BarcodeFormat.UPC_E]: 'UPC-E',
  [BarcodeFormat.CODE_128]: 'Code 128',
  [BarcodeFormat.CODE_39]: 'Code 39',
  [BarcodeFormat.CODE_93]: 'Code 93',
  [BarcodeFormat.CODABAR]: 'Codabar',
  [BarcodeFormat.ITF]: 'ITF',
  [BarcodeFormat.RSS_14]: 'RSS-14',
  [BarcodeFormat.RSS_EXPANDED]: 'RSS Expanded',
}

/**
 * Map a ZXing BarcodeFormat enum value to its display name.
 *
 * @param format - ZXing barcode format
 * @returns Human-readable format name, or 'Unknown' for unmapped formats
 */
export function formatLabel(format: BarcodeFormat | undefined | null): string {
  if (format === undefined || format === null) {
    return 'Unknown'
  }
  return FORMAT_LABELS[format] ?? 'Unknown'
}

// Match a basic email address (no surrounding whitespace, single @, dotted domain).
// Domain segments exclude '.' so they cannot overlap with the literal dot, which
// avoids the polynomial backtracking a naive [^\s@]+\.[^\s@]+ would introduce.
const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/
// Match a loose international phone number: optional +, digits and common separators
const PHONE_REGEX = /^\+?[\d\s\-().]{6,}$/

/**
 * Classify a decoded payload so the UI can offer a relevant quick action.
 *
 * Recognizes explicit URI schemes (mailto:, tel:, WIFI:, geo:, http(s)://)
 * as well as bare email addresses and phone numbers.
 *
 * @param text - Decoded barcode text
 * @returns The detected content type
 */
export function detectContentType(text: string): ContentType {
  const value = text.trim()

  if (/^https?:\/\//i.test(value)) {
    return ContentType.Url
  }
  if (/^mailto:/i.test(value) || EMAIL_REGEX.test(value)) {
    return ContentType.Email
  }
  if (/^tel:/i.test(value)) {
    return ContentType.Phone
  }
  if (/^wifi:/i.test(value)) {
    return ContentType.Wifi
  }
  if (/^geo:/i.test(value)) {
    return ContentType.Geo
  }
  if (PHONE_REGEX.test(value)) {
    return ContentType.Phone
  }

  return ContentType.Text
}

/**
 * Build an href for content types that map to a clickable action.
 *
 * Bare emails/phones get the proper scheme prepended; values that already
 * carry a scheme (mailto:, tel:, http://) are passed through unchanged.
 * Returns null for types without a navigable action (Wifi, Geo, Text).
 *
 * @param type - Detected content type
 * @param text - Decoded barcode text
 * @returns An href string, or null when there is no quick action
 */
export function toActionHref(type: ContentType, text: string): string | null {
  const value = text.trim()

  switch (type) {
    case ContentType.Url:
      return value
    case ContentType.Email:
      return /^mailto:/i.test(value) ? value : `mailto:${value}`
    case ContentType.Phone:
      return /^tel:/i.test(value) ? value : `tel:${value.replace(/[\s\-().]/g, '')}`
    default:
      return null
  }
}

/**
 * Validate that a selected file is an image before attempting to decode it.
 * Returns an i18n error key (not a message) to keep the multilingual UI consistent.
 *
 * @param file - File chosen by the user
 * @returns Validation result with an optional i18n error key
 */
export function validateImageFile(file: File): { valid: boolean, errorKey?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, errorKey: 'errorInvalidFileType' }
  }
  return { valid: true }
}
