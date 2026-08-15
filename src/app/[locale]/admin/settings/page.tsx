import { redirect } from 'next/navigation';
import { Locale } from '@/lib/types';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getSettings } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { SettingsForm } from '@/components/admin/SettingsForm';

interface AdminSettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminSettingsPage({ params }: AdminSettingsPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect('/en/admin/login');
  }

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  const dict = getDictionary(locale);
  const settings = await getSettings();

  return (
    <AdminLayout
      locale={locale}
      dict={dict}
      title={dict.admin.settings}
    >
      <div className="space-y-6 animate-fade-in">
        <SettingsForm
          initialSettings={settings}
          locale={locale}
          dict={dict}
        />
      </div>
    </AdminLayout>
  );
}
