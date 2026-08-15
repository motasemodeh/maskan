import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "JOD", locale: Locale = "en"): string {
  const formattedNumber = new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-US').format(amount);
  
  if (locale === 'ar') {
    const arCurrency =
      currency === 'JOD' ? 'د.أ' :
      currency === 'SAR' ? 'ر.س' :
      currency === 'AED' ? 'د.إ' :
      currency === 'USD' ? 'دولار' : currency;
    return `${formattedNumber} ${arCurrency}`;
  }
  
  return `${formattedNumber} ${currency}`;
}

export function formatArea(areaSqM: number, locale: Locale = "en"): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-US').format(areaSqM);
  return locale === 'ar' ? `${formatted} م²` : `${formatted} m²`;
}

export function createWhatsAppUrl(phone: string, text: string): string {
  // Strip non-digit chars except plus
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function createTelUrl(phone: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleanPhone}`;
}
