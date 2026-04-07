import React, { useState, useEffect } from 'react';
import { Section, User } from '../types';
import { NAV_ITEMS } from '../constants';

// Add global declaration for TypeScript to recognize the Google Translate object
declare global {
    interface Window {
        google: any;
    }
}

interface HeaderProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  user: User | null;
  onLogout: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, user, onLogout, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const initGoogleTranslate = () => {
      const googleTranslateElement = document.getElementById('google_translate_element');
      // Ensure the element exists and is empty before initializing
      if (window.google && googleTranslateElement && googleTranslateElement.childElementCount === 0) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,te,mr,ta,gu,kn,ml,pa,ur,or',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      }
    };

    if (user) {
      if (window.google) {
        initGoogleTranslate();
      } else {
        setTimeout(initGoogleTranslate, 500);
      }
    }
  }, [user]);

  const handleLinkClick = (section: Section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  const AuthButtons: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
    const baseClasses = isMobile ? 'block px-3 py-2 rounded-md text-base font-medium' : 'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300';

    if (user) {
      return (
        <div className={isMobile ? 'space-y-1' : 'flex items-center space-x-4'}>
          <span className={`${baseClasses} text-gray-700`}>Welcome, {user.name}</span>
          <div id="google_translate_element" className={isMobile ? 'py-2 px-3' : ''}></div>
          <button
            onClick={() => handleLinkClick(Section.CART)}
            className="relative text-gray-700 hover:text-green-600 transition-colors"
            aria-label="Open Shopping Cart"
          >
            <i className="fas fa-shopping-cart fa-lg"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { onLogout(); setIsMenuOpen(false); }}
            className={`${baseClasses} text-gray-700 hover:bg-green-500 hover:text-white`}
          >
            Logout
          </button>
        </div>
      );
    }
    return (
      <div className={isMobile ? 'space-y-1' : 'flex items-baseline space-x-2'}>
        <button
          onClick={() => handleLinkClick(Section.LOGIN)}
          className={`${baseClasses} text-gray-700 hover:bg-green-500 hover:text-white`}
        >
          Login
        </button>
        <button
          onClick={() => handleLinkClick(Section.SIGNUP)}
          className={`${baseClasses} bg-green-600 text-white hover:bg-green-700`}
        >
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <header className="bg-lime-50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(Section.HERO);}} className="flex items-center transition-transform duration-300 hover:scale-105">
              <img className="h-16 w-auto" src="https://i.ibb.co/3sZpYkX/logo.png" alt="GROWSMART Logo" />
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.section}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.section);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    activeSection === item.section
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-green-500 hover:text-white'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <AuthButtons />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-green-600 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <i className="fas fa-times h-6 w-6"></i>
              ) : (
                <i className="fas fa-bars h-6 w-6"></i>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={`#${item.section}`}
                onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.section);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === item.section
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-green-500 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
             <div className="border-t border-gray-200 mt-2 pt-2">
                <AuthButtons isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;