import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

const Footer: React.FC = () => {
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
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-green-800/50">
          <div>
            <h3 className="text-white font-bold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to={ROUTES.WEATHER} className="text-green-300/70 hover:text-green-300 transition-colors"><i className="fas fa-cloud-sun mr-2 text-green-500/50"></i>Weather</Link></li>
              <li><Link to={ROUTES.CROP_ADVISOR} className="text-green-300/70 hover:text-green-300 transition-colors"><i className="fas fa-seedling mr-2 text-green-500/50"></i>Crop Advisor</Link></li>
              <li><Link to={ROUTES.DISEASE_DETECTION} className="text-green-300/70 hover:text-green-300 transition-colors"><i className="fas fa-bug mr-2 text-green-500/50"></i>Disease Detection</Link></li>
              <li><Link to={ROUTES.MANDI} className="text-green-300/70 hover:text-green-300 transition-colors"><i className="fas fa-store mr-2 text-green-500/50"></i>Smart Mandi</Link></li>
              <li><Link to={ROUTES.SCHEMES} className="text-green-300/70 hover:text-green-300 transition-colors"><i className="fas fa-landmark mr-2 text-green-500/50"></i>Govt Schemes</Link></li>
              <li><Link to={ROUTES.EQUIPMENT} className="text-green-300/70 hover:text-green-300 transition-colors"><i className="fas fa-tractor mr-2 text-green-500/50"></i>Equipment Rental</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-green-300/70"><i className="fas fa-envelope text-green-400"></i>support@growsmart.in</li>
              <li className="flex items-center gap-2 text-green-300/70"><i className="fas fa-phone text-green-400"></i>1800-180-1551</li>
              <li className="flex items-center gap-2 text-green-300/70"><i className="fas fa-map-marker-alt text-green-400"></i>Pune, Maharashtra</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="https://facebook.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fab fa-facebook-f text-xs text-green-300"></i></a>
              <a href="https://twitter.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fab fa-twitter text-xs text-green-300"></i></a>
              <a href="https://instagram.com/growsmart" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fab fa-instagram text-xs text-green-300"></i></a>
              <a href="https://youtube.com/@growsmart" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fab fa-youtube text-xs text-green-300"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">About</h3>
            <p className="text-sm text-green-300/70 leading-relaxed mb-4">
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
