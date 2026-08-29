'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, Send, User, Phone, MapPin, Building2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { City, Locale } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface RentalRequestFormProps {
  locale: Locale;
  dict: Dictionary;
}

interface FormState {
  fullName: string;
  phone: string;
  area: string;
  district: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  fullName: '',
  phone: '',
  area: '',
  district: '',
  notes: '',
};

export function RentalRequestForm({ locale, dict }: RentalRequestFormProps) {
  const t = dict.listProperty;
  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [cities, setCities] = useState<City[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cities and areas are managed from the admin panel
  useEffect(() => {
    let active = true;

    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.success) setCities(data.data as City[]);
      })
      .catch(() => {
        /* fall back to free-text inputs */
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedCity = useMemo(
    () => cities.find((c) => (isAr ? c.name.ar : c.name.en) === form.area),
    [cities, form.area, isAr]
  );

  const hasCities = cities.length > 0;
  const districtOptions = selectedCity?.districts ?? [];

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCityChange = (value: string) => {
    // Changing the city clears the previously selected area
    setForm((prev) => ({ ...prev, area: value, district: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.phone.trim() || !form.area.trim() || !form.district.trim()) {
      setError(t.errorRequired);
      return;
    }

    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      setError(t.errorPhone);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rental-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error === 'MISSING_FIELDS') setError(t.errorRequired);
        else if (data.error === 'INVALID_PHONE') setError(t.errorPhone);
        else setError(t.errorGeneric);
        return;
      }

      setIsSuccess(true);
      setForm(EMPTY_FORM);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl border border-[#e8e1d6] shadow-xl p-8 sm:p-12 text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#11161d] font-serif-luxury mb-2.5">
          {t.successTitle}
        </h2>
        <p className="text-sm text-[#5f584d] leading-relaxed max-w-md mx-auto">
          {t.successDesc}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="px-6 py-3 rounded-full btn-gold text-sm font-bold cursor-pointer"
          >
            {t.newRequest}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#1c222b] bg-[#f2ede4] hover:bg-[#e8e1d6] transition-colors"
          >
            <span>{t.backHome}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-[#e8e1d6] shadow-xl p-6 sm:p-9 space-y-5 animate-fade-in"
    >
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full name */}
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-[#6b6355] mb-2">
            {t.fullName} <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#e5dfd3] focus-within:border-[#c5a880] focus-within:bg-white transition-colors">
            <User className="w-4 h-4 text-[#c5a880] shrink-0" />
            <input
              id="fullName"
              type="text"
              required
              maxLength={120}
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className="bg-transparent w-full text-sm text-[#1c222b] placeholder-[#a39a8b] focus:outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[#6b6355] mb-2">
            {t.phone} <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#e5dfd3] focus-within:border-[#c5a880] focus-within:bg-white transition-colors">
            <Phone className="w-4 h-4 text-[#c5a880] shrink-0" />
            <input
              id="phone"
              type="tel"
              required
              dir="ltr"
              maxLength={25}
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t.phonePlaceholder}
              className="bg-transparent w-full text-sm text-[#1c222b] placeholder-[#a39a8b] focus:outline-none text-start"
            />
          </div>
        </div>

        {/* Area */}
        <div>
          <label htmlFor="area" className="block text-xs font-bold uppercase tracking-wider text-[#6b6355] mb-2">
            {t.area} <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#e5dfd3] focus-within:border-[#c5a880] focus-within:bg-white transition-colors">
            <MapPin className="w-4 h-4 text-[#c5a880] shrink-0" />
            {hasCities ? (
              <select
                id="area"
                required
                value={form.area}
                onChange={(e) => handleCityChange(e.target.value)}
                className="bg-transparent w-full text-sm text-[#1c222b] focus:outline-none cursor-pointer"
              >
                <option value="">{t.selectArea}</option>
                {cities.map((city) => {
                  const label = isAr ? city.name.ar : city.name.en;
                  return (
                    <option key={city.id} value={label}>
                      {label}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                id="area"
                type="text"
                required
                maxLength={120}
                value={form.area}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder={t.areaPlaceholder}
                className="bg-transparent w-full text-sm text-[#1c222b] placeholder-[#a39a8b] focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* District */}
        <div>
          <label htmlFor="district" className="block text-xs font-bold uppercase tracking-wider text-[#6b6355] mb-2">
            {t.district} <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#e5dfd3] focus-within:border-[#c5a880] focus-within:bg-white transition-colors">
            <Building2 className="w-4 h-4 text-[#c5a880] shrink-0" />
            {hasCities && districtOptions.length > 0 ? (
              <select
                id="district"
                required
                value={form.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="bg-transparent w-full text-sm text-[#1c222b] focus:outline-none cursor-pointer"
              >
                <option value="">{t.selectDistrict}</option>
                {districtOptions.map((district) => {
                  const label = isAr ? district.name.ar : district.name.en;
                  return (
                    <option key={district.id} value={label}>
                      {label}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                id="district"
                type="text"
                required
                maxLength={120}
                value={form.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder={t.districtPlaceholder}
                className="bg-transparent w-full text-sm text-[#1c222b] placeholder-[#a39a8b] focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-[#6b6355] mb-2">
            {t.notes}
          </label>
          <textarea
            id="notes"
            rows={4}
            maxLength={1000}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder={t.notesPlaceholder}
            className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#e5dfd3] focus:border-[#c5a880] focus:bg-white text-sm text-[#1c222b] placeholder-[#a39a8b] focus:outline-none transition-colors resize-y"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full btn-gold text-sm font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.submitting}</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{t.submit}</span>
          </>
        )}
      </button>
    </form>
  );
}
