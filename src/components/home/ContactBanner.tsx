import { Phone, MessageCircle, Sparkles } from 'lucide-react';
import { Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { createTelUrl, createWhatsAppUrl } from '@/lib/utils';

interface ContactBannerProps {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}

export function ContactBanner({ locale, dict, settings }: ContactBannerProps) {
  const isAr = locale === 'ar';

  const defaultMsg = isAr
    ? `مرحباً، أود التحدث مع مستشار التأجير لمعرفة الشقق الفاخرة المتاحة ومواعيد المعاينة.`
    : `Hello! I would like to speak with a leasing manager regarding available luxury residences.`;

  return (
    <section className="py-20 bg-gradient-to-r from-[#1c1813] via-[#241f1a] to-[#1a1612] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-14 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          {/* Left Text */}
          <div className="max-w-2xl text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/20 text-[#dfcbb5] text-xs font-bold uppercase tracking-wider mb-4 border border-[#c5a880]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'خدمة عملاء راقية' : 'Personalized Concierge'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-serif-luxury">
              {dict.ctaBanner.title}
            </h2>
            <p className="text-sm sm:text-base text-[#bfb7ab] mt-3 leading-relaxed">
              {dict.ctaBanner.subtitle}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            {/* WhatsApp CTA */}
            <a
              href={createWhatsAppUrl(settings.whatsapp, defaultMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-lg shadow-[#25D366]/25 transition-all hover:scale-105 w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{dict.ctaBanner.whatsappBtn}</span>
            </a>

            {/* Direct Call CTA */}
            <a
              href={createTelUrl(settings.phone)}
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 backdrop-blur-md transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-[#c5a880]" />
              <span dir="ltr">{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
