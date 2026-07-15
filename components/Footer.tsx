
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h1 className="text-3xl font-bold mb-3">
              <span className="text-green-500">G</span>ROW
              <span className="text-green-500">S</span>MART
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Complete Solution for Farmers — Weather, Marketplace, Crop Advisory, and Government Schemes all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#weather" className="hover:text-green-400 transition-colors duration-300">Weather Forecast</a></li>
              <li><a href="#crop-recommender" className="hover:text-green-400 transition-colors duration-300">Crop Advisor</a></li>
              <li><a href="#mandi" className="hover:text-green-400 transition-colors duration-300">Smart Mandi</a></li>
              <li><a href="#agri-market" className="hover:text-green-400 transition-colors duration-300">Agri-Market</a></li>
              <li><a href="#schemes" className="hover:text-green-400 transition-colors duration-300">Government Schemes</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><i className="fas fa-envelope mr-2 text-green-500"></i>support@growsmart.in</li>
              <li><i className="fas fa-phone mr-2 text-green-500"></i>1800-180-1551 (Toll Free)</li>
              <li><i className="fas fa-map-marker-alt mr-2 text-green-500"></i>Pune, Maharashtra, India</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>Made with <i className="fas fa-heart text-red-500"></i> for Indian Farmers</p>
          <p className="mt-1">Copyright &copy; {new Date().getFullYear()} GROWSMART. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
