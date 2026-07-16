import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const FEATURES = [
  { title: 'Weather Intelligence', desc: 'Real-time forecasts with ML rain predictions', icon: 'fas fa-cloud-sun', color: 'bg-blue-500', route: ROUTES.WEATHER, textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  { title: 'Crop Advisor', desc: 'AI recommends best crops for your soil & season', icon: 'fas fa-seedling', color: 'bg-green-500', route: ROUTES.CROP_ADVISOR, textColor: 'text-green-600', bgColor: 'bg-green-50' },
  { title: 'Disease Detection', desc: 'Identify crop diseases and get treatment advice', icon: 'fas fa-bug', color: 'bg-amber-500', route: ROUTES.DISEASE_DETECTION, textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
  { title: 'Farmer News', desc: 'AI-curated news tailored to your crops & region', icon: 'fas fa-newspaper', color: 'bg-emerald-500', route: ROUTES.NEWS, textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { title: 'Govt Schemes', desc: 'Personalized welfare scheme recommendations', icon: 'fas fa-landmark', color: 'bg-indigo-500', route: ROUTES.SCHEMES, textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { title: 'Smart Mandi', desc: 'Live market prices and AI price predictions', icon: 'fas fa-store', color: 'bg-orange-500', route: ROUTES.MANDI, textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
  { title: 'Equipment Rental', desc: 'Find and rent farming equipment near you', icon: 'fas fa-tractor', color: 'bg-red-500', route: ROUTES.EQUIPMENT, textColor: 'text-red-600', bgColor: 'bg-red-50' },
];

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <i className="fas fa-leaf text-green-300 text-sm"></i>
              <span className="text-sm font-medium text-green-100">Eco-Friendly Smart Farming</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Everything a Farmer Needs,
              <br />
              <span className="text-green-300">One Smart Platform</span>
            </h1>
            <p className="text-lg text-green-100/80 mb-8 max-w-xl">
              Weather intelligence, crop disease detection, live mandi prices, and government schemes — all in one place, completely free.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={ROUTES.WEATHER} className="inline-flex items-center gap-2 bg-white text-green-700 font-bold py-3.5 px-8 rounded-full hover:bg-green-50 transition-all shadow-lg">
                <i className="fas fa-rocket"></i> Get Started
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold py-3.5 px-8 rounded-full hover:bg-white/10 transition-all">
                <i className="fas fa-play-circle"></i> Learn More
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 sm:gap-10">
              <div><p className="text-2xl sm:text-3xl font-bold text-green-300">10K+</p><p className="text-xs sm:text-sm text-green-100/70">Farmers</p></div>
              <div><p className="text-2xl sm:text-3xl font-bold text-green-300">50+</p><p className="text-xs sm:text-sm text-green-100/70">Districts</p></div>
              <div><p className="text-2xl sm:text-3xl font-bold text-green-300">100%</p><p className="text-xs sm:text-sm text-green-100/70">Free</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Smart Tools for Every Farming Need</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Choose a service below to get started — each tool is designed to help you farm smarter and earn more.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                to={f.route}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${f.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <i className={`${f.icon} ${f.textColor} text-2xl`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{f.desc}</p>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${f.textColor}`}>
                  Explore <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Brief */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">Why GROWSMART?</span>
            <h2 className="text-3xl font-bold text-gray-800">Built for Every Indian Farmer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'fas fa-globe-asia', title: 'Multi-Language', desc: 'Available in 12+ Indian languages — Hindi, Tamil, Telugu, Bengali, and more.' },
              { icon: 'fas fa-brain', title: 'AI-Powered', desc: 'Machine learning models trained on Indian agricultural data for accurate predictions.' },
              { icon: 'fas fa-hand-holding-heart', title: '100% Free', desc: 'No hidden charges, no subscriptions. Every feature is completely free for farmers.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className={`${item.icon} text-green-600 text-2xl`}></i>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
