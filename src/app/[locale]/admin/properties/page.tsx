import { redirect } from 'next/navigation';
import { Locale } from '@/lib/types';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getProperties } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PropertyTable } from '@/components/admin/PropertyTable';

interface AdminPropertiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPropertiesPage({ params }: AdminPropertiesPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect('/en/admin/login');
  }

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  const dict = getDictionary(locale);
  const properties = await getProperties(false);

  return (
    <AdminLayout
      locale={locale}
      dict={dict}
      title={dict.admin.properties}
    >
      <div className="space-y-6 animate-fade-in">
        <PropertyTable
          initialProperties={properties}
          locale={locale}
          dict={dict}
        />
      </div>
    </AdminLayout>
  );
}
