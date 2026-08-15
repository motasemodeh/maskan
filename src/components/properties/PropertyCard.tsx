'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Maximize2, ArrowRight, ArrowLeft, MessageCircle, ShieldCheck } from 'lucide-react';
import { Property, Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { formatPrice, formatArea, createWhatsAppUrl } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  locale: Locale;
  dict: Dictionary;
  settings?: SiteSettings;
}

export function PropertyCard({ property, locale, dict, settings }: PropertyCardProps) {
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

          {/* Quick WhatsApp Inquiry */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md transition-transform hover:scale-110"
            title={dict.propertyCard.quickContact}
          >
            <MessageCircle className="w-4 h-4 fill-white" />
          </a>
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
    </div>
  );
}
