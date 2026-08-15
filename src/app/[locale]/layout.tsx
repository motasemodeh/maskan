import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Locale } from '@/lib/types';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getSettings } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnalyticsTracker } from '@/components/common/AnalyticsTracker';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const settings = await getSettings();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const gaId = settings.gaMeasurementId && settings.gaMeasurementId !== 'G-XXXXXXXXXX' ? settings.gaMeasurementId : null;

  return (
    <html lang={locale} dir={dir} className="h-full scroll-smooth">
      <head>
        {/* Google Analytics Script if valid ID configured */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#fbfaf8] text-[#1a1f26] antialiased">
        <AnalyticsTracker locale={locale} />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
