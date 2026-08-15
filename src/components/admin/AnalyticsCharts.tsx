'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Eye,
  Smartphone,
  Globe2,
  Share2,
  TrendingUp,
  BarChart2,
  ExternalLink,
  Save,
  CheckCircle2
} from 'lucide-react';
import { AnalyticsSummary, Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { formatPrice } from '@/lib/utils';

interface AnalyticsChartsProps {
  summary: AnalyticsSummary;
  settings: SiteSettings;
  locale: Locale;
  dict: Dictionary;
}

export function AnalyticsCharts({ summary, settings, locale, dict }: AnalyticsChartsProps) {
  const isAr = locale === 'ar';
  const [gaId, setGaId] = useState(settings.gaMeasurementId || '');
  const [isSavingGa, setIsSavingGa] = useState(false);
  const [gaSavedMessage, setGaSavedMessage] = useState(false);

  const handleSaveGa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGa(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gaMeasurementId: gaId.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setGaSavedMessage(true);
        setTimeout(() => setGaSavedMessage(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save GA ID:', err);
    } finally {
      setIsSavingGa(false);
    }
  };

  // Calculate percentages for devices
  const totalDevices = summary.devices.mobile + summary.devices.desktop + summary.devices.tablet || 1;
  const mobilePct = Math.round((summary.devices.mobile / totalDevices) * 100);
  const desktopPct = Math.round((summary.devices.desktop / totalDevices) * 100);
  const tabletPct = Math.round((summary.devices.tablet / totalDevices) * 100);

  // Calculate languages percentage
  const totalLangs = summary.languages.en + summary.languages.ar || 1;
  const arPct = Math.round((summary.languages.ar / totalLangs) * 100);
  const enPct = Math.round((summary.languages.en / totalLangs) * 100);

  // Maximum daily view for relative bar height
  const maxDaily = Math.max(...summary.dailyViews.map((d) => d.views), 10);

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#e5dfd3] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 text-[#a9885c] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#8a8070] uppercase tracking-wider block">
              {dict.analytics.uniqueVisitors}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#11161d]">
              {summary.totalVisitors.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e5dfd3] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#8a8070] uppercase tracking-wider block">
              {dict.analytics.pageViews}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#11161d]">
              {summary.totalPageViews.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e5dfd3] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#8a8070] uppercase tracking-wider block">
              {dict.analytics.propertyViews}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#11161d]">
              {summary.totalPropertyViews.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Traffic Over Time & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Views Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#11161d] font-serif-luxury flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#c5a880]" />
              <span>{dict.analytics.viewsOverTime}</span>
            </h2>
            <span className="text-xs text-[#8a8070] font-semibold">
              {isAr ? 'آخر 7 أيام' : 'Last 7 Days'}
            </span>
          </div>

          {/* Simple Clean Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {summary.dailyViews.map((day) => {
              const heightPct = Math.max(Math.round((day.views / maxDaily) * 100), 12);
              const dateLabel = new Date(day.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                weekday: 'short',
              });

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-[#8a8070] group-hover:text-[#11161d] transition-colors">
                    {day.views}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[38px] rounded-t-lg bg-gradient-to-t from-[#ab895e] to-[#c5a880] group-hover:from-[#94744d] group-hover:to-[#b6976d] transition-all shadow-xs"
                  />
                  <span className="text-[10px] text-[#8a8070] font-semibold truncate">
                    {dateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Devices & Languages */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-6">
          {/* Devices Breakdown */}
          <div>
            <h2 className="text-base font-bold text-[#11161d] font-serif-luxury mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#c5a880]" />
              <span>{dict.analytics.devices}</span>
            </h2>
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <div className="flex justify-between mb-1 text-[#4f483e]">
                  <span>{isAr ? 'هواتف ذكية' : 'Mobile'}</span>
                  <span>{mobilePct}% ({summary.devices.mobile})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f1ede6] overflow-hidden">
                  <div style={{ width: `${mobilePct}%` }} className="h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-[#4f483e]">
                  <span>{isAr ? 'أجهزة مكتبية' : 'Desktop'}</span>
                  <span>{desktopPct}% ({summary.devices.desktop})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f1ede6] overflow-hidden">
                  <div style={{ width: `${desktopPct}%` }} className="h-full bg-blue-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-[#4f483e]">
                  <span>{isAr ? 'أجهزة لوحية' : 'Tablet'}</span>
                  <span>{tabletPct}% ({summary.devices.tablet})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f1ede6] overflow-hidden">
                  <div style={{ width: `${tabletPct}%` }} className="h-full bg-[#c5a880] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Languages Breakdown */}
          <div className="pt-4 border-t border-[#f1ede6]">
            <h3 className="text-xs font-bold text-[#8a8070] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{dict.analytics.languages}</span>
            </h3>
            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex-1 p-3 rounded-xl bg-[#faf8f5] border border-[#ded7ca] text-center">
                <span className="text-[#8a8070] block text-[10px]">العربية</span>
                <span className="text-base text-[#11161d]">{arPct}%</span>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-[#faf8f5] border border-[#ded7ca] text-center">
                <span className="text-[#8a8070] block text-[10px]">English</span>
                <span className="text-base text-[#11161d]">{enPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Most Visited Properties & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Visited Properties Table */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#11161d] font-serif-luxury">
            {dict.analytics.topProperties}
          </h2>
          <div className="divide-y divide-[#f1ede6]">
            {summary.topProperties.map((prop, idx) => {
              const title = isAr ? prop.title.ar : prop.title.en;
              return (
                <div key={prop.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-6 text-xs font-bold text-[#a9885c]">
                      #{idx + 1}
                    </span>
                    <div className="relative aspect-[16/10] w-14 rounded-lg overflow-hidden bg-black/10 shrink-0 border border-[#e5dfd3]">
                      <Image
                        src={prop.featuredImage}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/${locale}/properties/${prop.id}`}
                        target="_blank"
                        className="text-xs font-bold text-[#11161d] hover:text-[#c5a880] truncate block"
                      >
                        {title}
                      </Link>
                      <span className="text-[10px] text-[#8a8070] font-mono">
                        {prop.referenceNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-end">
                      <span className="text-xs font-extrabold text-[#11161d] block">
                        {prop.views} {dict.admin.tableViews}
                      </span>
                      <span className="text-[10px] text-[#8a8070]">
                        {formatPrice(prop.price, 'JOD', locale)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources & Google Analytics Config */}
        <div className="space-y-6">
          {/* Traffic Sources */}
          <div className="bg-white p-6 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#11161d] font-serif-luxury flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#c5a880]" />
              <span>{dict.analytics.sources}</span>
            </h2>
            <div className="space-y-2.5 text-xs">
              {Object.entries(summary.sources).map(([src, count]) => (
                <div key={src} className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf8f5] border border-[#ded7ca]">
                  <span className="font-semibold text-[#4f483e]">{src}</span>
                  <span className="font-extrabold text-[#11161d]">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Analytics ID Integration Card */}
          <div className="bg-[#11161d] text-white p-6 rounded-3xl border border-white/10 shadow-md space-y-3">
            <h3 className="text-sm font-bold text-white font-serif-luxury">
              {dict.analytics.gaIntegration}
            </h3>
            <p className="text-xs text-[#a79f93] leading-relaxed">
              {dict.analytics.gaDesc}
            </p>
            <form onSubmit={handleSaveGa} className="space-y-2.5 pt-1">
              <input
                type="text"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                placeholder={dict.analytics.gaPlaceholder}
                className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-[#878074] focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="submit"
                disabled={isSavingGa}
                className="btn-gold w-full py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingGa ? 'Saving...' : dict.analytics.saveGa}</span>
              </button>
            </form>
            {gaSavedMessage && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{dict.analytics.gaUpdated}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
