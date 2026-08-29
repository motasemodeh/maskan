'use client';

import { useState } from 'react';
import { Phone, Share2, Check, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { Property, Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { formatPrice, createWhatsAppUrl, createTelUrl } from '@/lib/utils';

interface PropertyContactCardProps {
  property: Property;
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}

export function PropertyContactCard({ property, locale, dict, settings }: PropertyContactCardProps) {
  const [copied, setCopied] = useState(false);

  const isAr = locale === 'ar';
  const title = isAr ? property.title.ar : property.title.en;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `${title} (${property.referenceNumber})`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // User cancelled or clipboard denied
    }
  };

  const whatsAppText = isAr
    ? `مرحباً! أنا مهتم بمعاينة شقة "${title}" (الرقم المرجعي: ${property.referenceNumber}) المعروضة بقيمة ${formatPrice(property.price, property.currency, 'ar')}. أرجو تزويدي بكافة التفاصيل وموعد المعاينة.`
    : `Hello! I am interested in viewing "${title}" (Ref: ${property.referenceNumber}) listed at ${formatPrice(property.price, property.currency, 'en')}. Please provide details and schedule a viewing.`;

  const whatsAppUrl = createWhatsAppUrl(settings.whatsapp, whatsAppText);
  const telUrl = createTelUrl(settings.phone);

  return (
    <div className="bg-white rounded-3xl border border-[#e5dfd3] p-6 sm:p-7 shadow-lg sticky top-28 space-y-6">
      {/* Price Header */}
      <div className="pb-5 border-b border-[#f1ede6]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-[#8c8273] uppercase tracking-wider">
            {dict.propertyCard.reference}: <strong className="text-[#161b22]">{property.referenceNumber}</strong>
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              property.status === 'available'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {property.status === 'available'
              ? dict.propertyDetails.availableStatus
              : dict.propertyDetails.rentedStatus}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#11161d] tracking-tight">
            {formatPrice(property.price, property.currency, locale)}
          </span>
          <span className="text-sm font-semibold text-[#7c7365]">
            / {property.period === 'monthly' ? dict.propertyCard.month : dict.propertyCard.year}
          </span>
        </div>

        {property.deposit && (
          <p className="text-xs text-[#8c8273] mt-1.5">
            {dict.propertyDetails.deposit}: <strong>{formatPrice(property.deposit, property.currency, locale)}</strong>
          </p>
        )}
      </div>

      {/* Direct Action Buttons */}
      <div className="space-y-3">
        {/* WhatsApp Button */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-base font-bold shadow-lg shadow-[#25D366]/25 transition-all hover:scale-102 cursor-pointer"
        >
          <WhatsAppIcon className="w-5 h-5" />
          <span>{dict.propertyDetails.chatWhatsApp}</span>
        </a>

        {/* Call Button */}
        <a
          href={telUrl}
          className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl bg-[#11161d] hover:bg-[#232a35] text-white text-sm font-bold shadow-md transition-all hover:scale-102 cursor-pointer"
        >
          <Phone className="w-4 h-4 text-[#c5a880]" />
          <span>{dict.propertyDetails.callNow}</span>
          <span className="text-xs text-[#c5a880] font-normal ms-1" dir="ltr">
            ({settings.phone})
          </span>
        </a>
      </div>

      {/* Trust guarantees list */}
      <div className="pt-2 space-y-2.5 text-xs text-[#6e6659] border-t border-[#f1ede6]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isAr ? 'معاينة فورية مع مسؤول التأجير المعتمد' : 'Direct in-person viewing with assigned agent'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#c5a880] shrink-0" />
          <span>{dict.propertyDetails.directAssistance}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#c5a880] shrink-0" />
          <span>{isAr ? 'عقود رسمية موثقة وخالية من أي رسوم خفية' : 'Verified tenancy contract, zero hidden fees'}</span>
        </div>
      </div>

      {/* Share Button */}
      <div className="pt-3 border-t border-[#f1ede6]">
        <button
          onClick={handleShare}
          type="button"
          className="w-full py-2.5 px-4 rounded-xl bg-[#f8f6f2] hover:bg-[#ede5d8] text-[#554d42] hover:text-[#161b22] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#e5ded2]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">{dict.propertyDetails.copied}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#8c8273]" />
              <span>{dict.propertyDetails.shareListing}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
