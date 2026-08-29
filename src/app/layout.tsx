import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dar & Miftah | دار ومفتاح - Luxury Apartment & Residence Rentals',
  description: 'Dar & Miftah (دار ومفتاح) - Discover luxury apartments and residences for rent in prime locations with verified specifications and dedicated leasing advisory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
