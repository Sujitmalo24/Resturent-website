import { breadcrumbStructuredData } from '../../lib/structuredData';

export const metadata = {
  title: "Menu - Savory Haven Restaurant",
  description: "Discover our exquisite menu featuring fresh, locally-sourced ingredients. From appetizers to desserts, each dish is crafted with culinary excellence.",
  keywords: "menu, restaurant menu, fine dining, appetizers, entrees, desserts, vegetarian, vegan, gluten-free",
  openGraph: {
    title: "Menu - Savory Haven Restaurant",
    description: "Discover our exquisite menu featuring fresh, locally-sourced ingredients. From appetizers to desserts, each dish is crafted with culinary excellence.",
    images: ['/menu/menu list/menu-list.jpg'],
  },
};

export default function MenuLayout({ children }) {
  const breadcrumbs = breadcrumbStructuredData([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://savoryhaven.com' },
    { name: 'Menu', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://savoryhaven.com'}/menu` }
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
