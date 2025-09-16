// Restaurant Structured Data for SEO
export const restaurantStructuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Savory Haven",
  "description": "Experience culinary excellence at Savory Haven. Fresh, locally-sourced ingredients crafted into unforgettable dining experiences.",
  "url": process.env.NEXT_PUBLIC_SITE_URL || "https://savoryhaven.com",
  "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://savoryhaven.com"}/logo.png`,
  "image": [
    `${process.env.NEXT_PUBLIC_SITE_URL || "https://savoryhaven.com"}/hero/hero-image.jpg`,
    `${process.env.NEXT_PUBLIC_SITE_URL || "https://savoryhaven.com"}/gallery/gel1.jpg`,
    `${process.env.NEXT_PUBLIC_SITE_URL || "https://savoryhaven.com"}/gallery/gel2.jpg`
  ],
  "telephone": "+1-123-456-7890",
  "email": "info@savoryhaven.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Culinary Street",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.7580",
    "longitude": "-73.9855"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "11:00",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Friday", "Saturday"],
      "opens": "11:00",
      "closes": "23:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "12:00",
      "closes": "21:00"
    }
  ],
  "servesCuisine": ["American", "Contemporary", "Farm-to-table"],
  "priceRange": "$$-$$$",
  "acceptsReservations": true,
  "menu": `${process.env.NEXT_PUBLIC_SITE_URL || "https://savoryhaven.com"}/menu`,
  "hasMenu": {
    "@type": "Menu",
    "name": "Main Menu",
    "description": "Our carefully crafted menu featuring fresh, locally-sourced ingredients"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Sarah Johnson"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Absolutely incredible dining experience! The attention to detail in every dish was remarkable."
    }
  ],
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Wheelchair Accessible",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Outdoor Seating",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Valet Parking",
      "value": true
    }
  ],
  "paymentAccepted": "Cash, Credit Card, Debit Card, Apple Pay, Google Pay",
  "currenciesAccepted": "USD"
};

// Menu Item Structured Data Generator
export const menuItemStructuredData = (item) => ({
  "@context": "https://schema.org",
  "@type": "MenuItem",
  "name": item.name,
  "description": item.description,
  "image": item.image,
  "offers": {
    "@type": "Offer",
    "price": item.price,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "nutrition": item.nutrition && {
    "@type": "NutritionInformation",
    "calories": item.nutrition.calories
  },
  "suitableForDiet": item.dietary?.map(diet => `https://schema.org/${diet}Diet`) || []
});

// Event Structured Data (for special events)
export const eventStructuredData = (event) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": "Restaurant",
    "name": "Savory Haven",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Culinary Street",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Savory Haven",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://savoryhaven.com"
  },
  "offers": event.offers && {
    "@type": "Offer",
    "price": event.offers.price,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://savoryhaven.com"}/reservations`
  }
});

// Breadcrumb Structured Data Generator
export const breadcrumbStructuredData = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// FAQ Structured Data Generator
export const faqStructuredData = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
