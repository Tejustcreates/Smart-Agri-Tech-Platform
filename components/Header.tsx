import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { NAV_ITEMS, ROUTES } from '../constants';

declare global {
  interface Window {
    google: any;
  }
}

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navigate = useNavigate();
  const location = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
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

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isOnHomePage = location.pathname === ROUTES.HOME;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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
            <span className="text-lg font-bold text-green-700 hidden sm:block">GROWSMART</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isOnHomePage && activeSection === item.sectionId
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <i className={`${item.icon} mr-1.5 text-xs`} aria-hidden="true"></i>
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="translate-pill">
              <i className="fas fa-globe text-green-600 text-xs" aria-hidden="true"></i>
              <div id="google_translate_element"></div>
            </div>
            <NavLink
              to={ROUTES.CART}
              aria-label="View cart"
              className={({ isActive }) =>
                `relative p-2 rounded-lg transition-colors ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`
              }
            >
              <i className="fas fa-shopping-cart text-lg" aria-hidden="true"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </NavLink>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Hi, {user.name}</span>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink to={ROUTES.LOGIN} className="px-4 py-2 text-sm font-medium border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
                  Login
                </NavLink>
                <NavLink to={ROUTES.SIGNUP} className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-all">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <NavLink to={ROUTES.CART} aria-label="View cart" className="relative p-2 text-gray-600">
              <i className="fas fa-shopping-cart text-lg" aria-hidden="true"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className="p-2 text-gray-600 hover:text-green-600"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`} aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
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
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <i className={`${item.icon} mr-3 w-5 text-center`} aria-hidden="true"></i>
                {item.name}
              </button>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-3">
              <div id="google_translate_element_mobile" className="mobile-translate-widget mb-3 px-4"></div>
              {user ? (
                <div className="space-y-2">
                  <p className="px-4 text-sm text-gray-500">Hi, {user.name}</p>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                    <i className="fas fa-sign-out-alt mr-3" aria-hidden="true"></i>Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <NavLink to={ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 border border-green-600 text-green-600 rounded-lg text-center font-medium hover:bg-green-50">
                    Login
                  </NavLink>
                  <NavLink to={ROUTES.SIGNUP} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-green-600 text-white rounded-lg text-center font-medium hover:bg-green-700">
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
