/**
 * Case converter implementation
 *
 * Converts a string into common casing formats used in programming and text.
 * All conversions operate on the RAW input. The `change-case` library already
 * treats spaces, hyphens, underscores, and case transitions as word boundaries
 * and preserves digits, so no pre-sanitization is needed. Pre-stripping
 * non-letter characters (the previous behavior) silently dropped digits and
 * separators, which broke conversions such as uppercasing a UUID.
 */

import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from 'change-case';

/**
 * Identifies a casing format. Each value doubles as the i18n key suffix
 * under `tools.case-converter.*` used for the format's label.
 */
export enum CaseFormat {
  Lowercase = 'lowercase',
  Uppercase = 'uppercase',
  Camelcase = 'camelcase',
  Pascalcase = 'pascalcase',
  Snakecase = 'snakecase',
  Paramcase = 'paramcase',
  Constantcase = 'constantcase',
  Capitalcase = 'capitalcase',
  Sentencecase = 'sentencecase',
  Headercase = 'headercase',
  Nocase = 'nocase',
  Dotcase = 'dotcase',
  Pathcase = 'pathcase',
  Mockingcase = 'mockingcase',
}

/** Groups formats for display purposes. */
export type CaseCategory = 'basic' | 'programming' | 'text' | 'path' | 'special';

export interface CaseFormatDescriptor {
  key: CaseFormat;
  category: CaseCategory;
  convert: (input: string) => string;
}

/**
 * Mocking case: alternate upper/lower casing by character index.
 * Operates on the raw input so every character (including digits and symbols)
 * is preserved.
 */
export function mockingCase(input: string): string {
  return input
    .split('')
    .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
    .join('');
}

/**
 * Ordered list of supported formats. Order is preserved for UI rendering.
 */
export const CASE_FORMATS: CaseFormatDescriptor[] = [
  { key: CaseFormat.Lowercase, category: 'basic', convert: (input) => input.toLocaleLowerCase() },
  { key: CaseFormat.Uppercase, category: 'basic', convert: (input) => input.toLocaleUpperCase() },
  { key: CaseFormat.Camelcase, category: 'programming', convert: camelCase },
  { key: CaseFormat.Pascalcase, category: 'programming', convert: pascalCase },
  { key: CaseFormat.Snakecase, category: 'programming', convert: snakeCase },
  { key: CaseFormat.Paramcase, category: 'programming', convert: kebabCase },
  { key: CaseFormat.Constantcase, category: 'programming', convert: constantCase },
  { key: CaseFormat.Capitalcase, category: 'text', convert: capitalCase },
  { key: CaseFormat.Sentencecase, category: 'text', convert: sentenceCase },
  { key: CaseFormat.Headercase, category: 'text', convert: trainCase },
  { key: CaseFormat.Nocase, category: 'text', convert: noCase },
  { key: CaseFormat.Dotcase, category: 'path', convert: dotCase },
  { key: CaseFormat.Pathcase, category: 'path', convert: pathCase },
  { key: CaseFormat.Mockingcase, category: 'special', convert: mockingCase },
];

/**
 * Convert an input string into the given casing format.
 *
 * @param input - Raw input string
 * @param format - Target casing format
 * @returns The converted string
 */
export function convertCase(input: string, format: CaseFormat): string {
  const descriptor = CASE_FORMATS.find((entry) => entry.key === format);
  if (!descriptor) {
    return input;
  }
  return descriptor.convert(input);
}
