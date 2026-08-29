'use client';

import { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronDown,
  Loader2,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { City, District, Locale } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface LocationsManagerProps {
  initialCities: City[];
  locale: Locale;
  dict: Dictionary;
}

export function LocationsManager({ initialCities, locale, dict }: LocationsManagerProps) {
  const t = dict.admin;
  const isAr = locale === 'ar';

  const [cities, setCities] = useState<City[]>(initialCities);
  const [expandedCityId, setExpandedCityId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New city inputs
  const [newCityEn, setNewCityEn] = useState('');
  const [newCityAr, setNewCityAr] = useState('');

  // New / edited area inputs, keyed by city id
  const [newDistrict, setNewDistrict] = useState<Record<string, { en: string; ar: string }>>({});
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [editCityName, setEditCityName] = useState({ en: '', ar: '' });
  const [editingDistrict, setEditingDistrict] = useState<{ cityId: string; districtId: string } | null>(null);
  const [editDistrictName, setEditDistrictName] = useState({ en: '', ar: '' });

  const cityLabel = (city: City) => (isAr ? city.name.ar : city.name.en);
  const districtLabel = (district: District) => (isAr ? district.name.ar : district.name.en);

  const showError = (code?: string) => {
    if (code === 'DUPLICATE') setError(t.duplicateError);
    else if (code === 'MISSING_NAME') setError(t.nameRequired);
    else setError(isAr ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
  };

  const replaceCity = (updated: City) =>
    setCities((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

  /* ---------------- Cities ---------------- */

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newCityEn.trim() || !newCityAr.trim()) {
      setError(t.nameRequired);
      return;
    }

    setBusy('new-city');
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: { en: newCityEn, ar: newCityAr } }),
      });
      const data = await res.json();
      if (!data.success) return showError(data.error);

      setCities((prev) => [...prev, data.data]);
      setNewCityEn('');
      setNewCityAr('');
      setExpandedCityId(data.data.id);
    } finally {
      setBusy(null);
    }
  };

  const handleRenameCity = async (cityId: string) => {
    setError(null);
    if (!editCityName.en.trim() || !editCityName.ar.trim()) {
      setError(t.nameRequired);
      return;
    }

    setBusy(cityId);
    try {
      const res = await fetch(`/api/locations/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rename-city', name: editCityName }),
      });
      const data = await res.json();
      if (!data.success) return showError(data.error);

      replaceCity(data.data);
      setEditingCityId(null);
    } finally {
      setBusy(null);
    }
  };

  const handleDeleteCity = async (cityId: string) => {
    if (!window.confirm(t.deleteCityConfirm)) return;

    setBusy(cityId);
    try {
      const res = await fetch(`/api/locations/${cityId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) return showError(data.error);

      setCities((prev) => prev.filter((c) => c.id !== cityId));
    } finally {
      setBusy(null);
    }
  };

  /* ---------------- Areas ---------------- */

  const handleAddDistrict = async (e: React.FormEvent, cityId: string) => {
    e.preventDefault();
    setError(null);

    const draft = newDistrict[cityId] || { en: '', ar: '' };
    if (!draft.en.trim() || !draft.ar.trim()) {
      setError(t.nameRequired);
      return;
    }

    setBusy(cityId);
    try {
      const res = await fetch(`/api/locations/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-district', name: draft }),
      });
      const data = await res.json();
      if (!data.success) return showError(data.error);

      replaceCity(data.data);
      setNewDistrict((prev) => ({ ...prev, [cityId]: { en: '', ar: '' } }));
    } finally {
      setBusy(null);
    }
  };

  const handleRenameDistrict = async (cityId: string, districtId: string) => {
    setError(null);
    if (!editDistrictName.en.trim() || !editDistrictName.ar.trim()) {
      setError(t.nameRequired);
      return;
    }

    setBusy(districtId);
    try {
      const res = await fetch(`/api/locations/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rename-district', districtId, name: editDistrictName }),
      });
      const data = await res.json();
      if (!data.success) return showError(data.error);

      replaceCity(data.data);
      setEditingDistrict(null);
    } finally {
      setBusy(null);
    }
  };

  const handleDeleteDistrict = async (cityId: string, districtId: string) => {
    if (!window.confirm(t.deleteDistrictConfirm)) return;

    setBusy(districtId);
    try {
      const res = await fetch(`/api/locations/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-district', districtId }),
      });
      const data = await res.json();
      if (!data.success) return showError(data.error);

      replaceCity(data.data);
    } finally {
      setBusy(null);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-sm text-[#11161d] focus:border-[#c5a880] focus:bg-white focus:outline-none transition-colors';

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ms-auto text-rose-400 hover:text-rose-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add City */}
      <form
        onSubmit={handleAddCity}
        className="bg-white rounded-2xl border border-[#e8e1d6] p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-[#c5a880]" />
          <h2 className="text-sm font-bold text-[#11161d]">{t.addCity}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            dir="ltr"
            value={newCityEn}
            onChange={(e) => setNewCityEn(e.target.value)}
            placeholder={t.cityNameEn}
            className={inputClass}
          />
          <input
            type="text"
            dir="rtl"
            value={newCityAr}
            onChange={(e) => setNewCityAr(e.target.value)}
            placeholder={t.cityNameAr}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={busy === 'new-city'}
            className="btn-gold flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
          >
            {busy === 'new-city' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{t.addCity}</span>
          </button>
        </div>
      </form>

      {/* Cities list */}
      {cities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e1d6] p-12 text-center shadow-xs">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#f2ede4] flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-[#c5a880]" />
          </div>
          <p className="text-sm font-bold text-[#11161d]">{t.locationsEmpty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cities.map((city) => {
            const isExpanded = expandedCityId === city.id;
            const isEditingThisCity = editingCityId === city.id;

            return (
              <div
                key={city.id}
                className="bg-white rounded-2xl border border-[#e8e1d6] shadow-xs overflow-hidden"
              >
                {/* City row */}
                <div className="flex items-center gap-3 p-4">
                  {isEditingThisCity ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        dir="ltr"
                        value={editCityName.en}
                        onChange={(e) => setEditCityName((p) => ({ ...p, en: e.target.value }))}
                        placeholder={t.cityNameEn}
                        className={inputClass}
                      />
                      <input
                        type="text"
                        dir="rtl"
                        value={editCityName.ar}
                        onChange={(e) => setEditCityName((p) => ({ ...p, ar: e.target.value }))}
                        placeholder={t.cityNameAr}
                        className={inputClass}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setExpandedCityId(isExpanded ? null : city.id)}
                      className="flex-1 flex items-center gap-3 text-start cursor-pointer"
                    >
                      <span className="w-9 h-9 rounded-xl bg-[#f7f1e7] border border-[#e6d9c4] flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#c5a880]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold text-[#11161d] truncate">{cityLabel(city)}</span>
                        <span className="block text-xs text-[#8a8272]">
                          {t.areasCount.replace('{count}', String(city.districts.length))}
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8a8272] ms-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isEditingThisCity ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRenameCity(city.id)}
                          disabled={busy === city.id}
                          title={t.saveChanges}
                          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        >
                          {busy === city.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCityId(null)}
                          title={t.cancelEdit}
                          className="p-2 rounded-lg text-[#8a8272] hover:bg-[#f2ede4] cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCityId(city.id);
                            setEditCityName({ en: city.name.en, ar: city.name.ar });
                          }}
                          title={t.renameCity}
                          className="p-2 rounded-lg text-[#c5a880] hover:bg-[#f2ede4] cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCity(city.id)}
                          disabled={busy === city.id}
                          title={t.delete}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                        >
                          {busy === city.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Areas */}
                {isExpanded && (
                  <div className="border-t border-[#f0ebe2] bg-[#faf8f5] p-4 space-y-3">
                    {city.districts.length === 0 ? (
                      <p className="text-xs text-[#8a8272] py-2">{t.noAreas}</p>
                    ) : (
                      <ul className="flex flex-wrap gap-2">
                        {city.districts.map((district) => {
                          const isEditingThis =
                            editingDistrict?.cityId === city.id && editingDistrict?.districtId === district.id;

                          if (isEditingThis) {
                            return (
                              <li
                                key={district.id}
                                className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2.5 rounded-xl border border-[#e5dfd3]"
                              >
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={editDistrictName.en}
                                  onChange={(e) => setEditDistrictName((p) => ({ ...p, en: e.target.value }))}
                                  placeholder={t.districtNameEn}
                                  className={inputClass}
                                />
                                <input
                                  type="text"
                                  dir="rtl"
                                  value={editDistrictName.ar}
                                  onChange={(e) => setEditDistrictName((p) => ({ ...p, ar: e.target.value }))}
                                  placeholder={t.districtNameAr}
                                  className={inputClass}
                                />
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleRenameDistrict(city.id, district.id)}
                                    disabled={busy === district.id}
                                    className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                  >
                                    {busy === district.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingDistrict(null)}
                                    className="p-2 rounded-lg text-[#8a8272] hover:bg-[#f2ede4] cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </li>
                            );
                          }

                          return (
                            <li
                              key={district.id}
                              className="group flex items-center gap-2 ps-3.5 pe-2 py-2 rounded-full bg-white border border-[#e5dfd3] text-sm text-[#443e35]"
                            >
                              <span className="font-medium">{districtLabel(district)}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDistrict({ cityId: city.id, districtId: district.id });
                                  setEditDistrictName({ en: district.name.en, ar: district.name.ar });
                                }}
                                title={t.edit}
                                className="p-1 rounded-full text-[#c5a880] hover:bg-[#f2ede4] cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDistrict(city.id, district.id)}
                                disabled={busy === district.id}
                                title={t.delete}
                                className="p-1 rounded-full text-rose-400 hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                              >
                                {busy === district.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {/* Add area */}
                    <form
                      onSubmit={(e) => handleAddDistrict(e, city.id)}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#ece6da]"
                    >
                      <input
                        type="text"
                        dir="ltr"
                        value={newDistrict[city.id]?.en || ''}
                        onChange={(e) =>
                          setNewDistrict((prev) => ({
                            ...prev,
                            [city.id]: { en: e.target.value, ar: prev[city.id]?.ar || '' },
                          }))
                        }
                        placeholder={t.districtNameEn}
                        className={inputClass}
                      />
                      <input
                        type="text"
                        dir="rtl"
                        value={newDistrict[city.id]?.ar || ''}
                        onChange={(e) =>
                          setNewDistrict((prev) => ({
                            ...prev,
                            [city.id]: { en: prev[city.id]?.en || '', ar: e.target.value },
                          }))
                        }
                        placeholder={t.districtNameAr}
                        className={inputClass}
                      />
                      <button
                        type="submit"
                        disabled={busy === city.id}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c0f12] hover:bg-[#1c222b] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 text-[#c5a880]" />
                        <span>{t.addDistrict}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
