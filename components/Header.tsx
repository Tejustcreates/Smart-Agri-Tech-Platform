import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User } from '../types';
import { NAV_ITEMS, ROUTES } from '../constants';

declare global {
  interface Window {
    google: any;
  }
}

const PRIMARY_NAV = ['hero', 'weather', 'crop-recommender', 'mandi'];

const SEARCH_SUGGESTIONS = [
  { label: 'Live Mandi Prices', subtext: 'Check latest market rates & nearby APMCs', sectionId: 'mandi', icon: 'fas fa-store', keywords: ['mandi', 'price', 'rate', 'bhav', 'market', 'onion', 'soybean', 'wheat', 'cotton'] },
  { label: 'Weather Forecast & Rain Alert', subtext: 'Rain forecast, humidity & spray advisory', sectionId: 'weather', icon: 'fas fa-cloud-sun', keywords: ['weather', 'rain', 'temperature', 'forecast', 'monsoon', 'barish', 'havaman'] },
  { label: 'Crop Doctor (Disease Detection)', subtext: 'Identify plant diseases & remedies', sectionId: 'disease-detection', icon: 'fas fa-bug', keywords: ['disease', 'doctor', 'leaf', 'blight', 'pest', 'fungus', 'cure', 'spray', 'keeda'] },
  { label: 'Crop Advisor & Soil Recommendations', subtext: 'Smart crop selection by soil & season', sectionId: 'crop-recommender', icon: 'fas fa-seedling', keywords: ['crop', 'advisor', 'soil', 'yield', 'sowing', 'npk', 'fertilizer', 'seed'] },
  { label: 'Govt Schemes & PM-KISAN', subtext: 'Check eligibility & application steps', sectionId: 'schemes', icon: 'fas fa-landmark', keywords: ['scheme', 'yojana', 'pm-kisan', 'subsidy', 'loan', 'insurance', 'kcc', 'grant'] },
  { label: 'Farm Equipment Rental', subtext: 'Rent tractors, harvesters & sprayers', sectionId: 'equipment-recommender', icon: 'fas fa-tractor', keywords: ['equipment', 'tractor', 'rental', 'rent', 'tools', 'harvester', 'spray pump'] },
  { label: 'Farmer News & MSP Alerts', subtext: 'Daily updates on MSP and policies', sectionId: 'news', icon: 'fas fa-newspaper', keywords: ['news', 'msp', 'updates', 'articles', 'agri', 'batmya'] },
];

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  cartCount: number;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, cartCount, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    setIsMoreOpen(false);
    const navItem = NAV_ITEMS.find((item) => item.sectionId === sectionId);
    if (navItem && 'route' in navItem && (navItem as any).route) {
      navigate((navItem as any).route);
      return;
    }
    if (location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname !== ROUTES.HOME) return;
    const sectionIds = NAV_ITEMS.map((item) => item.sectionId);
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    elements.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === ROUTES.HOME && location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState({}, '');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    const initGoogleTranslate = () => {
      const desktopEl = document.getElementById('google_translate_element');
      const mobileEl = document.getElementById('google_translate_element_mobile');
      if (window.google && desktopEl && desktopEl.childElementCount === 0) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,hi,bn,te,mr,ta,gu,kn,ml,pa,ur,or', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element'
        );
      }
      if (window.google && mobileEl && mobileEl.childElementCount === 0) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,hi,bn,te,mr,ta,gu,kn,ml,pa,ur,or', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element_mobile'
        );
      }
    };
    const maxAttempts = 25;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.google?.translate) { initGoogleTranslate(); clearInterval(interval); }
      else if (attempts >= maxAttempts) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setIsMoreOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { onLogout(); navigate('/'); };
  const isOnHomePage = location.pathname === ROUTES.HOME;
  const primaryNav = NAV_ITEMS.filter((item) => PRIMARY_NAV.includes(item.sectionId));
  const moreNav = NAV_ITEMS.filter((item) => !PRIMARY_NAV.includes(item.sectionId));

  const filteredSearch = SEARCH_SUGGESTIONS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.label.toLowerCase().includes(q) ||
      item.subtext.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q));
  });

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#062c18]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border-b border-emerald-500/20'
        : 'bg-[#07361d] border-b border-emerald-600/20 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <button
            onClick={() => {
              if (isOnHomePage) window.scrollTo({ top: 0, behavior: 'smooth' });
              else navigate('/');
            }}
            className="flex items-center gap-2.5 flex-shrink-0 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <i className="fas fa-leaf text-white text-base"></i>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black text-white tracking-tight flex items-center gap-1">
                GROW<span className="text-emerald-400">SMART</span>
              </div>
              <span className="text-[10px] text-emerald-200/70 font-semibold tracking-wider uppercase block sm:hidden md:block">Agri-Platform</span>
            </div>
          </button>

          {/* Center Interactive Quick Search (desktop) */}
          <div className="hidden lg:block relative flex-1 max-w-sm xl:max-w-md" ref={searchRef}>
            <div className="flex items-center bg-white/10 rounded-xl px-3.5 py-2 border border-white/15 hover:border-emerald-400/40 focus-within:border-emerald-400 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all">
              <i className="fas fa-search text-white/50 text-xs mr-2.5"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search mandi, weather, crop doctor..."
                className="bg-transparent text-white placeholder-white/50 text-xs outline-none flex-1 min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-white/40 hover:text-white text-xs px-1"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2.5 z-50 animate-fade-in-down overflow-hidden">
                <div className="px-3.5 pb-2 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Quick Features & Tools</span>
                  <span className="text-emerald-600 font-medium">Click to navigate</span>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {filteredSearch.length > 0 ? (
                    filteredSearch.map((item) => (
                      <button
                        key={item.sectionId}
                        onClick={() => scrollToSection(item.sectionId)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 flex items-start gap-3 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <i className={`${item.icon} text-xs`}></i>
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-800 group-hover:text-emerald-800 transition-colors">{item.label}</p>
                          <p className="text-[11px] text-gray-500">{item.subtext}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No matching tools found for "{searchQuery}".
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Helpline + Nav + Language + Cart + Auth */}
          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
            {/* Kisan Call Center Helpline badge */}
            <a
              href="tel:18001801551"
              title="Kisan Call Center (Toll-Free Govt Helpline)"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 hover:bg-amber-500/25 transition-all text-xs font-bold mr-1"
            >
              <i className="fas fa-phone-volume text-amber-400 text-xs"></i>
              <span>Helpline: 1800-180-1551</span>
            </a>

            {primaryNav.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isOnHomePage && activeSection === item.sectionId
                    ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <i className={`${item.icon} mr-1.5 text-[11px]`}></i>
                {item.name}
              </button>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center gap-1"
              >
                <span>More</span>
                <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {isMoreOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-56 z-50 animate-fade-in-down">
                  {moreNav.map((item) => (
                    <button
                      key={item.sectionId}
                      onClick={() => { setIsMoreOpen(false); scrollToSection(item.sectionId); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-3 transition-all duration-200 ${
                        isOnHomePage && activeSection === item.sectionId
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-700'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                        isOnHomePage && activeSection === item.sectionId ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <i className={item.icon}></i>
                      </span>
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language pill */}
            <div className="translate-pill ml-1">
              <i className="fas fa-globe text-white/70 text-xs"></i>
              <div id="google_translate_element"></div>
            </div>

            {/* Cart */}
            <NavLink
              to={ROUTES.CART}
              aria-label="View cart"
              className={({ isActive }) =>
                `relative p-2.5 rounded-xl transition-all duration-200 ${isActive ? 'text-white bg-white/15 ring-1 ring-white/20' : 'text-white/70 hover:text-white hover:bg-white/10'}`
              }
            >
              <i className="fas fa-shopping-cart text-sm"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] rounded-full h-4 min-w-[18px] flex items-center justify-center font-black px-1 shadow-md">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-[11px] font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-white font-semibold">{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <button onClick={() => onOpenAuth && onOpenAuth('login')} className="px-3.5 py-1.5 text-xs font-bold border border-white/25 text-white rounded-xl hover:bg-white/10 transition-all">
                  Login
                </button>
                <button onClick={() => onOpenAuth && onOpenAuth('signup')} className="btn-modern px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* MOBILE: Quick Helpline + Search toggle + Menu */}
          <div className="flex lg:hidden items-center gap-1.5 flex-shrink-0">
            <a
              href="tel:18001801551"
              aria-label="Call Kisan Helpline"
              className="p-2 rounded-xl text-amber-300 bg-amber-500/20 border border-amber-400/30 flex items-center justify-center"
            >
              <i className="fas fa-phone-volume text-sm"></i>
            </a>
            <NavLink to={ROUTES.CART} className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10">
              <i className="fas fa-shopping-cart text-base"></i>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-slate-900 text-[9px] rounded-full h-4 min-w-[16px] flex items-center justify-center font-black px-0.5">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#052615]/98 backdrop-blur-2xl border-t border-emerald-500/20 shadow-2xl">
          <div className="px-4 py-4 space-y-1.5 max-h-[75vh] overflow-y-auto">
            {/* Quick Helpline banner in mobile menu */}
            <a
              href="tel:18001801551"
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 mb-2 font-bold text-xs"
            >
              <div className="flex items-center gap-2.5">
                <i className="fas fa-phone-volume text-amber-400 text-base"></i>
                <div>
                  <div className="text-white font-black">Kisan Call Center</div>
                  <div className="text-[11px] text-amber-300/80">Toll-Free Helpline: 1800-180-1551</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-amber-400 text-slate-950 text-[10px] font-black">CALL NOW</span>
            </a>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => { setIsMenuOpen(false); scrollToSection(item.sectionId); }}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${
                  isOnHomePage && activeSection === item.sectionId
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                  isOnHomePage && activeSection === item.sectionId ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-white/10 text-white/80'
                }`}>
                  <i className={item.icon}></i>
                </span>
                <span>{item.name}</span>
              </button>
            ))}

            <div className="border-t border-white/10 mt-3 pt-3">
              <div id="google_translate_element_mobile" className="mobile-translate-widget mb-3 px-2"></div>
              {user ? (
                <div className="space-y-2 px-2">
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-xs font-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-white font-bold">{user.name}</span>
                  </div>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2.5 text-red-300 hover:bg-white/10 rounded-xl transition-colors font-semibold text-xs flex items-center gap-2">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-2 pt-1">
                  <button onClick={() => { setIsMenuOpen(false); onOpenAuth && onOpenAuth('login'); }} className="py-2.5 border border-white/20 text-white rounded-xl text-center font-bold text-xs hover:bg-white/10">
                    Login
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); onOpenAuth && onOpenAuth('signup'); }} className="py-2.5 bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 rounded-xl text-center font-black text-xs hover:shadow-lg">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
