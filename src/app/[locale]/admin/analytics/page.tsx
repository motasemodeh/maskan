import { redirect } from 'next/navigation';
import { Locale } from '@/lib/types';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getAnalyticsSummary, getSettings } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

interface AdminAnalyticsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminAnalyticsPage({ params }: AdminAnalyticsPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect('/en/admin/login');
  }

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  const dict = getDictionary(locale);
  const summary = await getAnalyticsSummary();
  const settings = await getSettings();

  return (
    <AdminLayout
      locale={locale}
      dict={dict}
      title={dict.analytics.title}
    >
      <div className="space-y-6 animate-fade-in">
        <AnalyticsCharts
          summary={summary}
          settings={settings}
          locale={locale}
          dict={dict}
        />
      </div>
    </AdminLayout>
  );
}
