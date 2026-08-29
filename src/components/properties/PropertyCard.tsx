'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Maximize2, ArrowRight, ArrowLeft, Phone, X } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { Property, Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { formatPrice, formatArea, createWhatsAppUrl, createTelUrl } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  locale: Locale;
  dict: Dictionary;
  settings?: SiteSettings;
}

export function PropertyCard({ property, locale, dict, settings }: PropertyCardProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const title = isAr ? property.title.ar : property.title.en;
  const locationName = isAr ? property.location.ar : property.location.en;

  const bedLabel =
    property.bedrooms === 0
      ? dict.filters.studio
      : `${property.bedrooms} ${dict.propertyCard.beds}`;

  const whatsAppPhone = settings?.whatsapp || '+971501234567';
  const whatsAppMsg = isAr
    ? `مرحباً! أنا مهتم بالشقة ${title} (الرقم المرجعي: ${property.referenceNumber}). أرجو تزويدي بالتفاصيل وموعد المعاينة.`
    : `Hello! I am interested in ${title} (Ref: ${property.referenceNumber}). Please share details and viewing availability.`;

  const whatsAppUrl = createWhatsAppUrl(whatsAppPhone, whatsAppMsg);

  const callPhone = settings?.phone || whatsAppPhone;
  const telUrl = createTelUrl(callPhone);

  // The modal is portalled to <body>: the card itself uses a hover transform,
  // and a transformed ancestor would otherwise trap `position: fixed` inside it.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close the contact modal with the Escape key and lock body scroll while open
  useEffect(() => {
    if (!isContactOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsContactOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isContactOpen]);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#e4decb]/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Card Image Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#161b22]">
        <Image
          src={property.featuredImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
          {/* Reference # Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#0c0f12]/85 text-[#e5e1da] backdrop-blur-md border border-white/10 shadow-sm">
            {property.referenceNumber}
          </span>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5">
            {property.featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#c5a880] text-white shadow-sm">
                {dict.propertyCard.featured}
              </span>
            )}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                property.status === 'available'
                  ? 'bg-emerald-600/90 text-white'
                  : 'bg-rose-600/90 text-white'
              }`}
            >
              {property.status === 'available'
                ? dict.propertyCard.available
                : dict.propertyCard.rented}
            </span>
          </div>
        </div>

        {/* Price Tag in Bottom of Image */}
        <div className="absolute bottom-3.5 start-3.5 end-3.5 flex items-end justify-between">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/40 shadow-md">
            <span className="text-base font-extrabold text-[#0c0f12] tracking-tight">
              {formatPrice(property.price, property.currency, locale)}
            </span>
            <span className="text-xs text-[#6e685f] ms-1">
              / {property.period === 'monthly' ? dict.propertyCard.month : dict.propertyCard.year}
            </span>
          </div>

          {/* Quick Contact - opens call / WhatsApp choice modal */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsContactOpen(true);
            }}
            className="p-2.5 rounded-xl bg-[#c5a880] hover:bg-[#b3956d] text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
            title={dict.propertyCard.quickContact}
            aria-haspopup="dialog"
            aria-expanded={isContactOpen}
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#827a6f] mb-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
            <span className="truncate">{locationName}</span>
          </div>

          {/* Title */}
          <Link href={`/${locale}/properties/${property.id}`} className="block group/link">
            <h3 className="text-base font-bold text-[#161b22] line-clamp-1 group-hover/link:text-[#c5a880] transition-colors">
              {title}
            </h3>
          </Link>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-2 my-4 py-2.5 px-3 rounded-xl bg-[#f7f5f0] border border-[#ebe5dc] text-xs text-[#524d45]">
            <div className="flex items-center gap-1.5 justify-center font-medium">
              <Bed className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{bedLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center font-medium border-x border-[#ded7cc]">
              <Bath className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{property.bathrooms} {dict.propertyCard.baths}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center font-medium">
              <Maximize2 className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{formatArea(property.areaSqM, locale)}</span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          href={`/${locale}/properties/${property.id}`}
          className="w-full py-2.5 px-4 rounded-xl border border-[#d6cec0] hover:border-[#c5a880] bg-white hover:bg-[#fcfbf9] text-[#241f19] hover:text-[#a9885c] text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-xs"
        >
          <span>{dict.propertyCard.viewDetails}</span>
          <ArrowIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Contact Choice Modal (rendered at the document root) */}
      {isContactOpen && isMounted && createPortal(
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          dir={isAr ? 'rtl' : 'ltr'}
          role="dialog"
          aria-modal="true"
          aria-label={dict.propertyCard.contactTitle}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsContactOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#e8e1d6] p-6 sm:p-7 animate-fade-in">
            <button
              type="button"
              onClick={() => setIsContactOpen(false)}
              title={dict.propertyCard.close}
              className="absolute top-4 end-4 p-1.5 rounded-lg text-[#8a8272] hover:text-[#11161d] hover:bg-[#f2ede4] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6 pt-1">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#f7f1e7] border border-[#e6d9c4] flex items-center justify-center mb-3.5">
                <Phone className="w-5 h-5 text-[#c5a880]" />
              </div>
              <h3 className="text-lg font-extrabold text-[#11161d] font-serif-luxury">
                {dict.propertyCard.contactTitle}
              </h3>
              <p className="text-xs text-[#6b6355] mt-1.5 leading-relaxed">
                {dict.propertyCard.contactSubtitle}
              </p>
              <p className="text-[11px] font-bold text-[#8a8272] mt-2 tracking-wider">
                {property.referenceNumber}
              </p>
            </div>

            <div className="space-y-3">
              {/* Call Us */}
              <a
                href={telUrl}
                onClick={() => setIsContactOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-[#0c0f12] hover:bg-[#1c222b] text-white text-sm font-bold shadow-md transition-all hover:scale-[1.02]"
              >
                <Phone className="w-4 h-4 text-[#c5a880]" />
                <span>{dict.propertyCard.callUs}</span>
                <span dir="ltr" className="text-[#a89f91] font-medium text-xs">
                  {callPhone}
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsContactOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md transition-all hover:scale-[1.02]"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>{dict.propertyCard.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
