'use client';

import Link from "next/link";
import { motion } from 'framer-motion';
import { useAccessibility } from '../hooks/useAccessibility';
import { fadeInUp, fadeInDown, staggerContainer, floating } from '../lib/animations';

const Hero = () => {
  const { prefersReducedMotion } = useAccessibility();

  // Disable animations if user prefers reduced motion
  const animationProps = prefersReducedMotion ? {} : {
    initial: "initial",
    animate: "animate",
    variants: staggerContainer
  };

  const textAnimation = prefersReducedMotion ? {} : fadeInUp;
  const badgeAnimation = prefersReducedMotion ? {} : fadeInDown;
  const buttonAnimation = prefersReducedMotion ? {} : { ...fadeInUp, transition: { delay: 0.8, duration: 0.6 } };

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      role="banner"
      aria-label="Hero section"
    >
      {/* Light Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to main content
      </a>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8"
        {...animationProps}
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-amber-400 bg-amber-900/40 border border-amber-400 rounded-full"
            {...(prefersReducedMotion ? {} : badgeAnimation)}
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
            Welcome to Fine Dining
          </motion.div>

          {/* Heading */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            {...(prefersReducedMotion ? {} : textAnimation)}
          >
            <motion.span 
              className="block"
              {...(prefersReducedMotion ? {} : { ...textAnimation, transition: { delay: 0.2 } })}
            >
              Taste the
            </motion.span>
            <motion.span 
              className="block text-amber-400"
              {...(prefersReducedMotion ? {} : { ...textAnimation, transition: { delay: 0.4 } })}
            >
              Excellence
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90"
            {...(prefersReducedMotion ? {} : { ...textAnimation, transition: { delay: 0.6 } })}
          >
            Experience culinary artistry where every dish tells a story of passion, 
            tradition, and innovation. Join us for an unforgettable dining journey.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            {...(prefersReducedMotion ? {} : buttonAnimation)}
          >
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <Link
                href="/reservations"
                className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg text-lg hover:bg-amber-700 transition duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Make a reservation at our restaurant"
              >
                Reserve Your Table
              </Link>
            </motion.div>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <Link
                href="/menu"
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-semibold rounded-lg text-lg border-2 border-white hover:bg-white hover:text-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="View our restaurant menu"
              >
                View Our Menu
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm opacity-80"
            {...(prefersReducedMotion ? {} : { ...fadeInUp, transition: { delay: 1.0 } })}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Award-winning cuisine</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Fresh local ingredients</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Exceptional service</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating scroll indicator */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          {...floating}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-white text-sm mt-2 opacity-75">Scroll to explore</p>
        </motion.div>
      )}

      {/* Accessibility announcement for screen readers */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        Welcome to Savory Haven fine dining restaurant. Navigate using Tab key or screen reader commands.
      </div>
    </section>
  );
};

export default Hero;
