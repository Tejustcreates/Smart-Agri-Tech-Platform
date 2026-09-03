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
  const navigate = useNavigate();
  const location = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { onLogout(); navigate('/'); };
  const isOnHomePage = location.pathname === ROUTES.HOME;
  const primaryNav = NAV_ITEMS.filter((item) => PRIMARY_NAV.includes(item.sectionId));
  const moreNav = NAV_ITEMS.filter((item) => !PRIMARY_NAV.includes(item.sectionId));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-brand-900/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] border-b border-white/5'
        : 'bg-brand-900 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <button
            onClick={() => {
              if (isOnHomePage) window.scrollTo({ top: 0, behavior: 'smooth' });
              else navigate('/');
            }}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-300 group-hover:scale-105 transition-transform">
              <i className="fas fa-leaf text-white text-sm"></i>
            </div>
            <span className="text-lg font-extrabold text-white hidden sm:block tracking-tight">
              GROW<span className="text-emerald-400">SMART</span>
            </span>
          </button>

          {/* Center Search (desktop) */}
          <div className="hidden lg:flex items-center bg-white/8 rounded-xl px-4 py-2.5 flex-1 max-w-md border border-white/5 hover:border-white/15 focus-within:border-emerald-400/40 focus-within:bg-white/12 transition-all duration-300">
            <i className="fas fa-search text-white/40 text-sm mr-2.5"></i>
            <input
              type="text"
              placeholder="Search weather, crops, mandi..."
              className="bg-transparent text-white placeholder-white/40 text-sm outline-none flex-1 min-w-0"
              onFocus={() => toast('Search coming soon', { icon: '🔍' })}
              readOnly
            />
            <button
              onClick={() => toast('Voice search coming soon', { icon: '🎤' })}
              className="flex-shrink-0 flex items-center justify-center text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Voice search"
            >
              <i className="fas fa-microphone text-sm"></i>
            </button>
          </div>

          {/* Right: Nav + Language + Cart + Auth */}
          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
            {primaryNav.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isOnHomePage && activeSection === item.sectionId
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
              >
                <i className={`${item.icon} mr-1.5 text-xs`}></i>
                {item.name}
              </button>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all duration-300"
              >
                More <i className={`fas fa-chevron-down text-[10px] ml-1 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {isMoreOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-56 z-50 animate-fade-in-down">
                  {moreNav.map((item) => (
                    <button
                      key={item.sectionId}
                      onClick={() => { setIsMoreOpen(false); scrollToSection(item.sectionId); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 transition-all duration-200 ${
                        isOnHomePage && activeSection === item.sectionId
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                        isOnHomePage && activeSection === item.sectionId ? 'bg-emerald-100' : 'bg-gray-100'
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
              <i className="fas fa-globe text-white/50 text-xs"></i>
              <div id="google_translate_element"></div>
            </div>

            {/* Cart */}
            <NavLink
              to={ROUTES.CART}
              aria-label="View cart"
              className={({ isActive }) =>
                `relative p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'text-white bg-white/15' : 'text-white/60 hover:text-white hover:bg-white/8'}`
              }
            >
              <i className="fas fa-shopping-cart text-base"></i>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] rounded-full h-5 min-w-[20px] flex items-center justify-center font-bold px-1 shadow-lg shadow-red-500/30 animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/80 font-medium">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all duration-300">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => onOpenAuth && onOpenAuth('login')} className="px-4 py-2 text-sm font-medium border border-white/20 text-white rounded-xl hover:bg-white/8 transition-all duration-300">
                  Login
                </button>
                <button onClick={() => onOpenAuth && onOpenAuth('signup')} className="btn-modern px-4 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* MOBILE: Cart + Search + Hamburger */}
          <div className="flex lg:hidden items-center gap-1 flex-shrink-0">
            <NavLink to={ROUTES.CART} className="relative p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all">
              <i className="fas fa-shopping-cart text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full h-4 min-w-[16px] flex items-center justify-center font-bold px-0.5">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => toast('Search coming soon', { icon: '🔍' })}
              className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all"
              aria-label="Search"
            >
              <i className="fas fa-search text-lg"></i>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="p-2.5 text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-brand-800/95 backdrop-blur-xl border-t border-white/5 shadow-2xl">
          <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.sectionId}
                onClick={() => { setIsMenuOpen(false); scrollToSection(item.sectionId); }}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-base font-medium flex items-center gap-3 transition-all duration-300 ${
                  isOnHomePage && activeSection === item.sectionId
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                  isOnHomePage && activeSection === item.sectionId ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5'
                }`}>
                  <i className={item.icon}></i>
                </span>
                {item.name}
              </button>
            ))}
            <div className="border-t border-white/10 mt-3 pt-3">
              <div id="google_translate_element_mobile" className="mobile-translate-widget mb-3 px-4"></div>
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-white/80 font-medium">{user.name}</span>
                  </div>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/8 rounded-xl transition-colors">
                    <i className="fas fa-sign-out-alt mr-3"></i>Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-4">
                  <button onClick={() => { setIsMenuOpen(false); onOpenAuth && onOpenAuth('login'); }} className="block w-full py-3 border border-white/20 text-white rounded-xl text-center font-medium hover:bg-white/8 transition-all">
                    Login
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); onOpenAuth && onOpenAuth('signup'); }} className="block w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl text-center font-medium hover:shadow-lg transition-all">
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
