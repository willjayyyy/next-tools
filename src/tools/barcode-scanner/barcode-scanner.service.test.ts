import { BarcodeFormat } from '@zxing/library'
import { describe, expect, it } from 'vitest'
import {
  ContentType,
  detectContentType,
  formatLabel,
  SUPPORTED_FORMATS,
  toActionHref,
  validateImageFile,
} from './barcode-scanner.service'

describe('barcode-scanner service', () => {
  describe('detectContentType', () => {
    it('detects http and https URLs', () => {
      expect(detectContentType('https://next-tools.dev')).toBe(ContentType.Url)
      expect(detectContentType('http://example.com/path?q=1')).toBe(ContentType.Url)
    })

    it('detects mailto and bare email addresses', () => {
      expect(detectContentType('mailto:hello@example.com')).toBe(ContentType.Email)
      expect(detectContentType('hello@example.com')).toBe(ContentType.Email)
    })

    it('detects tel scheme and bare phone numbers', () => {
      expect(detectContentType('tel:+1-202-555-0173')).toBe(ContentType.Phone)
      expect(detectContentType('+44 20 7946 0958')).toBe(ContentType.Phone)
    })

    it('detects WiFi network payloads', () => {
      expect(detectContentType('WIFI:S:MyNet;T:WPA;P:secret;;')).toBe(ContentType.Wifi)
    })

    it('detects geo coordinates', () => {
      expect(detectContentType('geo:37.786971,-122.399677')).toBe(ContentType.Geo)
    })

    it('falls back to plain text', () => {
      expect(detectContentType('just some text')).toBe(ContentType.Text)
      expect(detectContentType('Product code ABC-123 unit')).toBe(ContentType.Text)
    })

    it('ignores surrounding whitespace', () => {
      expect(detectContentType('   https://example.com   ')).toBe(ContentType.Url)
    })
  })

  describe('toActionHref', () => {
    it('returns the URL unchanged', () => {
      expect(toActionHref(ContentType.Url, 'https://example.com')).toBe('https://example.com')
    })

    it('prepends mailto: for bare emails and passes through existing scheme', () => {
      expect(toActionHref(ContentType.Email, 'hello@example.com')).toBe('mailto:hello@example.com')
      expect(toActionHref(ContentType.Email, 'mailto:hello@example.com')).toBe('mailto:hello@example.com')
    })

    it('builds a tel: href and strips separators from bare numbers', () => {
      expect(toActionHref(ContentType.Phone, '+1 (202) 555-0173')).toBe('tel:+12025550173')
      expect(toActionHref(ContentType.Phone, 'tel:+12025550173')).toBe('tel:+12025550173')
    })

    it('returns null for content types without a navigable action', () => {
      expect(toActionHref(ContentType.Wifi, 'WIFI:S:x;;')).toBeNull()
      expect(toActionHref(ContentType.Geo, 'geo:1,2')).toBeNull()
      expect(toActionHref(ContentType.Text, 'hello')).toBeNull()
    })
  })

  describe('formatLabel', () => {
    it('maps known formats to display names', () => {
      expect(formatLabel(BarcodeFormat.QR_CODE)).toBe('QR Code')
      expect(formatLabel(BarcodeFormat.EAN_13)).toBe('EAN-13')
      expect(formatLabel(BarcodeFormat.CODE_128)).toBe('Code 128')
      expect(formatLabel(BarcodeFormat.DATA_MATRIX)).toBe('Data Matrix')
    })

    it('returns Unknown for null, undefined, or unmapped formats', () => {
      expect(formatLabel(null)).toBe('Unknown')
      expect(formatLabel(undefined)).toBe('Unknown')
    })
  })

  describe('sUPPORTED_FORMATS', () => {
    it('includes QR and the common 2D/1D symbologies', () => {
      expect(SUPPORTED_FORMATS).toContain(BarcodeFormat.QR_CODE)
      expect(SUPPORTED_FORMATS).toContain(BarcodeFormat.PDF_417)
      expect(SUPPORTED_FORMATS).toContain(BarcodeFormat.EAN_13)
      expect(SUPPORTED_FORMATS).toContain(BarcodeFormat.CODE_128)
    })

    it('has no duplicate entries', () => {
      expect(new Set(SUPPORTED_FORMATS).size).toBe(SUPPORTED_FORMATS.length)
    })
  })

  describe('validateImageFile', () => {
    it('accepts image files', () => {
      const file = new File([''], 'photo.png', { type: 'image/png' })
      expect(validateImageFile(file)).toEqual({ valid: true })
    })

    it('rejects non-image files with an i18n error key', () => {
      const file = new File([''], 'doc.pdf', { type: 'application/pdf' })
      expect(validateImageFile(file)).toEqual({ valid: false, errorKey: 'errorInvalidFileType' })
    })
  })
})
