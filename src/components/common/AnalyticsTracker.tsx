'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/types';

interface AnalyticsTrackerProps {
  locale: Locale;
  propertyId?: string;
  referenceNumber?: string;
}

export function AnalyticsTracker({ locale, propertyId, referenceNumber }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const lastTracked = useRef<string>('');

  useEffect(() => {
    // Avoid double counting same path in same render
    const trackKey = `${pathname}-${propertyId || ''}`;
    if (lastTracked.current === trackKey) return;
    lastTracked.current = trackKey;

    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          propertyId,
          referenceNumber,
          language: locale,
          referrer: document.referrer || 'direct',
        }),
      }).catch(() => {});
    } catch {
      // Non-critical tracking fail-safe
    }
  }, [pathname, propertyId, referenceNumber, locale]);

  return null;
}
