
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="brand mb-4">
          <h1 className="text-3xl font-bold">
            <span className="text-green-500">G</span>row
            <span className="text-green-500">S</span>mart
          </h1>
        </div>
        <h2 className="text-lg text-gray-300 mb-4">Complete Solution For Farmers</h2>
        <p className="text-gray-400">Copyright © 2025 Growsmart. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
