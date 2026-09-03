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
  { to: '/?scrollTo=mandi', icon: 'fas fa-store', label: 'Mandi', sectionId: 'mandi' },
  { to: '/?scrollTo=weather', icon: 'fas fa-cloud-sun', label: 'Weather', sectionId: 'weather' },
  { to: '/?scrollTo=disease-detection', icon: 'fas fa-bug', label: 'Doctor', sectionId: 'disease-detection' },
  { to: ROUTES.DASHBOARD, icon: 'fas fa-chart-line', label: 'Dashboard', sectionId: undefined },
  { to: ROUTES.CART, icon: 'fas fa-shopping-cart', label: 'Cart', badge: true, sectionId: undefined },
];

const BottomNav: React.FC<BottomNavProps> = ({ user, cartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (item: typeof NAV_ITEMS[0]) => {
    if (item.sectionId) {
      navigate('/', { state: { scrollTo: item.sectionId } });
    } else {
      navigate(item.to);
    }
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#052615]/98 backdrop-blur-2xl border-t border-emerald-500/20 shadow-[0_-8px_32px_rgba(0,0,0,0.35)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-[64px] px-1 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isHome = item.to === ROUTES.HOME && !item.sectionId;
          const isCart = item.badge;
          const isDashboard = item.to === ROUTES.DASHBOARD;

          if (isHome) {
            return (
              <NavLink
                key="home"
                to={ROUTES.HOME}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[48px] rounded-xl transition-all duration-200 relative ${
                    isActive ? 'text-emerald-400 font-bold' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                      <i className={`${item.icon} text-lg`}></i>
                      {isActive && (
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          }

          if (isDashboard) {
            return (
              <NavLink
                key="dashboard"
                to={ROUTES.DASHBOARD}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[48px] rounded-xl transition-all duration-200 relative ${
                    isActive ? 'text-emerald-400 font-bold' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                      <i className={`${item.icon} text-lg`}></i>
                      {isActive && (
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
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
                  `relative flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[48px] rounded-xl transition-all duration-200 ${
                    isActive ? 'text-emerald-400 font-bold' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                      <i className={`${item.icon} text-lg`}></i>
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 text-[9px] rounded-full h-4 min-w-[16px] flex items-center justify-center font-black px-0.5 shadow-md">
                          {cartCount}
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[48px] rounded-xl transition-all duration-200 text-white/60 hover:text-white"
            >
              <div className="relative transition-transform duration-200">
                <i className={`${item.icon} text-lg`}></i>
              </div>
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area for iPhone */}
      <div className="h-[env(safe-area-inset-bottom)] bg-[#052615]"></div>
    </nav>
  );
};

export default BottomNav;
