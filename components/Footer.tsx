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
    if ('route' in link && link.route) navigate(link.route);
    else if ('sectionId' in link && link.sectionId) scrollToSection(link.sectionId);
  };

  return (
    <footer className="relative bg-gradient-to-b from-brand-900 via-brand-900 to-emerald-950 text-brand-100 pb-20 lg:pb-0 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-[150px] opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full filter blur-[150px] opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10">
        {/* Top: Brand + Newsletter */}
        <div className="text-center pb-10 border-b border-white/10">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <i className="fas fa-leaf text-white text-lg"></i>
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              GROW<span className="text-emerald-400">SMART</span>
            </span>
          </div>
          <p className="text-brand-300/60 text-sm max-w-md mx-auto mb-8">
            Empowering Indian farmers with smart technology — weather, crops, market, and government schemes.
          </p>

          {/* Newsletter-style CTA */}
          <div className="max-w-md mx-auto flex gap-2">
            <div className="flex-1 flex items-center bg-white/8 rounded-xl px-4 py-3 border border-white/10 hover:border-emerald-400/30 transition-colors">
              <i className="fas fa-envelope text-white/30 text-sm mr-3"></i>
              <span className="text-white/30 text-sm">Get farming tips via email</span>
            </div>
            <button className="btn-modern px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/10">
          {/* Features */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <i className="fas fa-th-large text-emerald-400 text-xs"></i>
              </span>
              Features
            </h3>
            <ul className="space-y-1">
              {FOOTER_LINKS.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleFooterLink(link)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-brand-300/60 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm flex items-center gap-3 group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                      <i className={`${link.icon} text-xs group-hover:text-emerald-400 transition-colors`}></i>
                    </span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <i className="fas fa-headset text-emerald-400 text-xs"></i>
              </span>
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group cursor-pointer">
                <span className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-emerald-500/15 flex items-center justify-center transition-colors">
                  <i className="fas fa-envelope text-emerald-400/70 text-xs"></i>
                </span>
                support@growsmart.in
              </li>
              <li className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group cursor-pointer">
                <span className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-emerald-500/15 flex items-center justify-center transition-colors">
                  <i className="fas fa-phone text-emerald-400/70 text-xs"></i>
                </span>
                1800-180-1551
              </li>
              <li className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group cursor-pointer">
                <span className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-emerald-500/15 flex items-center justify-center transition-colors">
                  <i className="fas fa-map-marker-alt text-emerald-400/70 text-xs"></i>
                </span>
                Pune, Maharashtra
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex gap-2.5 mt-6">
              {[
                { icon: 'fab fa-facebook-f', label: 'Facebook' },
                { icon: 'fab fa-twitter', label: 'Twitter' },
                { icon: 'fab fa-instagram', label: 'Instagram' },
                { icon: 'fab fa-youtube', label: 'YouTube' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-emerald-500/20 hover:scale-110 transition-all duration-300 group"
                >
                  <i className={`${s.icon} text-white/50 text-sm group-hover:text-emerald-400 transition-colors`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <i className="fas fa-info-circle text-emerald-400 text-xs"></i>
              </span>
              About
            </h3>
            <p className="text-sm text-brand-300/60 leading-relaxed mb-6">
              GROWSMART bridges the gap between technology and Indian agriculture. Free, AI-powered, available in 12+ languages. Built with love for every Indian farmer.
            </p>
            <div className="flex flex-wrap gap-2">
              {['100% Free', 'Multi-Language', 'AI-Powered', 'Open Source'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white/50 border border-white/5 hover:border-emerald-400/20 hover:text-emerald-300/70 transition-all duration-300 cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <i className="fas fa-leaf text-emerald-400 text-xs"></i>
            <span>Made for Indian Farmers</span>
          </div>
          <p>&copy; {new Date().getFullYear()} GROWSMART. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
