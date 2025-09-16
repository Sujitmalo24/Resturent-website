'use client';

import { useState, useEffect } from 'react';
import MenuCard from '../../components/MenuCard';

export default function Menu() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        let url = '/api/menu?';
        
        if (activeCategory !== 'all') {
          url += `category=${activeCategory}&`;
        }
        if (showVegetarianOnly) {
          url += `vegetarian=true&`;
        }
        if (showFeaturedOnly) {
          url += `featured=true&`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          setMenuData(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to load menu data');
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [activeCategory, showVegetarianOnly, showFeaturedOnly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-orange-600">Menu</span>
          </h1>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated selection of dishes, each crafted with passion 
            and the finest ingredients to create an unforgettable dining experience.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items
              </button>
              {menuData?.categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVegetarianOnly}
                  onChange={(e) => setShowVegetarianOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center ${
                  showVegetarianOnly ? 'bg-green-600 border-green-600' : 'border-gray-300'
                }`}>
                  {showVegetarianOnly && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-700">🌱 Vegetarian Only</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center ${
                  showFeaturedOnly ? 'bg-orange-600 border-orange-600' : 'border-gray-300'
                }`}>
                  {showFeaturedOnly && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-700">⭐ Featured Only</span>
              </label>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Showing {menuData?.items?.length || 0} items
              {activeCategory !== 'all' && (
                <span className="ml-2 text-orange-600 font-medium">
                  in {menuData?.categories?.find(cat => cat.id === activeCategory)?.name}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Menu Items Grid */}
        {menuData?.items?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuData.items.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more menu items.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Order?</h3>
          <p className="text-xl mb-8 opacity-90">
            Reserve your table now and experience our culinary excellence firsthand.
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200">
            Make a Reservation
          </button>
        </div>
      </div>
    </div>
  );
}
