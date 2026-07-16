import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

const FOOTER_LINKS = [
  { name: 'Weather', sectionId: 'weather', icon: 'fas fa-cloud-sun' },
  { name: 'Crop Advisor', sectionId: 'crop-recommender', icon: 'fas fa-seedling' },
  { name: 'Disease Detection', sectionId: 'disease-detection', icon: 'fas fa-bug' },
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

  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="text-center pt-12 pb-8 border-b border-green-800/50">
          <div className="inline-flex items-center gap-2 mb-3">
            <i className="fas fa-leaf text-green-400 text-xl"></i>
            <span className="text-2xl font-bold">
              <span className="text-green-400">G</span>ROW<span className="text-green-400">S</span>MART
            </span>
          </div>
          <p className="text-green-300/70 text-sm max-w-md mx-auto">
            Empowering Indian farmers with smart technology — weather, crops, market, and government schemes.
          </p>
        </div>

        {/* 3-Column */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-green-800/50">
          <div>
            <h3 className="text-white font-bold text-base mb-5">Features</h3>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.sectionId}>
                  <button
                    onClick={() => scrollToSection(link.sectionId)}
                    className="text-green-300/70 hover:text-green-300 transition-colors text-left flex items-center gap-2"
                  >
                    <i className={`${link.icon} text-green-500/50 text-xs w-4 text-center`}></i>{link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-5">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-green-300/70"><i className="fas fa-envelope text-green-400 text-xs w-4 text-center"></i>support@growsmart.in</li>
              <li className="flex items-center gap-2.5 text-green-300/70"><i className="fas fa-phone text-green-400 text-xs w-4 text-center"></i>1800-180-1551</li>
              <li className="flex items-center gap-2.5 text-green-300/70"><i className="fas fa-map-marker-alt text-green-400 text-xs w-4 text-center"></i>Pune, Maharashtra</li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a href="https://facebook.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fab fa-facebook-f text-xs text-green-300"></i></a>
              <a href="https://twitter.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fab fa-twitter text-xs text-green-300"></i></a>
              <a href="https://instagram.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fab fa-instagram text-xs text-green-300"></i></a>
              <a href="https://youtube.com/@growsmart" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fab fa-youtube text-xs text-green-300"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-5">About</h3>
            <p className="text-sm text-green-300/70 leading-relaxed mb-5">
              GROWSMART bridges the gap between technology and Indian agriculture. Free, AI-powered, available in 12+ languages.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-800/40 rounded-full text-xs text-green-300/80">100% Free</span>
              <span className="px-3 py-1 bg-green-800/40 rounded-full text-xs text-green-300/80">Multi-Language</span>
              <span className="px-3 py-1 bg-green-800/40 rounded-full text-xs text-green-300/80">AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-5 text-center text-sm text-green-400/50">
          <p><i className="fas fa-leaf text-green-500 mr-1"></i> Made for Indian Farmers</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} GROWSMART. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
