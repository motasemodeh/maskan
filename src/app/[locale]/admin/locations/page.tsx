import { redirect } from 'next/navigation';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getCities } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LocationsManager } from '@/components/admin/LocationsManager';

interface AdminLocationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminLocationsPage({ params }: AdminLocationsPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect('/en/admin/login');
  }

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  const dict = getDictionary(locale);
  const cities = await getCities();

  return (
    <AdminLayout locale={locale} dict={dict} title={dict.admin.locationsTitle}>
      <div className="space-y-6 animate-fade-in">
        <p className="text-sm text-[#6b6355] max-w-2xl">{dict.admin.locationsSubtitle}</p>
        <LocationsManager initialCities={cities} locale={locale} dict={dict} />
      </div>
    </AdminLayout>
  );
}
