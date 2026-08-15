import Link from 'next/link';
import { Building2, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0f12] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#c5a880] flex items-center justify-center mb-6">
        <Building2 className="w-8 h-8" />
      </div>

      <span className="text-6xl sm:text-8xl font-black text-[#c5a880] tracking-tighter mb-4 font-serif-luxury">
        404
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-serif-luxury">
        Page Not Found / الصفحة غير موجودة
      </h1>

      <p className="text-sm text-[#a89f91] max-w-md mb-8">
        The residence or page you are looking for might have been removed, rented, or is temporarily unavailable.
      </p>

      <div className="flex items-center gap-4">
        <Link
          href="/en"
          className="btn-gold px-6 py-3 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home (EN)</span>
        </Link>
        <Link
          href="/ar"
          className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-xs font-bold text-white border border-white/20 transition-all"
        >
          <span>الرئيسية (العربية)</span>
        </Link>
      </div>
    </div>
  );
}
