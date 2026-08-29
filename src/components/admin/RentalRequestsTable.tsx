'use client';

import { useState, useMemo } from 'react';
import { Search, Trash2, Phone, Inbox, Loader2 } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { Locale, RentalRequest, RentalRequestStatus } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface RentalRequestsTableProps {
  initialRequests: RentalRequest[];
  locale: Locale;
  dict: Dictionary;
}

const STATUS_STYLES: Record<RentalRequestStatus, string> = {
  new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function RentalRequestsTable({ initialRequests, locale, dict }: RentalRequestsTableProps) {
  const [requests, setRequests] = useState<RentalRequest[]>(initialRequests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RentalRequestStatus>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const isAr = locale === 'ar';
  const t = dict.admin;

  const statusLabel = (status: RentalRequestStatus) =>
    status === 'new' ? t.statusNew : status === 'contacted' ? t.statusContacted : t.statusArchived;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesTerm =
        !term ||
        r.fullName.toLowerCase().includes(term) ||
        r.phone.toLowerCase().includes(term) ||
        r.area.toLowerCase().includes(term) ||
        r.district.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [requests, search, statusFilter]);

  const newCount = requests.filter((r) => r.status === 'new').length;

  const handleStatusChange = async (id: string, status: RentalRequestStatus) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/rental-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.reqDeleteConfirm)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/rental-requests/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(isAr ? 'ar-JO' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#e8e1d6] p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.requestsTotal}</p>
          <p className="text-3xl font-extrabold text-[#11161d] mt-1.5">{requests.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e8e1d6] p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.requestsNew}</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1.5">{newCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-[#e8e1d6] p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e5dfd3] flex-1 focus-within:border-[#c5a880]">
          <Search className="w-4 h-4 text-[#c5a880] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.reqSearch}
            className="bg-transparent text-sm w-full text-[#1c222b] placeholder-[#a39a8b] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | RentalRequestStatus)}
          className="px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e5dfd3] text-sm text-[#1c222b] focus:outline-none focus:border-[#c5a880] cursor-pointer"
        >
          <option value="all">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
          <option value="new">{t.statusNew}</option>
          <option value="contacted">{t.statusContacted}</option>
          <option value="archived">{t.statusArchived}</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e1d6] p-12 text-center shadow-xs">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#f2ede4] flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-[#c5a880]" />
          </div>
          <p className="text-base font-bold text-[#11161d]">{t.requestsEmpty}</p>
          <p className="text-sm text-[#6b6355] mt-1.5">{t.requestsEmptyDesc}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e8e1d6] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#faf8f5] border-b border-[#e8e1d6]">
                <tr className="text-start">
                  <th className="px-4 py-3.5 text-start text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.reqName}</th>
                  <th className="px-4 py-3.5 text-start text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.reqPhone}</th>
                  <th className="px-4 py-3.5 text-start text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.reqArea}</th>
                  <th className="px-4 py-3.5 text-start text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.reqDistrict}</th>
                  <th className="px-4 py-3.5 text-start text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.reqDate}</th>
                  <th className="px-4 py-3.5 text-start text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.reqStatus}</th>
                  <th className="px-4 py-3.5 text-start text-xs font-bold uppercase tracking-wider text-[#8a8272]">{t.tableActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe2]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#faf8f5] transition-colors align-top">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#11161d]">{r.fullName}</p>
                      {r.notes && (
                        <p className="text-xs text-[#6b6355] mt-1 max-w-xs line-clamp-2">{r.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span dir="ltr" className="font-medium text-[#1c222b]">{r.phone}</span>
                    </td>
                    <td className="px-4 py-4 text-[#443e35]">{r.area}</td>
                    <td className="px-4 py-4 text-[#443e35]">{r.district}</td>
                    <td className="px-4 py-4 text-xs text-[#6b6355] whitespace-nowrap">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-4">
                      <select
                        value={r.status}
                        disabled={busyId === r.id}
                        onChange={(e) => handleStatusChange(r.id, e.target.value as RentalRequestStatus)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold cursor-pointer focus:outline-none ${STATUS_STYLES[r.status]}`}
                      >
                        <option value="new">{t.statusNew}</option>
                        <option value="contacted">{t.statusContacted}</option>
                        <option value="archived">{t.statusArchived}</option>
                      </select>
                      <span className="sr-only">{statusLabel(r.status)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${r.phone.replace(/\s/g, '')}`}
                          title={t.reqCall}
                          className="p-2 rounded-lg text-[#c5a880] hover:bg-[#f2ede4] transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={waLink(r.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t.reqWhatsapp}
                          className="p-2 rounded-lg text-[#25D366] hover:bg-emerald-50 transition-colors"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          disabled={busyId === r.id}
                          title={t.delete}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {busyId === r.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
