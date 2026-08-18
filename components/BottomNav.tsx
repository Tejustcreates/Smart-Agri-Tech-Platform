import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { ROUTES } from '../constants';

interface BottomNavProps {
  user: User | null;
  onLogout: () => void;
  cartCount: number;
}

const NAV_ITEMS = [
  { to: ROUTES.HOME, icon: 'fas fa-home', label: 'Home' },
  { to: '/?scrollTo=weather', icon: 'fas fa-cloud-sun', label: 'Weather', sectionId: 'weather' },
  { to: '/?scrollTo=mandi', icon: 'fas fa-store', label: 'Mandi', sectionId: 'mandi' },
  { to: ROUTES.DASHBOARD, icon: 'fas fa-chart-line', label: 'Dashboard' },
  { to: ROUTES.CART, icon: 'fas fa-shopping-cart', label: 'Cart', badge: true },
  { to: ROUTES.LOGIN, icon: 'fas fa-user', label: 'Login', authOnly: true },
];

const BottomNav: React.FC<BottomNavProps> = ({ user, onLogout, cartCount }) => {
  const navigate = useNavigate();

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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-brand-900 border-t border-white/10 shadow-[0_-2px_10px_rgba(0,0,0,0.15)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {items.map((item) => {
          const isHome = item.to === ROUTES.HOME;
          const isCart = item.badge;

          if (isHome) {
            return (
              <NavLink
                key="home"
                to={ROUTES.HOME}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 flex-1 py-1 min-h-[48px] rounded-lg transition-colors ${
                    isActive ? 'text-white' : 'text-white/60'
                  }`
                }
              >
                <i className={`${item.icon} text-lg`} aria-hidden="true"></i>
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </NavLink>
            );
          }

          if (isCart) {
            return (
              <NavLink
                key="cart"
                to={ROUTES.CART}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 min-h-[48px] rounded-lg transition-colors ${
                    isActive ? 'text-white' : 'text-white/60'
                  }`
                }
              >
                <i className={`${item.icon} text-lg`} aria-hidden="true"></i>
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-[calc(50%-18px)] bg-red-500 text-white text-[9px] rounded-full h-4 min-w-[16px] flex items-center justify-center font-bold px-1">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 min-h-[48px] rounded-lg text-white/60 transition-colors"
            >
              <i className={`${item.icon} text-lg`} aria-hidden="true"></i>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
