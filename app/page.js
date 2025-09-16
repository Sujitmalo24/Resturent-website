import Hero from '../components/Hero';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import { restaurantStructuredData } from '../lib/structuredData';

export const metadata = {
  title: "Savory Haven - Fine Dining Restaurant in New York",
  description: "Experience culinary excellence at Savory Haven. Fresh, locally-sourced ingredients crafted into unforgettable dining experiences in the heart of New York City.",
  openGraph: {
    title: "Savory Haven - Fine Dining Restaurant in New York",
    description: "Experience culinary excellence at Savory Haven. Fresh, locally-sourced ingredients crafted into unforgettable dining experiences.",
    images: ['/hero/hero-image.jpg'],
  },
};

export default function Home() {
  return (
    <>
      {/* Restaurant Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantStructuredData) }}
      />
      
      <div className="min-h-screen">
        <Hero />
        <About />
        <Gallery />
        <Testimonials />
      </div>
    </>
  );
}
