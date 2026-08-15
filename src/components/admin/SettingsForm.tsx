'use client';

import { useState } from 'react';
import { Save, CheckCircle2, Phone, MessageCircle, Mail, Building, Video, DollarSign } from 'lucide-react';
import { SiteSettings, Locale } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface SettingsFormProps {
  initialSettings: SiteSettings;
  locale: Locale;
  dict: Dictionary;
}

export function SettingsForm({ initialSettings, locale, dict }: SettingsFormProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isAr = locale === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save settings error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'تم حفظ وتحديث الإعدادات بنجاح!' : 'Settings updated successfully!'}</span>
        </div>
      )}

      {/* Company Branding */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#11161d] font-serif-luxury flex items-center gap-2">
          <Building className="w-4 h-4 text-[#c5a880]" />
          <span>{isAr ? 'بيانات واسم الشركة' : 'Company Branding'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
              {isAr ? 'اسم الشركة بالإنجليزية' : 'Company Name (English)'}
            </label>
            <input
              type="text"
              required
              dir="ltr"
              value={settings.companyName.en}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  companyName: { ...settings.companyName, en: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880] focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
              {isAr ? 'اسم الشركة بالعربية' : 'Company Name (Arabic)'}
            </label>
            <input
              type="text"
              required
              dir="rtl"
              value={settings.companyName.ar}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  companyName: { ...settings.companyName, ar: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Contact & Conversion Channels */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#11161d] font-serif-luxury flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#c5a880]" />
          <span>{isAr ? 'قنوات التواصل المباشرة (الهاتف والواتساب)' : 'Direct Contact & WhatsApp Channels'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>{isAr ? 'رقم الواتساب المعتمد (مع الرمز الدولي)' : 'WhatsApp Number (with country code)'}</span>
            </label>
            <input
              type="text"
              required
              dir="ltr"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              placeholder="+971501234567"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880] focus:bg-white font-mono"
            />
            <p className="text-[10px] text-[#8a8070] mt-1">
              {isAr ? 'سيتم ربط جميع أزرار محادثة الواتساب بهذا الرقم تلقائياً.' : 'All WhatsApp inquiry buttons across listings will direct to this number.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{isAr ? 'رقم الهاتف للاتصال المباشر' : 'Direct Call Phone Number'}</span>
            </label>
            <input
              type="text"
              required
              dir="ltr"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+971 4 800 3597"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880] focus:bg-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{isAr ? 'البريد الإلكتروني للتأجير' : 'Leasing Email Address'}</span>
            </label>
            <input
              type="email"
              required
              dir="ltr"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{isAr ? 'العملة الافتراضية' : 'Default Currency'}</span>
            </label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880] focus:bg-white cursor-pointer"
            >
              <option value="JOD">JOD (دينار أردني - د.أ)</option>
              <option value="USD">USD ($)</option>
              <option value="AED">AED (درهم إماراتي)</option>
              <option value="SAR">SAR (ريال سعودي)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Video Banner Media */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e5dfd3] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#11161d] font-serif-luxury flex items-center gap-2">
          <Video className="w-4 h-4 text-[#c5a880]" />
          <span>{isAr ? 'فيديو واجهة الصفحة الرئيسية (Hero Banner)' : 'Homepage Hero Video Banner'}</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
              {isAr ? 'رابط ملف الفيديو (MP4 مباشر)' : 'Video Stream URL (.mp4 direct)'}
            </label>
            <input
              type="url"
              dir="ltr"
              value={settings.heroVideoUrl}
              onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880] focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
              {isAr ? 'رابط صورة الغلاف البديلة للفيديو' : 'Video Poster Fallback Image URL'}
            </label>
            <input
              type="url"
              dir="ltr"
              value={settings.heroVideoPoster}
              onChange={(e) => setSettings({ ...settings, heroVideoPoster: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880] focus:bg-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-gold px-8 py-3.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ كافة الإعدادات' : 'Save All Settings')}</span>
        </button>
      </div>
    </form>
  );
}
