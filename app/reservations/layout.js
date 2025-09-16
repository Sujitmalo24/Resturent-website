import { breadcrumbStructuredData } from '../../lib/structuredData';

export const metadata = {
  title: "Reservations - Savory Haven Restaurant",
  description: "Reserve your table at Savory Haven for an unforgettable dining experience. Book online for lunch, dinner, or special occasions.",
  keywords: "reservations, book table, restaurant booking, fine dining, dinner reservations",
  openGraph: {
    title: "Reservations - Savory Haven Restaurant",
    description: "Reserve your table at Savory Haven for an unforgettable dining experience. Book online for lunch, dinner, or special occasions.",
    images: ['/hero/hero-image.jpg'],
  },
};

export default function ReservationsLayout({ children }) {
  const breadcrumbs = breadcrumbStructuredData([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://savoryhaven.com' },
    { name: 'Reservations', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://savoryhaven.com'}/reservations` }
  ]);

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {children}
    </>
  );
}
