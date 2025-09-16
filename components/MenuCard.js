import Image from 'next/image';

const MenuCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Overlay with badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {item.featured && (
            <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
          {item.isVegetarian && (
            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              🌱 Vegetarian
            </span>
          )}
          {item.isSpicy && (
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              🌶️ Spicy
            </span>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-4 right-4">
          <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full font-bold">
            ${item.price}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>

        {/* Allergen Information */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Contains:</p>
            <div className="flex flex-wrap gap-1">
              {item.allergens.map((allergen, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transform hover:scale-105 transition-all duration-200">
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
