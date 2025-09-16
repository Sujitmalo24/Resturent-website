'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '../hooks/useAccessibility';
import { fadeInUp, scaleIn, staggerContainer } from '../lib/animations';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { prefersReducedMotion, announceToScreenReader } = useAccessibility();

  // Gallery images data
  const galleryImages = [
    {
      id: 1,
      src: '/gallery/gel1.jpg',
      alt: 'Restaurant Interior View',
      title: 'Elegant Dining Space'
    },
    {
      id: 2,
      src: '/gallery/gel2.jpg',
      alt: 'Chef Preparation',
      title: 'Culinary Excellence'
    },
    {
      id: 3,
      src: '/gallery/gel3.jpg',
      alt: 'Signature Dish',
      title: 'Signature Delicacies'
    },
    {
      id: 4,
      src: '/gallery/gel4.jpg',
      alt: 'Restaurant Ambiance',
      title: 'Perfect Ambiance'
    },
    {
      id: 5,
      src: '/gallery/gel5.jpg',
      alt: 'Fine Dining Experience',
      title: 'Premium Experience'
    },
    {
      id: 6,
      src: '/gallery/gel6.jpg',
      alt: 'Fresh Ingredients',
      title: 'Fresh & Quality'
    },
    {
      id: 7,
      src: '/gallery/gel7.jpg',
      alt: 'Restaurant Setting',
      title: 'Memorable Moments'
    }
  ];

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % galleryImages.length;
    } else {
      newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <span className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full mb-4">
            Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Visual <span className="text-orange-500">Delights</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Take a glimpse into our world of culinary artistry, elegant ambiance, and unforgettable dining experiences
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer card-hover ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              } ${index === 3 ? 'lg:col-span-2' : ''}`}
              onClick={() => openModal(image)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className={`relative ${index === 0 ? 'h-96 md:h-full' : 'h-64 md:h-80'} overflow-hidden`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <div className="p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                    <p className="text-gray-200 text-sm">Click to view larger</p>
                  </div>
                </div>
                
                {/* Hover Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fadeInUp">
          <p className="text-gray-600 mb-6">Experience the magic in person</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg btn-primary">
            Make a Reservation
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors duration-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-500 transition-colors duration-300 z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-500 transition-colors duration-300 z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative w-full h-96 md:h-[600px] rounded-lg overflow-hidden">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-b-lg">
              <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;