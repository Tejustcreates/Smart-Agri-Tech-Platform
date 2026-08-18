import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

const FOOTER_LINKS = [
  { name: 'Weather', sectionId: 'weather', icon: 'fas fa-cloud-sun' },
  { name: 'Crop Advisor', sectionId: 'crop-recommender', icon: 'fas fa-seedling' },
  { name: 'Disease Detection', sectionId: 'disease-detection', icon: 'fas fa-bug' },
  { name: 'Dashboard', route: '/dashboard', icon: 'fas fa-chart-line' },
  { name: 'Smart Mandi', sectionId: 'mandi', icon: 'fas fa-store' },
  { name: 'Govt Schemes', sectionId: 'schemes', icon: 'fas fa-landmark' },
  { name: 'Equipment Rental', sectionId: 'equipment-recommender', icon: 'fas fa-tractor' },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME, { state: { scrollTo: sectionId } });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFooterLink = (link: typeof FOOTER_LINKS[0]) => {
    if ('route' in link && link.route) {
      navigate(link.route);
    } else if ('sectionId' in link && link.sectionId) {
      scrollToSection(link.sectionId);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-brand-900 to-brand-900 text-brand-100 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Brand */}
        <div className="text-center pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2 mb-3">
            <i className="fas fa-leaf text-brand-400 text-xl"></i>
            <span className="text-2xl font-bold">
              <span className="text-brand-400">G</span>ROW<span className="text-brand-400">S</span>MART
            </span>
          </div>
          <p className="text-brand-300/70 text-sm max-w-md mx-auto">
            Empowering Indian farmers with smart technology — weather, crops, market, and government schemes.
          </p>
        </div>

        {/* 3-Column */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10">
          <div>
            <h3 className="text-white font-bold text-base mb-5">Features</h3>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleFooterLink(link)}
                    className="text-brand-300/70 hover:text-brand-300 transition-colors text-left flex items-center gap-2"
                  >
                    <i className={`${link.icon} text-brand-400 text-xs w-4 text-center`}></i>{link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-5">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-white/70"><i className="fas fa-envelope text-brand-400 text-xs w-4 text-center"></i>support@growsmart.in</li>
              <li className="flex items-center gap-2.5 text-white/70"><i className="fas fa-phone text-brand-400 text-xs w-4 text-center"></i>1800-180-1551</li>
              <li className="flex items-center gap-2.5 text-white/70"><i className="fas fa-map-marker-alt text-brand-400 text-xs w-4 text-center"></i>Pune, Maharashtra</li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a href="https://facebook.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"><i className="fab fa-facebook-f text-xs text-white/80"></i></a>
              <a href="https://twitter.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"><i className="fab fa-twitter text-xs text-white/80"></i></a>
              <a href="https://instagram.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"><i className="fab fa-instagram text-xs text-white/80"></i></a>
              <a href="https://youtube.com/@growsmart" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors"><i className="fab fa-youtube text-xs text-white/80"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-5">About</h3>
            <p className="text-sm text-brand-300/70 leading-relaxed mb-5">
              GROWSMART bridges the gap between technology and Indian agriculture. Free, AI-powered, available in 12+ languages.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">100% Free</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">Multi-Language</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-5 text-center text-sm text-white/40">
          <p><i className="fas fa-leaf text-brand-400 mr-1"></i> Made for Indian Farmers</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} GROWSMART. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
