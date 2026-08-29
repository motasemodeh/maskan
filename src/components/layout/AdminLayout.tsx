'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  Building,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Plus,
  ShieldAlert,
  Inbox,
  MapPin
} from 'lucide-react';
import { Locale } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface AdminLayoutProps {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
}

export function AdminLayout({ locale, dict, children, title, actionButton }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAr = locale === 'ar';

  const navItems = [
    {
      href: `/${locale}/admin`,
      exact: true,
      label: dict.admin.overview,
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/properties`,
      exact: false,
      label: dict.admin.properties,
      icon: Building,
    },
    {
      href: `/${locale}/admin/locations`,
      exact: false,
      label: dict.admin.locations,
      icon: MapPin,
    },
    {
      href: `/${locale}/admin/rental-requests`,
      exact: false,
      label: dict.admin.rentalRequests,
      icon: Inbox,
    },
    {
      href: `/${locale}/admin/analytics`,
      exact: false,
      label: dict.admin.analytics,
      icon: BarChart3,
    },
    {
      href: `/${locale}/admin/settings`,
      exact: false,
      label: dict.admin.settings,
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(`/${locale}/admin/login`);
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] text-[#1c222b] flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-72 bg-[#0c0f12] text-[#d6cfc4] flex-col justify-between shrink-0 border-e border-[#242932]">
        <div>
          {/* Logo / Brand */}
          <div className="p-6 border-b border-white/10">
            <Link href={`/${locale}/admin`} className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-md bg-white/10 flex items-center justify-center border border-white/15">
                <Image
                  src="/logo.png"
                  alt={dict.admin.portalTitle}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-base tracking-tight font-serif-luxury">
                  {dict.admin.portalTitle}
                </span>
                <span className="text-[#a89f91] text-[10px] uppercase tracking-widest">
                  {isAr ? 'الإدارة والتحكم' : 'Management Console'}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#c5a880] text-white shadow-md shadow-[#c5a880]/20'
                      : 'text-[#a89f91] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-[#c5a880] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span>{dict.admin.viewSite}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? '...' : dict.admin.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#e5dfd3] px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              type="button"
              className="lg:hidden p-2 text-[#443e35] hover:text-black rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {title && (
              <h1 className="text-xl font-bold text-[#11161d] font-serif-luxury truncate">
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-3.5">
            {actionButton}
            <LanguageSwitcher currentLocale={locale} variant="light" />
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-[#0c0f12] text-white flex flex-col justify-between p-6 z-10">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <span className="font-bold text-sm font-serif-luxury text-[#c5a880]">
                    {dict.admin.portalTitle}
                  </span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="py-6 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-[#c5a880] text-white'
                            : 'text-[#a89f91] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <Link
                  href={`/${locale}`}
                  target="_blank"
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-[#c5a880] bg-white/5"
                >
                  <span>{dict.admin.viewSite}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{dict.admin.logout}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
