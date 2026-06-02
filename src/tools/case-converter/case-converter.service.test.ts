import { describe, expect, it } from 'vitest';
import { CASE_FORMATS, CaseFormat, convertCase, mockingCase } from './case-converter.service';

const UUID = '57832a01-ec7d-43a7-9bd5-3a7036cbeec7';
const SENTENCE = 'lorem ipsum dolor sit amet';

describe('case-converter service', () => {
  describe('convertCase - basic casing preserves all characters', () => {
    // Regression: previously non-letter characters (digits, hyphens) were
    // stripped before conversion, so uppercasing a UUID lost everything but
    // the letters. See issue #2.
    it('uppercases a UUID without dropping digits or hyphens', () => {
      expect(convertCase(UUID, CaseFormat.Uppercase)).toBe('57832A01-EC7D-43A7-9BD5-3A7036CBEEC7');
    });

    it('lowercases a UUID without dropping digits or hyphens', () => {
      expect(convertCase(UUID, CaseFormat.Lowercase)).toBe('57832a01-ec7d-43a7-9bd5-3a7036cbeec7');
    });

    it('keeps spaces and punctuation for upper/lower of a sentence', () => {
      expect(convertCase('Hello, World! 123', CaseFormat.Uppercase)).toBe('HELLO, WORLD! 123');
      expect(convertCase('Hello, World! 123', CaseFormat.Lowercase)).toBe('hello, world! 123');
    });
  });

  describe('convertCase - word-based formats split a sentence correctly', () => {
    // Regression: stripping spaces collapsed the sentence into a single word,
    // making capital/sentence/header case identical. They must differ.
    it('produces distinct results for capital, sentence, and header case', () => {
      const capital = convertCase(SENTENCE, CaseFormat.Capitalcase);
      const sentence = convertCase(SENTENCE, CaseFormat.Sentencecase);
      const header = convertCase(SENTENCE, CaseFormat.Headercase);

      expect(capital).toBe('Lorem Ipsum Dolor Sit Amet');
      expect(sentence).toBe('Lorem ipsum dolor sit amet');
      expect(header).toBe('Lorem-Ipsum-Dolor-Sit-Amet');

      expect(new Set([capital, sentence, header]).size).toBe(3);
    });

    it('converts programming formats from a sentence', () => {
      expect(convertCase(SENTENCE, CaseFormat.Camelcase)).toBe('loremIpsumDolorSitAmet');
      expect(convertCase(SENTENCE, CaseFormat.Pascalcase)).toBe('LoremIpsumDolorSitAmet');
      expect(convertCase(SENTENCE, CaseFormat.Snakecase)).toBe('lorem_ipsum_dolor_sit_amet');
      expect(convertCase(SENTENCE, CaseFormat.Paramcase)).toBe('lorem-ipsum-dolor-sit-amet');
      expect(convertCase(SENTENCE, CaseFormat.Constantcase)).toBe('LOREM_IPSUM_DOLOR_SIT_AMET');
      expect(convertCase(SENTENCE, CaseFormat.Dotcase)).toBe('lorem.ipsum.dolor.sit.amet');
      expect(convertCase(SENTENCE, CaseFormat.Pathcase)).toBe('lorem/ipsum/dolor/sit/amet');
      expect(convertCase(SENTENCE, CaseFormat.Nocase)).toBe('lorem ipsum dolor sit amet');
    });
  });

  describe('mockingCase', () => {
    it('alternates casing by character index', () => {
      expect(mockingCase('hello')).toBe('HeLlO');
    });

    it('preserves non-letter characters in their positions', () => {
      expect(mockingCase('a-b-c')).toBe('A-B-C');
    });
  });

  describe('convertCase - edge cases', () => {
    it('returns an empty string for empty input across all formats', () => {
      for (const descriptor of CASE_FORMATS) {
        expect(convertCase('', descriptor.key)).toBe('');
      }
    });

    it('returns the raw input for an unknown format', () => {
      expect(convertCase('Foo Bar', 'unknown' as CaseFormat)).toBe('Foo Bar');
    });
  });

  describe('case format registry', () => {
    it('exposes 14 formats with unique keys', () => {
      expect(CASE_FORMATS).toHaveLength(14);
      expect(new Set(CASE_FORMATS.map((entry) => entry.key)).size).toBe(14);
    });
  });
});
