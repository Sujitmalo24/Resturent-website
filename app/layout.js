// app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccessibilityPanel from "../components/AccessibilityPanel";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Savory Haven - Fine Dining Experience",
  description: "Experience culinary excellence at Savory Haven. Fresh, locally-sourced ingredients crafted into unforgettable dining experiences in the heart of New York City.",
  keywords: "restaurant, fine dining, fresh ingredients, New York, reservations, culinary, food, dining experience, farm-to-table",
  authors: [{ name: "Savory Haven" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://savoryhaven.com'),
  openGraph: {
    title: "Savory Haven - Fine Dining Experience",
    description: "Experience culinary excellence at Savory Haven. Fresh, locally-sourced ingredients crafted into unforgettable dining experiences.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://savoryhaven.com',
    siteName: "Savory Haven",
    images: [
      {
        url: '/hero/hero-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Savory Haven Restaurant Interior',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Savory Haven - Fine Dining Experience",
    description: "Experience culinary excellence at Savory Haven. Fresh, locally-sourced ingredients crafted into unforgettable dining experiences.",
    images: ['/hero/hero-image.jpg'],
    creator: '@savoryhaven',
    site: '@savoryhaven',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

// ✅ Full recommended viewport config
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f59e0b", // Amber theme color
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main id="main-content" className="pt-16" tabIndex="-1">{children}</main>
        <Footer />
        <AccessibilityPanel />
      </body>
    </html>
  );
}
