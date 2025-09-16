import { breadcrumbStructuredData } from '../../lib/structuredData';

export const metadata = {
  title: "Contact Us - Savory Haven Restaurant",
  description: "Get in touch with Savory Haven. Find our location, hours, contact information, and send us a message. We're here to help with any questions.",
  keywords: "contact, location, hours, phone, email, address, directions, restaurant contact",
  openGraph: {
    title: "Contact Us - Savory Haven Restaurant",
    description: "Get in touch with Savory Haven. Find our location, hours, contact information, and send us a message.",
    images: ['/hero/hero-image.jpg'],
  },
};

export default function ContactLayout({ children }) {
  const breadcrumbs = breadcrumbStructuredData([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://savoryhaven.com' },
    { name: 'Contact', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://savoryhaven.com'}/contact` }
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
