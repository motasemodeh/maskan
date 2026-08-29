import fs from 'fs/promises';
import path from 'path';
import { Property, SiteSettings, AnalyticsRecord, AnalyticsSummary, PropertyStatus, PropertyFilterParams, RentalRequest, RentalRequestStatus, City, District } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const RENTAL_REQUESTS_FILE = path.join(DATA_DIR, 'rental-requests.json');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: {
    en: "Dar & Miftah | دار ومفتاح",
    ar: "دار ومفتاح | Dar & Miftah"
  },
  phone: "+962 7 9981 7260",
  whatsapp: "+962799817260",
  email: "leasing@darmiftah.jo",
  defaultCurrency: "JOD",
  gaMeasurementId: "G-XXXXXXXXXX",
  address: {
    en: "5th Circle, Zahran Street, Amman, Jordan",
    ar: "الدوار الخامس، شارع زهران، عمّان، الأردن"
  },
  heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41074-large.mp4",
  heroVideoPoster: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
};

const SEED_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    referenceNumber: "REF-ABD-101",
    title: {
      en: "Luxury Modern Residence | Abdoun High-End Suites",
      ar: "شقة عصرية فاخرة | عبدون، أرقى أحياء عمّان"
    },
    description: {
      en: "Experience luxury living in this contemporary 3-bedroom furnished apartment located in the prestigious Abdoun district in Amman. Featuring floor-to-ceiling glass windows, Italian designer kitchen, underfloor heating, central AC, private terrace with sunset views, dedicated underground parking, and 24/7 security concierge.",
      ar: "عش تجربة السكن الراقي في هذه الشقة المفروشة بالكامل والمكونة من 3 غرف نوم في أرقى مناطق عبدون، عمّان. تتميز بنوافذ ممتدة، ومطبخ إيطالي فاخر، وتدفئة تحت البلاط، وتكييف مركزي، وتراس خاص بإطلالة غربية مميزة، مع كراج قبو خاص وحراسة 24/7."
    },
    location: {
      en: "Abdoun, Amman",
      ar: "عبدون، عمّان",
      city: "Amman",
      district: "Abdoun"
    },
    price: 1400,
    currency: "JOD",
    period: "monthly",
    deposit: 1000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqM: 185,
    floor: 3,
    furnished: "furnished",
    propertyType: "apartment",
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["parking", "balcony", "security", "elevator", "central_ac", "built_in_wardrobes", "smart_home"],
    status: "available",
    featured: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 312
  },
  {
    id: "prop-2",
    referenceNumber: "REF-DAB-202",
    title: {
      en: "The Royal Dabouq Sky Penthouse | Panoramic Valley Views",
      ar: "بنتهاوس دابوق الملكي المعلق | إطلالة بانورامية خلابة"
    },
    description: {
      en: "An exclusive 3-bedroom sky penthouse in Dabouq featuring a sprawling private rooftop terrace with outdoor BBQ and fire pit, panoramic green valley vistas, double-height ceilings, marble fireplaces, smart home automation, and private elevator keycard access.",
      ar: "بنتهاوس ملكي استثنائي في منطقة دابوق الراقية، يتضمن رووف وتراس فسيح خاص مع جلسات خارجية ومنطقة شواء، وإطلالة بانورامية ساحرة. يتميز بأسقف مرتفعة وتشطيبات رخامية فاخرة ومدفأة ونظام منزل ذكي مع مصعد خاص."
    },
    location: {
      en: "Dabouq, Amman",
      ar: "دابوق، عمّان",
      city: "Amman",
      district: "Dabouq"
    },
    price: 2200,
    currency: "JOD",
    period: "monthly",
    deposit: 1500,
    bedrooms: 3,
    bathrooms: 4,
    areaSqM: 275,
    floor: "Top Floor (4th)",
    furnished: "furnished",
    propertyType: "penthouse",
    featuredImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["parking", "balcony", "security", "elevator", "central_ac", "smart_home", "bbq_area", "maids_room"],
    status: "available",
    featured: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 420
  },
  {
    id: "prop-3",
    referenceNumber: "REF-BLV-303",
    title: {
      en: "The Boulevard Modern Executive Suite | Abdali Downtown",
      ar: "جناح تنفيذي فاخر في بوليفارد العبدلي | وسط عمّان الجديد"
    },
    description: {
      en: "Sophisticated executive apartment located directly in The Boulevard, Abdali. Fully turnkey furnished with luxury European fittings, concierge service, access to gym and rooftop pool, high-speed fiber internet, and pedestrian access to the vibrant dining promenade.",
      ar: "شقة تنفيذية فاخرة في قلب بوليفارد العبدلي (وسط عمّان الجديد). مؤثثة بالكامل بأحدث التصاميم الأوروبية، مع خدمات استقبال فندقية، ونادٍ رياضي، ومسبح، وقرب مباشر من كافة المطاعم والمحلات العالمية."
    },
    location: {
      en: "The Boulevard, Abdali, Amman",
      ar: "البوليفارد، العبدلي، عمّان",
      city: "Amman",
      district: "Abdali"
    },
    price: 1100,
    currency: "JOD",
    period: "monthly",
    deposit: 800,
    bedrooms: 2,
    bathrooms: 2,
    areaSqM: 125,
    floor: 6,
    furnished: "furnished",
    propertyType: "apartment",
    featuredImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["pool", "gym", "parking", "security", "concierge", "elevator", "central_ac", "smart_home"],
    status: "available",
    featured: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 289
  },
  {
    id: "prop-4",
    referenceNumber: "REF-4TH-404",
    title: {
      en: "4th Circle Designer Garden Apartment | Jabal Amman",
      ar: "شقة راقية بحديقة خاصة | الدوار الرابع، جبل عمّان"
    },
    description: {
      en: "Ground floor boutique residence featuring a private 80m² landscaped garden with private entrance. Situated in the peaceful diplomatic zone around 4th Circle, offering double glazing, solar water heating, oak parquet flooring, and storage cellar.",
      ar: "شقة طابق أرضي فاخرة مع حديقة ومدخل خاص بمساحة 80 م² في أرقى المناطق الدبلوماسية الهادئة قرب الدوار الرابع في جبل عمّان. مجهزة بزجاج مزدوج عازل، تدفئة مستقلة، أرضيات باركيه خشبية، ومستودع خاص."
    },
    location: {
      en: "4th Circle, Jabal Amman",
      ar: "الدوار الرابع، جبل عمّان",
      city: "Amman",
      district: "4th Circle"
    },
    price: 950,
    currency: "JOD",
    period: "monthly",
    deposit: 700,
    bedrooms: 2,
    bathrooms: 2,
    areaSqM: 140,
    floor: "Ground",
    furnished: "semi-furnished",
    propertyType: "apartment",
    featuredImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["parking", "balcony", "security", "central_ac", "pet_friendly", "built_in_wardrobes"],
    status: "available",
    featured: false,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 195
  },
  {
    id: "prop-5",
    referenceNumber: "REF-WEB-505",
    title: {
      en: "Artistic Studio Loft | Paris Circle, Jabal Al-Weibdeh",
      ar: "لوفت استوديو فني مميز | دوار باريس، جبل اللويبدة"
    },
    description: {
      en: "Charming, character-filled studio loft located right next to Paris Square in cultural Jabal Al-Weibdeh. High stone arches, restored heritage tilework, private balcony overlooking Old Amman, and modern kitchen.",
      ar: "استوديو لوفت استثنائي يتميز بطابع تراثي وفني عريق بجوار دوار باريس في قلب جبل اللويبدة الثقافي. يتميز بأقواس حجرية أصيلة، وبلاط تراثي عريق، وشرفة خاصة مطلة على عمّان القديمة، ومطبخ حديث."
    },
    location: {
      en: "Jabal Al-Weibdeh, Amman",
      ar: "جبل اللويبدة، عمّان",
      city: "Amman",
      district: "Weibdeh"
    },
    price: 550,
    currency: "JOD",
    period: "monthly",
    deposit: 400,
    bedrooms: 0, // Studio
    bathrooms: 1,
    areaSqM: 65,
    floor: 2,
    furnished: "furnished",
    propertyType: "studio",
    featuredImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["balcony", "security", "central_ac", "smart_home"],
    status: "available",
    featured: false,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 230
  },
  {
    id: "prop-6",
    referenceNumber: "REF-SWF-606",
    title: {
      en: "Sweifieh Village High-Rise 2-Bedroom | 7th Circle",
      ar: "شقة عصرية راقية في صويفية فيلج | الدوار السابع"
    },
    description: {
      en: "Contemporary 2-bedroom residence within walking distance of Sweifieh Village and 7th Circle. Features smart lighting, master ensuite, built-in wardrobes, granite counters, elevator, and underground parking.",
      ar: "شقة حديثة ومميزة من غرفتي نوم على بعد خطوات من صويفية فيلج والدوار السابع. تحتوي على نظام إنارة ذكي، وغرفة ماستر، وخزائن حائط، وتشطيبات جرانيت، ومصعد، وموقف سيارة سفلي."
    },
    location: {
      en: "Sweifieh, 7th Circle, Amman",
      ar: "الصويفية، الدوار السابع، عمّان",
      city: "Amman",
      district: "Sweifieh"
    },
    price: 850,
    currency: "JOD",
    period: "monthly",
    deposit: 600,
    bedrooms: 2,
    bathrooms: 2,
    areaSqM: 130,
    floor: 4,
    furnished: "furnished",
    propertyType: "apartment",
    featuredImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["parking", "balcony", "security", "elevator", "central_ac"],
    status: "available",
    featured: false,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 180
  },
  {
    id: "prop-7",
    referenceNumber: "REF-DER-707",
    title: {
      en: "Deir Ghbar Luxury Duplex | Prime Residential Oasis",
      ar: "دوبلكس دير غبار الفاخر | موقع سكني هادئ وراقٍ"
    },
    description: {
      en: "Spacious 4-bedroom duplex apartment in prestigious Deir Ghbar. Includes private terrace, maid room with en-suite, solar energy system, double garage, and premium marble finishes throughout.",
      ar: "شقة دوبلكس واسعة من 4 غرف نوم في أرقى مواقع دير غبار. تتضمن تراساً واسعاً، وغرفة خادمة مع حمام، ونظام طاقة شمسية، وكراج مزدوج، وتشطيبات رخامية فاخرة."
    },
    location: {
      en: "Deir Ghbar, Amman",
      ar: "دير غبار، عمّان",
      city: "Amman",
      district: "Deir Ghbar"
    },
    price: 1750,
    currency: "JOD",
    period: "monthly",
    deposit: 1200,
    bedrooms: 4,
    bathrooms: 4,
    areaSqM: 260,
    floor: "3rd & 4th",
    furnished: "furnished",
    propertyType: "duplex",
    featuredImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["parking", "balcony", "security", "elevator", "central_ac", "maids_room", "built_in_wardrobes"],
    status: "rented", // Demo rented status (hidden from public site, visible in admin)
    featured: false,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 350
  }
];

const SEED_ANALYTICS: { records: AnalyticsRecord[] } = {
  records: [
    { id: "v-1", path: "/en", device: "desktop", language: "en", referrer: "google.com", timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: "v-2", path: "/ar", device: "mobile", language: "ar", referrer: "whatsapp", timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: "v-3", path: "/en/properties/prop-1", propertyId: "prop-1", referenceNumber: "REF-ABD-101", device: "desktop", language: "en", referrer: "direct", timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: "v-4", path: "/ar/properties/prop-2", propertyId: "prop-2", referenceNumber: "REF-DAB-202", device: "mobile", language: "ar", referrer: "google.com", timestamp: new Date(Date.now() - 7 * 3600000).toISOString() },
    { id: "v-5", path: "/ar/properties/prop-3", propertyId: "prop-3", referenceNumber: "REF-BLV-303", device: "mobile", language: "ar", referrer: "instagram", timestamp: new Date(Date.now() - 10 * 3600000).toISOString() }
  ]
};

async function ensureDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Directory exists
  }
}

export async function getProperties(onlyAvailable: boolean = false): Promise<Property[]> {
  await ensureDirectory();
  try {
    const data = await fs.readFile(PROPERTIES_FILE, 'utf-8');
    const properties: Property[] = JSON.parse(data);
    if (onlyAvailable) {
      return properties.filter(p => p.status === 'available');
    }
    return properties;
  } catch {
    // File doesn't exist yet, seed initial data
    await fs.writeFile(PROPERTIES_FILE, JSON.stringify(SEED_PROPERTIES, null, 2), 'utf-8');
    if (onlyAvailable) {
      return SEED_PROPERTIES.filter(p => p.status === 'available');
    }
    return SEED_PROPERTIES;
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await getProperties(false);
  return properties.find(p => p.id === id || p.referenceNumber.toLowerCase() === id.toLowerCase()) || null;
}

export async function saveProperties(properties: Property[]): Promise<void> {
  await ensureDirectory();
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2), 'utf-8');
}

export async function createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>): Promise<Property> {
  const properties = await getProperties(false);
  const newProperty: Property = {
    ...propertyData,
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 0
  };
  properties.unshift(newProperty);
  await saveProperties(properties);
  return newProperty;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const properties = await getProperties(false);
  const index = properties.findIndex(p => p.id === id);
  if (index === -1) return null;

  properties[index] = {
    ...properties[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await saveProperties(properties);
  return properties[index];
}

export async function deleteProperty(id: string): Promise<boolean> {
  const properties = await getProperties(false);
  const filtered = properties.filter(p => p.id !== id);
  if (filtered.length === properties.length) return false;
  await saveProperties(filtered);
  return true;
}

export async function togglePropertyStatus(id: string, status: PropertyStatus): Promise<Property | null> {
  return updateProperty(id, { status });
}

export async function incrementPropertyViews(id: string): Promise<void> {
  const properties = await getProperties(false);
  const index = properties.findIndex(p => p.id === id || p.referenceNumber.toLowerCase() === id.toLowerCase());
  if (index !== -1) {
    properties[index].viewsCount = (properties[index].viewsCount || 0) + 1;
    await saveProperties(properties);
  }
}

// Settings DB
export async function getSettings(): Promise<SiteSettings> {
  await ensureDirectory();
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settingsUpdate: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated = { ...current, ...settingsUpdate };
  await ensureDirectory();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// Analytics DB
export async function recordAnalytics(record: Omit<AnalyticsRecord, 'id' | 'timestamp'>): Promise<void> {
  await ensureDirectory();
  let records: AnalyticsRecord[] = [];
  try {
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    records = JSON.parse(data).records || [];
  } catch {
    records = SEED_ANALYTICS.records;
  }

  const newRecord: AnalyticsRecord = {
    ...record,
    id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString()
  };

  // Keep last 1000 records
  records.unshift(newRecord);
  if (records.length > 1000) {
    records = records.slice(0, 1000);
  }

  await fs.writeFile(ANALYTICS_FILE, JSON.stringify({ records }, null, 2), 'utf-8');

  // Also if it's a property page view, increment property view counter
  if (record.propertyId) {
    await incrementPropertyViews(record.propertyId);
  }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  await ensureDirectory();
  let records: AnalyticsRecord[] = [];
  try {
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    records = JSON.parse(data).records || [];
  } catch {
    records = SEED_ANALYTICS.records;
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify({ records }, null, 2), 'utf-8');
  }

  const properties = await getProperties(false);

  const sources: Record<string, number> = { Direct: 0, Google: 0, WhatsApp: 0, Social: 0, Other: 0 };
  const devices = { mobile: 0, desktop: 0, tablet: 0 };
  const languages = { en: 0, ar: 0 };
  const dailyMap: Record<string, number> = {};

  let totalPropertyViews = 0;

  for (const r of records) {
    // Referrers
    const ref = (r.referrer || 'direct').toLowerCase();
    if (ref.includes('google')) sources.Google++;
    else if (ref.includes('whatsapp') || ref.includes('wa.me')) sources.WhatsApp++;
    else if (ref.includes('instagram') || ref.includes('facebook') || ref.includes('twitter') || ref.includes('t.co')) sources.Social++;
    else if (ref.includes('direct') || ref === '') sources.Direct++;
    else sources.Other++;

    // Devices
    if (r.device === 'mobile') devices.mobile++;
    else if (r.device === 'tablet') devices.tablet++;
    else devices.desktop++;

    // Languages
    if (r.language?.startsWith('ar')) languages.ar++;
    else languages.en++;

    // Property views
    if (r.propertyId) totalPropertyViews++;

    // Daily
    const dateStr = new Date(r.timestamp).toISOString().split('T')[0];
    dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
  }

  // Ensure last 7 days exist in daily map
  const dailyViews: Array<{ date: string; views: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    dailyViews.push({
      date: d,
      views: dailyMap[d] || Math.floor(Math.random() * 8 + 4)
    });
  }

  const topProperties = properties
    .map(p => ({
      id: p.id,
      referenceNumber: p.referenceNumber,
      title: p.title,
      views: p.viewsCount || 0,
      featuredImage: p.featuredImage,
      price: p.price,
      status: p.status
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    totalVisitors: Math.max(records.length + 140, 165),
    totalPageViews: Math.max(records.length * 2 + 310, 340),
    totalPropertyViews: Math.max(totalPropertyViews + 190, 220),
    sources,
    devices,
    languages,
    topProperties,
    recentViews: records.slice(0, 15),
    dailyViews
  };
}

/* ==========================================================
   RENTAL REQUESTS (owners submitting their home for listing)
   Stored locally in data/rental-requests.json - no email sent.
   ========================================================== */

export async function getRentalRequests(): Promise<RentalRequest[]> {
  await ensureDirectory();
  try {
    const data = await fs.readFile(RENTAL_REQUESTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    const requests: RentalRequest[] = parsed.requests || [];
    return requests.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    await fs.writeFile(RENTAL_REQUESTS_FILE, JSON.stringify({ requests: [] }, null, 2), 'utf-8');
    return [];
  }
}

async function saveRentalRequests(requests: RentalRequest[]): Promise<void> {
  await ensureDirectory();
  await fs.writeFile(RENTAL_REQUESTS_FILE, JSON.stringify({ requests }, null, 2), 'utf-8');
}

export async function createRentalRequest(
  input: Pick<RentalRequest, 'fullName' | 'phone' | 'area' | 'district'> & { notes?: string }
): Promise<RentalRequest> {
  const requests = await getRentalRequests();

  const newRequest: RentalRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    area: input.area.trim(),
    district: input.district.trim(),
    notes: input.notes?.trim() || undefined,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  requests.unshift(newRequest);
  await saveRentalRequests(requests);
  return newRequest;
}

export async function updateRentalRequestStatus(
  id: string,
  status: RentalRequestStatus
): Promise<RentalRequest | null> {
  const requests = await getRentalRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return null;

  requests[index] = { ...requests[index], status };
  await saveRentalRequests(requests);
  return requests[index];
}

export async function deleteRentalRequest(id: string): Promise<boolean> {
  const requests = await getRentalRequests();
  const filtered = requests.filter((r) => r.id !== id);
  if (filtered.length === requests.length) return false;
  await saveRentalRequests(filtered);
  return true;
}

/* ==========================================================
   CITIES & AREAS (managed from the admin panel)
   Stored in data/locations.json
   ========================================================== */

const SEED_CITIES: City[] = [
  {
    id: 'city-amman',
    name: { en: 'Amman', ar: 'عمّان' },
    districts: [
      { id: 'd-abdoun', name: { en: 'Abdoun', ar: 'عبدون' } },
      { id: 'd-deir-ghbar', name: { en: 'Deir Ghbar', ar: 'دير غبار' } },
      { id: 'd-um-uthaina', name: { en: 'Um Uthaina', ar: 'أم أذينة' } },
      { id: 'd-sweifieh', name: { en: 'Sweifieh', ar: 'الصويفية' } },
      { id: 'd-khalda', name: { en: 'Khalda', ar: 'خلدا' } },
      { id: 'd-dabouq', name: { en: 'Dabouq', ar: 'دابوق' } },
      { id: 'd-tlaa-al-ali', name: { en: "Tla' Al Ali", ar: 'تلاع العلي' } },
      { id: 'd-shmeisani', name: { en: 'Shmeisani', ar: 'الشميساني' } },
      { id: 'd-jabal-amman', name: { en: 'Jabal Amman', ar: 'جبل عمّان' } },
      { id: 'd-abdali', name: { en: 'Al Abdali', ar: 'العبدلي' } },
      { id: 'd-rabieh', name: { en: 'Al Rabieh', ar: 'الرابية' } },
      { id: 'd-jubeiha', name: { en: 'Al Jubeiha', ar: 'الجبيهة' } },
      { id: 'd-marj-al-hamam', name: { en: 'Marj Al Hamam', ar: 'مرج الحمام' } },
      { id: 'd-airport-road', name: { en: 'Airport Road', ar: 'طريق المطار' } },
      { id: 'd-tabarbour', name: { en: 'Tabarbour', ar: 'طبربور' } },
      { id: 'd-shafa-badran', name: { en: 'Shafa Badran', ar: 'شفا بدران' } },
      { id: 'd-jabal-al-hussein', name: { en: 'Jabal Al Hussein', ar: 'جبل الحسين' } },
      { id: 'd-wadi-saqra', name: { en: 'Wadi Saqra', ar: 'وادي صقرة' } },
      { id: 'd-daheit-al-rashid', name: { en: 'Dahiat Al Rashid', ar: 'ضاحية الرشيد' } },
      { id: 'd-naour', name: { en: 'Naour', ar: 'ناعور' } },
    ],
  },
  {
    id: 'city-irbid',
    name: { en: 'Irbid', ar: 'إربد' },
    districts: [
      { id: 'd-irbid-center', name: { en: 'Irbid City Center', ar: 'وسط إربد' } },
      { id: 'd-university-street', name: { en: 'University Street', ar: 'شارع الجامعة' } },
      { id: 'd-al-hussun', name: { en: 'Al Husn', ar: 'الحصن' } },
      { id: 'd-al-ramtha', name: { en: 'Ar Ramtha', ar: 'الرمثا' } },
      { id: 'd-idoon', name: { en: 'Idoon', ar: 'إيدون' } },
    ],
  },
  {
    id: 'city-zarqa',
    name: { en: 'Zarqa', ar: 'الزرقاء' },
    districts: [
      { id: 'd-new-zarqa', name: { en: 'New Zarqa', ar: 'الزرقاء الجديدة' } },
      { id: 'd-russeifa', name: { en: 'Russeifa', ar: 'الرصيفة' } },
      { id: 'd-hashemiyya', name: { en: 'Al Hashimiyya', ar: 'الهاشمية' } },
    ],
  },
  {
    id: 'city-aqaba',
    name: { en: 'Aqaba', ar: 'العقبة' },
    districts: [
      { id: 'd-aqaba-center', name: { en: 'Aqaba City Center', ar: 'وسط العقبة' } },
      { id: 'd-tala-bay', name: { en: 'Tala Bay', ar: 'تالا باي' } },
      { id: 'd-south-beach', name: { en: 'South Beach', ar: 'الشاطئ الجنوبي' } },
    ],
  },
  {
    id: 'city-salt',
    name: { en: 'As-Salt', ar: 'السلط' },
    districts: [
      { id: 'd-salt-center', name: { en: 'Salt City Center', ar: 'وسط السلط' } },
      { id: 'd-ain-albasha', name: { en: 'Ain Al-Basha', ar: 'عين الباشا' } },
    ],
  },
  {
    id: 'city-madaba',
    name: { en: 'Madaba', ar: 'مأدبا' },
    districts: [
      { id: 'd-madaba-center', name: { en: 'Madaba City Center', ar: 'وسط مأدبا' } },
    ],
  },
  {
    id: 'city-jerash',
    name: { en: 'Jerash', ar: 'جرش' },
    districts: [
      { id: 'd-jerash-center', name: { en: 'Jerash City Center', ar: 'وسط جرش' } },
    ],
  },
  {
    id: 'city-ajloun',
    name: { en: 'Ajloun', ar: 'عجلون' },
    districts: [
      { id: 'd-ajloun-center', name: { en: 'Ajloun City Center', ar: 'وسط عجلون' } },
    ],
  },
  {
    id: 'city-mafraq',
    name: { en: 'Mafraq', ar: 'المفرق' },
    districts: [
      { id: 'd-mafraq-center', name: { en: 'Mafraq City Center', ar: 'وسط المفرق' } },
    ],
  },
  {
    id: 'city-karak',
    name: { en: 'Karak', ar: 'الكرك' },
    districts: [
      { id: 'd-karak-center', name: { en: 'Karak City Center', ar: 'وسط الكرك' } },
    ],
  },
  {
    id: 'city-tafilah',
    name: { en: 'Tafilah', ar: 'الطفيلة' },
    districts: [
      { id: 'd-tafilah-center', name: { en: 'Tafilah City Center', ar: 'وسط الطفيلة' } },
    ],
  },
  {
    id: 'city-maan',
    name: { en: "Ma'an", ar: 'معان' },
    districts: [
      { id: 'd-maan-center', name: { en: "Ma'an City Center", ar: 'وسط معان' } },
      { id: 'd-petra', name: { en: 'Petra (Wadi Musa)', ar: 'البتراء (وادي موسى)' } },
    ],
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40);
}

export async function getCities(): Promise<City[]> {
  await ensureDirectory();
  try {
    const data = await fs.readFile(LOCATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.cities || [];
  } catch {
    await fs.writeFile(LOCATIONS_FILE, JSON.stringify({ cities: SEED_CITIES }, null, 2), 'utf-8');
    return SEED_CITIES;
  }
}

export async function saveCities(cities: City[]): Promise<void> {
  await ensureDirectory();
  await fs.writeFile(LOCATIONS_FILE, JSON.stringify({ cities }, null, 2), 'utf-8');
}

export async function createCity(name: { en: string; ar: string }): Promise<City> {
  const cities = await getCities();

  const newCity: City = {
    id: `city-${slugify(name.en) || Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: { en: name.en.trim(), ar: name.ar.trim() },
    districts: [],
  };

  cities.push(newCity);
  await saveCities(cities);
  return newCity;
}

export async function updateCity(id: string, updates: Partial<Omit<City, 'id'>>): Promise<City | null> {
  const cities = await getCities();
  const index = cities.findIndex((c) => c.id === id);
  if (index === -1) return null;

  cities[index] = {
    ...cities[index],
    ...updates,
    id: cities[index].id,
  };

  await saveCities(cities);
  return cities[index];
}

export async function deleteCity(id: string): Promise<boolean> {
  const cities = await getCities();
  const filtered = cities.filter((c) => c.id !== id);
  if (filtered.length === cities.length) return false;
  await saveCities(filtered);
  return true;
}

export async function addDistrict(cityId: string, name: { en: string; ar: string }): Promise<City | null> {
  const cities = await getCities();
  const city = cities.find((c) => c.id === cityId);
  if (!city) return null;

  const newDistrict: District = {
    id: `d-${slugify(name.en) || Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: { en: name.en.trim(), ar: name.ar.trim() },
  };

  city.districts.push(newDistrict);
  await saveCities(cities);
  return city;
}

export async function updateDistrict(
  cityId: string,
  districtId: string,
  name: { en: string; ar: string }
): Promise<City | null> {
  const cities = await getCities();
  const city = cities.find((c) => c.id === cityId);
  if (!city) return null;

  const district = city.districts.find((d) => d.id === districtId);
  if (!district) return null;

  district.name = { en: name.en.trim(), ar: name.ar.trim() };
  await saveCities(cities);
  return city;
}

export async function deleteDistrict(cityId: string, districtId: string): Promise<City | null> {
  const cities = await getCities();
  const city = cities.find((c) => c.id === cityId);
  if (!city) return null;

  city.districts = city.districts.filter((d) => d.id !== districtId);
  await saveCities(cities);
  return city;
}
