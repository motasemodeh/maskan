import { ShieldCheck, Headphones, MapPin, Sparkles } from 'lucide-react';
import { Locale } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface WhyChooseUsProps {
  locale: Locale;
  dict: Dictionary;
}

export function WhyChooseUs({ locale, dict }: WhyChooseUsProps) {
  const isAr = locale === 'ar';

  const features = [
    {
      icon: ShieldCheck,
      title: dict.trust.feat1Title,
      desc: dict.trust.feat1Desc,
    },
    {
      icon: Headphones,
      title: dict.trust.feat2Title,
      desc: dict.trust.feat2Desc,
    },
    {
      icon: MapPin,
      title: dict.trust.feat3Title,
      desc: dict.trust.feat3Desc,
    },
    {
      icon: Sparkles,
      title: dict.trust.feat4Title,
      desc: dict.trust.feat4Desc,
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-[#11161d] text-white relative overflow-hidden">
      {/* Subtle architectural background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#c5a880] uppercase tracking-widest bg-[#c5a880]/15 px-3 py-1 rounded-full border border-[#c5a880]/30 inline-block mb-3">
            {dict.nav.about}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif-luxury">
            {dict.trust.title}
          </h2>
          <p className="text-sm sm:text-base text-[#a79f93] mt-3 leading-relaxed">
            {dict.trust.subtitle}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#c5a880]/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c5a880]/20 to-[#c5a880]/5 text-[#dfcbb5] border border-[#c5a880]/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:text-white group-hover:bg-[#c5a880] transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#dfcbb5] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9c9487] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
