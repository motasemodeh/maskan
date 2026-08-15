'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Locale } from '@/lib/types';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
  variant?: 'light' | 'dark' | 'minimal';
}

export function LanguageSwitcher({ currentLocale, className = '', variant = 'light' }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const nextLocale: Locale = currentLocale === 'en' ? 'ar' : 'en';

    // Replace current locale segment in pathname
    let newPath = pathname;
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    } else {
      newPath = `/${nextLocale}${pathname}`;
    }

    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(newPath);
  };

  const isDark = variant === 'dark';

  return (
    <button
      onClick={toggleLocale}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
        isDark
          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          : 'bg-[#f4efe8] hover:bg-[#ebdccb] text-[#2c261e] border border-[#dfd7cc]'
      } ${className}`}
      title={currentLocale === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
    >
      <Globe className="w-3.5 h-3.5 text-[#c5a880]" />
      <span>{currentLocale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
