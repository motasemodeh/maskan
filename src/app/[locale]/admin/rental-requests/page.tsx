import { redirect } from 'next/navigation';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getRentalRequests } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { RentalRequestsTable } from '@/components/admin/RentalRequestsTable';

interface AdminRentalRequestsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminRentalRequestsPage({ params }: AdminRentalRequestsPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect('/en/admin/login');
  }

  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  const dict = getDictionary(locale);
  const requests = await getRentalRequests();

  return (
    <AdminLayout locale={locale} dict={dict} title={dict.admin.rentalRequests}>
      <div className="space-y-6 animate-fade-in">
        <RentalRequestsTable
          initialRequests={requests}
          locale={locale}
          dict={dict}
        />
      </div>
    </AdminLayout>
  );
}
