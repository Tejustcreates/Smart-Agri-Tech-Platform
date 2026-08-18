import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { ROUTES } from '../constants';

interface BottomNavProps {
  user: User | null;
  onLogout: () => void;
  cartCount: number;
}

const NAV_ITEMS = [
  { to: ROUTES.HOME, icon: 'fas fa-home', label: 'Home', sectionId: undefined },
  { to: '/?scrollTo=weather', icon: 'fas fa-cloud-sun', label: 'Weather', sectionId: 'weather' },
  { to: '/?scrollTo=mandi', icon: 'fas fa-store', label: 'Mandi', sectionId: 'mandi' },
  { to: ROUTES.DASHBOARD, icon: 'fas fa-chart-line', label: 'Dashboard', sectionId: undefined },
  { to: ROUTES.CART, icon: 'fas fa-shopping-cart', label: 'Cart', badge: true, sectionId: undefined },
  { to: ROUTES.LOGIN, icon: 'fas fa-user', label: 'Login', authOnly: true, sectionId: undefined },
];

const BottomNav: React.FC<BottomNavProps> = ({ user, onLogout, cartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (item: typeof NAV_ITEMS[0]) => {
    if (item.sectionId) {
      navigate('/', { state: { scrollTo: item.sectionId } });
    } else if (item.authOnly && user) {
      onLogout();
      navigate('/');
    } else {
      navigate(item.to);
    }
  };

  const items = NAV_ITEMS.filter((item) => !item.authOnly || !user);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-brand-900/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-4px_30px_rgba(0,0,0,0.2)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-[68px] px-1">
        {items.map((item) => {
          const isHome = item.to === ROUTES.HOME && !item.sectionId;
          const isCart = item.badge;

          if (isHome) {
            return (
              <NavLink
                key="home"
                to={ROUTES.HOME}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[52px] rounded-xl transition-all duration-300 relative ${
                    isActive ? 'text-white' : 'text-white/45'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                      <i className={`${item.icon} text-xl`}></i>
                      {isActive && (
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"></span>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold leading-tight ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          }

          if (isCart) {
            return (
              <NavLink
                key="cart"
                to={ROUTES.CART}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[52px] rounded-xl transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-white/45'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                      <i className={`${item.icon} text-xl`}></i>
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[8px] rounded-full h-4 min-w-[16px] flex items-center justify-center font-bold px-0.5 shadow-lg shadow-red-500/30">
                          {cartCount}
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"></span>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold leading-tight ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          }

          const isActive = location.pathname === item.to;

          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[52px] rounded-xl transition-all duration-300 ${
                isActive ? 'text-white' : 'text-white/45'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-300`}>
                <i className={`${item.icon} text-xl`}></i>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"></span>
                )}
              </div>
              <span className={`text-[10px] font-semibold leading-tight ${isActive ? 'text-white' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area for iPhone */}
      <div className="h-[env(safe-area-inset-bottom)] bg-brand-900"></div>
    </nav>
  );
};

export default BottomNav;
