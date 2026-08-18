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
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navigate = useNavigate();
  const location = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);

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
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname !== ROUTES.HOME) return;

    const sectionIds = NAV_ITEMS.map((item) => item.sectionId);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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
      if (window.google?.translate) {
        initGoogleTranslate();
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isOnHomePage = location.pathname === ROUTES.HOME;

  const primaryNav = NAV_ITEMS.filter((item) => PRIMARY_NAV.includes(item.sectionId));
  const moreNav = NAV_ITEMS.filter((item) => !PRIMARY_NAV.includes(item.sectionId));

  return (
    <header className="bg-brand-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* LEFT ZONE: Logo + Wordmark */}
          <button
            onClick={() => {
              if (isOnHomePage) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <img className="h-10 w-auto" src="./img/logo.png" alt="GROWSMART" />
            <span className="text-lg font-bold text-white hidden sm:block">GROWSMART</span>
          </button>

          {/* CENTER ZONE: Search + Mic Pill (desktop only) */}
          <div className="hidden lg:flex items-center bg-white/10 rounded-full px-4 py-2 flex-1 max-w-md">
            <i className="fas fa-search text-white/50 text-sm mr-2" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search weather, crops, mandi..."
              className="bg-transparent text-white placeholder-white/50 text-sm outline-none flex-1 min-w-0"
              onFocus={() => toast('Search coming soon', { icon: '🔍' })}
              readOnly
            />
            <button
              onClick={() => toast('Voice search coming soon', { icon: '🎤' })}
              className="flex-shrink-0 flex items-center justify-center text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Voice search"
            >
              <i className="fas fa-microphone text-sm"></i>
            </button>
          </div>

          {/* RIGHT ZONE: Nav + Language + Cart + Auth */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {/* Primary nav links */}
            {primaryNav.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isOnHomePage && activeSection === item.sectionId
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <i className={`${item.icon} mr-1.5 text-xs`} aria-hidden="true"></i>
                {item.name}
              </button>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                More <i className={`fas fa-chevron-down text-xs ml-1 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {isMoreOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 w-52 z-50">
                  {moreNav.map((item) => (
                    <button
                      key={item.sectionId}
                      onClick={() => { setIsMoreOpen(false); scrollToSection(item.sectionId); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors ${
                        isOnHomePage && activeSection === item.sectionId
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`${item.icon} w-5 text-center text-xs`} aria-hidden="true"></i>
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language pill */}
            <div className="translate-pill ml-1">
              <i className="fas fa-globe text-brand-400 text-xs" aria-hidden="true"></i>
              <div id="google_translate_element"></div>
            </div>

            {/* Cart */}
            <NavLink
              to={ROUTES.CART}
              aria-label="View cart"
              className={({ isActive }) =>
                `relative p-2 rounded-lg transition-colors ${isActive ? 'text-white bg-white/20' : 'text-white/70 hover:text-white hover:bg-white/10'}`
              }
            >
              <i className="fas fa-shopping-cart text-lg" aria-hidden="true"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80">Hi, {user.name}</span>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink to={ROUTES.LOGIN} className="px-4 py-2 text-sm font-medium border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all">
                  Login
                </NavLink>
                <NavLink to={ROUTES.SIGNUP} className="px-4 py-2 text-sm font-medium bg-brand-400 text-white rounded-lg hover:bg-brand-200 shadow-sm transition-all">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* MOBILE: Search icon + Hamburger */}
          <div className="flex lg:hidden items-center gap-1 flex-shrink-0">
            <button
              onClick={() => toast('Search coming soon', { icon: '🔍' })}
              className="p-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <i className="fas fa-search text-lg" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`} aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-brand-800 border-t border-white/10 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToSection(item.sectionId);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isOnHomePage && activeSection === item.sectionId
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <i className={`${item.icon} mr-3 w-5 text-center`} aria-hidden="true"></i>
                {item.name}
              </button>
            ))}
            <div className="border-t border-white/10 mt-2 pt-3">
              <div id="google_translate_element_mobile" className="mobile-translate-widget mb-3 px-4"></div>
              {user ? (
                <div className="space-y-2">
                  <p className="px-4 text-sm text-white/50">Hi, {user.name}</p>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 rounded-lg">
                    <i className="fas fa-sign-out-alt mr-3" aria-hidden="true"></i>Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <NavLink to={ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 border border-white/30 text-white rounded-lg text-center font-medium hover:bg-white/10">
                    Login
                  </NavLink>
                  <NavLink to={ROUTES.SIGNUP} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-brand-400 text-white rounded-lg text-center font-medium hover:bg-brand-200">
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
