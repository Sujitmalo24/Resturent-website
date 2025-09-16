import Image from 'next/image';

const About = () => {
  const features = [
    {
      icon: "🍽️",
      title: "Fine Dining",
      description: "Exceptional cuisine crafted with passion and served with elegance in a sophisticated atmosphere."
    },
    {
      icon: "👨‍🍳",
      title: "Expert Chefs",
      description: "Our award-winning chefs bring years of culinary expertise and innovation to every dish."
    },
    {
      icon: "🌿",
      title: "Fresh Ingredients",
      description: "We source the finest local and seasonal ingredients to ensure quality and sustainability."
    },
    {
      icon: "🏆",
      title: "Award Winning",
      description: "Recognized for excellence in dining, service, and culinary innovation across the region."
    }
  ];

  const stats = [
    { number: "15+", label: "Years of Excellence" },
    { number: "50K+", label: "Happy Customers" },
    { number: "200+", label: "Signature Dishes" },
    { number: "25+", label: "Expert Chefs" }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-orange-600">Delicious</span>
          </h2>
          <div className="w-24 h-1 bg-orange-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the story behind our passion for culinary excellence and our commitment 
            to creating unforgettable dining experiences.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              A Legacy of Culinary Excellence
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded in 2008, Delicious Restaurant has been at the forefront of innovative 
              cuisine, blending traditional techniques with modern creativity. Our journey 
              began with a simple vision: to create extraordinary dining experiences that 
              celebrate the art of cooking.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every dish tells a story, crafted with locally-sourced ingredients and 
              prepared by our team of passionate chefs. We believe that great food brings 
              people together, creating memories that last a lifetime.
            </p>
            
            {/* Key Points */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full mr-4"></div>
                <span className="text-gray-700 font-medium">Locally sourced, premium ingredients</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full mr-4"></div>
                <span className="text-gray-700 font-medium">Innovative menu with seasonal specials</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full mr-4"></div>
                <span className="text-gray-700 font-medium">Warm, welcoming atmosphere</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full mr-4"></div>
                <span className="text-gray-700 font-medium">Exceptional service standards</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/gallery/gel1.jpg"
                alt="Restaurant Interior"
                width={600}
                height={400}
                className="object-cover w-full h-96"
              />
              {/* Overlay with Quote */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <blockquote className="text-lg font-medium mb-2">
                    "Creating culinary art that touches the soul and brings people together."
                  </blockquote>
                  <cite className="text-sm opacity-90">- Chef Marco Rodriguez, Head Chef</cite>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-12 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-orange-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chef's Special Message */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">👨‍🍳</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">From Our Kitchen to Your Heart</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              "At Delicious, we don't just prepare meals – we craft experiences. Every ingredient 
              is chosen with care, every technique perfected through passion, and every dish 
              served with love. Join us on this culinary journey where tradition meets innovation."
            </p>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="font-bold text-gray-900">Chef Marco Rodriguez</p>
                <p className="text-gray-600">Executive Chef & Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
