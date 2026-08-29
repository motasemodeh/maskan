import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getSettings } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RentalRequestForm } from '@/components/forms/RentalRequestForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    title: dict.listProperty.title,
    description: dict.listProperty.subtitle,
    alternates: {
      canonical: `/${locale}/list-your-property`,
      languages: {
        en: '/en/list-your-property',
        ar: '/ar/list-your-property',
      },
    },
  };
}

export default async function ListYourPropertyPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const settings = await getSettings();

  return (
    <div className="flex-1 flex flex-col">
      <Header locale={locale} dict={dict} settings={settings} />

      <main className="flex-1 bg-[#f7f5f1]">
        {/* Page Heading */}
        <section className="bg-gradient-to-r from-[#1c1813] via-[#241f1a] to-[#1a1612] text-white pt-32 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/20 text-[#dfcbb5] text-xs font-bold uppercase tracking-wider mb-4 border border-[#c5a880]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dict.listProperty.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-serif-luxury">
              {dict.listProperty.title}
            </h1>
            <p className="text-sm sm:text-base text-[#bfb7ab] mt-4 leading-relaxed">
              {dict.listProperty.subtitle}
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
          <RentalRequestForm locale={locale} dict={dict} />
        </section>
      </main>

      <Footer locale={locale} dict={dict} settings={settings} />
    </div>
  );
}
