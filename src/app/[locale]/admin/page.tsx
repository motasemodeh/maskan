import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  Plus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { Locale } from '@/lib/types';
import { getDictionary, isValidLocale } from '@/locales/dictionary';
import { getProperties, getAnalyticsSummary, getSettings } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PropertyTable } from '@/components/admin/PropertyTable';

interface AdminDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboardPage({ params }: AdminDashboardPageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect('/en/admin/login');
  }

  // Verify Auth
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${locale}/admin/login`);
  }

  const dict = getDictionary(locale);
  const properties = await getProperties(false);
  const analytics = await getAnalyticsSummary();
  const settings = await getSettings();

  const totalProps = properties.length;
  const availableCount = properties.filter((p) => p.status === 'available').length;
  const rentedCount = properties.filter((p) => p.status !== 'available').length;
  const totalViews = properties.reduce((acc, p) => acc + (p.viewsCount || 0), 0);

  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <AdminLayout
      locale={locale}
      dict={dict}
      title={dict.admin.overview}
      actionButton={
        <Link
          href={`/${locale}/admin/properties`}
          className="btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{dict.admin.addNew}</span>
        </Link>
      }
    >
      <div className="space-y-8 animate-fade-in">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Properties */}
          <div className="bg-white p-6 rounded-3xl border border-[#e5dfd3] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#11161d] text-[#c5a880] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#8a8070] uppercase tracking-wider block">
                {dict.admin.totalProperties}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#11161d]">
                {totalProps}
              </span>
            </div>
          </div>

          {/* Available Public Properties */}
          <div className="bg-white p-6 rounded-3xl border border-[#e5dfd3] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#8a8070] uppercase tracking-wider block">
                {dict.admin.availableCount}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {availableCount}
              </span>
            </div>
          </div>

          {/* Rented / Hidden Properties */}
          <div className="bg-white p-6 rounded-3xl border border-[#e5dfd3] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#8a8070] uppercase tracking-wider block">
                {dict.admin.rentedCount}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-700">
                {rentedCount}
              </span>
            </div>
          </div>

          {/* Total Property Views */}
          <div className="bg-white p-6 rounded-3xl border border-[#e5dfd3] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 text-[#a9885c] flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#8a8070] uppercase tracking-wider block">
                {dict.admin.totalViews}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#11161d]">
                {totalViews.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Analytics & Activity Banner */}
        <div className="bg-gradient-to-r from-[#161b22] to-[#11161d] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-start">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c5a880] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{dict.admin.analytics}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
              {isAr ? 'مؤشرات التفاعل والزيارات في الوقت الفعلي' : 'Real-Time Engagement & Visitor Metrics'}
            </h2>
            <p className="text-xs sm:text-sm text-[#a89f91]">
              {isAr
                ? `سجل الموقع ${analytics.totalVisitors} زائر فريد و ${analytics.totalPageViews} مشاهدة للصفحات.`
                : `The platform has recorded ${analytics.totalVisitors} unique visitors and ${analytics.totalPageViews} total page views.`}
            </p>
          </div>

          <Link
            href={`/${locale}/admin/analytics`}
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold shadow-md shrink-0"
          >
            <span>{isAr ? 'استعراض تقرير التحليلات' : 'View Full Analytics Report'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Property Management Table Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#11161d] font-serif-luxury">
              {dict.admin.properties}
            </h2>
            <Link
              href={`/${locale}/admin/properties`}
              className="text-xs font-bold text-[#a9885c] hover:text-[#886940] flex items-center gap-1"
            >
              <span>{isAr ? 'عرض كافة العقارات' : 'Manage All Properties'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <PropertyTable
            initialProperties={properties}
            locale={locale}
            dict={dict}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
