import {
  Bed,
  Bath,
  Maximize2,
  Layers,
  Sofa,
  Building,
  ShieldCheck,
  Waves,
  Dumbbell,
  Car,
  Wind,
  Tv,
  CheckCircle2,
  Flame,
  Dog,
  Sparkles,
  Lock,
  Headphones,
  Eye,
  ArrowUpCircle
} from 'lucide-react';
import { Property, Locale } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { formatArea } from '@/lib/utils';

interface PropertySpecsProps {
  property: Property;
  locale: Locale;
  dict: Dictionary;
}

const AMENITY_ICONS: Record<string, any> = {
  pool: Waves,
  gym: Dumbbell,
  parking: Car,
  balcony: Wind,
  security: ShieldCheck,
  concierge: Headphones,
  sea_view: Eye,
  elevator: ArrowUpCircle,
  central_ac: Wind,
  smart_home: Tv,
  maids_room: Sparkles,
  built_in_wardrobes: Lock,
  pet_friendly: Dog,
  kids_play_area: Sparkles,
  spa_sauna: Flame,
  bbq_area: Flame,
};

export function PropertySpecs({ property, locale, dict }: PropertySpecsProps) {
  const isAr = locale === 'ar';
  const description = isAr ? property.description.ar : property.description.en;

  const furnishingLabel =
    property.furnished === 'furnished'
      ? dict.filters.isFurnished
      : property.furnished === 'semi-furnished'
      ? dict.filters.semiFurnished
      : dict.filters.unfurnished;

  const typeLabel =
    property.propertyType === 'apartment'
      ? dict.filters.apartment
      : property.propertyType === 'penthouse'
      ? dict.filters.penthouse
      : property.propertyType === 'duplex'
      ? dict.filters.duplex
      : property.propertyType === 'studio'
      ? dict.filters.studio
      : property.propertyType;

  const specsList = [
    {
      icon: Bed,
      label: dict.propertyDetails.bedrooms,
      value: property.bedrooms === 0 ? dict.filters.studio : `${property.bedrooms} ${dict.propertyCard.beds}`,
    },
    {
      icon: Bath,
      label: dict.propertyDetails.bathrooms,
      value: `${property.bathrooms} ${dict.propertyCard.baths}`,
    },
    {
      icon: Maximize2,
      label: dict.propertyDetails.area,
      value: formatArea(property.areaSqM, locale),
    },
    {
      icon: Layers,
      label: dict.propertyDetails.floor,
      value: property.floor ? `${property.floor}` : '—',
    },
    {
      icon: Sofa,
      label: dict.propertyDetails.furnishingStatus,
      value: furnishingLabel,
    },
    {
      icon: Building,
      label: dict.propertyDetails.type,
      value: typeLabel,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Specifications Grid */}
      <div>
        <h2 className="text-lg font-bold text-[#161b22] uppercase tracking-wider mb-5 flex items-center gap-2 font-serif-luxury">
          <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
          <span>{dict.propertyDetails.keySpecs}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {specsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-[#e5dfd3] shadow-xs flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f8f5ee] border border-[#e8ded0] text-[#a9885c] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#8a8070] uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <span className="text-sm font-extrabold text-[#1a1f26]">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#161b22] uppercase tracking-wider flex items-center gap-2 font-serif-luxury">
          <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
          <span>{dict.propertyDetails.description}</span>
        </h2>
        <p className="text-[#4f483e] leading-relaxed text-sm sm:text-base whitespace-pre-line font-normal">
          {description}
        </p>
      </div>

      {/* Amenities & Features */}
      {property.amenities && property.amenities.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-[#161b22] uppercase tracking-wider flex items-center gap-2 font-serif-luxury">
            <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
            <span>{dict.propertyDetails.amenities}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {property.amenities.map((amenityKey) => {
              const Icon = AMENITY_ICONS[amenityKey] || CheckCircle2;
              const label = (dict.amenities as Record<string, string>)[amenityKey] || amenityKey;
              return (
                <div
                  key={amenityKey}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f4] border border-[#ebe5da] text-xs font-semibold text-[#2d2720]"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#dfd7cc] text-[#a9885c] flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
