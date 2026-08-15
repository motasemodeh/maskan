import en from './en.json';
import ar from './ar.json';
import { Locale } from '@/lib/types';

const dictionaries = {
  en,
  ar,
};

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}

export function isValidLocale(locale: string): locale is Locale {
  return locale === 'en' || locale === 'ar';
}
