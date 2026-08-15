import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from '@/lib/types';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getProperties, getSettings } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroVideo } from '@/components/home/HeroVideo';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { ContactBanner } from '@/components/home/ContactBanner';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = getDictionary(locale);
  const settings = await getSettings();
  const isAr = locale === 'ar';
  const companyName = isAr ? settings.companyName.ar : settings.companyName.en;

  const title = isAr
    ? `${companyName} | شقق ومساكن فاخرة للإيجار`
    : `${companyName} | Luxury Residences & Apartments For Rent`;

  const description = isAr
    ? 'استكشف أرقى الشقق السكنية الفاخرة للإيجار في أفضل المواقع الحيوية مع معاينة فورية وعقود موثقة.'
    : 'Discover exclusive luxury apartments and residences for rent in prime metropolitan locations with dedicated concierge advisory.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: settings.heroVideoPoster }],
      locale: isAr ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ar: '/ar',
      },
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const settings = await getSettings();
  const properties = await getProperties(true); // only available

  // Extract unique locations for the filter
  const isAr = locale === 'ar';
  const availableLocations = Array.from(
    new Set(properties.map((p) => (isAr ? p.location.ar : p.location.en)))
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header locale={locale} dict={dict} settings={settings} />

      <main className="flex-1">
        {/* Full-width Video Hero */}
        <HeroVideo
          locale={locale}
          dict={dict}
          settings={settings}
          availableLocations={availableLocations}
        />

        {/* Featured Properties Showcase */}
        <FeaturedProperties
          properties={properties}
          locale={locale}
          dict={dict}
          settings={settings}
        />

        {/* Trust & Brand Highlights */}
        <WhyChooseUs locale={locale} dict={dict} />

        {/* Contact & WhatsApp Conversion Banner */}
        <ContactBanner locale={locale} dict={dict} settings={settings} />
      </main>

      <Footer locale={locale} dict={dict} settings={settings} />
    </div>
  );
}
