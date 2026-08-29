'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, Building2, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { createTelUrl, createWhatsAppUrl } from '@/lib/utils';

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}

export function Header({ locale, dict, settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAr = locale === 'ar';
  const companyName = isAr ? settings.companyName.ar : settings.companyName.en;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/properties`, label: dict.nav.properties },
    { href: `/${locale}#featured`, label: dict.nav.featured },
    { href: `/${locale}#why-us`, label: dict.nav.about },
  ];

  const whatsAppGeneralUrl = createWhatsAppUrl(
    settings.whatsapp,
    isAr
      ? `مرحباً، أود الاستفسار عن الشقق الفاخرة المتاحة لديكم.`
      : `Hello, I would like to inquire about available luxury residences.`
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0c0f12]/92 backdrop-blur-md border-b border-[#2c261e]/40 shadow-xl py-3.5'
          : 'bg-gradient-to-b from-[#0c0f12]/90 via-[#0c0f12]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl overflow-hidden shadow-lg shadow-[#c5a880]/15 group-hover:scale-105 transition-transform duration-200 bg-white/10 flex items-center justify-center border border-white/15">
              <Image
                src="/logo.png"
                alt={companyName}
                fill
                sizes="48px"
                priority
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-tight group-hover:text-[#c5a880] transition-colors font-serif-luxury">
                {companyName}
              </span>
              <span className="text-[#a89f91] text-[10px] tracking-widest uppercase -mt-0.5">
                {isAr ? 'عقارات ومساكن فاخرة' : 'Luxury Residential Leasing'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-[#c5a880] font-semibold'
                      : 'text-[#e5e1da] hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a880] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Language Switcher */}
          <div className="hidden lg:flex items-center gap-3.5">
            <LanguageSwitcher currentLocale={locale} variant="dark" />

            {/* Direct Phone */}
            <a
              href={createTelUrl(settings.phone)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#e5e1da] hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
              title={dict.nav.callUs}
            >
              <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
              <span dir="ltr">{settings.phone}</span>
            </a>

            {/* WhatsApp CTA */}
            <a
              href={whatsAppGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-[#25D366]/20 transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>{dict.nav.whatsapp}</span>
            </a>

            {/* Admin Link Icon */}
            <Link
              href={`/${locale}/admin`}
              className="p-2 text-[#a89f91] hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title={dict.nav.admin}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2.5 md:hidden">
            <LanguageSwitcher currentLocale={locale} variant="dark" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-[#e5e1da] hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0f12]/98 border-b border-[#2c261e] px-4 pt-3 pb-6 animate-fade-in">
          <nav className="flex flex-col gap-3 mb-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-[#e5e1da] hover:text-[#c5a880] py-2 border-b border-white/5 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/admin`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-[#a89f91] hover:text-white py-2 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>{dict.nav.admin}</span>
            </Link>
          </nav>

          <div className="flex flex-col gap-2.5">
            <a
              href={createTelUrl(settings.phone)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold border border-white/15"
            >
              <Phone className="w-4 h-4 text-[#c5a880]" />
              <span dir="ltr">{settings.phone}</span>
            </a>
            <a
              href={whatsAppGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold shadow-lg"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>{dict.nav.whatsapp}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
