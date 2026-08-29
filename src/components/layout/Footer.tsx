import Link from 'next/link';
import Image from 'next/image';
import { Building2, Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { createTelUrl, createWhatsAppUrl } from '@/lib/utils';

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}

export function Footer({ locale, dict, settings }: FooterProps) {
  const isAr = locale === 'ar';
  const companyName = isAr ? settings.companyName.ar : settings.companyName.en;
  const address = isAr ? settings.address.ar : settings.address.en;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0c0f12] text-[#d6cfc4] pt-16 pb-12 border-t border-[#23201b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-md bg-white/10 flex items-center justify-center border border-white/15">
                <Image
                  src="/logo.png"
                  alt={companyName}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <span className="text-white font-bold text-lg tracking-tight font-serif-luxury">
                {companyName}
              </span>
            </Link>
            <p className="text-sm text-[#9c9386] leading-relaxed">
              {dict.footer.tagline}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={createWhatsAppUrl(settings.whatsapp, 'Hello')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#25D366] text-[#c5a880] hover:text-white flex items-center justify-center transition-colors duration-200"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={createTelUrl(settings.phone)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#c5a880] text-[#c5a880] hover:text-white flex items-center justify-center transition-colors duration-200"
                title="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#c5a880] text-[#c5a880] hover:text-white flex items-center justify-center transition-colors duration-200"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-[#c5a880]/30 pb-2 inline-block">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}`} className="text-[#a89f91] hover:text-[#c5a880] transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/properties`} className="text-[#a89f91] hover:text-[#c5a880] transition-colors">
                  {dict.nav.properties}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#featured`} className="text-[#a89f91] hover:text-[#c5a880] transition-colors">
                  {dict.nav.featured}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#why-us`} className="text-[#a89f91] hover:text-[#c5a880] transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/admin`} className="text-[#a89f91] hover:text-[#c5a880] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{dict.nav.admin}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-[#c5a880]/30 pb-2 inline-block">
              {dict.footer.contactInfo}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-[#a89f91]">
                <MapPin className="w-4 h-4 text-[#c5a880] shrink-0 mt-1" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-[#a89f91]">
                <Phone className="w-4 h-4 text-[#c5a880] shrink-0" />
                <a href={createTelUrl(settings.phone)} className="hover:text-white" dir="ltr">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-[#a89f91]">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={createWhatsAppUrl(settings.whatsapp, 'Hello')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  dir="ltr"
                >
                  {settings.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-3 text-[#a89f91]">
                <Mail className="w-4 h-4 text-[#c5a880] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-[#c5a880]/30 pb-2 inline-block">
              {dict.footer.workingHours}
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2.5 text-[#e5e1da] text-xs font-semibold">
                <Clock className="w-4 h-4 text-[#c5a880]" />
                <span>{dict.footer.workingHoursVal}</span>
              </div>
              <p className="text-xs text-[#9c9386] leading-relaxed">
                {isAr
                  ? 'خدمة العملاء والرد الفوري على استفسارات الواتساب متاحة طوال أيام الأسبوع للمعاينة والحجوزات.'
                  : 'Concierge leasing advisors are available 7 days a week for immediate viewings and booking assistance.'}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7f776a] gap-4">
          <p>© {currentYear} {companyName}. {dict.footer.allRightsReserved}</p>
          <div className="flex items-center gap-6">
            <span>{dict.footer.privacy}</span>
            <span>•</span>
            <span>{dict.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
