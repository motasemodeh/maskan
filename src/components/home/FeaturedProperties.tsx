import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Property, Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { PropertyCard } from '../properties/PropertyCard';

interface FeaturedPropertiesProps {
  properties: Property[];
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}

export function FeaturedProperties({ properties, locale, dict, settings }: FeaturedPropertiesProps) {
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const featured = properties.filter((p) => p.featured && p.status === 'available');
  const displayProperties = featured.length > 0 ? featured : properties.slice(0, 3);

  if (displayProperties.length === 0) return null;

  return (
    <section id="featured" className="py-20 bg-[#fbfaf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/15 text-[#a9885c] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dict.nav.featured}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#11161d] tracking-tight font-serif-luxury">
              {isAr ? 'أحدث الشقق والمساكن المميزة' : 'Featured Architectural Residences'}
            </h2>
            <p className="text-sm sm:text-base text-[#70685d] mt-2">
              {isAr
                ? 'استكشف أرقى الشقق المتاحة حالياً للإيجار الفوري بتصاميم استثنائية وإطلالات ساحرة.'
                : 'Explore prime, turnkey rental residences curated for high design and immediate move-in.'}
            </p>
          </div>

          <Link
            href={`/${locale}/properties`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#11161d] hover:text-[#c5a880] transition-colors pb-1 border-b-2 border-[#11161d] hover:border-[#c5a880] shrink-0 self-start md:self-auto"
          >
            <span>{dict.hero.ctaExplore}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              locale={locale}
              dict={dict}
              settings={settings}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
