import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

const FOOTER_LINKS = [
  { name: 'Live Mandi Prices', route: ROUTES.MANDI, icon: 'fas fa-store' },
  { name: 'Weather Forecast', route: ROUTES.WEATHER, icon: 'fas fa-cloud-sun' },
  { name: 'Crop Doctor', route: ROUTES.DISEASE, icon: 'fas fa-bug' },
  { name: 'Crop Advisor', route: ROUTES.CROPS, icon: 'fas fa-seedling' },
  { name: 'Govt Schemes', route: ROUTES.SCHEMES, icon: 'fas fa-landmark' },
  { name: 'Equipment Rental', route: ROUTES.EQUIPMENT, icon: 'fas fa-tractor' },
  { name: 'Farmer News', route: ROUTES.NEWS, icon: 'fas fa-newspaper' },
];

const GOVT_PORTALS = [
  { name: 'e-NAM (National Agri Market)', url: 'https://www.enam.gov.in/' },
  { name: 'Agmarknet (Mandi Price Portal)', url: 'https://agmarknet.gov.in/' },
  { name: 'PM-KISAN Samman Nidhi', url: 'https://pmkisan.gov.in/' },
  { name: 'IMD Mausam (Govt Weather)', url: 'https://mausam.imd.gov.in/' },
  { name: 'Soil Health Card Portal', url: 'https://soilhealth.dac.gov.in/' },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleFooterLink = (link: typeof FOOTER_LINKS[0]) => {
    navigate(link.route);
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#062c18] via-[#041f11] to-[#02130a] text-emerald-100 pb-20 lg:pb-0 overflow-hidden border-t border-emerald-500/20">
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10">
        {/* Top: Brand Banner + Kisan Helpline Card */}
        <div className="pb-12 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                <i className="fas fa-leaf text-base"></i>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                GROW<span className="text-emerald-400">SMART</span>
              </span>
            </div>
            <p className="text-emerald-100/75 text-sm max-w-lg leading-relaxed mb-4">
              Empowering Indian farmers with scientific AI advisory, hyper-local weather intelligence, live APMC mandi prices, and government welfare schemes.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-emerald-300">100% Free Forever</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-emerald-300">12+ Indian Languages</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-emerald-300">AI Powered</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-emerald-300">Farmer First</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-300/30 flex items-center justify-center text-lg flex-shrink-0">
                <i className="fas fa-phone-volume"></i>
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">National Kisan Call Center</h4>
                <p className="text-[11px] text-amber-300">Toll-Free Government Helpline</p>
              </div>
            </div>
            <p className="text-xs text-emerald-100/70 mb-3">
              Direct phone support from government agricultural experts available 6:00 AM to 10:00 PM in all major Indian languages.
            </p>
            <a
              href="tel:18001801551"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs hover:shadow-md transition-all"
            >
              <i className="fas fa-phone"></i> Call 1800-180-1551 (Toll-Free)
            </a>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10">
          {/* Features */}
          <div>
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <i className="fas fa-th-large text-emerald-400 text-xs"></i>
              Platform Tools
            </h3>
            <ul className="space-y-1">
              {FOOTER_LINKS.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleFooterLink(link)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-emerald-100/70 hover:text-white hover:bg-white/5 transition-all text-xs flex items-center gap-2.5"
                  >
                    <i className={`${link.icon} text-emerald-400 text-xs w-4`}></i>
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Govt Agri Portals */}
          <div>
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <i className="fas fa-building-columns text-emerald-400 text-xs"></i>
              Govt Agriculture Portals
            </h3>
            <ul className="space-y-2 text-xs">
              {GOVT_PORTALS.map((portal) => (
                <li key={portal.name}>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-100/70 hover:text-emerald-300 transition-colors flex items-center justify-between group py-1"
                  >
                    <span>{portal.name}</span>
                    <i className="fas fa-external-link-alt text-[10px] opacity-40 group-hover:opacity-100 transition-opacity"></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Mission */}
          <div>
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <i className="fas fa-circle-info text-emerald-400 text-xs"></i>
              Our Farmer-First Mission
            </h3>
            <p className="text-xs text-emerald-100/70 leading-relaxed mb-5">
              GrowSmart is built with a singular mission: put cutting-edge satellite, weather, and AI intelligence directly into the hands of Indian farmers to double farm incomes and reduce crop risk.
            </p>
            <div className="flex gap-2">
              {[
                { icon: 'fab fa-whatsapp', label: 'WhatsApp Agri Community' },
                { icon: 'fab fa-youtube', label: 'YouTube Farming Guides' },
                { icon: 'fab fa-telegram', label: 'Telegram Weather Alerts' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  title={s.label}
                  className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-emerald-500/20 hover:scale-105 transition-all text-emerald-200"
                >
                  <i className={`${s.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/50">
          <div className="flex items-center gap-2">
            <i className="fas fa-leaf text-emerald-400 text-xs"></i>
            <span>GROWSMART • Empowering Indian Agriculture</span>
          </div>
          <p>&copy; {new Date().getFullYear()} GROWSMART. All farmer tools free forever.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">Farmer Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
