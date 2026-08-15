'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Property, Locale, PropertyStatus } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { formatPrice } from '@/lib/utils';
import { PropertyFormModal } from './PropertyFormModal';

interface PropertyTableProps {
  initialProperties: Property[];
  locale: Locale;
  dict: Dictionary;
}

export function PropertyTable({ initialProperties, locale, dict }: PropertyTableProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PropertyStatus>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Delete Confirmation State
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAr = locale === 'ar';

  // Filter properties
  const filtered = properties.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const titleMatch =
      p.title.en.toLowerCase().includes(query) ||
      p.title.ar.toLowerCase().includes(query);
    const refMatch = p.referenceNumber.toLowerCase().includes(query);
    const locMatch =
      p.location.en.toLowerCase().includes(query) ||
      p.location.ar.toLowerCase().includes(query);

    return matchesStatus && (!query || titleMatch || refMatch || locMatch);
  });

  const handleToggleStatus = async (id: string, currentStatus: PropertyStatus) => {
    const nextStatus: PropertyStatus = currentStatus === 'available' ? 'rented' : 'available';

    // Optimistic UI update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );

    try {
      await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleSaveProperty = async (data: any) => {
    if (editingProperty) {
      // Update
      const res = await fetch(`/api/properties/${editingProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setProperties((prev) =>
          prev.map((p) => (p.id === editingProperty.id ? result.data : p))
        );
      }
    } else {
      // Create
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setProperties((prev) => [result.data, ...prev]);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProperty) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/properties/${deletingProperty.id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setProperties((prev) => prev.filter((p) => p.id !== deletingProperty.id));
        setDeletingProperty(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddModal = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e5dfd3] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#a39a8c] absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.admin.searchAdmin}
            className="w-full ps-10 pe-4 py-2 rounded-xl bg-[#f8f6f1] border border-[#ded7ca] text-xs text-[#161b22] focus:outline-none focus:border-[#c5a880] focus:bg-white"
          />
        </div>

        {/* Status Filter & Add Button */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#f8f6f1] border border-[#ded7ca] rounded-xl px-3 py-2 text-xs text-[#161b22] focus:outline-none focus:border-[#c5a880] cursor-pointer"
          >
            <option value="all">{dict.admin.filterStatus}</option>
            <option value="available">{dict.admin.statusAvailable}</option>
            <option value="rented">{dict.admin.statusRented}</option>
            <option value="hidden">{dict.admin.statusHidden}</option>
          </select>

          <button
            onClick={openAddModal}
            className="btn-gold inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{dict.admin.addNew}</span>
          </button>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-[#e5dfd3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#4f483e]">
            <thead className="bg-[#fbfaf8] border-b border-[#eee8dd] text-[#7d7466] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4 text-start">{dict.admin.tableImage}</th>
                <th className="py-3.5 px-4 text-start">{dict.admin.tableRef}</th>
                <th className="py-3.5 px-4 text-start">{dict.admin.tableTitle}</th>
                <th className="py-3.5 px-4 text-start">{dict.admin.tableLocation}</th>
                <th className="py-3.5 px-4 text-start">{dict.admin.tablePrice}</th>
                <th className="py-3.5 px-4 text-center">{dict.admin.tableStatus}</th>
                <th className="py-3.5 px-4 text-center">{dict.admin.tableViews}</th>
                <th className="py-3.5 px-4 text-end">{dict.admin.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1ede6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#999081]">
                    {dict.filters.noResults}
                  </td>
                </tr>
              ) : (
                filtered.map((property) => {
                  const title = isAr ? property.title.ar : property.title.en;
                  const locationName = isAr ? property.location.ar : property.location.en;
                  const isAvailable = property.status === 'available';

                  return (
                    <tr key={property.id} className="hover:bg-[#faf8f5] transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="relative aspect-[16/10] w-16 rounded-lg overflow-hidden bg-black/10 border border-[#e5dfd3]">
                          <Image
                            src={property.featuredImage}
                            alt={title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Reference Number */}
                      <td className="py-3 px-4 font-mono font-bold text-[#11161d]">
                        {property.referenceNumber}
                      </td>

                      {/* Title & Type */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-[#11161d] line-clamp-1">
                          {title}
                        </div>
                        <span className="text-[10px] text-[#8a8070] uppercase tracking-wider">
                          {property.bedrooms === 0 ? dict.filters.studio : `${property.bedrooms} Beds`} • {property.propertyType}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 max-w-[180px] truncate text-[#6e6659]">
                        {locationName}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-[#11161d] whitespace-nowrap">
                        {formatPrice(property.price, property.currency, locale)}
                        <span className="text-[10px] text-[#8a8070] block font-normal">
                          / {property.period === 'monthly' ? dict.propertyCard.month : dict.propertyCard.year}
                        </span>
                      </td>

                      {/* Quick Status Toggle */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(property.id, property.status)}
                          type="button"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                          title={dict.admin.toggleVisibility}
                        >
                          {isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{dict.admin.statusAvailable}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{dict.admin.statusRented}</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Views Count */}
                      <td className="py-3 px-4 text-center font-bold text-[#11161d]">
                        {property.viewsCount || 0}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View on live site */}
                          <Link
                            href={`/${locale}/properties/${property.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#8a8070] hover:text-[#11161d] hover:bg-[#f1ede6] transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(property)}
                            className="p-1.5 rounded-lg text-[#8a8070] hover:text-[#a9885c] hover:bg-[#f1ede6] transition-colors cursor-pointer"
                            title={dict.admin.edit}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingProperty(property)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={dict.admin.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProperty}
        initialData={editingProperty}
        locale={locale}
        dict={dict}
      />

      {/* Delete Confirmation Modal */}
      {deletingProperty && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e5dfd3] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#11161d] font-serif-luxury">
                {dict.admin.deleteConfirmTitle}
              </h3>
              <p className="text-xs text-[#70685d] mt-2 leading-relaxed">
                {dict.admin.deleteConfirmDesc.replace('{ref}', deletingProperty.referenceNumber)}
              </p>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProperty(null)}
                className="px-4 py-2 rounded-xl border border-[#ded7ca] text-xs font-bold text-[#554d42] hover:bg-[#faf8f5]"
              >
                {dict.admin.cancel}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : dict.admin.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
