import ContactForm from '../../components/ContactForm';
import GoogleMap from '../../components/GoogleMap';

export const metadata = {
  title: 'Contact Us | Restaurant Name',
  description: 'Get in touch with us. Find our location, hours, phone number and send us a message. We\'d love to hear from you!',
  keywords: 'contact, location, hours, phone, address, restaurant contact'
};

export default function ContactPage() {
  return (
    <main className="pt-16"> {/* Account for fixed navbar */}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get In <span className="text-orange-200">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              We&apos;d love to hear from you. Whether you have questions, feedback, or just want to say hello, 
              we&apos;re here to help make your dining experience exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Phone */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center card-hover">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600 mb-4">Call us anytime</p>
              <a href="tel:+15551234567" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300">
                (555) 123-4567
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center card-hover">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Send us a message</p>
              <a href="mailto:info@restaurant.com" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300">
                info@restaurant.com
              </a>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center card-hover">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Location</h3>
              <p className="text-gray-600 mb-4">Visit us</p>
              <address className="text-orange-500 font-semibold not-italic">
                123 Gourmet Street<br />
                Culinary District, CD 12345
              </address>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center card-hover">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hours</h3>
              <p className="text-gray-600 mb-4">We&apos;re open</p>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Mon-Thu:</span>
                  <span className="font-semibold">5:00 PM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Fri-Sat:</span>
                  <span className="font-semibold">5:00 PM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold">4:00 PM - 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <div className="animate-slideInLeft">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Find Us</h2>
              <GoogleMap />
              
              {/* Directions */}
              <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Directions & Parking</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Located in the heart of Culinary District</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Valet parking available after 6 PM</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Public parking garage 1 block north</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Accessible entrance on Gourmet Street</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slideInRight">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Private Events</h3>
              <p className="text-gray-300 mb-4">Host your special occasion with us. We offer private dining rooms and custom menus.</p>
              <a href="tel:+15551234567" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-300">
                Call for Details
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Catering Services</h3>
              <p className="text-gray-300 mb-4">Bring our exceptional cuisine to your event. Full-service catering available.</p>
              <a href="mailto:catering@restaurant.com" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-300">
                catering@restaurant.com
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Gift Cards</h3>
              <p className="text-gray-300 mb-4">Give the gift of exceptional dining. Purchase gift cards online or in person.</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                Buy Gift Cards
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
