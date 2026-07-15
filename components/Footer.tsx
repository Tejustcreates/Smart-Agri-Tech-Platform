
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-gradient-to-b from-green-900 to-green-950 text-green-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Row 1: Brand + Tagline */}
        <div className="text-center pt-16 pb-10 border-b border-green-800/50">
          <div className="inline-flex items-center gap-2 mb-4">
            <i className="fas fa-leaf text-green-400 text-2xl"></i>
            <h1 className="text-3xl font-bold">
              <span className="text-green-400">G</span>ROW
              <span className="text-green-400">S</span>MART
            </h1>
          </div>
          <p className="text-green-300/70 text-sm max-w-md mx-auto leading-relaxed">
            A complete digital platform for Indian farmers — weather intelligence, crop advisory, live mandi prices, and government schemes, all in one place.
          </p>
        </div>

        {/* Row 2: Quick Links */}
        <div className="py-10 border-b border-green-800/50">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            <a href="#about" className="text-green-300/70 hover:text-green-300 transition-colors duration-300">About</a>
            <a href="#weather" className="text-green-300/70 hover:text-green-300 transition-colors duration-300">Weather</a>
            <a href="#crop-recommender" className="text-green-300/70 hover:text-green-300 transition-colors duration-300">Crop Advisor</a>
            <a href="#disease-detection" className="text-green-300/70 hover:text-green-300 transition-colors duration-300">Disease Detection</a>
            <a href="#news" className="text-green-300/70 hover:text-green-300 transition-colors duration-300">News</a>
            <a href="#schemes" className="text-green-300/70 hover:text-green-300 transition-colors duration-300">Schemes</a>
            <a href="#mandi" className="text-green-300/70 hover:text-green-300 transition-colors duration-300">Mandi</a>
            <a href="#equipment-recommender" className="text-green-300/70 hover:text-green-300 transition-colors duration-300">Equipment Rental</a>
          </div>
        </div>

        {/* Row 3: Contact + Social */}
        <div className="py-10 border-b border-green-800/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-green-300/70">
            <span><i className="fas fa-envelope mr-2 text-green-400"></i>support@growsmart.in</span>
            <span><i className="fas fa-phone mr-2 text-green-400"></i>1800-180-1551 (Toll Free)</span>
            <span><i className="fas fa-map-marker-alt mr-2 text-green-400"></i>Pune, Maharashtra, India</span>
          </div>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" aria-label="Facebook">
              <i className="fab fa-facebook-f text-sm text-green-300"></i>
            </a>
            <a href="#" className="w-9 h-9 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" aria-label="Twitter">
              <i className="fab fa-twitter text-sm text-green-300"></i>
            </a>
            <a href="#" className="w-9 h-9 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" aria-label="Instagram">
              <i className="fab fa-instagram text-sm text-green-300"></i>
            </a>
            <a href="#" className="w-9 h-9 bg-green-800/50 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" aria-label="YouTube">
              <i className="fab fa-youtube text-sm text-green-300"></i>
            </a>
          </div>
        </div>

        {/* Row 4: Copyright */}
        <div className="py-6 text-center text-sm text-green-400/50">
          <p><i className="fas fa-leaf text-green-500 mr-1"></i> Made for Indian Farmers</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} GROWSMART. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
