import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants';

const FEATURES = [
  { label: 'Weather', desc: 'Forecasts & rain alerts', icon: 'fas fa-cloud-sun', sectionId: 'weather', gradient: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-200' },
  { label: 'Crop Advice', desc: 'AI crop recommendations', icon: 'fas fa-seedling', sectionId: 'crop-recommender', gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  { label: 'Disease Check', desc: 'Identify & treat issues', icon: 'fas fa-bug', sectionId: 'disease-detection', gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
  { label: 'Dashboard', desc: 'Your farming command center', icon: 'fas fa-chart-line', route: '/dashboard', gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200' },
  { label: 'News', desc: 'Curated farmer updates', icon: 'fas fa-newspaper', sectionId: 'news', gradient: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200' },
  { label: 'Schemes', desc: 'Govt welfare programs', icon: 'fas fa-landmark', sectionId: 'schemes', gradient: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200' },
  { label: 'Mandi Price', desc: 'Live market prices', icon: 'fas fa-store', sectionId: 'mandi', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
  { label: 'Equipment', desc: 'Rent farming tools', icon: 'fas fa-tractor', sectionId: 'equipment-recommender', gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200' },
];

const STATS = [
  { value: '10K+', label: 'Active Farmers', icon: 'fas fa-users' },
  { value: '50+', label: 'Districts', icon: 'fas fa-map-marker-alt' },
  { value: '100%', label: 'Free Forever', icon: 'fas fa-heart' },
  { value: '12+', label: 'Languages', icon: 'fas fa-globe' },
];

const WHY_ITEMS = [
  { icon: 'fas fa-globe-asia', title: 'Multi-Language', desc: 'Available in 12+ Indian languages — Hindi, Tamil, Telugu, Bengali, and more.', gradient: 'from-emerald-400 to-green-500' },
  { icon: 'fas fa-brain', title: 'AI-Powered', desc: 'ML models trained on Indian agricultural data for accurate crop & weather predictions.', gradient: 'from-violet-400 to-purple-500' },
  { icon: 'fas fa-hand-holding-heart', title: '100% Free', desc: 'No hidden charges, no subscriptions. Every feature is completely free for farmers.', gradient: 'from-amber-400 to-orange-500' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar', role: 'Farmer, Maharashtra', text: 'GrowSmart recommended Rice for my field and yield improved by 30%. Life-changing app!', avatar: 'RK', color: 'from-emerald-400 to-green-600' },
  { name: 'Sunita Patil', role: 'Farmer, Karnataka', text: 'Mandi price comparison saved me ₹300/quintal by finding a better mandi nearby.', avatar: 'SP', color: 'from-amber-400 to-orange-500' },
  { name: 'Anil Verma', role: 'Farmer, M.P.', text: 'Didnt know about PM-KISAN until GrowSmart showed it. Now I get every installment.', avatar: 'AV', color: 'from-blue-400 to-indigo-500' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState({}, '');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFeatureClick = (f: typeof FEATURES[0]) => {
    if ('route' in f && f.route) {
      navigate(f.route);
    } else if ('sectionId' in f && f.sectionId) {
      scrollToSection(f.sectionId);
    }
  };

  return (
    <div>
      {/* ═══════ HERO ═══════ */}
      <section id="hero" className="relative min-h-[100vh] flex items-center overflow-hidden hero-gradient">
        {/* Animated dot pattern */}
        <div className="absolute inset-0 hero-pattern opacity-40"></div>

        {/* Floating decorative blobs */}
        <div className="blob w-96 h-96 bg-emerald-400 top-[-10%] left-[-5%] animate-float-slow"></div>
        <div className="blob w-80 h-80 bg-yellow-400 bottom-[10%] right-[-5%] animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="blob w-64 h-64 bg-cyan-400 top-[40%] right-[15%] animate-float-slow" style={{ animationDelay: '2s' }}></div>

        {/* Floating icons */}
        <div className="absolute top-[15%] right-[10%] text-5xl opacity-15 animate-float hidden lg:block" style={{ animationDelay: '0.5s' }}>🌾</div>
        <div className="absolute top-[25%] right-[25%] text-4xl opacity-15 animate-float-slow hidden lg:block" style={{ animationDelay: '1.5s' }}>🌤️</div>
        <div className="absolute bottom-[25%] left-[10%] text-5xl opacity-15 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>🚜</div>
        <div className="absolute bottom-[15%] right-[5%] text-4xl opacity-15 animate-float-slow hidden lg:block" style={{ animationDelay: '0.8s' }}>📊</div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="animate-fade-in-down inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-white/90">Eco-Friendly Smart Farming</span>
            </div>

            {/* Heading */}
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6" style={{ animationDelay: '0.1s' }}>
              Farm Smarter,
              <br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-lime-300">
                  Grow Better
                </span>
                <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full opacity-60"></span>
              </span>
            </h1>

            {/* Subtext */}
            <p className="animate-fade-in-up text-lg sm:text-xl text-white/80 mb-10 max-w-xl leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Weather intelligence, crop disease detection, live mandi prices, and government schemes — all in one place, completely free.
            </p>

            {/* Search bar */}
            <div className="animate-fade-in-up mb-10 max-w-lg" style={{ animationDelay: '0.3s' }}>
              <div className="glass-dark rounded-2xl pl-5 pr-2 py-2 flex items-center">
                <i className="fas fa-search text-white/40 text-base mr-3"></i>
                <input
                  type="text"
                  placeholder="Search weather, crops, mandi..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 text-base outline-none min-w-0"
                  onFocus={() => toast('Search coming soon', { icon: '🔍' })}
                  readOnly
                />
                <button
                  onClick={() => toast('Voice search coming soon', { icon: '🎤' })}
                  className="flex-shrink-0 flex items-center justify-center text-white p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
                  aria-label="Voice search"
                >
                  <i className="fas fa-microphone"></i>
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="animate-fade-in-up flex flex-wrap gap-4 mb-12" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => scrollToSection('weather')}
                className="btn-modern group inline-flex items-center gap-3 bg-white text-emerald-800 font-bold py-4 px-8 rounded-2xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <i className="fas fa-rocket group-hover:rotate-12 transition-transform duration-300"></i>
                Get Started Free
              </button>
              <a
                href="#features"
                className="btn-modern inline-flex items-center gap-3 border-2 border-white/25 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <i className="fas fa-play-circle"></i>
                Explore Features
              </a>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ animationDelay: '0.5s' }}>
              {STATS.map((s) => (
                <div key={s.label} className="glass-dark rounded-2xl px-4 py-4 text-center group hover:bg-white/15 transition-all duration-300 cursor-default">
                  <i className={`${s.icon} text-emerald-300 text-lg mb-1 block group-hover:scale-110 transition-transform`}></i>
                  <p className="text-2xl sm:text-3xl font-black text-white">{s.value}</p>
                  <p className="text-[11px] sm:text-xs text-white/60 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="relative py-20 md:py-28 bg-gray-50" ref={featuresRef}>
        {/* Section decorative blob */}
        <div className="blob w-72 h-72 bg-emerald-500 top-0 right-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-5 py-2 text-sm font-semibold mb-5 border border-emerald-100">
              <i className="fas fa-th-large text-xs"></i> Our Platform
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Everything You Need,
              <br />
              <span className="gradient-text">In One Place</span>
            </h2>
            <div className="section-divider my-5"></div>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base">
              Choose a tool below to get started — each is designed to help you farm smarter and earn better.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {FEATURES.map((f, i) => (
              <button
                key={f.label}
                onClick={() => handleFeatureClick(f)}
                className="group relative bg-white rounded-2xl p-5 md:p-6 min-h-[140px] tap-target text-left flex flex-col border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Icon circle */}
                <div className={`relative w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110`}>
                  <i className={`${f.icon} text-xl ${f.text} group-hover:text-white transition-colors duration-300`}></i>
                </div>

                {/* Text */}
                <div className="relative z-10">
                  <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-300">{f.label}</h3>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 leading-relaxed group-hover:text-white/70 transition-colors duration-300">{f.desc}</p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-white/20 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <i className="fas fa-arrow-right text-xs text-gray-500 group-hover:text-white transition-colors"></i>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-5 py-2 text-sm font-semibold mb-5 border border-brand-100">
              <i className="fas fa-route text-xs"></i> How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Simple Steps to
              <span className="gradient-text"> Smarter Farming</span>
            </h2>
            <div className="section-divider my-5"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', icon: 'fas fa-map-marker-alt', title: 'Set Location', desc: 'Enter your farm location for localized data.', color: 'from-emerald-500 to-green-600' },
              { num: '02', icon: 'fas fa-flask', title: 'Input Data', desc: 'Enter soil parameters manually or via IoT sensors.', color: 'from-blue-500 to-indigo-600' },
              { num: '03', icon: 'fas fa-robot', title: 'AI Insights', desc: 'ML models analyze and provide smart recommendations.', color: 'from-violet-500 to-purple-600' },
              { num: '04', icon: 'fas fa-rocket', title: 'Take Action', desc: 'Make informed decisions for better yield & profit.', color: 'from-amber-500 to-orange-600' },
            ].map((step, i) => (
              <div key={step.num} className="relative group">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover-lift text-center relative overflow-hidden">
                  {/* Number badge */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-black text-lg">{step.num}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                    <i className={`${step.icon} text-gray-600 text-lg`}></i>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                {/* Connector arrow (hidden on mobile & last item) */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-gray-300 z-10">
                    <i className="fas fa-chevron-right text-sm"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY GROWSMART ═══════ */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-[120px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full filter blur-[120px] opacity-10"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-200 rounded-full px-5 py-2 text-sm font-semibold mb-5 border border-white/10">
              <i className="fas fa-star text-xs"></i> Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Built for Every
              <span className="text-emerald-300"> Indian Farmer</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full mx-auto mt-5"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="group glass-dark rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${item.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-5 py-2 text-sm font-semibold mb-5 border border-amber-100">
              <i className="fas fa-quote-left text-xs"></i> Farmer Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              What Farmers
              <span className="gradient-text-gold"> Say About Us</span>
            </h2>
            <div className="section-divider my-5"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="group bg-white rounded-2xl p-6 border border-gray-100 hover-lift relative overflow-hidden">
                {/* Quote icon */}
                <div className="absolute top-4 right-4 text-6xl text-gray-50 opacity-50 font-serif leading-none select-none">"</div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-amber-400 text-sm"></i>
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10">{t.text}</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="blob w-80 h-80 bg-white top-[-20%] right-[-10%]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Farm Smarter?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Join thousands of farmers already using GrowSmart to make data-driven decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => scrollToSection('weather')}
              className="btn-modern inline-flex items-center gap-2 bg-white text-emerald-700 font-bold py-4 px-8 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <i className="fas fa-rocket"></i> Get Started Free
            </button>
            <a
              href="#features"
              className="btn-modern inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
            >
              <i className="fas fa-info-circle"></i> Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
