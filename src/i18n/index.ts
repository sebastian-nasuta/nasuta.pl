import pl from './locales/pl.json';
import en from './locales/en.json';

export const translations = {
  pl,
  en,
} as const;

export type Locale = keyof typeof translations;

export const locales = Object.keys(translations) as Locale[];

export const defaultLocale: Locale = 'pl';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof pl>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value in translations;
}

function getByPath(obj: unknown, path: string): string | undefined {
  const result = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof result === 'string' ? result : undefined;
}

export function t(key: TranslationKey | string, locale: Locale = defaultLocale): string {
  return (
    getByPath(translations[locale], key) ??
    getByPath(translations[defaultLocale], key) ??
    key
  );
}
