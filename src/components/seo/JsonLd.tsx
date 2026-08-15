import { Property, Locale, SiteSettings } from '@/lib/types';

interface PropertyJsonLdProps {
  property: Property;
  locale: Locale;
  settings: SiteSettings;
  url: string;
}

export function PropertyJsonLd({ property, locale, settings, url }: PropertyJsonLdProps) {
  const isAr = locale === 'ar';
  const title = isAr ? property.title.ar : property.title.en;
  const description = isAr ? property.description.ar : property.description.en;
  const locationName = isAr ? property.location.ar : property.location.en;

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": title,
    "description": description,
    "url": url,
    "image": property.gallery.length > 0 ? property.gallery : [property.featuredImage],
    "identifier": property.referenceNumber,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency,
      "availability": property.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": property.price,
        "priceCurrency": property.currency,
        "unitText": property.period === 'monthly' ? "MONTH" : "YEAR"
      }
    },
    "accommodationCategory": property.propertyType,
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.areaSqM,
      "unitCode": "MTK"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location.city,
      "addressRegion": locationName,
      "streetAddress": locationName
    },
    "provider": {
      "@type": "RealEstateAgent",
      "name": isAr ? settings.companyName.ar : settings.companyName.en,
      "telephone": settings.phone,
      "email": settings.email
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
