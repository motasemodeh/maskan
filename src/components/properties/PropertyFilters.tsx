'use client';

import { Search, MapPin, DollarSign, Bed, RefreshCw, SlidersHorizontal, Building } from 'lucide-react';
import { Locale } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface PropertyFiltersProps {
  locale: Locale;
  dict: Dictionary;
  locations: string[];
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  minPrice: string;
  onMinPriceChange: (val: string) => void;
  maxPrice: string;
  onMaxPriceChange: (val: string) => void;
  selectedBedrooms: string;
  onBedroomsChange: (beds: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  resultsCount: number;
}

export function PropertyFilters({
  locale,
  dict,
  locations,
  selectedLocation,
  onLocationChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  selectedBedrooms,
  onBedroomsChange,
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onReset,
  resultsCount,
}: PropertyFiltersProps) {
  const bedroomOptions = [
    { value: 'all', label: dict.filters.allBeds },
    { value: '0', label: dict.filters.studio },
    { value: '1', label: dict.filters.bed1 },
    { value: '2', label: dict.filters.bed2 },
    { value: '3', label: dict.filters.bed3 },
  ];

  const hasActiveFilters =
    Boolean(selectedLocation) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    selectedBedrooms !== 'all' ||
    selectedType !== 'all' ||
    Boolean(searchQuery);

  return (
    <div className="bg-white rounded-2xl border border-[#e5dfd3] p-5 sm:p-6 shadow-sm mb-8">
      {/* Top Row: Search Input & Sort & Reset */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-5 border-b border-[#efeae1]">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#a39a8c] absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={dict.filters.searchPlaceholder}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#e2dbcd] text-sm text-[#161b22] placeholder-[#9c9384] focus:outline-none focus:border-[#c5a880] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#8c8273] hover:text-[#161b22]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#665f54] shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{dict.filters.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-[#f8f6f1] border border-[#e2dbcd] rounded-lg px-2.5 py-1.5 text-xs text-[#161b22] focus:outline-none focus:border-[#c5a880] cursor-pointer"
            >
              <option value="newest">{dict.filters.sortNewest}</option>
              <option value="price-asc">{dict.filters.sortPriceLow}</option>
              <option value="price-desc">{dict.filters.sortPriceHigh}</option>
              <option value="area-desc">{dict.filters.sortAreaHigh}</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8c7453] bg-[#f8f4ee] hover:bg-[#ebdccb] border border-[#dfd2be] transition-colors cursor-pointer"
              title={dict.filters.reset}
            >
              <RefreshCw className="w-3 h-3" />
              <span>{dict.filters.reset}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
        {/* Location Filter */}
        <div>
          <label className="block text-xs font-bold text-[#443e35] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{dict.filters.location}</span>
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#e2dbcd] text-sm text-[#161b22] focus:outline-none focus:border-[#c5a880] cursor-pointer"
          >
            <option value="">{dict.filters.allLocations}</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price Filter */}
        <div>
          <label className="block text-xs font-bold text-[#443e35] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{dict.filters.minPrice}</span>
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="0"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#e2dbcd] text-sm text-[#161b22] placeholder-[#9c9384] focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        {/* Max Price Filter */}
        <div>
          <label className="block text-xs font-bold text-[#443e35] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{dict.filters.maxPrice}</span>
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="50,000+"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#e2dbcd] text-sm text-[#161b22] placeholder-[#9c9384] focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        {/* Property Type Filter */}
        <div>
          <label className="block text-xs font-bold text-[#443e35] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{dict.filters.propertyType}</span>
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6f1] border border-[#e2dbcd] text-sm text-[#161b22] focus:outline-none focus:border-[#c5a880] cursor-pointer"
          >
            <option value="all">{dict.filters.allTypes}</option>
            <option value="apartment">{dict.filters.apartment}</option>
            <option value="penthouse">{dict.filters.penthouse}</option>
            <option value="duplex">{dict.filters.duplex}</option>
            <option value="studio">{dict.filters.studio}</option>
          </select>
        </div>
      </div>

      {/* Bedroom Pills Row */}
      <div className="mt-4 pt-4 border-t border-[#f1ede6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#635b4f] uppercase tracking-wider me-1 flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{dict.filters.bedrooms}:</span>
          </span>
          {bedroomOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onBedroomsChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedBedrooms === opt.value
                  ? 'bg-[#11161d] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#554d42] hover:bg-[#e8decb]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="text-xs font-semibold text-[#8c8273]">
          {dict.filters.showingResults.replace('{count}', resultsCount.toString())}
        </div>
      </div>
    </div>
  );
}
