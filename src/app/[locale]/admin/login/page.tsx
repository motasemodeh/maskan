'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Lock, User, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { Locale } from '@/lib/types';
import { getDictionary } from '@/locales/dictionary';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

interface AdminLoginPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<Locale>('en');
  const router = useRouter();

  // Load params
  useState(() => {
    params.then((p) => {
      setLocale((p.locale as Locale) || 'en');
    });
  });

  const dict = getDictionary(locale);
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/${locale}/admin`);
        router.refresh();
      } else {
        setError(data.error || dict.admin.loginError);
      }
    } catch {
      setError(dict.admin.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f12] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-md bg-white/10 flex items-center justify-center border border-white/15">
            <Image
              src="/logo.png"
              alt={dict.admin.portalTitle}
              fill
              sizes="40px"
              className="object-contain p-1"
            />
          </div>
          <span className="font-bold text-base font-serif-luxury text-white">
            {dict.admin.portalTitle}
          </span>
        </Link>
        <LanguageSwitcher currentLocale={locale} variant="dark" />
      </div>

      {/* Login Box */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-10">
        <div className="bg-[#161b22]/90 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30 mx-auto flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-serif-luxury">
              {dict.admin.loginTitle}
            </h1>
            <p className="text-xs text-[#a89f91] leading-relaxed">
              {dict.admin.loginSubtitle}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#d6cfc4] uppercase mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{dict.admin.username}</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-[#70685d] focus:outline-none focus:border-[#c5a880] focus:bg-white/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#d6cfc4] uppercase mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{dict.admin.password}</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-[#70685d] focus:outline-none focus:border-[#c5a880] focus:bg-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? '...' : dict.admin.signIn}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </form>

          {/* Demo helper badge */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-[#a89f91] bg-white/5 p-2.5 rounded-xl border border-white/5">
              {dict.admin.demoCredentials}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-[#70685d] z-10">
        <Link href={`/${locale}`} className="hover:text-[#c5a880] transition-colors">
          ← {dict.admin.viewSite}
        </Link>
      </div>
    </div>
  );
}
