export type Locale = 'en' | 'ar';

export type PropertyStatus = 'available' | 'rented' | 'hidden';

export type FurnishedStatus = 'furnished' | 'semi-furnished' | 'unfurnished';

export type PropertyType = 'apartment' | 'penthouse' | 'duplex' | 'studio' | 'loft' | 'villa';

export interface Property {
  id: string;
  referenceNumber: string; // e.g. "REF-MAR-101"
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  location: {
    en: string;
    ar: string;
    city: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  currency: string; // e.g. 'SAR', 'AED', 'USD'
  period: 'monthly' | 'yearly';
  deposit?: number;
  bedrooms: number; // 0 = Studio
  bathrooms: number;
  areaSqM: number;
  floor?: number | string;
  furnished: FurnishedStatus;
  propertyType: PropertyType;
  featuredImage: string;
  gallery: string[];
  videoUrl?: string;
  amenities: string[];
  status: PropertyStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
}

export interface SiteSettings {
  companyName: {
    en: string;
    ar: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  defaultCurrency: string;
  gaMeasurementId: string;
  address: {
    en: string;
    ar: string;
  };
  heroVideoUrl: string;
  heroVideoPoster: string;
}

export interface AnalyticsRecord {
  id: string;
  path: string;
  propertyId?: string;
  referenceNumber?: string;
  referrer?: string;
  device: 'mobile' | 'desktop' | 'tablet' | 'other';
  browser?: string;
  language: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  totalPropertyViews: number;
  sources: Record<string, number>;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  languages: {
    en: number;
    ar: number;
  };
  topProperties: Array<{
    id: string;
    referenceNumber: string;
    title: { en: string; ar: string };
    views: number;
    featuredImage: string;
    price: number;
    status: PropertyStatus;
  }>;
  recentViews: AnalyticsRecord[];
  dailyViews: Array<{
    date: string;
    views: number;
  }>;
}

export interface PropertyFilterParams {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'all';
  propertyType?: string | 'all';
  furnished?: string | 'all';
  search?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'area-desc';
}

export type RentalRequestStatus = 'new' | 'contacted' | 'archived';

export interface RentalRequest {
  id: string;
  fullName: string;
  phone: string;
  area: string;
  district: string;
  notes?: string;
  status: RentalRequestStatus;
  createdAt: string;
}

export interface District {
  id: string;
  name: {
    en: string;
    ar: string;
  };
}

export interface City {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  districts: District[];
}
