import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants';

const FEATURES = [
  { title: 'Weather Intelligence', desc: 'Real-time forecasts with ML rain predictions', icon: 'fas fa-cloud-sun', sectionId: 'weather', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  { title: 'Crop Advisor', desc: 'AI recommends best crops for your soil & season', icon: 'fas fa-seedling', sectionId: 'crop-recommender', textColor: 'text-green-600', bgColor: 'bg-green-50' },
  { title: 'Disease Detection', desc: 'Identify crop diseases and get treatment advice', icon: 'fas fa-bug', sectionId: 'disease-detection', textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
  { title: 'Farmer News', desc: 'AI-curated news tailored to your crops & region', icon: 'fas fa-newspaper', sectionId: 'news', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { title: 'Govt Schemes', desc: 'Personalized welfare scheme recommendations', icon: 'fas fa-landmark', sectionId: 'schemes', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { title: 'Smart Mandi', desc: 'Live market prices and AI price predictions', icon: 'fas fa-store', sectionId: 'mandi', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
  { title: 'Equipment Rental', desc: 'Find and rent farming equipment near you', icon: 'fas fa-tractor', sectionId: 'equipment-recommender', textColor: 'text-red-600', bgColor: 'bg-red-50' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section id="hero" className="snap-section relative min-h-screen flex items-center overflow-hidden bg-brand-900">
        {/* Background image with dark overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')" }}></div>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <i className="fas fa-leaf text-brand-100 text-sm"></i>
              <span className="text-sm font-medium text-brand-50">Eco-Friendly Smart Farming</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Everything a Farmer Needs,
              <br />
              <span className="text-brand-100">One Smart Platform</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-white/85 mb-8 max-w-xl leading-relaxed">
              Weather intelligence, crop disease detection, live mandi prices, and government schemes — all in one place, completely free.
            </p>

            {/* Search + Voice bar */}
            <div className="mb-8 max-w-lg">
              <div className="flex items-center bg-white/15 backdrop-blur-sm border border-white/20 rounded-full pl-5 pr-2 py-2">
                <i className="fas fa-search text-white/50 text-base mr-3" aria-hidden="true"></i>
                <input
                  type="text"
                  placeholder="Search weather, crops, mandi..."
                  className="flex-1 bg-transparent text-white placeholder-white/50 text-base outline-none min-w-0"
                  onFocus={() => toast('Search coming soon', { icon: '🔍' })}
                  readOnly
                />
                <button
                  onClick={() => toast('Voice search coming soon', { icon: '🎤' })}
                  className="flex-shrink-0 flex items-center justify-center text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Voice search"
                >
                  <i className="fas fa-microphone"></i>
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('weather')}
                className="inline-flex items-center gap-2 bg-white text-brand-800 font-bold py-3.5 px-8 rounded-full hover:bg-brand-50 transition-all shadow-lg"
              >
                <i className="fas fa-rocket"></i> Get Started
              </button>
              <a href="#features" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold py-3.5 px-8 rounded-full hover:bg-white/10 transition-all">
                <i className="fas fa-play-circle"></i> Learn More
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap gap-6 sm:gap-10">
              <div><p className="text-2xl sm:text-3xl font-bold text-brand-100">10K+</p><p className="text-xs sm:text-sm text-white/70">Farmers</p></div>
              <div><p className="text-2xl sm:text-3xl font-bold text-brand-100">50+</p><p className="text-xs sm:text-sm text-white/70">Districts</p></div>
              <div><p className="text-2xl sm:text-3xl font-bold text-brand-100">100%</p><p className="text-xs sm:text-sm text-white/70">Free</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="snap-section py-16 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Smart Tools for Every Farming Need</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Choose a service below to get started — each tool is designed to help you farm smarter and earn more.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <button
                key={f.title}
                onClick={() => scrollToSection(f.sectionId)}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300 hover:-translate-y-1 text-left flex flex-col"
              >
                <div className={`w-14 h-14 ${f.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <i className={`${f.icon} ${f.textColor} text-2xl`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed flex-1">{f.desc}</p>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${f.textColor} group-hover:underline mt-auto`}>
                  Explore <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About Brief */}
      <section className="snap-section py-12 md:py-16 bg-gray-50 border-t border-gray-100">
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
