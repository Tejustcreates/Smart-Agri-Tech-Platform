import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface QuickActionItem {
  id: string;
  title: string;
  subTitle: string;
  desc: string;
  icon: string;
  sectionId?: string;
  route?: string;
  accent: string;
  badge: string;
  iconBg: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'mandi',
    title: 'Live Mandi Prices',
    subTitle: 'बाजार भाव',
    desc: 'Compare 50+ APMC mandi rates and maximize your crop profits',
    icon: 'fas fa-store',
    sectionId: 'mandi',
    accent: 'border-emerald-200 hover:border-emerald-400',
    badge: 'Live Rates',
    iconBg: 'bg-emerald-500 text-white',
  },
  {
    id: 'weather',
    title: 'Weather & Rain Alert',
    subTitle: 'हवामान अंदाज',
    desc: '7-day local forecast, rainfall chance & farm spraying advice',
    icon: 'fas fa-cloud-sun',
    sectionId: 'weather',
    accent: 'border-sky-200 hover:border-sky-400',
    badge: 'Real-time',
    iconBg: 'bg-sky-500 text-white',
  },
  {
    id: 'disease',
    title: 'Crop Doctor & Disease Check',
    subTitle: 'पीक रोग निदान',
    desc: 'Instant plant disease diagnosis with organic & chemical cures',
    icon: 'fas fa-bug',
    sectionId: 'disease-detection',
    accent: 'border-rose-200 hover:border-rose-400',
    badge: 'AI Doctor',
    iconBg: 'bg-rose-500 text-white',
  },
  {
    id: 'crop',
    title: 'Crop Advisor & Soil Care',
    subTitle: 'पीक सल्लागार',
    desc: 'Personalized crop recommendations based on your soil & season',
    icon: 'fas fa-seedling',
    sectionId: 'crop-recommender',
    accent: 'border-teal-200 hover:border-teal-400',
    badge: 'High Yield',
    iconBg: 'bg-teal-600 text-white',
  },
  {
    id: 'schemes',
    title: 'Govt Schemes & Subsidies',
    subTitle: 'सरकारी योजना',
    desc: 'Check eligibility for PM-KISAN, crop insurance & subsidized loans',
    icon: 'fas fa-landmark',
    sectionId: 'schemes',
    accent: 'border-amber-200 hover:border-amber-400',
    badge: 'Direct Benefit',
    iconBg: 'bg-amber-500 text-white',
  },
  {
    id: 'equipment',
    title: 'Community Equipment Rental',
    subTitle: 'कृषी यंत्रे',
    desc: 'Rent tractors, harvesters & spray pumps from nearby farmers',
    icon: 'fas fa-tractor',
    sectionId: 'equipment-recommender',
    accent: 'border-orange-200 hover:border-orange-400',
    badge: 'Affordable',
    iconBg: 'bg-orange-500 text-white',
  },
];

const TICKER_ITEMS = [
  { text: 'Soybean (Nashik APMC): ₹4,850/q', change: '+2.3%', isPositive: true },
  { text: 'Wheat (Indore APMC): ₹2,275/q (Govt MSP)', change: '+0.8%', isPositive: true },
  { text: 'Cotton (Akola APMC): ₹6,920/q', change: '+1.5%', isPositive: true },
  { text: 'Onion (Lasalgaon): ₹1,950/q', change: '-1.2%', isPositive: false },
  { text: 'IMD Alert: Clear weather expected across Maharashtra & MP for next 48 hours', isAlert: true },
  { text: 'PM-KISAN: 17th Installment e-KYC verification active on portal', isAlert: true },
  { text: 'Kisan Call Center: Dial 1800-180-1551 for 24/7 free expert consultation', isCall: true },
];

const STATS = [
  { value: '10K+', label: 'Active Farmers', subtext: 'Trusting GrowSmart', icon: 'fas fa-users' },
  { value: '50+', label: 'APMC Mandis', subtext: 'Tracked daily', icon: 'fas fa-store' },
  { value: '12+', label: 'Indian Languages', subtext: 'Accessible nationwide', icon: 'fas fa-language' },
  { value: '100%', label: 'Free Forever', subtext: 'Zero subscription cost', icon: 'fas fa-heart' },
];

const WHY_ITEMS = [
  {
    icon: 'fas fa-language',
    title: 'Multi-Language Accessibility',
    desc: 'Available in Hindi, Marathi, Telugu, Tamil, Bengali, and English so every farmer can use it in their mother tongue.',
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: 'fas fa-mobile-screen-button',
    title: 'Farmer-Friendly Design',
    desc: 'Large touch buttons, clear icons, and high contrast designed specifically for outdoor viewing on mobile screens in fields.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: 'fas fa-robot',
    title: 'Scientific Agri-AI Models',
    desc: 'Machine learning models trained on Indian agricultural data for precise crop, disease, and weather intelligence.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: 'fas fa-hand-holding-dollar',
    title: '100% Free & Transparent',
    desc: 'No hidden charges or subscription fees. Every single advisory tool is completely free for all Indian farmers.',
    color: 'from-amber-500 to-orange-600',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh Patil',
    role: 'Soybean & Onion Farmer',
    location: 'Nashik, Maharashtra',
    text: 'GrowSmart showed me the live price difference between Nashik and Lasalgaon mandis. I sold at ₹250/quintal higher and made an extra ₹15,000 on my harvest!',
    tag: 'Mandi Intelligence',
    avatar: 'RP',
  },
  {
    name: 'Rameshwar Singh',
    role: 'Wheat & Mustard Farmer',
    location: 'Indore, Madhya Pradesh',
    text: 'The weather alert warned me 24 hours before unseasonal rain. I delayed pesticide spraying and saved both my crop and ₹4,000 in chemical costs.',
    tag: 'Weather Alert',
    avatar: 'RS',
  },
  {
    name: 'Venkat Rao',
    role: 'Paddy Farmer',
    location: 'Godavari, Andhra Pradesh',
    text: 'I uploaded a photo of my yellowing rice leaves. The Crop Doctor identified Bacterial Blight immediately and suggested an organic neem remedy that worked.',
    tag: 'Crop Doctor',
    avatar: 'VR',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleActionClick = (action: QuickActionItem) => {
    if (action.route) {
      navigate(action.route);
    } else if (action.sectionId) {
      scrollToSection(action.sectionId);
    }
  };

  return (
    <div className="bg-[#f8faf6]">
      {/* ═══════ REAL-TIME AGRICULTURAL TICKER ═══════ */}
      <div className="bg-[#052615] border-b border-emerald-500/20 text-white overflow-hidden py-2 text-xs relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider mr-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></span>
            LIVE AGRI FEED
          </div>
          <div className="overflow-hidden flex-1 relative">
            <div className="ticker-track flex items-center gap-8 text-[11px] font-medium text-emerald-100/90">
              {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                  <span>{item.text}</span>
                  {item.change && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {item.change}
                    </span>
                  )}
                  {item.isAlert && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                      Notice
                    </span>
                  )}
                  {item.isCall && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                      Toll-Free
                    </span>
                  )}
                  <span className="text-emerald-500/40 ml-2">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ HERO ═══════ */}
      <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden hero-gradient text-white">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none"></div>

        {/* Ambient illumination */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Hero Pitch */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-300 mb-6 shadow-sm">
              <i className="fas fa-shield-halved text-emerald-400"></i>
              <span>National Smart Agri-Tech Platform • 100% Free for Farmers</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-5">
              Farm Smarter. Sell Better.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-amber-200">
                Maximize Every Harvest.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/85 max-w-2xl mx-auto leading-relaxed mb-8">
              Live mandi rates across 50+ APMCs, hyper-local rainfall alerts, instant AI crop doctor, and government subsidies — built to empower every Indian farmer.
            </p>

            {/* Quick Action CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => scrollToSection('mandi')}
                className="btn-modern inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 font-black py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all text-sm"
              >
                <i className="fas fa-chart-line"></i>
                Check Live Mandi Rates
              </button>
              <button
                onClick={() => scrollToSection('weather')}
                className="btn-modern inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/25 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm backdrop-blur-sm"
              >
                <i className="fas fa-cloud-sun text-sky-300"></i>
                Check Local Weather
              </button>
              <a
                href="tel:18001801551"
                className="inline-flex items-center gap-2 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 font-bold py-3.5 px-5 rounded-xl transition-all text-sm"
              >
                <i className="fas fa-phone-volume"></i>
                Kisan Helpline: 1800-180-1551
              </a>
            </div>
          </div>

          {/* ═══════ 6 PROMINENT FARMER QUICK ACTION CARDS ═══════ */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Quick Access Farmer Tools
                </h2>
                <p className="text-xs text-emerald-200/70">Select any tool below to launch instantly</p>
              </div>
              <span className="hidden sm:inline-block text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
                Tap to jump directly
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className="group bg-white/95 hover:bg-white text-slate-900 rounded-2xl p-5 border border-white/80 hover:border-emerald-400 shadow-md hover:shadow-xl transition-all duration-200 text-left flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3 w-full">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <i className={`${action.icon} text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                          {action.title}
                        </h3>
                        <span className="text-xs font-semibold text-emerald-600">
                          ({action.subTitle})
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {action.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {action.desc}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700">
                    <span>Open Tool</span>
                    <i className="fas fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trust & Impact Stats */}
          <div className="mt-14 pt-8 border-t border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <i className={`${s.icon} text-emerald-400 text-lg mb-1.5`}></i>
                <div className="text-2xl sm:text-3xl font-black text-white">{s.value}</div>
                <div className="text-xs font-bold text-emerald-100">{s.label}</div>
                <div className="text-[10px] text-emerald-300/70">{s.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS (FARMER FRIENDLY STEPS) ═══════ */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full px-4 py-1 text-xs font-bold mb-3">
              <i className="fas fa-circle-check text-emerald-600"></i>
              <span>Simple 4-Step Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              How GrowSmart Helps You in 4 Steps
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              No complicated setups. Get answers on weather, crop health, and market rates in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Choose Location', desc: 'Select your state & district to get hyper-local weather alerts and nearby mandi prices.', icon: 'fas fa-location-dot', color: 'from-emerald-500 to-green-600' },
              { step: '02', title: 'Check Advisory', desc: 'Check soil suitability, recommended sowing crops, or diagnose plant pests by symptoms.', icon: 'fas fa-flask-vial', color: 'from-sky-500 to-blue-600' },
              { step: '03', title: 'Compare Mandis', desc: 'Compare live market rates across nearby APMCs to find the highest selling price for your crop.', icon: 'fas fa-scale-balanced', color: 'from-amber-500 to-orange-600' },
              { step: '04', title: 'Claim Benefits', desc: 'Find government schemes, subsidised seeds, equipment rental, and direct income support.', icon: 'fas fa-handshake-angle', color: 'from-purple-500 to-indigo-600' },
            ].map((st) => (
              <div key={st.step} className="farmer-card p-6 relative flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center font-black text-base mb-4 shadow-sm`}>
                    {st.step}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-xs font-semibold">
                  <i className={`${st.icon} text-emerald-600`}></i>
                  <span>Step {st.step} of 04</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY INDIAN FARMERS CHOOSE US ═══════ */}
      <section className="py-16 md:py-20 bg-[#f4f7f2] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 rounded-full px-4 py-1 text-xs font-bold mb-3">
              <i className="fas fa-award text-emerald-600"></i>
              <span>Built for Rural Realities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Why Indian Farmers Trust GrowSmart
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Engineered for seamless performance on budget smartphones, in low bandwidth areas, and with multilingual voice readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="farmer-card p-6 bg-white">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center text-xl mb-4 shadow-sm`}>
                  <i className={item.icon}></i>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ REAL FARMER STORIES ═══════ */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-full px-4 py-1 text-xs font-bold mb-3">
              <i className="fas fa-comment-dots text-amber-600"></i>
              <span>Farmer Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Voices From The Field
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Hear how farmers across India use GrowSmart to increase yields and make higher profits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="farmer-card p-6 flex flex-col justify-between bg-[#fbfcf9]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {t.tag}
                    </span>
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/70">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-green-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.role} • {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BOTTOM CTA & KISAN HELPLINE BANNER ═══════ */}
      <section className="py-16 bg-gradient-to-br from-[#064e3b] via-[#043e2f] to-[#022c22] text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold mb-5">
            <i className="fas fa-phone-volume"></i>
            <span>Govt of India Kisan Call Center: 1800-180-1551 (Toll Free)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
            Start Farming Smarter Today
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto mb-8">
            Access live mandi prices, weather forecasts, and disease detection right now — 100% free with no registration required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => scrollToSection('weather')}
              className="btn-modern inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-3.5 px-8 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/25"
            >
              <i className="fas fa-rocket"></i>
              Get Started Free
            </button>
            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all"
            >
              <i className="fas fa-phone"></i>
              Call Kisan Helpline
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
