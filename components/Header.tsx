import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown, Button, type MenuProps } from 'antd';
import {
  Search, X, ChevronDown, Globe, PhoneCall, Menu as MenuIcon, LogOut, ShoppingCart,
  Store, CloudSun, Bug, Sprout, Landmark, Tractor, Newspaper,
} from 'lucide-react';
import { User } from '../types';
import { NAV_ITEMS, ROUTES } from '../constants';

declare global {
  interface Window {
    google: any;
  }
}

const PRIMARY_NAV_ROUTES = [ROUTES.HOME, ROUTES.MANDI, ROUTES.WEATHER, ROUTES.DISEASE];

const SEARCH_SUGGESTIONS = [
  { label: 'Live Mandi Prices', subtext: 'Check latest market rates & nearby APMCs', route: ROUTES.MANDI, icon: Store, keywords: ['mandi', 'price', 'rate', 'bhav', 'market', 'onion', 'soybean', 'wheat', 'cotton'] },
  { label: 'Weather Forecast & Rain Alert', subtext: 'Rain forecast, humidity & spray advisory', route: ROUTES.WEATHER, icon: CloudSun, keywords: ['weather', 'rain', 'temperature', 'forecast', 'monsoon', 'barish', 'havaman'] },
  { label: 'Crop Doctor (Disease Detection)', subtext: 'Identify plant diseases & remedies', route: ROUTES.DISEASE, icon: Bug, keywords: ['disease', 'doctor', 'leaf', 'blight', 'pest', 'fungus', 'cure', 'spray', 'keeda'] },
  { label: 'Crop Advisor & Soil Recommendations', subtext: 'Smart crop selection by soil & season', route: ROUTES.CROPS, icon: Sprout, keywords: ['crop', 'advisor', 'soil', 'yield', 'sowing', 'npk', 'fertilizer', 'seed'] },
  { label: 'Govt Schemes & PM-KISAN', subtext: 'Check eligibility & application steps', route: ROUTES.SCHEMES, icon: Landmark, keywords: ['scheme', 'yojana', 'pm-kisan', 'subsidy', 'loan', 'insurance', 'kcc', 'grant'] },
  { label: 'Farm Equipment Rental', subtext: 'Rent tractors, harvesters & sprayers', route: ROUTES.EQUIPMENT, icon: Tractor, keywords: ['equipment', 'tractor', 'rental', 'rent', 'tools', 'harvester', 'spray pump'] },
  { label: 'Farmer News & MSP Alerts', subtext: 'Daily updates on MSP and policies', route: ROUTES.NEWS, icon: Newspaper, keywords: ['news', 'msp', 'updates', 'articles', 'agri', 'batmya'] },
];

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  cartCount: number;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, cartCount, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = useCallback((route: string) => {
    setIsMenuOpen(false);
    setSearchQuery('');
    navigate(route);
  }, [navigate]);

  const isRouteActive = useCallback((route: string) => {
    if (route === ROUTES.HOME) return location.pathname === ROUTES.HOME;
    return location.pathname.startsWith(route);
  }, [location.pathname]);

  useEffect(() => {
    const initMobileWidget = () => {
      const mobileEl = document.getElementById('google_translate_element_mobile');
      if (window.google?.translate && mobileEl && mobileEl.childElementCount === 0) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,hi,bn,te,mr,ta,gu,kn,ml,pa,ur,or', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element_mobile'
        );
        return true;
      }
      return false;
    };
    const maxAttempts = 25;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (initMobileWidget() || attempts >= maxAttempts) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => { onLogout(); navigate('/'); };
  const isOnHomePage = location.pathname === ROUTES.HOME;
  const primaryNav = NAV_ITEMS.filter((item) => PRIMARY_NAV_ROUTES.includes(item.route as any));
  const moreNav = NAV_ITEMS.filter((item) => !PRIMARY_NAV_ROUTES.includes(item.route as any));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SEARCH_SUGGESTIONS;
    return SEARCH_SUGGESTIONS.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.subtext.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
    );
  }, [searchQuery]);

  const moreMenuItems: MenuProps['items'] = moreNav.map((item) => ({
    key: item.route,
    label: item.name,
    icon: <item.icon size={14} />,
  }));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-[#062c18]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border-b border-emerald-500/20'
      : 'bg-[#07361d] border-b border-emerald-600/20 shadow-md'
      }`}>
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
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
              <Sprout size={20} className="text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black text-white tracking-tight flex items-center gap-1">
                GROW<span className="text-emerald-400">SMART</span>
              </div>
              <span className="text-[10px] text-emerald-200/70 font-semibold tracking-wider uppercase block sm:hidden md:block">Agri-Platform</span>
            </div>
          </button>

          {/* Center Interactive Quick Search (desktop) */}
          <div ref={searchRef} className="hidden lg:block relative flex-1 min-w-96 max-w-md xl:max-w-lg">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10" />
              <input
                type="text"
                aria-label="Search features and tools"
                placeholder="Search mandi, weather, crop doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchOptions.length > 0) {
                    navigateTo(searchOptions[0].route);
                  }
                  if (e.key === 'Escape') setSearchFocused(false);
                }}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                className="header-search-input w-full rounded-2xl pl-11 pr-10 py-3 border border-white/15 hover:border-emerald-400/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder-white/50 text-sm font-medium outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-sm p-1 z-10"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a1f12]/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 max-h-80 overflow-y-auto">
                {searchOptions.length > 0 ? (
                  searchOptions.map((item) => (
                    <button
                      key={item.route}
                      onClick={() => navigateTo(item.route)}
                      className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-emerald-500/15 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon size={14} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">{item.label}</p>
                        <p className="text-[11px] text-emerald-200/60">{item.subtext}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-emerald-200/50">
                    No matching tools found.
                  </div>
                )}
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
              <PhoneCall size={13} className="text-amber-400" />
              <span>Helpline: 1800-180-1551</span>
            </a>

            {primaryNav.map((item) => (
              <NavLink
                key={item.route}
                to={item.route}
                end={item.route === ROUTES.HOME}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${isActive
                    ? 'bg-white/20 text-white font-bold shadow-sm ring-1 ring-white/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon size={13} />
                {item.name}
              </NavLink>
            ))}

            {/* More dropdown */}
            <Dropdown
              trigger={['click']}
              menu={{ items: moreMenuItems, onClick: ({ key }) => navigateTo(key) }}
              overlayClassName="header-more-dropdown"
            >
              <button className="px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center gap-1">
                <span>More Tools</span>
                <ChevronDown size={11} />
              </button>
            </Dropdown>

            {/* Language pill */}
            <div className="translate-pill ml-1">
              <Globe size={13} className="text-white/70" />
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
              <ShoppingCart size={15} />
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
                <Button type="text" onClick={handleLogout} className="!text-white/70 hover:!text-white !text-xs !font-semibold !px-3 !h-auto !py-1.5">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Button onClick={() => onOpenAuth && onOpenAuth('login')} className="!border-white/25 !text-white !bg-transparent !text-xs !font-bold !h-auto !py-1.5 hover:!bg-white/10">
                  Login
                </Button>
                <Button type="primary" onClick={() => onOpenAuth && onOpenAuth('signup')} className="btn-modern !text-xs !font-bold !h-auto !py-1.5 !bg-gradient-to-r !from-emerald-400 !to-green-500 !text-slate-950 !border-0 hover:!shadow-lg hover:!shadow-emerald-500/25">
                  Sign Up
                </Button>
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
              <PhoneCall size={15} />
            </a>
            <NavLink to={ROUTES.CART} className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10">
              <ShoppingCart size={17} />
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
              {isMenuOpen ? <X size={19} /> : <MenuIcon size={19} />}
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
                <PhoneCall size={16} className="text-amber-400" />
                <div>
                  <div className="text-white font-black">Kisan Call Center</div>
                  <div className="text-[11px] text-amber-300/80">Toll-Free Helpline: 1800-180-1551</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-amber-400 text-slate-950 text-[10px] font-black">CALL NOW</span>
            </a>

            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.route}
                to={item.route}
                end={item.route === ROUTES.HOME}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${isActive ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-white/10 text-white/80'
                      }`}>
                      <item.icon size={14} />
                    </span>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
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
                    <LogOut size={13} /> Logout
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
