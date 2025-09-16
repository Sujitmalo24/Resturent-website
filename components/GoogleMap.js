'use client';
import React, { useState } from 'react';

const GoogleMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Restaurant coordinates (example: New York City coordinates)
  const restaurantLocation = {
    lat: 40.7128,
    lng: -74.0060,
    address: '123 Gourmet Street, Culinary District, CD 12345'
  };

  // Google Maps embed URL
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(restaurantLocation.address)}&zoom=15&maptype=roadmap`;

  // Fallback map using OpenStreetMap (no API key required)
  const osmMapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${restaurantLocation.lng - 0.01},${restaurantLocation.lat - 0.01},${restaurantLocation.lng + 0.01},${restaurantLocation.lat + 0.01}&layer=mapnik&marker=${restaurantLocation.lat},${restaurantLocation.lng}`;

  const handleMapLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg bg-gray-200">
        {/* Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* 
          OPTION 1: Google Maps Embed (requires API key)
          Replace YOUR_GOOGLE_MAPS_API_KEY with your actual API key
        */}
        {/* 
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleMapLoad}
          title="Restaurant Location"
        ></iframe>
        */}

        {/* 
          OPTION 2: OpenStreetMap Embed (no API key required - using this for demo)
        */}
        <iframe
          src={osmMapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          onLoad={handleMapLoad}
          title="Restaurant Location"
          className="w-full h-full"
        ></iframe>

        {/* Map Overlay with Restaurant Info */}
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-500 p-2 rounded-lg flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-bold text-gray-800 mb-1">Delicious Restaurant</h4>
              <p className="text-sm text-gray-600 mb-2">{restaurantLocation.address}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantLocation.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Directions
                </a>
                <a
                  href={`tel:+15551234567`}
                  className="inline-flex items-center px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Instructions */}
      <div className="mt-6 bg-orange-50 rounded-xl p-4">
        <h4 className="font-semibold text-orange-800 mb-2">Map Instructions:</h4>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Click &quot;Directions&quot; for turn-by-turn navigation</li>
          <li>• Use two fingers to zoom and navigate on mobile</li>
          <li>• Street parking available on Gourmet Street</li>
          <li>• Entrance is accessible for wheelchairs</li>
        </ul>
      </div>

      {/* Alternative Map Services */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantLocation.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Google Maps
        </a>
        <a
          href={`https://maps.apple.com/?q=${encodeURIComponent(restaurantLocation.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Apple Maps
        </a>
        <a
          href={`https://waze.com/ul?q=${encodeURIComponent(restaurantLocation.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-lg hover:bg-cyan-600 transition-colors duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Waze
        </a>
      </div>
    </div>
  );
};

export default GoogleMap;
