export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Temporary welcome section - will be replaced with Hero in next step */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Delicious Restaurant
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your navbar is working! Next step: Hero section
          </p>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">Navigation test:</p>
            <ul className="space-y-2 text-gray-600">
              <li>✅ Navbar component created</li>
              <li>✅ Responsive design with mobile menu</li>
              <li>✅ Restaurant branding</li>
              <li>✅ Navigation links ready</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
