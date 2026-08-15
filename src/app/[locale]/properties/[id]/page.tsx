import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Building2, Eye, ShieldCheck, Share2 } from 'lucide-react';
import { Locale } from '@/lib/types';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getPropertyById, getSettings, getProperties } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyGallery } from '@/components/properties/PropertyGallery';
import { PropertySpecs } from '@/components/properties/PropertySpecs';
import { PropertyContactCard } from '@/components/properties/PropertyContactCard';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyJsonLd } from '@/components/seo/JsonLd';
import { formatPrice } from '@/lib/utils';

interface PropertyDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  const properties = await getProperties(false);
  const params: Array<{ locale: string; id: string }> = [];

  for (const locale of ['en', 'ar']) {
    for (const prop of properties) {
      params.push({ locale, id: prop.id });
      params.push({ locale, id: prop.referenceNumber.toLowerCase() });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) return {};

  const property = await getPropertyById(id);
  if (!property) return { title: 'Property Not Found' };

  const settings = await getSettings();
  const isAr = locale === 'ar';
  const title = isAr ? property.title.ar : property.title.en;
  const description = isAr ? property.description.ar : property.description.en;
  const companyName = isAr ? settings.companyName.ar : settings.companyName.en;

  const fullTitle = `${title} (${property.referenceNumber}) | ${companyName}`;

  return {
    title: fullTitle,
    description: description.substring(0, 160),
    openGraph: {
      title: fullTitle,
      description: description.substring(0, 160),
      images: [{ url: property.featuredImage }],
      locale: isAr ? 'ar_SA' : 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `/${locale}/properties/${property.id}`,
      languages: {
        en: `/en/properties/${property.id}`,
        ar: `/ar/properties/${property.id}`,
      },
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { locale, id } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const property = await getPropertyById(id);
  if (!property) {
    notFound();
  }

  const dict = getDictionary(locale);
  const settings = await getSettings();
  const allProperties = await getProperties(true);

  // Similar properties recommendation (excluding current)
  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && p.status === 'available')
    .slice(0, 3);

  const isAr = locale === 'ar';
  const ChevronBack = isAr ? ChevronRight : ChevronLeft;
  const title = isAr ? property.title.ar : property.title.en;
  const locationName = isAr ? property.location.ar : property.location.en;

  const galleryImages = property.gallery && property.gallery.length > 0
    ? property.gallery
    : [property.featuredImage];

  return (
    <div className="flex-1 flex flex-col bg-[#fbfaf8]">
      <PropertyJsonLd
        property={property}
        locale={locale}
        settings={settings}
        url={`/${locale}/properties/${property.id}`}
      />

      <Header locale={locale} dict={dict} settings={settings} />

      <main className="flex-1 pt-28 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={`/${locale}/properties`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7d7466] hover:text-[#11161d] transition-colors"
            >
              <ChevronBack className="w-4 h-4 text-[#c5a880]" />
              <span>{dict.propertyDetails.backToListings}</span>
            </Link>

            <span className="text-xs font-mono font-bold text-[#8a8070] bg-[#f1ede6] px-3 py-1 rounded-full">
              {property.referenceNumber}
            </span>
          </div>

          {/* Title and Location Header */}
          <div className="mb-8 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#c5a880] text-white">
                {property.propertyType.toUpperCase()}
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

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#11161d] tracking-tight font-serif-luxury">
              {title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-[#736a5c] font-medium">
              <MapPin className="w-4 h-4 text-[#c5a880] shrink-0" />
              <span>{locationName}</span>
            </div>
          </div>

          {/* Photo Gallery with Lightbox */}
          <div className="mb-12">
            <PropertyGallery
              images={galleryImages}
              title={title}
              locale={locale}
              dict={dict}
            />
          </div>

          {/* Content & Sticky Contact Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Col (2 Cols on LG): Specs, Description, Amenities */}
            <div className="lg:col-span-2 space-y-10">
              <PropertySpecs property={property} locale={locale} dict={dict} />
            </div>

            {/* Right Col: High-Conversion Sticky Contact Card */}
            <div className="lg:col-span-1">
              <PropertyContactCard
                property={property}
                locale={locale}
                dict={dict}
                settings={settings}
              />
            </div>
          </div>

          {/* Similar Recommended Properties */}
          {similarProperties.length > 0 && (
            <div className="mt-20 pt-14 border-t border-[#e5dfd3]">
              <div className="mb-8">
                <span className="text-xs font-bold text-[#c5a880] uppercase tracking-wider block mb-1">
                  {isAr ? 'عقارات مشابهة' : 'Recommended Listings'}
                </span>
                <h2 className="text-2xl font-bold text-[#11161d] font-serif-luxury">
                  {isAr ? 'شقق فاخرة أخرى قد تناسبك' : 'Other Luxury Residences You May Like'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {similarProperties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    locale={locale}
                    dict={dict}
                    settings={settings}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale} dict={dict} settings={settings} />
    </div>
  );
}
