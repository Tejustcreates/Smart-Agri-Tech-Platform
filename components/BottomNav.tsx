import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { NAV_ITEMS, ROUTES } from '../constants';

interface BottomNavProps {
  cartCount: number;
}

const BOTTOM_NAV_ROUTES = [ROUTES.HOME, ROUTES.MANDI, ROUTES.WEATHER, ROUTES.DISEASE, ROUTES.DASHBOARD];

const BottomNav: React.FC<BottomNavProps> = ({ cartCount }) => {
  const items = NAV_ITEMS.filter((item) => BOTTOM_NAV_ROUTES.includes(item.route as any));

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#052615]/98 backdrop-blur-2xl border-t border-emerald-500/20 shadow-[0_-8px_32px_rgba(0,0,0,0.35)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-[64px] px-1 max-w-lg mx-auto">
        {items.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            end={item.route === ROUTES.HOME}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[48px] rounded-xl transition-all duration-200 relative ${
                isActive ? 'text-emerald-400 font-bold' : 'text-white/60 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
        <NavLink
          to={ROUTES.CART}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[48px] rounded-xl transition-all duration-200 relative ${
              isActive ? 'text-emerald-400 font-bold' : 'text-white/60 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                <ShoppingCart size={20} strokeWidth={isActive ? 2.5 : 2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 text-[9px] rounded-full h-4 min-w-[16px] flex items-center justify-center font-black px-0.5 shadow-md">
                    {cartCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight">Cart</span>
            </>
          )}
        </NavLink>
      </div>
      {/* Safe area for iPhone */}
      <div className="h-[env(safe-area-inset-bottom)] bg-[#052615]"></div>
    </nav>
  );
};

export default BottomNav;
