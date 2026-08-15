import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Locale } from '@/lib/types';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getProperties, getSettings } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyListingsClient } from '@/components/properties/PropertyListingsClient';
import { Building2 } from 'lucide-react';

interface PropertiesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PropertiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = getDictionary(locale);
  const settings = await getSettings();
  const isAr = locale === 'ar';
  const companyName = isAr ? settings.companyName.ar : settings.companyName.en;

  const title = isAr
    ? `الشقق المتاحة للإيجار | ${companyName}`
    : `Available Luxury Apartments For Rent | ${companyName}`;

  const description = isAr
    ? 'تصفح قائمة الشقق الفاخرة المتاحة للإيجار، وقارن الأسعار والمواصفات واحجز موعد معاينة فوري عبر واتساب.'
    : 'Browse available premium rental apartments, filter by area and price, and contact leasing managers instantly via WhatsApp.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: isAr ? 'ar_SA' : 'en_US',
    },
    alternates: {
      canonical: `/${locale}/properties`,
      languages: {
        en: '/en/properties',
        ar: '/ar/properties',
      },
    },
  };
}

export default async function PropertiesPage({ params }: PropertiesPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const settings = await getSettings();
  const properties = await getProperties(true); // only available public properties

  const isAr = locale === 'ar';

  return (
    <div className="flex-1 flex flex-col bg-[#fbfaf8]">
      <Header locale={locale} dict={dict} settings={settings} />

      <main className="flex-1 pt-28 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="mb-10 text-center sm:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/15 text-[#a9885c] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{dict.nav.properties}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#11161d] tracking-tight font-serif-luxury">
              {isAr ? 'عقارات وشقق سكنية متاحة للإيجار' : 'Available Luxury Residences'}
            </h1>
            <p className="text-sm sm:text-base text-[#756d61] mt-2 max-w-2xl">
              {isAr
                ? 'استخدم خيارات التصفية لتحديد المنطقة ونطاق السعر وعدد الغرف المطلوبة.'
                : 'Filter by location, price range, and bedroom requirements to find your ideal home.'}
            </p>
          </div>

          {/* Interactive Listings and Filters */}
          <Suspense fallback={<div className="py-20 text-center text-sm text-[#7d7466]">Loading listings...</div>}>
            <PropertyListingsClient
              initialProperties={properties}
              locale={locale}
              dict={dict}
              settings={settings}
            />
          </Suspense>
        </div>
      </main>

      <Footer locale={locale} dict={dict} settings={settings} />
    </div>
  );
}
