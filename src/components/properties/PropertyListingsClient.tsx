'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Property, Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';
import { PropertyCard } from './PropertyCard';
import { PropertyFilters } from './PropertyFilters';
import { Building2 } from 'lucide-react';

interface PropertyListingsClientProps {
  initialProperties: Property[];
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
}

export function PropertyListingsClient({
  initialProperties,
  locale,
  dict,
  settings,
}: PropertyListingsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAr = locale === 'ar';

  // State from URL or defaults
  const [selectedLocation, setSelectedLocation] = useState<string>(
    searchParams.get('location') || ''
  );
  const [minPrice, setMinPrice] = useState<string>(
    searchParams.get('minPrice') || ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    searchParams.get('maxPrice') || ''
  );
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>(
    searchParams.get('bedrooms') || 'all'
  );
  const [selectedType, setSelectedType] = useState<string>(
    searchParams.get('type') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );
  const [sortBy, setSortBy] = useState<string>('newest');

  // Unique locations list
  const locations = useMemo(() => {
    return Array.from(
      new Set(initialProperties.map((p) => (isAr ? p.location.ar : p.location.en)))
    );
  }, [initialProperties, isAr]);

  // Filtered and Sorted list (ONLY status === 'available')
  const filteredProperties = useMemo(() => {
    return initialProperties
      .filter((p) => p.status === 'available') // ensure only available shown publicly
      .filter((p) => {
        // Location filter
        if (selectedLocation) {
          const loc = isAr ? p.location.ar : p.location.en;
          if (loc !== selectedLocation) return false;
        }

        // Min Price
        if (minPrice && p.price < Number(minPrice)) {
          return false;
        }

        // Max Price
        if (maxPrice && p.price > Number(maxPrice)) {
          return false;
        }

        // Bedrooms
        if (selectedBedrooms !== 'all') {
          if (p.bedrooms !== Number(selectedBedrooms)) return false;
        }

        // Property Type
        if (selectedType !== 'all') {
          if (p.propertyType !== selectedType) return false;
        }

        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const title = (isAr ? p.title.ar : p.title.en).toLowerCase();
          const ref = p.referenceNumber.toLowerCase();
          const district = (p.location.district || '').toLowerCase();
          const city = (p.location.city || '').toLowerCase();

          if (!title.includes(q) && !ref.includes(q) && !district.includes(q) && !city.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'area-desc') return b.areaSqM - a.areaSqM;
        // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    initialProperties,
    selectedLocation,
    minPrice,
    maxPrice,
    selectedBedrooms,
    selectedType,
    searchQuery,
    sortBy,
    isAr,
  ]);

  const handleReset = () => {
    setSelectedLocation('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBedrooms('all');
    setSelectedType('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="space-y-8">
      {/* Interactive Filters Bar */}
      <PropertyFilters
        locale={locale}
        dict={dict}
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        selectedBedrooms={selectedBedrooms}
        onBedroomsChange={setSelectedBedrooms}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleReset}
        resultsCount={filteredProperties.length}
      />

      {/* Grid of Results */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e5dfd3] p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#faf8f5] border border-[#e8ded0] text-[#a9885c] mx-auto flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#11161d] font-serif-luxury">
            {dict.filters.noResults}
          </h3>
          <p className="text-sm text-[#7d7466] max-w-md mx-auto">
            {dict.filters.noResultsDesc}
          </p>
          <button
            onClick={handleReset}
            className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            {dict.filters.reset}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              locale={locale}
              dict={dict}
              settings={settings}
            />
          ))}
        </div>
      )}
    </div>
  );
}
