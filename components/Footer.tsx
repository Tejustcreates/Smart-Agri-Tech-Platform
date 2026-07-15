
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Row 1: Brand + Tagline */}
        <div className="text-center pt-16 pb-10 border-b border-gray-800">
          <h1 className="text-3xl font-bold mb-3">
            <span className="text-green-500">G</span>ROW
            <span className="text-green-500">S</span>MART
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            A complete digital platform for Indian farmers — weather intelligence, crop advisory, live mandi prices, and government schemes, all in one place.
          </p>
        </div>

        {/* Row 2: Quick Links */}
        <div className="py-10 border-b border-gray-800">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            <a href="#about" className="hover:text-green-400 transition-colors duration-300">About</a>
            <a href="#weather" className="hover:text-green-400 transition-colors duration-300">Weather</a>
            <a href="#crop-recommender" className="hover:text-green-400 transition-colors duration-300">Crop Advisor</a>
            <a href="#disease-detection" className="hover:text-green-400 transition-colors duration-300">Disease Detection</a>
            <a href="#news" className="hover:text-green-400 transition-colors duration-300">News</a>
            <a href="#schemes" className="hover:text-green-400 transition-colors duration-300">Schemes</a>
            <a href="#mandi" className="hover:text-green-400 transition-colors duration-300">Mandi</a>
            <a href="#equipment-recommender" className="hover:text-green-400 transition-colors duration-300">Equipment Rental</a>
          </div>
        </div>

        {/* Row 3: Contact + Social */}
        <div className="py-10 border-b border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span><i className="fas fa-envelope mr-2 text-green-500"></i>support@growsmart.in</span>
            <span><i className="fas fa-phone mr-2 text-green-500"></i>1800-180-1551 (Toll Free)</span>
            <span><i className="fas fa-map-marker-alt mr-2 text-green-500"></i>Pune, Maharashtra, India</span>
          </div>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" aria-label="Facebook">
              <i className="fab fa-facebook-f text-sm"></i>
            </a>
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" aria-label="Twitter">
              <i className="fab fa-twitter text-sm"></i>
            </a>
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" aria-label="Instagram">
              <i className="fab fa-instagram text-sm"></i>
            </a>
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300" aria-label="YouTube">
              <i className="fab fa-youtube text-sm"></i>
            </a>
          </div>
        </div>

        {/* Row 4: Copyright */}
        <div className="py-6 text-center text-sm text-gray-600">
          <p>Made with <i className="fas fa-heart text-red-500"></i> for Indian Farmers</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} GROWSMART. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
