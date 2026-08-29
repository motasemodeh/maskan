'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Building,
  Sparkles,
  DollarSign,
  MapPin,
  Layers,
  FileText
} from 'lucide-react';
import { Property, Locale, FurnishedStatus, PropertyType, PropertyStatus, City } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: Property | null;
  locale: Locale;
  dict: Dictionary;
}

const ALL_AMENITIES = [
  'pool',
  'gym',
  'parking',
  'balcony',
  'security',
  'concierge',
  'sea_view',
  'elevator',
  'central_ac',
  'smart_home',
  'maids_room',
  'built_in_wardrobes',
  'pet_friendly',
  'kids_play_area',
  'spa_sauna',
  'bbq_area',
];

export function PropertyFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  locale,
  dict,
}: PropertyFormModalProps) {
  const isEditing = Boolean(initialData);
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'media' | 'amenities'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [refNumber, setRefNumber] = useState(initialData?.referenceNumber || `REF-${Math.floor(100 + Math.random() * 900)}`);
  const [titleEn, setTitleEn] = useState(initialData?.title?.en || '');
  const [titleAr, setTitleAr] = useState(initialData?.title?.ar || '');
  const [descEn, setDescEn] = useState(initialData?.description?.en || '');
  const [descAr, setDescAr] = useState(initialData?.description?.ar || '');
  const [locationEn, setLocationEn] = useState(initialData?.location?.en || '');
  const [locationAr, setLocationAr] = useState(initialData?.location?.ar || '');
  const [city, setCity] = useState(initialData?.location?.city || '');
  const [cities, setCities] = useState<City[]>([]);

  // Cities & areas are managed in the admin "Cities & Areas" screen
  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.success) setCities(data.data as City[]);
      })
      .catch(() => {
        /* keep manual entry available */
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  const selectedCity = useMemo(
    () => cities.find((c) => c.name.en === city || c.name.ar === city),
    [cities, city]
  );
  const districtOptions = selectedCity?.districts ?? [];
  const hasCities = cities.length > 0;

  const [price, setPrice] = useState<string>(initialData?.price ? String(initialData.price) : '');
  const [currency, setCurrency] = useState(initialData?.currency || 'JOD');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>(initialData?.period || 'monthly');
  const [deposit, setDeposit] = useState<string>(initialData?.deposit ? String(initialData.deposit) : '');

  const [bedrooms, setBedrooms] = useState<string>(initialData?.bedrooms !== undefined ? String(initialData.bedrooms) : '2');
  const [bathrooms, setBathrooms] = useState<string>(initialData?.bathrooms !== undefined ? String(initialData.bathrooms) : '2');
  const [areaSqM, setAreaSqM] = useState<string>(initialData?.areaSqM ? String(initialData.areaSqM) : '150');
  const [floor, setFloor] = useState<string>(initialData?.floor ? String(initialData.floor) : '10');
  const [furnished, setFurnished] = useState<FurnishedStatus>(initialData?.furnished || 'furnished');
  const [propertyType, setPropertyType] = useState<PropertyType>(initialData?.propertyType || 'apartment');

  const [status, setStatus] = useState<PropertyStatus>(initialData?.status || 'available');
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);

  const [featuredImage, setFeaturedImage] = useState<string>(
    initialData?.featuredImage ||
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  );
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || ['pool', 'gym', 'parking', 'security', 'central_ac']);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle direct file upload for featured image
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setFeaturedImage(data.url);
      }
    } catch (err) {
      console.error('Featured image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle direct file upload for gallery images
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success && data.url) {
          setGallery((prev) => [...prev, data.url]);
        }
      }
    } catch (err) {
      console.error('Gallery image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setGallery((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const toggleAmenity = (key: string) => {
    if (amenities.includes(key)) {
      setAmenities((prev) => prev.filter((k) => k !== key));
    } else {
      setAmenities((prev) => [...prev, key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      referenceNumber: refNumber.trim(),
      title: {
        en: titleEn.trim() || 'Luxury Apartment',
        ar: titleAr.trim() || 'شقة فاخرة للإيجار',
      },
      description: {
        en: descEn.trim() || 'Premium residence with high-end amenities.',
        ar: descAr.trim() || 'شقة سكنية راقية مجهزة بأحدث الخدمات والمواصفات.',
      },
      location: {
        en: locationEn.trim() || 'Metropolitan City',
        ar: locationAr.trim() || 'المدينة الرئيسية',
        city: city.trim(),
        district: district.trim(),
      },
      price: Number(price) || 10000,
      currency,
      period,
      deposit: deposit ? Number(deposit) : undefined,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqM: Number(areaSqM),
      floor: floor || '1',
      furnished,
      propertyType,
      featuredImage: featuredImage || gallery[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      gallery: gallery.length > 0 ? gallery : [featuredImage],
      amenities,
      status,
      featured,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-[#e5dfd3] flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#eee8dd] flex items-center justify-between bg-[#faf8f5]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#11161d] font-serif-luxury">
              {isEditing
                ? dict.admin.modalEditTitle.replace('{ref}', initialData?.referenceNumber || '')
                : dict.admin.modalAddTitle}
            </h2>
            <p className="text-xs text-[#7d7466] mt-0.5">
              {isAr
                ? 'أدخل بيانات العقار باللغتين العربية والإنجليزية وتفاصيل الصور والأسعار'
                : 'Configure bilingual details, pricing, specs, and gallery imagery'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 text-[#7d7466] hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#eee8dd] bg-[#fbfaf8] px-6 gap-2 sm:gap-6 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'details'
                ? 'border-[#c5a880] text-[#a9885c]'
                : 'border-transparent text-[#7d7466] hover:text-[#11161d]'
            }`}
          >
            {isAr ? '1. العناوين والوصف والموقع' : '1. Basic Info & Location'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'specs'
                ? 'border-[#c5a880] text-[#a9885c]'
                : 'border-transparent text-[#7d7466] hover:text-[#11161d]'
            }`}
          >
            {isAr ? '2. الأسعار والمواصفات' : '2. Price & Specs'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'media'
                ? 'border-[#c5a880] text-[#a9885c]'
                : 'border-transparent text-[#7d7466] hover:text-[#11161d]'
            }`}
          >
            {isAr ? '3. الصور والمعرض' : '3. Images & Gallery'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('amenities')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'amenities'
                ? 'border-[#c5a880] text-[#a9885c]'
                : 'border-transparent text-[#7d7466] hover:text-[#11161d]'
            }`}
          >
            {isAr ? '4. المميزات وحالة الظهور' : '4. Amenities & Status'}
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: DETAILS & LOCATION */}
          {activeTab === 'details' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formRef} *
                  </label>
                  <input
                    type="text"
                    required
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] font-mono focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formCity}
                  </label>
                  {hasCities ? (
                    <select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setDistrict('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white cursor-pointer"
                    >
                      <option value="">{dict.admin.selectCity}</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.name.en}>
                          {isAr ? `${c.name.ar} - ${c.name.en}` : c.name.en}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formDistrict}
                  </label>
                  {districtOptions.length > 0 ? (
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white cursor-pointer"
                    >
                      <option value="">{dict.admin.selectDistrict}</option>
                      {districtOptions.map((d) => (
                        <option key={d.id} value={d.name.en}>
                          {isAr ? `${d.name.ar} - ${d.name.en}` : d.name.en}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                    />
                  )}
                </div>
              </div>

              {/* Titles EN / AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formEnTitle} *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Modern Marina Panoramic Suite"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formArTitle} *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: شقة مارينا بانورامية فاخرة"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
              </div>

              {/* Locations EN / AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formEnLocation} *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={locationEn}
                    onChange={(e) => setLocationEn(e.target.value)}
                    placeholder="e.g. Dubai Marina, Dubai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formArLocation} *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={locationAr}
                    onChange={(e) => setLocationAr(e.target.value)}
                    placeholder="مثال: دبي مارينا، دبي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
              </div>

              {/* Descriptions EN / AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formEnDesc}
                  </label>
                  <textarea
                    rows={4}
                    dir="ltr"
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="Comprehensive English description..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formArDesc}
                  </label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    placeholder="وصف تفصيلي شامل بالعربية..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICE & SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formPrice} *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] font-bold focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formCurrency}
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  >
                    <option value="JOD">JOD (دينار أردني - د.أ)</option>
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="SAR">SAR (ر.س)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formPeriod}
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  >
                    <option value="monthly">{isAr ? 'شهرياً' : 'Monthly'}</option>
                    <option value="yearly">{isAr ? 'سنوياً' : 'Yearly'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formBeds}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formBaths}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formArea}
                  </label>
                  <input
                    type="number"
                    min="20"
                    value={areaSqM}
                    onChange={(e) => setAreaSqM(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formFloor}
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formFurnishing}
                  </label>
                  <select
                    value={furnished}
                    onChange={(e) => setFurnished(e.target.value as FurnishedStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  >
                    <option value="furnished">{dict.filters.isFurnished}</option>
                    <option value="semi-furnished">{dict.filters.semiFurnished}</option>
                    <option value="unfurnished">{dict.filters.unfurnished}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                    {dict.admin.formType}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                  >
                    <option value="apartment">{dict.filters.apartment}</option>
                    <option value="penthouse">{dict.filters.penthouse}</option>
                    <option value="duplex">{dict.filters.duplex}</option>
                    <option value="studio">{dict.filters.studio}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#443e35] uppercase mb-1.5">
                  {dict.admin.formDeposit}
                </label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="Optional deposit amount"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA & GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in">
              {/* Featured Main Image */}
              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#ded7ca] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#11161d] uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#c5a880]" />
                    <span>{dict.admin.formFeaturedImage} *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#11161d] text-white hover:bg-[#28313f] transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{isUploading ? 'Uploading...' : dict.admin.uploadButton}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative aspect-[16/10] w-full sm:w-48 rounded-xl overflow-hidden bg-black/10 shrink-0 border border-[#dfd7cc]">
                    <Image
                      src={featuredImage}
                      alt="Featured Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="url"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder={dict.admin.orUrl}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880]"
                    />
                    <p className="text-[11px] text-[#8a8070] mt-1.5">
                      {isAr
                        ? 'الصورة الرئيسية التي ستظهر كغلاف للشقة في نتائج البحث والبطاقات.'
                        : 'Main cover image that will be shown across listings cards.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#ded7ca] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#11161d] uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#c5a880]" />
                    <span>{dict.admin.formGallery} ({gallery.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#11161d] text-white hover:bg-[#28313f] transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{isUploading ? 'Uploading...' : dict.admin.uploadButton}</span>
                  </button>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </div>

                {/* Add by URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder={dict.admin.orUrl}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#ded7ca] text-xs text-[#11161d] focus:border-[#c5a880]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-xl bg-[#c5a880] text-white text-xs font-bold hover:bg-[#b0926b] transition-all cursor-pointer shrink-0"
                  >
                    {dict.admin.addImage}
                  </button>
                </div>

                {/* Gallery Preview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#ded7ca] group bg-black/10"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-2 end-2 p-1.5 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-rose-700"
                        title={dict.admin.removeImage}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AMENITIES & STATUS */}
          {activeTab === 'amenities' && (
            <div className="space-y-6 animate-fade-in">
              {/* Status and Featured Controls */}
              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#ded7ca] grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#443e35] uppercase mb-2">
                    {dict.admin.formStatus} *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded7ca] text-sm text-[#11161d] font-bold focus:border-[#c5a880]"
                  >
                    <option value="available">🟢 {dict.admin.statusAvailable}</option>
                    <option value="rented">🔴 {dict.admin.statusRented}</option>
                    <option value="hidden">⚪ {dict.admin.statusHidden}</option>
                  </select>
                  <p className="text-[11px] text-[#8a8070] mt-1.5">
                    {isAr
                      ? 'العقارات المعينة كـ "مؤجر" أو "مخفي" تختفي تلقائياً من الموقع العام وتظل محفوظة في لوحة التحكم.'
                      : 'Properties marked as Rented or Hidden are immediately removed from the public website.'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4 sm:pt-6">
                  <label className="text-xs font-bold text-[#443e35] uppercase cursor-pointer">
                    {dict.admin.formFeatured}
                  </label>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 accent-[#c5a880] cursor-pointer rounded"
                  />
                </div>
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs font-bold text-[#443e35] uppercase mb-3">
                  {dict.propertyDetails.amenities}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {ALL_AMENITIES.map((key) => {
                    const isChecked = amenities.includes(key);
                    const label = (dict.amenities as Record<string, string>)[key] || key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleAmenity(key)}
                        className={`p-3 rounded-xl text-xs font-semibold text-start flex items-center justify-between border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#c5a880]/15 border-[#c5a880] text-[#8c6f47]'
                            : 'bg-[#faf8f5] border-[#ded7ca] text-[#554d42] hover:bg-[#f1ede6]'
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#a9885c] shrink-0 ms-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-[#eee8dd] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#ded7ca] text-xs font-bold text-[#554d42] hover:bg-[#faf8f5] transition-all cursor-pointer"
            >
              {dict.admin.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold px-7 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? dict.admin.saving : dict.admin.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
